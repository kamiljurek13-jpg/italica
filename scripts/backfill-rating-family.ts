import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const DATASET_PATH =
  (process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null) ??
  'C:\\Users\\kamij\\Documents\\ItalicaKaggleDataset\\victoriaSecret';

const limitArgIdx = process.argv.indexOf('--limit');
const LIMIT = limitArgIdx !== -1 ? parseInt(process.argv[limitArgIdx + 1]) : undefined;
const DRY_RUN = process.argv.includes('--dry-run');

const COLLECTIONS: Record<string, string> = {
  '1fb35698-bf9d-43ff-a36a-64bb01051dbc': 'majtki',
  'af89535d-68fd-409a-93d0-c9b4668e7991': 'biustonosze',
  '6585a80a-8cee-4a6d-8fff-a46ded641f91': 'zestawy',
  'eb774b01-fbdd-4c55-a9a2-8a3928c7b821': 'piżamy',
};

const VS_CDN_BASE = 'https://www.victoriassecret.com/p/760x1013';

interface VSProduct {
  family?: string;
  rating?: number;
  productImages: string[];
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SECRET_KEY!
);

function extractImageHash(imageUrl: string): string {
  // imageUrl: "https://www.victoriassecret.com/p/760x1013/tif/e7/ff/.../1120076154A2_OM_F.jpg"
  // productImages[0]: "tif/e7/ff/.../1120076154A2_OM_F"
  return imageUrl.replace(VS_CDN_BASE + '/', '').replace('.jpg', '');
}

async function main() {
  console.log(`🗂️  Wczytywanie JSON-ów kolekcji...${DRY_RUN ? ' (DRY RUN)' : ''}`);

  const imageMap = new Map<string, { rating: number | null; family: string | null }>();

  for (const [collectionId] of Object.entries(COLLECTIONS)) {
    const filePath = path.join(DATASET_PATH, `${collectionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Plik nie znaleziony: ${filePath}`);
      continue;
    }
    const products = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as VSProduct[];
    for (const p of products) {
      if (!p.productImages?.length) continue;
      imageMap.set(p.productImages[0], {
        rating: p.rating ?? null,
        family: p.family ?? null,
      });
    }
    console.log(`  ✓ ${collectionId.slice(0, 8)}...: ${products.length} produktów`);
  }
  console.log(`\n📊 Mapa imageHash: ${imageMap.size} wpisów\n`);

  // Pobierz produkty z DB
  const { data: dbProducts, error } = await supabase
    .from('products')
    .select('id, image_url');
  if (error) throw error;

  const limited = LIMIT ? dbProducts.slice(0, LIMIT) : dbProducts;

  let matched = 0;
  let skipped = 0;
  const updates: Array<{ id: string; rating: number | null; family: string | null }> = [];

  for (const row of limited) {
    const hash = extractImageHash(row.image_url);
    const vsData = imageMap.get(hash);
    if (vsData) {
      updates.push({ id: row.id, rating: vsData.rating, family: vsData.family });
      matched++;
    } else {
      skipped++;
    }
  }

  console.log(`✅ Zmatchowano: ${matched}  |  ⚠️  Pominięto: ${skipped}\n`);

  if (DRY_RUN) {
    console.log('DRY RUN — brak zmian w DB.');
    if (updates.length > 0) {
      console.log('Przykład (pierwsze 3):');
      updates.slice(0, 3).forEach(u => console.log(' ', JSON.stringify(u)));
    }
    return;
  }

  // Batch UPDATE po 50
  console.log(`📥 Aktualizuję ${updates.length} produktów...`);
  for (let i = 0; i < updates.length; i += 50) {
    const chunk = updates.slice(i, i + 50);
    for (const u of chunk) {
      const { error: updErr } = await supabase
        .from('products')
        .update({ rating: u.rating, family: u.family })
        .eq('id', u.id);
      if (updErr) console.warn(`⚠️  Błąd dla ${u.id}: ${updErr.message}`);
    }
    console.log(`  ${Math.min(i + 50, updates.length)}/${updates.length}`);
  }

  console.log('\n🎉 Backfill gotowy!');
}

main().catch(err => {
  console.error('❌', err);
  process.exit(1);
});
