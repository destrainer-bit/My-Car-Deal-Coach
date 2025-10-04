import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { upgradePlans } from '../data/upgradePlans';

async function upgrade(priceId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Redirect to auth if not logged in
      alert('Please sign in to continue with your purchase.');
      return;
    }

    const supabaseBaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL?.replace(/\/$/, '') || '';
    const checkoutUrl = supabaseBaseUrl
      ? `${supabaseBaseUrl}/functions/v1/create-checkout`
      : '/functions/v1/create-checkout';

    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId,
        successUrl: window.location.origin + '/app',
        cancelUrl: window.location.origin + '/pricing',
        mode: 'payment'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('Upgrade error:', error);
    alert('Failed to start checkout. Please try again.');
  }
}

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string, planId: string) => {
    setLoading(planId);
    try {
      await upgrade(priceId);
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Protection</h1>
        <p className="text-xl opacity-90 mb-8">
          Save thousands in markups, add-ons, and finance games for less than a soda a day.
        </p>
        <div className="flex justify-center gap-4 mb-8">
          <button 
            className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => window.location.href = '/'}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {upgradePlans.map((plan) => {
          const isLoading = loading === plan.id;
          const isPopular = plan.accent || plan.label === '90 Days';
          
          return (
            <div 
              key={plan.id}
              className={`relative p-6 rounded-2xl border transition-all hover:scale-105 ${
                isPopular 
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                  : 'border-white/20 bg-white/5'
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {plan.ribbon || 'Most Popular'}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.label}</h3>
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
                <div className="text-sm opacity-70">{plan.perDay}</div>
              </div>

              {/* Plan Description */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">{plan.headline}</h4>
                <p className="text-sm opacity-80 mb-4">{plan.blurb}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {plan.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleUpgrade(plan.id, plan.id)}
                disabled={isLoading || !plan.id}
              >
                {isLoading ? 'Processing...' : plan.cta}
              </button>

              {/* Unavailable Notice */}
              {!plan.id && (
                <p className="text-center text-sm opacity-60 mt-2">
                  Contact support for this plan
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Indicators */}
      <div className="text-center py-8 border-t border-white/10">
        <div className="flex justify-center items-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400">🔒</span>
            <span className="text-sm">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">💳</span>
            <span className="text-sm">Powered by Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">↩️</span>
            <span className="text-sm">30-Day Guarantee</span>
          </div>
        </div>
        <p className="text-sm opacity-70">
          Typical buyers overpay $1,500–$5,000 without guidance. Keep it in your pocket.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          <details className="p-4 bg-white/5 rounded-lg">
            <summary className="font-semibold cursor-pointer">How does this work?</summary>
            <p className="mt-2 opacity-80">
              You get access to our AI coach, negotiation scripts, red-flag alerts, and payment calculators. 
              Use them before and during your dealership visit to avoid common traps.
            </p>
          </details>
          <details className="p-4 bg-white/5 rounded-lg">
            <summary className="font-semibold cursor-pointer">What if I don't buy a car?</summary>
            <p className="mt-2 opacity-80">
              No problem! Your access period covers you for whenever you're ready. 
              Many customers use longer plans to shop multiple vehicles or help family members.
            </p>
          </details>
          <details className="p-4 bg-white/5 rounded-lg">
            <summary className="font-semibold cursor-pointer">Is there a money-back guarantee?</summary>
            <p className="mt-2 opacity-80">
              Yes! If you're not satisfied within 30 days, we'll refund your purchase. 
              We're confident you'll save more than you paid.
            </p>
          </details>
        </div>
      </div>
    </main>
  );
}
