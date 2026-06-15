import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Missing GITHUB_TOKEN' });
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
  );

  if (!response.ok) {
    const text = await response.text();
    return res.status(500).json({ error: `GitHub API ${response.status}`, detail: text });
  }

  return res.status(200).json({ ok: true, triggered: new Date().toISOString() });
}
