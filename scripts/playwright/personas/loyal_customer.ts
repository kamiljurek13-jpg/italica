import { PersonaContext, TARGET_URL } from '../utils/setup';
import { veryFastDelay, fastDelay } from '../utils/delays';

const PRECISE_QUERIES = ['biustonosz silk', 'majtki koronka', 'satyna piżama'];

export async function runLoyalCustomer(ctx: PersonaContext): Promise<void> {
  const { page, abGroup } = ctx;

  if (abGroup === 'A') {
    // Group A: knows exactly what to search — fastest flow possible
    await veryFastDelay();

    const searchBtn = page.getByRole('button', { name: 'Szukaj' });
    await searchBtn.waitFor({ timeout: 10000 });
    await searchBtn.click();
    await veryFastDelay();

    const query = PRECISE_QUERIES[Math.floor(Math.random() * PRECISE_QUERIES.length)];
    const embedDone = page.waitForResponse(
      resp => resp.url().includes('/functions/v1/embed'),
      { timeout: 20000 }
    ).catch(() => {});
    await page.locator('input[placeholder="Szukaj produktów..."]').fill(query);
    await embedDone;

    const firstResult = page.locator('ul li a[href*="/product/"]').first();
    if (await firstResult.isVisible({ timeout: 10000 }).catch(() => false)) {
      await firstResult.click();
    } else {
      await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'load' });
      await page.waitForSelector('a[href*="/product/"]', { timeout: 25000 }).catch(() => {});
      const fallbackProduct = page.locator('a[href*="/product/"]').first();
      if (!await fallbackProduct.isVisible({ timeout: 5000 }).catch(() => false)) return;
      await fallbackProduct.click();
    }
  } else {
    // Group B: knows the site well — uses Gift Helper as a quick shortcut
    await veryFastDelay();
    const giftLink = page.getByRole('link', { name: 'Doradca prezentów' });
    await giftLink.waitFor({ timeout: 10000 });
    await giftLink.click();

    const moods = ['Sexy', 'Na codzień', 'Sleep'];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    const moodCard = page.locator('[class*="cursor-pointer"]').filter({ hasText: mood }).first();
    if (!await moodCard.waitFor({ timeout: 10000 }).then(() => true).catch(() => false)) return;
    await veryFastDelay();
    await moodCard.click();

    const firstProduct = page.locator('a').filter({ hasText: 'Zobacz szczegóły' }).first();
    if (!await firstProduct.isVisible({ timeout: 20000 }).catch(() => false)) return;
    await veryFastDelay();
    await firstProduct.click();
  }

  await page.waitForURL(/\/product\//, { timeout: 10000 }).catch(() => {});
  await veryFastDelay();

  // Knows her size — selects immediately
  const sizeBtn = page.getByRole('button').filter({ hasText: /^(S|M|L)$/ }).first();
  if (await sizeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await sizeBtn.click();
    await veryFastDelay();
  }

  // Adds to cart without hesitation
  const addToCart = page.getByRole('button', { name: 'Dodaj do koszyka' });
  await addToCart.waitFor({ timeout: 5000 });
  await addToCart.click();
  await veryFastDelay();

  // Goes straight to checkout and completes order
  await page.goto(`${TARGET_URL}/checkout`, { waitUntil: 'load' });
  await fastDelay();

  const orderBtn = page.getByRole('button', { name: /Złóż zamówienie/ });
  if (await orderBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
    await orderBtn.click();
    await page.waitForLoadState('load');
  }
}
