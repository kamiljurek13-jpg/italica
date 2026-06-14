import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(ip);
  if (!limit || now > limit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }
  if (limit.count >= 10) return false;
  limit.count++;
  return true;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  mood: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const ipString = Array.isArray(ip) ? ip[0] : ip;
    if (!checkRateLimit(ipString)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const { mood } = req.body;
    if (!mood) return res.status(400).json({ error: 'Missing required field: mood' });

    const validMoods = ['sleepy', 'sexy', 'daily'];
    if (!validMoods.includes(mood.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid mood. Must be: sleepy, sexy, or daily' });
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('id, name, category, price, description, image_url, mood');

    if (dbError || !products?.length) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API configuration error' });

    const anthropic = new Anthropic({ apiKey });

    const moodProducts = (products as Product[]).filter(p => p.mood.includes(mood.toLowerCase()));
    if (moodProducts.length === 0) {
      return res.status(200).json({ recommendations: products.slice(0, 3), fallback: true });
    }

    const prompt = `You are a luxury lingerie gift advisor. A customer is looking for a gift with a "${mood}" mood/vibe.

Here are the available products that match this mood:
${moodProducts.map((p: Product, i: number) =>
  `${i + 1}. ${p.name} - ${p.category} - ${p.price} zł - ${p.description}`
).join('\n')}

Please select the top 3-4 products that best match the "${mood}" mood and explain why they're perfect for this occasion. Return ONLY a JSON array of product IDs in this exact format:
["id1", "id2", "id3"]

Choose products that best embody the "${mood}" feeling.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\[[\s\S]*?\]/);

    if (!jsonMatch) {
      return res.status(200).json({ recommendations: moodProducts.slice(0, 3), fallback: true });
    }

    const selectedIds: string[] = JSON.parse(jsonMatch[0]);
    let recommendations = (products as Product[]).filter(p => selectedIds.includes(p.id));

    if (recommendations.length < 3) {
      const additionalProducts = moodProducts
        .filter((p: Product) => !selectedIds.includes(p.id))
        .slice(0, 3 - recommendations.length);
      recommendations = [...recommendations, ...additionalProducts];
    }

    return res.status(200).json({ recommendations, mood, fallback: false });

  } catch (error) {
    console.error('Error in recommendations endpoint:', error);
    return res.status(200).json({
      recommendations: [],
      fallback: true,
      error: 'AI service temporarily unavailable',
    });
  }
}
