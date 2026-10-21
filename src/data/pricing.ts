export type TicketTierType = 'early-bird' | 'standard' | 'gate';

export interface TicketTier {
  type: TicketTierType;
  label: string;
  price: number;
  note: string;
}

export const TICKET_TIERS: Record<TicketTierType, TicketTier> = {
  'early-bird': {
    type: 'early-bird',
    label: 'Early Bird',
    price: 25,
    note: 'Sibling discounts'
  },
  standard: {
    type: 'standard',
    label: 'Standard',
    price: 30,
    note: 'Online'
  },
  gate: {
    type: 'gate',
    label: 'At Gate',
    price: 35,
    note: 'Pay on arrival'
  }
};

export const TICKET_TIERS_LIST: TicketTier[] = [
  TICKET_TIERS['early-bird'],
  TICKET_TIERS.standard,
  TICKET_TIERS.gate
];

export const EARLY_BIRD_SIBLING_TOTALS: Record<number, number> = {
  1: 25,
  2: 45,
  3: 60,
  4: 70
};

export const FREE_UNDER = 2;

export const ECOCASH_MERCHANT = '0779140417';

export function ecoCashCode(amount: number | string): string {
  return `*151*1*1*${ECOCASH_MERCHANT}*${amount}#`;
}

export function priceFor(tier: TicketTierType | string, childCount: number): number {
  const count = Math.max(1, childCount);
  if (tier === 'early-bird') {
    if (count in EARLY_BIRD_SIBLING_TOTALS) {
      return EARLY_BIRD_SIBLING_TOTALS[count];
    }
    return 70 + (count - 4) * 20;
  }
  if (tier === 'standard') {
    return count * TICKET_TIERS.standard.price;
  }
  return count * TICKET_TIERS.gate.price;
}
