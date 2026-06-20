/**
 * Marketplace item catalog — single source of truth.
 * All items are validated server-side before any transaction.
 * Cost is in "gold coins" earned through real quest completion.
 */

export type MarketplaceCategory =
  | 'learning'
  | 'wellness'
  | 'career'
  | 'social'

export interface MarketplaceItem {
  id: string
  name: string
  description: string
  category: MarketplaceCategory
  cost: number
  /** Icon emoji for quick rendering */
  icon: string
  /** Real-world redemption instructions shown post-purchase */
  redemptionNote: string
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  // ── Learning Credits ──────────────────────────────────────────────
  {
    id: 'learning-udemy',
    name: 'Udemy Course Voucher',
    description: 'Redeem for any Udemy course up to ₹499. Invest in a new skill today.',
    category: 'learning',
    cost: 500,
    icon: '🎓',
    redemptionNote: 'Screenshot this page and send to your accountability partner or admin for manual approval.',
  },
  {
    id: 'learning-book',
    name: 'Technical Book Credit',
    description: '1 technical e-book from Amazon Kindle or Gumroad (up to ₹299).',
    category: 'learning',
    cost: 300,
    icon: '📚',
    redemptionNote: 'Buy the book and log it as a completed learning quest for verification.',
  },
  {
    id: 'learning-hour',
    name: '1-Hour Deep Work Session',
    description: 'Unlock a scheduled uninterrupted focus block — no meetings, no pings.',
    category: 'learning',
    cost: 150,
    icon: '⚡',
    redemptionNote: 'Block the time on your calendar. Mark it as "GrowthMate Focus Block".',
  },

  // ── Wellness ──────────────────────────────────────────────────────
  {
    id: 'wellness-break',
    name: 'Guilt-Free Break Day',
    description: 'One sanctioned rest day without quest penalties. Recharge fully.',
    category: 'wellness',
    cost: 200,
    icon: '🌿',
    redemptionNote: 'Apply in Settings → Apply Wellness Break. Quests auto-pause for 24h.',
  },
  {
    id: 'wellness-meal',
    name: 'Healthy Meal Treat',
    description: 'Order a nutritious meal of your choice (budget: ₹200). You earned it.',
    category: 'wellness',
    cost: 350,
    icon: '🥗',
    redemptionNote: 'Order via Swiggy/Zomato and tag it #GrowthMateReward. No junk food!',
  },
  {
    id: 'wellness-spa',
    name: 'Spa / Massage Voucher',
    description: 'A 30-min relaxation session at a local spa or self-care centre.',
    category: 'wellness',
    cost: 750,
    icon: '💆',
    redemptionNote: 'Find a local wellness provider and redeem within 30 days of purchase.',
  },

  // ── Career Boosts ─────────────────────────────────────────────────
  {
    id: 'career-linkedin',
    name: 'LinkedIn Premium (1 Week)',
    description: 'Unlock 1 week of LinkedIn Premium InMails and learning paths.',
    category: 'career',
    cost: 400,
    icon: '💼',
    redemptionNote: 'Activate via LinkedIn and complete at least 2 courses during the week.',
  },
  {
    id: 'career-mock',
    name: 'Mock Interview Session',
    description: 'A 45-min peer mock interview with a senior from your network.',
    category: 'career',
    cost: 600,
    icon: '🎤',
    redemptionNote: 'Schedule via your accountability partner. Record key feedback.',
  },
  {
    id: 'career-resume',
    name: 'Resume Review',
    description: 'Get your resume reviewed by a senior professional or mentor.',
    category: 'career',
    cost: 450,
    icon: '📝',
    redemptionNote: 'Send your resume to your mentor and apply feedback within 7 days.',
  },

  // ── Social / Team ─────────────────────────────────────────────────
  {
    id: 'social-coffee',
    name: 'Coffee with a Mentor',
    description: 'Schedule a 30-min coffee chat with someone you admire. Grow your network.',
    category: 'social',
    cost: 250,
    icon: '☕',
    redemptionNote: 'Reach out and set up the meeting. Share one key takeaway afterwards.',
  },
  {
    id: 'social-team-lunch',
    name: 'Team Lunch Organiser',
    description: 'Host a team lunch (₹150 contribution). Strengthen real-world relationships.',
    category: 'social',
    cost: 300,
    icon: '🍽️',
    redemptionNote: 'Organise and attend. Post a group photo in your accountability group.',
  },
  {
    id: 'social-shoutout',
    name: 'Public Achievement Shoutout',
    description: 'We post your top achievement on the community board (anonymous option available).',
    category: 'social',
    cost: 100,
    icon: '🏆',
    redemptionNote: 'Achievement will be posted to your team leaderboard within 24h.',
  },
]

/** Get items by category */
export function getItemsByCategory(category: MarketplaceCategory): MarketplaceItem[] {
  return MARKETPLACE_ITEMS.filter(item => item.category === category)
}

/** Get item by id */
export function getItemById(id: string): MarketplaceItem | undefined {
  return MARKETPLACE_ITEMS.find(item => item.id === id)
}
