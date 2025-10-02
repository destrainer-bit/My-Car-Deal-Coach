export const upgradePlans = [
  {
    id: '72hours',
    label: '72 Hours',
    price: '$19',
    perDay: '$6.33/day',
    duration: '72 Hours',
    title: 'Your Emergency Shield',
    blurb: 'Last-minute protection before you step into the dealership.',
    highlights: [
      'Real-time coaching',
      'Red-flag alerts',
      'Negotiation scripts'
    ],
    cta: 'Activate 72-Hour Shield',
    priceId: import.meta.env.VITE_STRIPE_72HOURS_PRICE_ID || 'price_1SDFCfGGlhp8ceFI3DJvHpSX',
    mode: 'payment'
  },
  {
    id: '7days',
    label: '7 Days',
    price: '$29',
    perDay: '$4.14/day',
    duration: '7 Days',
    title: 'The Week of Wisdom',
    blurb: 'One week of insider strategy and AI roleplay coaching.',
    highlights: [
      'Outsmart common tactics',
      'Prep your offers',
      'Walk-away power'
    ],
    cta: 'Get 7 Days of Backup',
    priceId: import.meta.env.VITE_STRIPE_7DAYS_PRICE_ID || 'price_1SDFBcGGlhp8ceFIxyJYot3l',
    mode: 'payment'
  },
  {
    id: '30days',
    label: '30 Days',
    price: '$59',
    perDay: '$1.97/day',
    duration: '30 Days',
    title: 'The Smart Shopper’s Plan',
    blurb: 'A full month to compare, plan, and pounce.',
    highlights: [
      'Payment calculator',
      'Psychology-trained AI',
      'Deal breakdowns'
    ],
    cta: 'Lock In 30-Day Coverage',
    priceId: import.meta.env.VITE_STRIPE_30DAYS_PRICE_ID || 'price_1SDFAnGGlhp8ceFIil6GisXL',
    mode: 'payment'
  },
  {
    id: '60days',
    label: '60 Days',
    price: '$79',
    perDay: '$1.32/day',
    duration: '60 Days',
    title: 'Double Your Defense',
    blurb: 'Two months of bulletproof backup while you take your time.',
    highlights: [
      'Longer runway',
      'No pressure shopping',
      'Keep control'
    ],
    cta: 'Secure 60 Days Now',
    priceId: import.meta.env.VITE_STRIPE_60DAYS_PRICE_ID || 'price_1SDFEqGGlhp8ceFIIQmwntoT',
    mode: 'payment'
  },
  {
    id: '90days',
    label: '90 Days',
    price: '$97',
    perDay: '$1.08/day',
    duration: '90 Days',
    title: 'The Seasoned Negotiator',
    blurb: 'Three months of car-buying intelligence, ready when the right deal appears.',
    highlights: [
      'Most popular',
      'Stop $1,000s in fees',
      'Master the process'
    ],
    cta: 'Get 90 Days – Best Value',
    badge: 'Best Value',
    featured: true,
    priceId: import.meta.env.VITE_STRIPE_90DAYS_PRICE_ID || 'price_1SDFDzGGlhp8ceFIydvjm413',
    mode: 'payment'
  },
  {
    id: 'yearly',
    label: '1 Year',
    price: '$199',
    perDay: '$0.55/day',
    duration: 'Year',
    title: 'The Annual Armor',
    blurb: 'A full year of defense for serial buyers or long planners.',
    highlights: [
      'All features unlocked',
      'Use for family purchases',
      'Save $1,000s/year'
    ],
    cta: 'Go All-In for a Year',
    priceId: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID || 'price_1SDXr3GGlhp8ceFI6GEUQIwL',
    billingPortalUrl: 'https://billing.stripe.com/p/login/test_123',
    mode: 'payment'
  }
];
