import { chromium, BrowserContext, Page } from 'playwright';

export type PersonaType =
  | 'power_shopper'
  | 'premium_skeptic'
  | 'gift_buyer'
  | 'loyal_customer'
  | 'first_visit';

export type ABGroup = 'A' | 'B';

export interface PersonaContext {
  page: Page;
  context: BrowserContext;
  abGroup: ABGroup;
  close: () => Promise<void>;
}

export const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173';

export async function createPersonaSession(personaType: PersonaType): Promise<PersonaContext> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  if (process.env.VERCEL_BYPASS_SECRET) {
    await page.setExtraHTTPHeaders({
      'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_SECRET,
    });
  }

  // If FORCE_AB_GROUP is set, pre-seed the cookie before middleware sees the request
  if (process.env.FORCE_AB_GROUP) {
    await context.addCookies([{
      name: 'ab_group',
      value: process.env.FORCE_AB_GROUP,
      domain: new URL(TARGET_URL).hostname,
      path: '/',
      sameSite: 'Lax',
    }]);
  }

  // Navigate — Vercel middleware assigns ab_group cookie randomly (50/50)
  await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('nav', { timeout: 10000 });

  console.log(`  page loaded: ${await page.title()} @ ${page.url()}`);

  // Read which group middleware assigned
  const cookies = await context.cookies();
  const abGroupCookie = cookies.find(c => c.name === 'ab_group');
  const abGroup = (abGroupCookie?.value as ABGroup) ?? 'A';
  console.log(`  ab_group cookie: ${abGroupCookie?.value ?? '(not set, fallback A)'}`);

  // Identify persona in Amplitude via __italica helper exposed in amplitude.ts
  await page.evaluate(({ persona }: { persona: PersonaType }) => {
    const win = (globalThis as any);
    win.__italica?.identifyUser?.({
      synthetic_persona: persona,
      is_synthetic: true,
    });
  }, { persona: personaType });

  console.log(`[${personaType}] ab_group=${abGroup}`);

  return {
    page,
    context,
    abGroup,
    close: async () => {
      await page.evaluate(() => (globalThis as any).amplitude?.flush?.()).catch(() => {});
      await new Promise(r => setTimeout(r, 6000));
      return browser.close();
    },
  };
}
