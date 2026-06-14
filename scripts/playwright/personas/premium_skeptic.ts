import { PersonaContext, TARGET_URL } from '../utils/setup';
import { slowDelay, mediumDelay, fastDelay } from '../utils/delays';

const QUERIES_A = ['bielizna premium', 'biustonosz jedwab', 'bielizna koronka'];
const QUERIES_B_MOODS = ['Na codzień', 'Sleep'];

export async function runPremiumSkeptic(ctx: PersonaContext): Promise<void> {
  const { page, abGroup } = ctx;

  if (abGroup === 'A') {
    // Group A: searches but with hesitation
    await mediumDelay();

    const searchBtn = page.getByRole('button', { name: 'Szukaj' });
    await searchBtn.waitFor({ timeout: 10000 });
    await searchBtn.click();
    await mediumDelay();

    const query = QUERIES_A[Math.floor(Math.random() * QUERIES_A.length)];
    await page.locator('input[placeholder="Szukaj produktów..."]').fill(query);
    await mediumDelay();

    const firstResult = page.locator('ul li a[href*="/product/"]').first();
    if (await firstResult.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstResult.click();
    } else {
      await page.goto(`${TARGET_URL}/category/biustonosze`, { waitUntil: 'networkidle' });
      await fastDelay();
      await page.locator('a[href*="/product/"]').first().click();
    }
  } else {
    // Group B: tries Gift Helper but picks a "safe" mood
    await mediumDelay();
    const giftLink = page.getByRole('link', { name: 'Doradca prezentów' });
    await giftLink.waitFor({ timeout: 10000 });
    await giftLink.click();
    await page.waitForLoadState('networkidle');
    await mediumDelay();

    const mood = QUERIES_B_MOODS[Math.floor(Math.random() * QUERIES_B_MOODS.length)];
    await page.locator('[class*="cursor-pointer"]').filter({ hasText: mood }).first().click();
    await slowDelay(); // waits for recommendations with doubt

    const firstProduct = page.locator('a').filter({ hasText: 'Zobacz szczegóły' }).first();
    if (await firstProduct.isVisible({ timeout: 10000 }).catch(() => false)) {
      await firstProduct.click();
    }
  }

  await page.waitForLoadState('networkidle');
  await slowDelay(); // reads carefully

  // Opens description accordion
  const descBtn = page.getByRole('button', { name: 'Opis' }).first();
  if (await descBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await descBtn.click();
    await slowDelay();
  }

  // Opens reviews accordion
  const reviewsBtn = page.getByRole('button', { name: 'Opinie klientów' });
  if (await reviewsBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await reviewsBtn.click();
    await slowDelay();
  }

  // Opens product details accordion
  const detailsBtn = page.getByRole('button', { name: 'Szczegóły produktu' });
  if (await detailsBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await detailsBtn.click();
    await slowDelay();
  }

  // Selects a size but does NOT complete purchase — abandons at price
  const sizeBtn = page.getByRole('button').filter({ hasText: /^(M|S|L|XS|XL)$/ }).first();
  if (await sizeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await sizeBtn.click();
    await mediumDelay();
  }

  const addToCart = page.getByRole('button', { name: 'Dodaj do koszyka' });
  if (await addToCart.isVisible({ timeout: 3000 }).catch(() => false)) {
    await addToCart.click();
    await mediumDelay();

    // Goes to checkout, sees total price — and leaves (abandon)
    await page.goto(`${TARGET_URL}/checkout`, { waitUntil: 'networkidle' });
    await slowDelay(); // stares at the total price
    // Does NOT click "Złóż zamówienie" — session ends here
  }
}
