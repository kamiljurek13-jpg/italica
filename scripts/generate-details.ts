import * as path from 'path';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const limitArgIdx = process.argv.indexOf('--limit');
const LIMIT = limitArgIdx !== -1 ? parseInt(process.argv[limitArgIdx + 1]) : undefined;
const DRY_RUN = process.argv.includes('--dry-run');
const batchIdArgIdx = process.argv.indexOf('--batch-id');
const EXISTING_BATCH_ID = batchIdArgIdx !== -1 ? process.argv[batchIdArgIdx + 1] : undefined;

interface DetailItem { label: string; value: string; }
interface ReviewItem { author: string; rating: number; text: string; }

interface GeneratedData {
  family: string;
  rating: number;
  details: DetailItem[];
  reviews: ReviewItem[];
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SECRET_KEY!
);

function buildPrompt(name: string, category: string, description: string): string {
  return `Jesteś ekspertem marki bielizny premium "Italica" (Polska).
Produkt: "${name}", kategoria: "${category}"
Opis produktu: "${description}"

Wygeneruj dane produktu w 4 sekcjach. Odpowiedz TYLKO poprawnym JSON (bez markdown, bez komentarzy):

"family" — nazwa kolekcji: wyodrębnij z opisu jeśli jest (np. "Love Cloud", "Very Sexy", "Body by Victoria") lub wygeneruj stosowną włoską/elegancką nazwę kolekcji.

"rating" — liczba od 4.0 do 5.0 z 1 miejscem po przecinku (np. 4.7), przypisana na podstawie jak luksusowo brzmi opis.

"details" — 3-4 atrybuty produktu jako tablica obiektów:
  ZASADY:
  - Zawsze pierwszy: {"label":"Kolekcja","value":"<polska wersja nazwy kolekcji>"}
  - Zawsze dodaj: {"label":"Skład","value":"<skład materiałowy wnioskowany z opisu>"}
  - "Zapięcie" TYLKO dla biustonoszy i gorsetów (kategoria biustonosze) — NIGDY dla majtek, piżam, zestawów
  - Opcjonalnie: Krój, Fason, Podszewka, Poduszeczki — tylko jeśli sensowne dla tego produktu
  - Wszystkie wartości po polsku, styl premium

"reviews" — 2-3 recenzje klientek:
  - Imię i inicjał nazwiska po polsku (np. "Agnieszka M.", "Karolina W.", "Monika J.")
  - rating: 4 lub 5
  - Tekst nawiązuje BEZPOŚREDNIO do cech tego konkretnego produktu (kategoria, materiał, styl z opisu)
  - Styl: naturalny, entuzjastyczny, 1-2 zdania

{"family":"...","rating":4.7,"details":[{"label":"...","value":"..."}...],"reviews":[{"author":"...","rating":5,"text":"..."}...]}`;
}

async function main() {
  console.log(`🔍 Pobieranie produktów z DB...${DRY_RUN ? ' (DRY RUN)' : ''}`);

  const query = supabase
    .from('products')
    .select('id, name, category, description')
    .is('rating', null);

  const { data: products, error } = await query;
  if (error) throw error;

  const limited = LIMIT ? products.slice(0, LIMIT) : products;
  console.log(`📊 Produktów do przetworzenia: ${limited.length}\n`);

  if (limited.length === 0) {
    console.log('✅ Wszystkie produkty już mają details. Nic do roboty.');
    return;
  }

  if (DRY_RUN) {
    console.log('DRY RUN — przykładowy prompt:');
    console.log(buildPrompt(limited[0].name, limited[0].category, limited[0].description));
    return;
  }

  // ── Krok 1: Batch API ───────────────────────────────────────────────────
  let batchId: string;

  if (EXISTING_BATCH_ID) {
    console.log(`♻️  Reużywam batch: ${EXISTING_BATCH_ID}\n`);
    batchId = EXISTING_BATCH_ID;
  } else {
    console.log('🤖 Tworzę Batch job...');
    const requests = limited.map((p, i) => ({
      custom_id: `p${i}`,
      params: {
        model: 'claude-haiku-4-5-20251001' as const,
        max_tokens: 600,
        messages: [
          {
            role: 'user' as const,
            content: buildPrompt(p.name, p.category, p.description),
          },
        ],
      },
    }));

    const batch = await anthropic.messages.batches.create({ requests });
    batchId = batch.id;
    console.log(`📋 Batch ID: ${batchId}\n`);
    console.log('💡 Tip: jeśli chcesz wznowić po awarii: --batch-id ' + batchId);

    let batchStatus = batch;
    while (batchStatus.processing_status === 'in_progress') {
      await new Promise(r => setTimeout(r, 30_000));
      batchStatus = await anthropic.messages.batches.retrieve(batchId);
      const { succeeded, errored, processing } = batchStatus.request_counts;
      console.log(
        `  ⏳ gotowych: ${succeeded + errored}/${limited.length}  (błędów: ${errored}, w toku: ${processing})`
      );
    }
    console.log('✅ Batch zakończony!\n');
  }

  // ── Krok 2: Parsuj wyniki ───────────────────────────────────────────────
  const generated = new Map<string, GeneratedData>();
  const resultStream = await anthropic.messages.batches.results(batchId);

  for await (const result of resultStream) {
    if (result.result.type === 'succeeded') {
      const block = result.result.message.content[0];
      if (block.type === 'text') {
        try {
          const jsonMatch = block.text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('brak JSON');
          const parsed = JSON.parse(jsonMatch[0]) as GeneratedData;
          if (parsed.details && parsed.reviews) {
            generated.set(result.custom_id, parsed);
          }
        } catch {
          console.warn(`⚠️  Błąd parsowania dla ${result.custom_id}`);
        }
      }
    }
  }
  console.log(`📝 Sparsowano ${generated.size}/${limited.length} wyników\n`);

  // ── Krok 3: Batch UPDATE ────────────────────────────────────────────────
  console.log(`📥 Aktualizuję DB...`);
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < limited.length; i += 50) {
    const chunk = limited.slice(i, i + 50);
    for (let j = 0; j < chunk.length; j++) {
      const product = chunk[j];
      const data = generated.get(`p${i + j}`);
      if (!data) { failed++; continue; }

      const { error: updErr } = await supabase
        .from('products')
        .update({
          family: data.family,
          rating: data.rating,
          details: data.details,
          reviews: data.reviews,
        })
        .eq('id', product.id);

      if (updErr) {
        console.warn(`⚠️  Błąd update ${product.id}: ${updErr.message}`);
        failed++;
      } else {
        updated++;
      }
    }
    console.log(`  ${Math.min(i + 50, limited.length)}/${limited.length}`);
  }

  console.log(`\n🎉 Gotowe! Zaktualizowano: ${updated}  |  Błędów: ${failed}`);
}

main().catch(err => {
  console.error('❌', err);
  process.exit(1);
});
