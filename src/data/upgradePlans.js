export const upgradePlans = [
  {
    id: '72hours',
    price: '$19',
    duration: '72 Hours',
    title: 'Your Emergency Shield',
    highlights: [
      'Need quick protection before stepping into the dealership?',
      'Real-time coaching, red-flag alerts, and negotiation scripts.',
      'Perfect for last-minute buyers.'
    ],
    cta: 'Purchase Now!',
    priceId: import.meta.env.VITE_STRIPE_72HOURS_PRICE_ID || 'price_1SDFCfGGlhp8ceFI3DJvHpSX',
    mode: 'payment'
  },
  {
    id: '7days',
    price: '$29',
    duration: '7 Days',
    title: 'The Week of Wisdom',
    highlights: [
      'One week of insider strategies and AI roleplay coaching.',
      'Just $4/day to outsmart every tactic they throw at you.',
      'Ideal if you’re shopping dealerships this week.'
    ],
    cta: 'Purchase Now!',
    priceId: import.meta.env.VITE_STRIPE_7DAYS_PRICE_ID || 'price_1SDFBcGGlhp8ceFIxyJYot3l',
    mode: 'payment'
  },
  {
    id: '30days',
    price: '$59',
    duration: '30 Days',
    title: 'The Smart Shopper’s Plan',
    highlights: [
      'A full month of protection for under $2/day.',
      'Use the payment calculator, roleplay with the AI, and study tricks at your own pace.',
      'Best for comparison shoppers.'
    ],
    cta: 'Purchase Now!',
    priceId: import.meta.env.VITE_STRIPE_30DAYS_PRICE_ID || 'price_1SDFAnGGlhp8ceFIil6GisXL',
    mode: 'payment'
  },
  {
    id: '60days',
    price: '$79',
    duration: '60 Days',
    title: 'Double Your Defense',
    highlights: [
      'Two months of bulletproof backup for just $1.32/day.',
      'Stretch out your car search without stress.',
      'Great for buyers taking their time.'
    ],
    cta: 'Purchase Now!',
    priceId: import.meta.env.VITE_STRIPE_60DAYS_PRICE_ID || 'price_1SDFEqGGlhp8ceFIIQmwntoT',
    mode: 'payment'
  },
  {
    id: '90days',
    price: '$97',
    duration: '90 Days',
    title: 'The Seasoned Negotiator',
    highlights: [
      'A full 3 months of car-buying intelligence.',
      'For just $1.08/day, you’ll be ready when the right deal finally shows up.',
      'Our most popular choice.'
    ],
    cta: 'Purchase Now!',
    badge: 'Best Value',
    featured: true,
    priceId: import.meta.env.VITE_STRIPE_90DAYS_PRICE_ID || 'price_1SDFDzGGlhp8ceFIydvjm413',
    mode: 'payment'
  },
  {
    id: 'yearly',
    price: '$199',
    duration: 'Year',
    title: 'The Annual Armor',
    highlights: [
      'One full year of defense for only 55¢ a day.',
      'Perfect if you buy multiple vehicles or want lifelong prep.',
      'Save thousands on every purchase.'
    ],
    cta: 'Purchase Now!',
    priceId: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID || 'price_1SDXr3GGlhp8ceFI6GEUQIwL',
    billingPortalUrl: 'https://billing.stripe.com/p/login/test_123',
    mode: 'payment'
  }
];
