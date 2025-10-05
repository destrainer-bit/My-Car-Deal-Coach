import React from 'react';
import SavingsCalculator from '../components/SavingsCalculator';

export default function Landing() {
  // Cache bust: 2025-01-03-20:48
  console.log('🎯 Landing component rendering with updated title');
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Imagine a world where car buying no longer feels like a battle against pressure, persuasion, or dishonest sales tactics. Instead, it's smooth, honest, and genuinely enjoyable. Welcome to a new way of car shopping, the way it should be.
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
          Get insider coaching, negotiation scripts, and real-time alerts. 
          Save thousands on your next car purchase.
        </p>
        <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
          {/* Primary CTAs */}
          <button
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors w-full"
            onClick={() => window.location.href = '/pricing'}
          >
            Get your plan →
          </button>
          <button
            className="px-8 py-4 border border-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors w-full"
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Try savings demo
          </button>
          <button
            className="px-8 py-4 border border-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors w-full"
            onClick={() => window.location.href = '/onboarding'}
          >
            Take Tour 🎯
          </button>

          {/* Secondary utilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="py-3 px-4 border border-white/15 text-white rounded-lg font-medium hover:bg-white/10 transition-colors w-full"
              onClick={() => window.location.href = '/app/checklist'}
            >
              Show Checklist
            </button>
            <button
              className="py-3 px-4 border border-white/15 text-white rounded-lg font-medium hover:bg-white/10 transition-colors w-full"
              onClick={() => window.location.href = '/app'}
            >
              Test Premium Access
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-semibold mb-2">Real-Time Protection</h3>
          <p className="opacity-80">Get alerts about dealer tactics as they happen</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2">Save Thousands</h3>
          <p className="opacity-80">Avoid markups, add-ons, and financing games</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Expert Coaching</h3>
          <p className="opacity-80">AI-powered negotiation scripts and strategies</p>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section id="calculator" className="mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">See Your Potential Savings</h2>
          <p className="text-lg opacity-90">
            Try our calculator to estimate how much you could save with expert guidance
          </p>
        </div>
        {/* Teaser: NOT paid on landing */}
        <SavingsCalculator isPaid={false} />
      </section>

      {/* Social Proof */}
      <section className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-8">Trusted by Smart Car Buyers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-lg">
            <p className="mb-4">"Saved me $3,200 on my new truck. The dealer tried every trick in the book."</p>
            <p className="font-semibold">- Mike R.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg">
            <p className="mb-4">"The negotiation scripts were perfect. Got exactly the deal I wanted."</p>
            <p className="font-semibold">- Sarah L.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-lg">
            <p className="mb-4">"Wish I had this for my last car purchase. Never again getting ripped off."</p>
            <p className="font-semibold">- David K.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Save Thousands?</h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of smart buyers who refuse to overpay
        </p>
        <button 
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.href = '/pricing'}
        >
          Choose Your Plan
        </button>
      </section>
    </main>
  );
}