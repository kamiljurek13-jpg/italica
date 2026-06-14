import { PersonaContext, TARGET_URL } from '../utils/setup';
import { mediumDelay, slowDelay, fastDelay } from '../utils/delays';

const MOODS = ['Sleep', 'Sexy', 'Na codzień'];
const VAGUE_QUERIES = ['bielizna prezent', 'prezent dla kobiety', 'bielizna', 'lingerie'];

export async function runGiftBuyer(ctx: PersonaContext): Promise<void> {
  const { page, abGroup } = ctx;

  if (abGroup === 'B') {
    // Group B: Gift Helper — his natural flow
    await mediumDelay();

    const giftLink = page.getByRole('link', { name: 'Doradca prezentów' });
    await giftLink.waitFor({ timeout: 10000 });
    await giftLink.click();

    // Wait for mood cards to render (static content, no API call needed)
    const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const moodCard = page.locator('[class*="cursor-pointer"]').filter({ hasText: mood }).first();
    if (!await moodCard.waitFor({ timeout: 10000 }).then(() => true).catch(() => false)) return;
    await mediumDelay();
    await moodCard.click();
    await mediumDelay();

    // Wait for recommendations to load (Edge Function + DB query)
    const firstProduct = page.locator('a').filter({ hasText: 'Zobacz szczegóły' }).first();
    if (!await firstProduct.isVisible({ timeout: 20000 }).catch(() => false)) return;
    await mediumDelay();
    await firstProduct.click();
  } else {
    // Group A: search with vague query — he's lost
    await slowDelay();

    const searchBtn = page.getByRole('button', { name: 'Szukaj' });
    await searchBtn.waitFor({ timeout: 10000 });
    await searchBtn.click();
    await mediumDelay();

    const query = VAGUE_QUERIES[Math.floor(Math.random() * VAGUE_QUERIES.length)];
    await page.locator('input[placeholder="Szukaj produktów..."]').fill(query);
    await slowDelay(); // hesitates before clicking

    const firstResult = page.locator('ul li a[href*="/product/"]').first();
    if (await firstResult.isVisible({ timeout: 8000 }).catch(() => false)) {
      await firstResult.click();
    } else {
      // Search failed, browses popular category
      await page.goto(`${TARGET_URL}/category/zestawy`, { waitUntil: 'load' });
      await mediumDelay();
      const fallbackProduct = page.locator('a[href*="/product/"]').first();
      if (!await fallbackProduct.isVisible({ timeout: 15000 }).catch(() => false)) return;
      await fallbackProduct.click();
    }
  }

  // Wait for product page to render
  await page.waitForURL(/\/product\//, { timeout: 10000 }).catch(() => {});
  await mediumDelay();

  // Reads description — wants to make sure it's a good gift
  const descBtn = page.getByRole('button', { name: 'Opis' }).first();
  if (await descBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await descBtn.click();
    await mediumDelay();
  }

  // Picks a size (guesses M as a "safe" gift size)
  const sizeM = page.getByRole('button').filter({ hasText: /^M$/ }).first();
  if (await sizeM.isVisible({ timeout: 3000 }).catch(() => false)) {
    await sizeM.click();
  } else {
    const anySize = page.getByRole('button').filter({ hasText: /^(XS|S|L|XL)$/ }).first();
    if (await anySize.isVisible({ timeout: 3000 }).catch(() => false)) {
      await anySize.click();
    }
  }

  await fastDelay();

  // Adds to cart and completes purchase
  const addToCart = page.getByRole('button', { name: 'Dodaj do koszyka' });
  await addToCart.waitFor({ timeout: 5000 });
  await addToCart.click();
  await mediumDelay();

  await page.goto(`${TARGET_URL}/checkout`, { waitUntil: 'load' });
  await mediumDelay();

  const orderBtn = page.getByRole('button', { name: /Złóż zamówienie/ });
  if (await orderBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
    await orderBtn.click();
    await page.waitForLoadState('load');
  }
}
