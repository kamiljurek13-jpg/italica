import { createPersonaSession, PersonaType } from './utils/setup';
import { delay } from './utils/delays';
import { runPowerShopper } from './personas/power_shopper';
import { runPremiumSkeptic } from './personas/premium_skeptic';
import { runGiftBuyer } from './personas/gift_buyer';
import { runLoyalCustomer } from './personas/loyal_customer';
import { runFirstVisit } from './personas/first_visit';

// Weighted pool — reflects realistic traffic mix
const PERSONA_POOL: PersonaType[] = [
  'first_visit',     // 35%
  'first_visit',
  'first_visit',
  'first_visit',
  'first_visit',
  'first_visit',
  'first_visit',
  'premium_skeptic', // 25%
  'premium_skeptic',
  'premium_skeptic',
  'premium_skeptic',
  'premium_skeptic',
  'gift_buyer',      // 20%
  'gift_buyer',
  'gift_buyer',
  'gift_buyer',
  'power_shopper',   // 12%
  'power_shopper',
  'power_shopper',
  'loyal_customer',  // 8%
  'loyal_customer',
];

function pickPersonas(count: number): PersonaType[] {
  const shuffled = [...PERSONA_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const RUNNERS: Record<PersonaType, (ctx: any) => Promise<void>> = {
  power_shopper:   runPowerShopper,
  premium_skeptic: runPremiumSkeptic,
  gift_buyer:      runGiftBuyer,
  loyal_customer:  runLoyalCustomer,
  first_visit:     runFirstVisit,
};

async function runPersona(personaType: PersonaType): Promise<void> {
  console.log(`\n→ Starting [${personaType}]`);
  const ctx = await createPersonaSession(personaType);
  try {
    await RUNNERS[personaType](ctx);
    console.log(`✓ [${personaType}] done (ab_group=${ctx.abGroup})`);
  } catch (err) {
    console.error(`✗ [${personaType}] error:`, err);
  } finally {
    await ctx.close();
  }
}

async function main(): Promise<void> {
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3 personas per run
  const personas = pickPersonas(count);

  console.log(`Running ${count} personas: ${personas.join(', ')}`);

  for (const persona of personas) {
    await runPersona(persona);
    // Human-like gap between sessions (30s–90s)
    const gap = 30000 + Math.floor(Math.random() * 60000);
    console.log(`  waiting ${Math.round(gap / 1000)}s before next persona...`);
    await delay(gap);
  }

  console.log('\nAll personas completed.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
