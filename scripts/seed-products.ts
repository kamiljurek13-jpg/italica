import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const DATASET_PATH =
  (process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null) ??
  'C:\\Users\\kamij\\Documents\\ItalicaKaggleDataset\\victoriaSecret';

const limitArgIdx = process.argv.indexOf('--limit');
const LIMIT = limitArgIdx !== -1 ? parseInt(process.argv[limitArgIdx + 1]) : undefined;

// Reuse an already-completed batch to avoid re-billing
const batchIdArgIdx = process.argv.indexOf('--batch-id');
const EXISTING_BATCH_ID = batchIdArgIdx !== -1 ? process.argv[batchIdArgIdx + 1] : undefined;

const COLLECTIONS: Record<string, string> = {
  '1fb35698-bf9d-43ff-a36a-64bb01051dbc': 'majtki',
  'af89535d-68fd-409a-93d0-c9b4668e7991': 'biustonosze',
  '6585a80a-8cee-4a6d-8fff-a46ded641f91': 'zestawy',
  'eb774b01-fbdd-4c55-a9a2-8a3928c7b821': 'piżamy',
};

const VS_CDN_BASE = 'https://www.victoriassecret.com/p/760x1013';

interface VSProduct {
  name: string;
  family?: string;
  price?: string;
  rating?: number;
  masterStyleId: string;
  productImages: string[];
}

interface EnrichedProduct {
  name: string;
  description: string;
  mood: string[];
  price: number;
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SECRET_KEY!
);

async function main() {
  // ── Krok 1: Wczytaj JSON-y ──────────────────────────────────────────────
  console.log('📂 Wczytywanie JSON-ów...');
  const allProducts: Array<VSProduct & { category: string }> = [];

  for (const [collectionId, category] of Object.entries(COLLECTIONS)) {
    const filePath = path.join(DATASET_PATH, `${collectionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Plik nie znaleziony: ${filePath}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as VSProduct[];
    const valid = raw.filter(p => p.productImages?.length > 0 && p.masterStyleId);
    const sorted = [...valid].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    const limited = LIMIT ? sorted.slice(0, LIMIT) : sorted;
    allProducts.push(...limited.map(p => ({ ...p, category })));
    console.log(`  ✓ ${category}: ${limited.length} produktów`);
  }

  if (allProducts.length === 0) {
    console.error('❌ Brak produktów. Sprawdź ścieżkę datasetu.');
    process.exit(1);
  }
  console.log(`\n📊 Łącznie: ${allProducts.length} produktów\n`);

  // ── Krok 2: Anthropic Batch API ─────────────────────────────────────────
  let batchId: string;

  if (EXISTING_BATCH_ID) {
    console.log(`♻️  Reużywam batch: ${EXISTING_BATCH_ID}\n`);
    batchId = EXISTING_BATCH_ID;
  } else {
    console.log('🤖 Tworzę Batch job...');
    const requests = allProducts.map((p, i) => {
      const priceUsd = parseFloat(p.price?.replace(/[^0-9.]/g, '') || '0');
      return {
        custom_id: `p${i}`,
        params: {
          model: 'claude-haiku-4-5-20251001' as const,
          max_tokens: 300,
          messages: [
            {
              role: 'user' as const,
              content: `Jesteś ekspertem marki bielizny premium "Italica" (Polska).
Dane produktu VS: nazwa="${p.name}", linia="${p.family ?? ''}", kategoria="${p.category}"
Cena VS: ${priceUsd || '?'} USD (kurs ~4.05 PLN/USD, Italica to marka premium więc stosuj markup 2-3x)

Odpowiedz TYLKO poprawnym JSON (bez markdown):
{"name":"<polska elegancka nazwa 2-4 słowa>","description":"<luksusowy opis po polsku 1-2 zdania>","mood":["<max 2 z: sleepy/sexy/daily>"],"price":<liczba całkowita PLN zaokrąglona do 9>}`,
            },
          ],
        },
      };
    });

    const batch = await anthropic.messages.batches.create({ requests });
    batchId = batch.id;
    console.log(`📋 Batch ID: ${batchId}\n`);

    let batchStatus = batch;
    while (batchStatus.processing_status === 'in_progress') {
      await new Promise(r => setTimeout(r, 30_000));
      batchStatus = await anthropic.messages.batches.retrieve(batchId);
      const { succeeded, errored, processing } = batchStatus.request_counts;
      console.log(
        `  ⏳ gotowych: ${succeeded + errored}/${allProducts.length}  (błędów: ${errored}, w toku: ${processing})`
      );
    }
    console.log('✅ Batch zakończony!\n');
  }

  const enriched = new Map<string, EnrichedProduct>();
  const resultStream = await anthropic.messages.batches.results(batchId);
  for await (const result of resultStream) {
    if (result.result.type === 'succeeded') {
      const block = result.result.message.content[0];
      if (block.type === 'text') {
        try {
          // Model sometimes wraps JSON in ```json...``` code fences — strip them
          const jsonMatch = block.text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('brak JSON w odpowiedzi');
          enriched.set(result.custom_id, JSON.parse(jsonMatch[0]) as EnrichedProduct);
        } catch {
          console.warn(`⚠️  Błąd parsowania JSON dla ${result.custom_id}`);
        }
      }
    }
  }
  console.log(`📝 Sparsowano ${enriched.size}/${allProducts.length} wyników\n`);

  // ── Krok 3: Obrazki — VS CDN blokuje bulk download (403)
  // Wstawiamy VS URL bezpośrednio jako image_url; osobny skrypt pobierze i wgra do Supabase.
  console.log('🖼️  Pomijam download — używam VS CDN URL bezpośrednio...');
  const imageUrls = new Map<number, string>();
  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    imageUrls.set(i, `${VS_CDN_BASE}/${p.productImages[0]}.jpg`);
  }
  console.log(`✅ URL-e gotowe (${imageUrls.size})\n`);

  // ── Krok 4: Wyczyść DB i insertuj ───────────────────────────────────────
  console.log('🗑️  Czyszczę tabelę products...');
  const { error: delErr } = await supabase.from('products').delete().gt('price', 0);
  if (delErr) throw delErr;

  const rows = allProducts
    .map((p, i) => {
      const data = enriched.get(`p${i}`);
      const imageUrl = imageUrls.get(i);
      if (!data || !imageUrl) return null;
      return {
        id: crypto.randomUUID(),
        name: data.name,
        category: p.category,
        price: data.price,
        description: data.description,
        image_url: imageUrl,
        mood: data.mood,
        color: null as null,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  console.log(`📥 Insertuję ${rows.length} produktów...`);
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    const { error } = await supabase.from('products').insert(chunk);
    if (error) throw error;
    console.log(`  ${Math.min(i + 50, rows.length)}/${rows.length}`);
  }

  console.log(`\n🎉 Gotowe! ${rows.length} produktów w bazie.`);
}

main().catch(err => {
  console.error('❌', err);
  process.exit(1);
});
