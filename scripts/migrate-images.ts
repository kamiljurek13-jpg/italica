import * as path from 'path';
import dotenv from 'dotenv';
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const limitArgIdx = process.argv.indexOf('--limit');
const LIMIT = limitArgIdx !== -1 ? parseInt(process.argv[limitArgIdx + 1]) : undefined;

const concurrencyArgIdx = process.argv.indexOf('--concurrency');
const CONCURRENCY = concurrencyArgIdx !== -1 ? parseInt(process.argv[concurrencyArgIdx + 1]) : 3;

const DRY_RUN = process.argv.includes('--dry-run');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SECRET_KEY!
);

const BUCKET = 'ItalicaImages';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;

async function runBatched<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>
) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.allSettled(items.slice(i, i + concurrency).map(fn));
  }
}

async function main() {
  console.log(`🚀 migrate-images.ts ${DRY_RUN ? '[DRY RUN]' : ''}`);
  console.log(`   concurrency=${CONCURRENCY}${LIMIT ? `, limit=${LIMIT}` : ''}\n`);

  // Fetch products that still point to VS CDN
  const { data: products, error } = await supabase
    .from('products')
    .select('id, image_url')
    .like('image_url', 'https://www.victoriassecret.com%')
    .order('created_at', { ascending: true });

  if (error) throw error;

  const toMigrate = LIMIT ? products.slice(0, LIMIT) : products;
  console.log(`📋 Produktów do migracji: ${toMigrate.length}\n`);

  if (toMigrate.length === 0) {
    console.log('✅ Nic do zrobienia — wszystkie obrazki już zmigrowane.');
    return;
  }

  if (DRY_RUN) {
    for (const p of toMigrate) {
      console.log(`  [dry-run] ${p.id} → images/${p.id}.webp`);
    }
    return;
  }

  // Launch Playwright
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });

  // Visit VS homepage to acquire session cookies
  console.log('🌐 Ustawianie sesji na victoriassecret.com...');
  const page = await context.newPage();
  await page.goto('https://www.victoriassecret.com/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {
    console.log('   ⚠️  Homepage timeout — kontynuuję bez pełnej sesji');
  });
  await page.close();

  let migrated = 0;
  let skipped = 0;
  const failed: string[] = [];

  console.log('🖼️  Pobieranie i konwersja...\n');

  await runBatched(toMigrate, CONCURRENCY, async (product) => {
    const storageKey = `images/${product.id}.webp`;
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storageKey}`;

    try {
      // Download via Playwright browser context (shares cookies with VS session)
      const response = await context.request.get(product.image_url, {
        headers: {
          Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://www.victoriassecret.com/',
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        timeout: 20000,
      });

      if (!response.ok()) {
        console.log(`  ⚠️  ${product.id}: HTTP ${response.status()} — pominięto`);
        skipped++;
        return;
      }

      const jpgBuffer = await response.body();

      // Convert to WebP with lanczos3
      const webpBuffer = await sharp(jpgBuffer)
        .resize(760, 1013, {
          fit: 'cover',
          kernel: sharp.kernel.lanczos3,
        })
        .webp({ quality: 85 })
        .toBuffer();

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storageKey, webpBuffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        console.log(`  ❌ ${product.id}: upload błąd — ${uploadError.message}`);
        failed.push(product.id);
        return;
      }

      // Update DB
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', product.id);

      if (updateError) {
        console.log(`  ❌ ${product.id}: DB update błąd — ${updateError.message}`);
        failed.push(product.id);
        return;
      }

      migrated++;
      if (migrated % 10 === 0 || migrated === toMigrate.length) {
        console.log(`  ✓ ${migrated}/${toMigrate.length} zmigrowanych`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ❌ ${product.id}: ${msg}`);
      failed.push(product.id);
    }
  });

  await browser.close();

  console.log(`\n🎉 Gotowe!`);
  console.log(`   ✅ Zmigrowano: ${migrated}`);
  console.log(`   ⚠️  Pominięto (403/timeout): ${skipped}`);
  console.log(`   ❌ Błędy: ${failed.length}`);
  if (failed.length > 0) {
    console.log(`\nFailed IDs:\n${failed.join('\n')}`);
  }
}

main().catch(err => {
  console.error('❌ Fatalny błąd:', err);
  process.exit(1);
});
