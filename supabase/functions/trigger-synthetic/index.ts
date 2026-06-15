import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req: Request) => {
  const cronSecret = req.headers.get('x-cron-secret')
  if (!cronSecret || cronSecret !== Deno.env.get('CRON_SECRET')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = Deno.env.get('GITHUB_TOKEN')
  if (!token) {
    return new Response('Missing GITHUB_TOKEN', { status: 500 })
  }

  const response = await fetch(
    'https://api.github.com/repos/kamiljurek13-jpg/italica/actions/workflows/synthetic-users.yml/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ ref: 'main' }),
    }
  )

  if (!response.ok) {
    const text = await response.text()
    return new Response(
      JSON.stringify({ error: `GitHub API ${response.status}`, detail: text }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ ok: true, triggered: new Date().toISOString() }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
