import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SECRET_KEY!;
const EMBED_URL = `${SUPABASE_URL}/functions/v1/embed`;
const BATCH_SIZE = 20;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function embedText(text: string): Promise<number[]> {
  const res = await fetch(EMBED_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Embed error ${res.status}: ${await res.text()}`);
  }

  const { embedding } = await res.json();
  return embedding as number[];
}

async function main() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, category, mood, family')
    .is('embedding', null);

  if (error) throw error;

  console.log(`Produktów bez embeddingu: ${products!.length}`);

  let processed = 0;
  let failed = 0;

  for (let i = 0; i < products!.length; i += BATCH_SIZE) {
    const batch = products!.slice(i, i + BATCH_SIZE);

    for (const p of batch) {
      const text = [
        p.name,
        p.description,
        p.category,
        (p.mood as string[] | null)?.join(' ') ?? '',
        p.family ?? '',
      ]
        .filter(Boolean)
        .join('. ');

      try {
        const embedding = await embedText(text);

        const { error: updateError } = await supabase
          .from('products')
          .update({ embedding })
          .eq('id', p.id);

        if (updateError) {
          console.error(`  ✗ ${p.name}: ${updateError.message}`);
          failed++;
        }
      } catch (err) {
        console.error(`  ✗ ${p.name}: ${String(err)}`);
        failed++;
      }
    }

    processed += batch.length;
    console.log(`Postęp: ${processed}/${products!.length} (błędy: ${failed})`);
  }

  console.log(`\nGotowe. Sukces: ${processed - failed}, Błędy: ${failed}`);
}

main().catch(console.error);
