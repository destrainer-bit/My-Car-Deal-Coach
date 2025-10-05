import React from 'react';
import SavingsCalculator from '../components/SavingsCalculator';
import { useSubscription } from '../hooks/useSubscription';

export default function AppHome() {
  return (
    <div className="mobile-first-app-home">
      <div className="container">
        <h1 className="mobile-first-title">
          Welcome to Car Deal Coach!
        </h1>
        <p className="mobile-first-subtitle">
          You're signed in! Start by creating your first deal.
        </p>
        <div className="mobile-first-grid">
          <div className="mobile-first-card">
            <h3>📝 Create New Deal</h3>
            <p>
              Start tracking a car you're interested in.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/app/create-deal'}
            >
              Create Deal
            </button>
          </div>
          
          <div className="mobile-first-card">
            <h3>💾 Your Deals</h3>
            <p>
              View and manage all your saved deals.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/app/saved-deals'}
            >
              View Deals
            </button>
          </div>
          
          <div className="mobile-first-card">
            <h3>✅ Negotiation Checklist</h3>
            <p>
              Track your negotiation progress step by step.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/app/checklist'}
            >
              View Checklist
            </button>
          </div>
          
          <div className="mobile-first-card">
            <h3>📝 Notes & Photos</h3>
            <p>
              Keep track of important information and photos.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/app/notes'}
            >
              View Notes
            </button>
          </div>
          
          <div className="mobile-first-card">
            <h3>🧮 Financial Tools</h3>
            <p>
              Calculate payments, rates, and financing options.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/app/settings'}
            >
              Open Calculators
            </button>
          </div>
          
          <div className="mobile-first-card">
            <h3>🤖 Car Buying Coach</h3>
            <p>
              Ask questions and get personalized guidance from your AI coach.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.open('https://chatgpt.com/g/g-68d8a61f4f888191b31500953d037590-the-negotiator', '_blank')}
            >
              Ask Coach GPT
            </button>
          </div>
          
          <div className="mobile-first-card">
            <h3>📚 How to Use</h3>
            <p>
              Get the complete guide to using all features.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/app/how-to-use'}
            >
              View Guide
            </button>
          </div>
          
          <div className="mobile-first-card">
            <h3>⚙️ Settings</h3>
            <p>
              Manage your account, billing, and app preferences.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/app/settings'}
            >
              Open Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}