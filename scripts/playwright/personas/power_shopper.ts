import { PersonaContext, TARGET_URL } from '../utils/setup';
import { fastDelay, veryFastDelay } from '../utils/delays';

const QUERIES = ['biustonosz koronkowy', 'majtki jedwabne', 'bielizna satyna', 'biustonosz silk'];

export async function runPowerShopper(ctx: PersonaContext): Promise<void> {
  const { page, abGroup } = ctx;

  if (abGroup === 'A') {
    // Group A: search — her natural flow
    await fastDelay();

    const searchBtn = page.getByRole('button', { name: 'Szukaj' });
    await searchBtn.waitFor({ timeout: 10000 });
    await searchBtn.click();
    await fastDelay();

    const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];
    // Register listener before fill so we never miss the embed response
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
    // Group B: no search icon — goes straight to category (she knows what she wants)
    await fastDelay();
    await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'load' });
    await fastDelay();
    const productLink = page.locator('a[href*="/product/"]').first();
    if (!await productLink.isVisible({ timeout: 15000 }).catch(() => false)) return;
    await productLink.click();
  }

  await page.waitForURL(/\/product\//, { timeout: 10000 }).catch(() => {});
  await fastDelay();

  // Select size — try standard sizes first
  const sizeBtn = page.getByRole('button').filter({ hasText: /^(M|S|L|XS|XL)$/ }).first();
  if (await sizeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await sizeBtn.click();
    await veryFastDelay();
  }

  // Add to cart
  const addToCart = page.getByRole('button', { name: 'Dodaj do koszyka' });
  await addToCart.waitFor({ timeout: 5000 });
  await addToCart.click();
  await fastDelay();

  // Checkout
  await page.goto(`${TARGET_URL}/checkout`, { waitUntil: 'load' });
  await fastDelay();

  const orderBtn = page.getByRole('button', { name: /Złóż zamówienie/ });
  if (await orderBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
    await orderBtn.click();
    await page.waitForLoadState('load');
  }
}
