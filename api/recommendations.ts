/**
 * Vercel Serverless Function for Anthropic API
 * This endpoint securely handles product recommendations using Claude AI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

// Rate limiting helper (simple in-memory cache)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (10 requests per hour)
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
  }

  if (limit.count >= 10) {
    return false; // Rate limit exceeded
  }

  limit.count++;
  return true;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  mood: string[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const ipString = Array.isArray(ip) ? ip[0] : ip;
    
    if (!checkRateLimit(ipString)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    }

    // Validate request body
    const { mood, products } = req.body;

    if (!mood || !products) {
      return res.status(400).json({ 
        error: 'Missing required fields: mood, products' 
      });
    }

    // Validate mood
    const validMoods = ['sleepy', 'sexy', 'daily'];
    if (!validMoods.includes(mood.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid mood. Must be: sleepy, sexy, or daily' 
      });
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        error: 'Products must be a non-empty array' 
      });
    }

    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return res.status(500).json({ 
        error: 'API configuration error' 
      });
    }

    const anthropic = new Anthropic({ apiKey });

    // Filter products by mood
    const moodProducts = products.filter((p: Product) =>
      p.mood.includes(mood.toLowerCase())
    );

    if (moodProducts.length === 0) {
      // Fallback: return all products if none match
      return res.status(200).json({
        recommendations: products.slice(0, 3),
        fallback: true,
      });
    }

    // Create prompt for Claude
    const prompt = `You are a luxury jewelry gift advisor. A customer is looking for a gift with a "${mood}" mood/vibe.

Here are the available products that match this mood:
${moodProducts.map((p: Product, i: number) => 
  `${i + 1}. ${p.name} - ${p.category} - $${p.price} - ${p.description}`
).join('\n')}

Please select the top 3-4 products that best match the "${mood}" mood and explain why they're perfect for this occasion. Return ONLY a JSON array of product IDs in this exact format:
["id1", "id2", "id3"]

Choose products that best embody the "${mood}" feeling.`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Parse response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Extract JSON array from response
    const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
    
    if (!jsonMatch) {
      // Fallback: return first 3 mood products
      return res.status(200).json({
        recommendations: moodProducts.slice(0, 3),
        fallback: true,
      });
    }

    const selectedIds: string[] = JSON.parse(jsonMatch[0]);

    // Get recommended products
    let recommendations = products.filter((p: Product) => 
      selectedIds.includes(p.id)
    );

    // If we got fewer than expected, add more from mood products
    if (recommendations.length < 3) {
      const additionalProducts = moodProducts
        .filter((p: Product) => !selectedIds.includes(p.id))
        .slice(0, 3 - recommendations.length);
      recommendations = [...recommendations, ...additionalProducts];
    }

    // Return recommendations
    return res.status(200).json({
      recommendations,
      mood,
      fallback: false,
    });

  } catch (error) {
    console.error('Error in recommendations endpoint:', error);
    
    // Return fallback recommendations on error
    const { mood, products } = req.body;
    const fallbackProducts = products
      ?.filter((p: Product) => p.mood?.includes(mood?.toLowerCase()))
      ?.slice(0, 3) || [];

    return res.status(200).json({
      recommendations: fallbackProducts,
      fallback: true,
      error: 'AI service temporarily unavailable',
    });
  }
}
