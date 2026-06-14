import { PersonaContext, TARGET_URL } from '../utils/setup';
import { slowDelay, mediumDelay } from '../utils/delays';

const CATEGORIES = ['biustonosze', 'zestawy', 'pizamy'];

export async function runFirstVisit(ctx: PersonaContext): Promise<void> {
  const { page, abGroup } = ctx;

  // Spends time on homepage, looking around
  await slowDelay();
  await page.mouse.wheel(0, 300);
  await slowDelay();
  await page.mouse.wheel(0, 400);
  await mediumDelay();

  if (abGroup === 'B') {
    // Group B: curious about Gift Helper — clicks it to see what it is
    const giftLink = page.getByRole('link', { name: 'Doradca prezentów' });
    if (await giftLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await giftLink.click();
      // Wait for mood cards to render before "reading" the page
      await page.locator('[class*="cursor-pointer"]').first().waitFor({ timeout: 10000 }).catch(() => {});
      await slowDelay();

      // Reads the description but doesn't click a mood — bounces
      await slowDelay();
      await page.goBack();
      await page.waitForSelector('nav', { timeout: 10000 }).catch(() => {});
    }
  } else {
    // Group A: tries to open search but doesn't know what to look for
    const searchBtn = page.getByRole('button', { name: 'Szukaj' });
    if (await searchBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchBtn.click();
      await mediumDelay();
      // Opens search, looks at popular searches but doesn't type anything
      await slowDelay();
      // Closes search (press Escape)
      await page.keyboard.press('Escape');
      await mediumDelay();
    }
  }

  // Browses a category out of curiosity
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  await page.goto(`${TARGET_URL}/category/${category}`, { waitUntil: 'load' });
  await slowDelay();
  await page.mouse.wheel(0, 500);
  await slowDelay();

  // Maybe clicks on a product (50% chance) but doesn't buy
  if (Math.random() > 0.5) {
    const productLink = page.locator('a[href*="/product/"]').first();
    if (await productLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await productLink.click();
      await page.waitForURL(/\/product\//, { timeout: 10000 }).catch(() => {});
      await slowDelay();
      await page.mouse.wheel(0, 300);
      await slowDelay();
      // Leaves without adding to cart
    }
  }
  // Session ends here — no purchase
}
