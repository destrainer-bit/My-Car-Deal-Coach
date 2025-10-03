import React from 'react';

export default function ImprovedLanding() {
  // Force cache bust
  console.log('🎯 ImprovedLanding component is rendering!');
  
  return (
    <>
      <style>{`
        .header { 
          position: sticky; 
          top: 0; 
          padding: max(12px, env(safe-area-inset-top)) 16px 12px; 
          background: #000; 
          z-index: 1000; 
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo { 
          color: #fff; 
          font-size: 1.2rem; 
          font-weight: 700; 
          margin: 0;
        }
        .menu-btn { 
          background: #3b82f6; 
          border: none; 
          color: #fff; 
          padding: 8px 12px; 
          border-radius: 8px; 
          font-size: 1rem;
        }
        .page {
          padding: 20px 16px;
          padding-bottom: max(32px, env(safe-area-inset-bottom));
          background: #000;
          color: #fff;
          min-height: 100vh;
          max-width: 100%;
          box-sizing: border-box;
        }
        .section { 
          margin-top: 32px; 
        }
        .hero {
          margin-top: 0;
        }
        .btn--primary { 
          display: block; 
          padding: 16px 24px; 
          border-radius: 12px; 
          font-weight: 700; 
          font-size: 18px;
          background: #3b82f6;
          color: #fff;
          text-decoration: none;
          width: 100%;
          text-align: center;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .action-list {
          margin-top: 32px;
        }
        .action-list a { 
          display: block; 
          padding: 12px 16px; 
          border-radius: 10px; 
          background: #1f2937; 
          margin-bottom: 12px; 
          color: #e5e7eb;
          text-decoration: none;
          text-align: center;
          border: 1px solid #374151;
          font-size: 16px;
          transition: all 0.2s ease;
        }
        .action-list a:hover {
          background: #374151;
          border-color: #4b5563;
        }
        .fineprint {
          margin-top: 32px;
        }
        .fineprint small {
          color: #94a3b8;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        h2 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
          color: #fff;
        }
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 32px;
          color: #d1d5db;
          max-width: 100%;
        }
      `}</style>
      
      <header className="header">
        <h1 className="logo">Car Deal Coach</h1>
        <button className="menu-btn" aria-label="Open menu">☰</button>
      </header>

      <main className="page">
        <section className="hero section">
          <h2>Smooth. Honest. Enjoyable.</h2>
          <p>Skip pressure and games. Get a clear plan, real numbers, and a fair deal—on your terms.</p>
          <a className="btn btn--primary" href="/pricing">Get your plan →</a>

          <nav className="action-list">
            <a className="btn btn--secondary" href="#demo">Try savings demo</a>
            <a className="btn btn--secondary" href="#tour">Take Tour</a>
            <a className="btn btn--secondary" href="#checklist">Show Checklist</a>
            <a className="btn btn--secondary" href="/premium">Test Premium Access</a>
          </nav>
        </section>

        <section className="section fineprint">
          <small>Apple Pay & Google Pay supported · 7-day money-back (one per customer). Refunds requested in-app with saved scenario, completed checklist, and purchase docs.</small>
        </section>
      </main>
    </>
  );
}
