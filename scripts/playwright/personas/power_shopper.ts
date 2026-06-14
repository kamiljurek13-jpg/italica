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
    await fastDelay();

    // Click first product result if available, otherwise go to category directly
    const firstResult = page.locator('ul li a[href*="/product/"]').first();
    if (await firstResult.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstResult.click();
    } else {
      await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'networkidle' });
      await page.locator('a[href*="/product/"]').first().click();
    }
  } else {
    // Group B: no search icon — goes straight to category (she knows what she wants)
    await fastDelay();
    await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'networkidle' });
    await fastDelay();
    await page.locator('a[href*="/product/"]').first().click();
  }

  await page.waitForLoadState('networkidle');
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
  await page.goto(`${TARGET_URL}/checkout`, { waitUntil: 'networkidle' });
  await fastDelay();

  const orderBtn = page.getByRole('button', { name: /Złóż zamówienie/ });
  if (await orderBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
    await orderBtn.click();
    await page.waitForLoadState('networkidle');
  }
}
