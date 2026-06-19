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
    console.log(`  [ps] query="${query}" | registering embed listener`);
    const embedDone = page.waitForResponse(
      resp => resp.url().includes('/functions/v1/embed') && resp.request().method() === 'POST',
      { timeout: 25000 }
    ).then(r => { console.log(`  [ps] embed response: ${r.status()} ${r.url()}`); return r; })
     .catch(() => { console.log(`  [ps] embed timed out or errored`); });
    await page.locator('input[placeholder="Szukaj produktów..."]').fill(query);
    console.log(`  [ps] fill done, awaiting embed`);
    await embedDone;
    console.log(`  [ps] embed done, checking isVisible`);

    const firstResult = page.locator('ul li a[href*="/product/"]').first();
    const resultVisible = await firstResult.isVisible({ timeout: 10000 }).catch(() => false);
    console.log(`  [ps] firstResult.isVisible=${resultVisible} | url=${page.url()}`);
    if (resultVisible) {
      await firstResult.click();
      console.log(`  [ps] clicked search result`);
    } else {
      console.log(`  [ps] fallback: goto category`);
      await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'load' });
      console.log(`  [ps] category loaded: ${page.url()}`);
      await page.waitForSelector('a[href*="/product/"]', { timeout: 25000 }).catch(() => { console.log(`  [ps] waitForSelector timed out`); });
      const fallbackProduct = page.locator('a[href*="/product/"]').first();
      const fallbackVisible = await fallbackProduct.isVisible({ timeout: 5000 }).catch(() => false);
      console.log(`  [ps] fallbackProduct.isVisible=${fallbackVisible}`);
      if (!fallbackVisible) return;
      await fallbackProduct.click();
      console.log(`  [ps] clicked fallback product`);
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
