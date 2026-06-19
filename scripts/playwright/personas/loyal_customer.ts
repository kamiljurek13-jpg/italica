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
    await page.locator('input[placeholder="Szukaj produktów..."]').fill(query);
    await page.waitForResponse(
      resp => resp.url().includes('/functions/v1/embed') && resp.status() === 200,
      { timeout: 20000 }
    ).catch(() => {});

    const firstResult = page.locator('ul li a[href*="/product/"]').first();
    if (await firstResult.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstResult.click();
    } else {
      await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'load' });
      const fallbackProduct = page.locator('a[href*="/product/"]').first();
      if (!await fallbackProduct.isVisible({ timeout: 15000 }).catch(() => false)) return;
      await fallbackProduct.click();
    }
  } else {
    // Group B: no search — goes directly to her favourite category (knows the site)
    await veryFastDelay();
    await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'load' });
    await veryFastDelay();
    const productLink = page.locator('a[href*="/product/"]').first();
    if (!await productLink.isVisible({ timeout: 15000 }).catch(() => false)) return;
    await productLink.click();
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
