import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const session = new Supabase.ai.Session('gte-small')

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'text is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const output = await session.run(text, { mean_pool: true, normalize: true })
    const embedding = Array.from(output as Float32Array) as number[]

    return Response.json({ embedding }, { headers: corsHeaders })
  } catch (err) {
    console.error('Embed error:', err)
    return Response.json(
      { error: String(err) },
      { status: 500, headers: corsHeaders }
    )
  }
})
