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
    await page.locator('input[placeholder="Szukaj produktów..."]').fill(query);
    // Embed Edge Function has 400ms debounce + cold start; wait for the actual response
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
