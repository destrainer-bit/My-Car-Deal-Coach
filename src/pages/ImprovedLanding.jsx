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
          padding: 24px 16px;
          padding-bottom: max(24px, env(safe-area-inset-bottom));
          background: #000;
          color: #fff;
          min-height: 100vh;
        }
        .section { 
          margin-top: 32px; 
        }
        .hero {
          margin-top: 0;
        }
        .btn--primary { 
          display: inline-block; 
          padding: 14px 18px; 
          border-radius: 12px; 
          font-weight: 700; 
          background: #3b82f6;
          color: #fff;
          text-decoration: none;
          width: 100%;
          text-align: center;
          margin-bottom: 16px;
        }
        .action-list {
          margin-top: 24px;
        }
        .action-list a { 
          display: block; 
          padding: 10px 12px; 
          border-radius: 10px; 
          background: #0f172a; 
          margin-top: 8px; 
          color: #fff;
          text-decoration: none;
          text-align: center;
          border: 1px solid #1e293b;
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
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        p {
          font-size: 1.1rem;
          line-height: 1.5;
          margin-bottom: 24px;
          color: #cbd5e1;
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
