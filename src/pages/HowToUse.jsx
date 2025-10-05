import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HowToUse({ onBack }) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')

  const sections = {
    overview: {
      title: '🚀 Getting Started',
      content: (
        <div className="how-to-section">
          <h3>Welcome to Car Deal Coach!</h3>
          <p>This app helps you find, research, and negotiate the best car deals. Follow this guide to get the most out of your car buying experience.</p>
          
          <div className="quick-start">
            <h4>🎯 Quick Start (5 minutes)</h4>
            <ol>
              <li><strong>Create your first deal</strong> - Add a car you're interested in</li>
              <li><strong>Research the market</strong> - Use our pricing tools</li>
              <li><strong>Plan your approach</strong> - Use the negotiation checklist</li>
              <li><strong>Track your progress</strong> - Take notes and photos</li>
            </ol>
          </div>

          <div className="coach-gpt-highlight">
            <h4>🤖 Your Personal AI Coach</h4>
            <p><strong>Ask the Coach GPT for educational information on:</strong></p>
            <ul>
              <li><strong>Interest rates</strong> - "What interest rate should I expect with a 720 credit score?"</li>
              <li><strong>Debt-to-income ratios</strong> - "Is my debt-to-income ratio too high for a car loan?"</li>
              <li><strong>Financing planning</strong> - "How much should I put down based on my income?"</li>
              <li><strong>Credit improvement</strong> - "How can I improve my credit score before applying?"</li>
              <li><strong>Negotiation tactics</strong> - "What should I say when the dealer offers a high rate?"</li>
            </ul>
            <div className="disclaimer">
              <strong>⚠️ DISCLAIMER:</strong> The Coach GPT provides educational information only and is NOT financial advice. 
              Always consult with qualified financial professionals before making financial decisions.
            </div>
            <p><strong>Access the Coach GPT from:</strong></p>
            <ul>
              <li>Main dashboard - "Ask Coach GPT" button</li>
              <li>Sidebar - "Open Agent" button</li>
              <li>Settings page - Personal Negotiator Agent section</li>
            </ul>
          </div>

          <div className="app-navigation">
            <h4>🧭 App Navigation</h4>
            <div className="nav-guide">
              <div className="nav-item">
                <span className="nav-icon">🏠</span>
                <div>
                  <strong>Onboarding</strong> - Learn about features
                </div>
              </div>
              <div className="nav-item">
                <span className="nav-icon">➕</span>
                <div>
                  <strong>Create Deal</strong> - Add new cars to track
                </div>
              </div>
              <div className="nav-item">
                <span className="nav-icon">📋</span>
                <div>
                  <strong>Your Deals</strong> - Manage all your tracked cars
                </div>
              </div>
              <div className="nav-item">
                <span className="nav-icon">✅</span>
                <div>
                  <strong>Checklist</strong> - Step-by-step negotiation guide
                </div>
              </div>
              <div className="nav-item">
                <span className="nav-icon">📝</span>
                <div>
                  <strong>Notes</strong> - Keep important information
                </div>
              </div>
              <div className="nav-item">
                <span className="nav-icon">⚙️</span>
                <div>
                  <strong>Settings</strong> - App preferences and AI agent
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    createDeal: {
      title: '➕ Creating Your First Deal',
      content: (
        <div className="how-to-section">
          <h3>How to Add a Car Deal</h3>
          <p>Start by creating a deal for any car you're interested in. This becomes your central tracking hub.</p>
          
          <div className="step-guide">
            <div className="step">
              <h4>Step 1: Car You Want to Buy</h4>
              <p><strong>Important:</strong> This is about the car you want to PURCHASE, not a trade-in vehicle.</p>
              <ul>
                <li><strong>Year:</strong> Enter the model year (e.g., 2023)</li>
                <li><strong>Make:</strong> Brand name (e.g., Honda, Toyota, Ford)</li>
                <li><strong>Model:</strong> Specific model (e.g., Civic, Camry, F-150)</li>
                <li><strong>Trim:</strong> Trim level (e.g., LX, EX, Limited)</li>
                <li><strong>Mileage:</strong> Current odometer reading</li>
              </ul>
            </div>

            <div className="step">
              <h4>Step 2: Vehicle Details</h4>
              <ul>
                <li><strong>New or Used:</strong> Select whether it's a new or used car</li>
                <li><strong>Condition:</strong> Rate condition (for used cars only)</li>
                <li><strong>Location:</strong> Where the car is located</li>
                <li><strong>Photos:</strong> Add photos of the car (optional)</li>
              </ul>
            </div>

            <div className="step">
              <h4>Step 3: Trade-In (Optional)</h4>
              <ul>
                <li><strong>Have a Trade-In?</strong> Select yes or no</li>
                <li><strong>Trade Details:</strong> Year, make, model, mileage</li>
                <li><strong>Trade Condition:</strong> Rate your trade-in's condition</li>
                <li><strong>Trade Photos:</strong> Add photos of your trade-in</li>
                <li><strong>Skip if No Trade:</strong> You can skip this step entirely</li>
              </ul>
            </div>

            <div className="step">
              <h4>Step 4: Price Estimate</h4>
              <ul>
                <li><strong>Market Analysis:</strong> See estimated price range based on real listings</li>
                <li><strong>Regional Pricing:</strong> Prices adjusted for your specific area</li>
                <li><strong>Trade Value:</strong> See estimated trade-in value (if applicable)</li>
                <li><strong>Important:</strong> These are retail market averages, not wholesale prices</li>
                <li><strong>Pro Tip:</strong> Get a CarMax quote - most manufacturers honor CarMax trade-in quotes</li>
              </ul>
            </div>

            <div className="step">
              <h4>Step 5: Save & Track</h4>
              <ul>
                <li>Click "Save Deal" to add to your tracking list</li>
                <li>Deal will appear in "Your Deals" section</li>
                <li>You can edit, duplicate, or delete anytime</li>
              </ul>
            </div>
          </div>

          <div className="pro-tips">
            <h4>💡 Pro Tips for Creating Deals</h4>
            <ul>
              <li><strong>Be specific:</strong> Include trim level for accurate pricing</li>
              <li><strong>Check mileage:</strong> Lower is usually better for value</li>
              <li><strong>Location matters:</strong> Urban areas often have higher prices</li>
              <li><strong>Take photos:</strong> Document the car's condition</li>
            </ul>
          </div>
        </div>
      )
    },
    dealsManagement: {
      title: '📋 Managing Your Deals',
      content: (
        <div className="how-to-section">
          <h3>Your Deals Dashboard</h3>
          <p>The "Your Deals" section is your command center. Here's how to use it effectively.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <h4>🔍 Filtering & Sorting</h4>
              <ul>
                <li><strong>Status Filter:</strong> Researching, Visiting, Pending, Purchased</li>
                <li><strong>Sort Options:</strong> Recently updated, created, make/model, price</li>
                <li><strong>Advanced Filters:</strong> Price range, year, mileage, condition</li>
              </ul>
            </div>

            <div className="feature-card">
              <h4>📊 Analysis Tools</h4>
              <ul>
                <li><strong>Calculator:</strong> Monthly payment calculations</li>
                <li><strong>Compare:</strong> Side-by-side deal comparison</li>
                <li><strong>Analytics:</strong> Spending patterns and trends</li>
                <li><strong>Market Data:</strong> KBB and Edmunds valuations</li>
              </ul>
            </div>

            <div className="feature-card">
              <h4>🎯 Deal Actions</h4>
              <ul>
                <li><strong>Edit:</strong> Update any deal information</li>
                <li><strong>Duplicate:</strong> Create similar deals quickly</li>
                <li><strong>Delete:</strong> Remove deals you're no longer interested in</li>
                <li><strong>Bulk Operations:</strong> Manage multiple deals at once</li>
              </ul>
            </div>
          </div>

          <div className="deal-status-guide">
            <h4>📈 Deal Status Guide</h4>
            <div className="status-list">
              <div className="status-item">
                <span className="status-badge researching">Researching</span>
                <p>Just found the car, doing initial research</p>
              </div>
              <div className="status-item">
                <span className="status-badge visiting">Visiting</span>
                <p>Going to see the car in person</p>
              </div>
              <div className="status-item">
                <span className="status-badge pending">Pending Finance</span>
                <p>Working on financing approval</p>
              </div>
              <div className="status-item">
                <span className="status-badge walked">Walked Away</span>
                <p>Decided not to purchase this car</p>
              </div>
              <div className="status-item">
                <span className="status-badge purchased">Purchased</span>
                <p>Successfully bought this car!</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    checklist: {
      title: '✅ Negotiation Checklist',
      content: (
        <div className="how-to-section">
          <h3>Step-by-Step Negotiation Guide</h3>
          <p>The checklist ensures you don't miss any important steps in your car buying process.</p>
          
          <div className="checklist-phases">
            <div className="phase">
              <h4>🔍 Before Your Visit</h4>
              <ul>
                <li><strong>Research fair market value</strong> - Use KBB, Edmunds, or our tools</li>
                <li><strong>Check vehicle history</strong> - Get CarFax or AutoCheck report</li>
                <li><strong>Review all photos</strong> - Look for damage or issues</li>
                <li><strong>Prepare questions</strong> - Write down what to ask the dealer</li>
                <li><strong>Set maximum budget</strong> - Know your absolute limit</li>
                <li><strong>Get pre-approved</strong> - Secure financing before visiting</li>
              </ul>
            </div>

            <div className="phase">
              <h4>🏪 At the Dealership</h4>
              <ul>
                <li><strong>Take thorough test drive</strong> - Test all features and systems</li>
                <li><strong>Inspect exterior</strong> - Look for dents, scratches, rust</li>
                <li><strong>Check interior</strong> - Seats, electronics, air conditioning</li>
                <li><strong>Check engine</strong> - Listen for unusual sounds</li>
                <li><strong>Verify features</strong> - Make sure everything works</li>
                <li><strong>Negotiate price</strong> - Start below asking price</li>
                <li><strong>Ask about fees</strong> - Document processing, dealer fees</li>
              </ul>
            </div>

            <div className="phase">
              <h4>💰 Finance Office</h4>
              <ul>
                <li><strong>Review contract</strong> - Read every line carefully</li>
                <li><strong>Verify interest rate</strong> - Confirm the APR</li>
                <li><strong>Understand payment</strong> - Know total cost and monthly payment</li>
                <li><strong>Check warranty</strong> - What's covered and for how long</li>
                <li><strong>⚠️ AVOID extra warranties</strong> - Don't buy unless you ABSOLUTELY need it</li>
                <li><strong>⚠️ SKIP gap insurance</strong> - Only needed if you're NOT putting down significant down payment</li>
                <li><strong>Complete paperwork</strong> - Sign only after understanding everything</li>
              </ul>
            </div>

            <div className="phase">
              <h4>🎉 After Purchase</h4>
              <ul>
                <li><strong>Morning-after review</strong> - Double-check all paperwork</li>
                <li><strong>Register vehicle</strong> - Get title and registration</li>
                <li><strong>Update insurance</strong> - Add the new car to your policy</li>
                <li><strong>Schedule service</strong> - Book first maintenance appointment</li>
              </ul>
            </div>
          </div>

          <div className="checklist-tips">
            <h4>💡 Checklist Tips</h4>
            <ul>
              <li><strong>Check off items as you complete them</strong></li>
              <li><strong>Don't rush through the process</strong></li>
              <li><strong>Take your time with negotiations</strong></li>
              <li><strong>Ask questions if anything is unclear</strong></li>
            </ul>
          </div>
        </div>
      )
    },
    notes: {
      title: '📝 Notes & Photos',
      content: (
        <div className="how-to-section">
          <h3>Keeping Track of Important Information</h3>
          <p>Use notes and photos to remember important details about cars and your buying process.</p>
          
          <div className="notes-guide">
            <div className="notes-section" style={{ color: '#ffffff' }}>
              <h4 style={{ color: '#ffffff' }}>📝 What to Write in Notes</h4>
              <ul style={{ color: '#ffffff' }}>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Dealer information:</strong> Salesperson name, contact info</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Questions to ask:</strong> Maintenance history, accidents, recalls</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Negotiation points:</strong> What you're willing to pay</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Pros and cons:</strong> What you like/dislike about the car</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Comparison notes:</strong> How it compares to other cars</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Follow-up actions:</strong> What to do next</li>
              </ul>
            </div>

            <div className="photos-section" style={{ color: '#ffffff' }}>
              <h4 style={{ color: '#ffffff' }}>📸 What Photos to Take</h4>
              <ul style={{ color: '#ffffff' }}>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Exterior shots:</strong> All angles, any damage</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Interior photos:</strong> Seats, dashboard, electronics</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Engine bay:</strong> Overall condition, leaks</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Documentation:</strong> VIN, mileage, service records</li>
                <li style={{ color: '#ffffff' }}><strong style={{ color: '#ffffff' }}>Damage photos:</strong> Any scratches, dents, or issues</li>
              </ul>
            </div>
          </div>

          <div className="organization-tips">
            <h4>🗂️ Organization Tips</h4>
            <ul>
              <li><strong>Use descriptive names</strong> for photos</li>
              <li><strong>Date your notes</strong> to track timeline</li>
              <li><strong>Be specific</strong> about what you observed</li>
              <li><strong>Include context</strong> - where, when, who</li>
            </ul>
          </div>
        </div>
      )
    },
    settings: {
      title: '⚙️ Settings & AI Agent',
      content: (
        <div className="how-to-section">
          <h3>App Settings and AI Assistant</h3>
          <p>Customize your experience and get help from our AI negotiation agent.</p>
          
          <div className="settings-guide">
            <div className="setting-section">
              <h4>🌙 App Preferences</h4>
              <ul>
                <li><strong>Data Management:</strong> Clear all data or export for backup</li>
                <li><strong>Notifications:</strong> Get reminders about your deals</li>
              </ul>
            </div>

            <div className="ai-agent-section">
              <h4>🤖 AI Negotiation Agent - USE THIS FOR ANY QUESTIONS!</h4>
              <p><strong>⚠️ IMPORTANT: Use the AI agent for ANY questions or concerns you have!</strong></p>
              <p>The AI agent can help you with:</p>
              <ul>
                <li><strong>Negotiation strategies</strong> - Get tips for specific situations</li>
                <li><strong>Price analysis</strong> - Understand if a price is fair</li>
                <li><strong>Question suggestions</strong> - What to ask dealers</li>
                <li><strong>Timing advice</strong> - When to buy vs. wait</li>
                <li><strong>Financing guidance</strong> - Loan and payment advice</li>
                <li><strong>Warranty decisions</strong> - Whether you need extra coverage</li>
                <li><strong>Gap insurance</strong> - If you need it based on your down payment</li>
                <li><strong>Any car buying concern</strong> - No question is too small!</li>
              </ul>
            </div>

            <div className="premium-features">
              <h4>⭐ Premium Features</h4>
              <ul>
                <li><strong>Advanced Analytics</strong> - Detailed spending insights</li>
                <li><strong>Market Alerts</strong> - Notifications for price changes</li>
                <li><strong>Priority Support</strong> - Faster AI responses</li>
                <li><strong>Export Tools</strong> - Advanced data export options</li>
              </ul>
            </div>
          </div>

          <div className="ai-usage-tips">
            <h4>💡 How to Use the AI Agent - CRITICAL FOR SUCCESS!</h4>
            <p><strong>🚨 DON'T HESITATE - Ask the AI agent about EVERYTHING!</strong></p>
            <ul>
              <li><strong>Be specific:</strong> Include car details, price, and situation</li>
              <li><strong>Ask follow-up questions:</strong> Dig deeper into advice</li>
              <li><strong>Share context:</strong> Mention your budget and preferences</li>
              <li><strong>Use regularly:</strong> Get advice throughout your search</li>
              <li><strong>Ask about warranties:</strong> Should you buy extra coverage?</li>
              <li><strong>Ask about gap insurance:</strong> Do you need it with your down payment?</li>
              <li><strong>Ask about financing:</strong> Is this rate and term good?</li>
              <li><strong>Ask about negotiation:</strong> How to counter their offer</li>
            </ul>
          </div>
        </div>
      )
    },
    bestPractices: {
      title: '🏆 Best Practices',
      content: (
        <div className="how-to-section">
          <h3>Getting the Best Results</h3>
          <p>Follow these proven strategies to maximize your car buying success.</p>
          
          <div className="practices-grid">
            <div className="practice-card">
              <h4>💰 Budget Strategy</h4>
              <ul>
                <li>Set a firm maximum budget before shopping</li>
                <li>Include taxes, fees, and insurance in calculations</li>
                <li>Get pre-approved for financing</li>
                <li>Consider total cost of ownership, not just price</li>
              </ul>
            </div>

            <div className="practice-card">
              <h4>🔍 Research Strategy</h4>
              <ul>
                <li>Research multiple sources for pricing</li>
                <li>Check vehicle history reports</li>
                <li>Compare similar cars in your area</li>
                <li>Understand market conditions</li>
              </ul>
            </div>

            <div className="practice-card">
              <h4>🤝 Negotiation Strategy</h4>
              <ul>
                <li>Start negotiations below your target price</li>
                <li>Be prepared to walk away</li>
                <li>Negotiate price before discussing financing</li>
                <li>Get everything in writing</li>
              </ul>
            </div>

            <div className="practice-card">
              <h4>⏰ Timing Strategy</h4>
              <ul>
                <li>Shop at month-end for better deals</li>
                <li>Consider seasonal factors</li>
                <li>Take your time - don't rush</li>
                <li>Be patient for the right deal</li>
              </ul>
            </div>
          </div>

          <div className="common-mistakes">
            <h4>⚠️ Common Mistakes to Avoid</h4>
            <ul>
              <li><strong>Focusing only on monthly payment</strong> - Look at total cost</li>
              <li><strong>Not checking vehicle history</strong> - Always get a report</li>
              <li><strong>Skipping the test drive</strong> - Always test drive first</li>
              <li><strong>Not negotiating</strong> - Everything is negotiable</li>
              <li><strong>Rushing the process</strong> - Take your time</li>
            </ul>
          </div>

          <div className="success-tips">
            <h4>🎯 Success Tips</h4>
            <ul>
              <li><strong>Use the app consistently</strong> - Track everything</li>
              <li><strong>Take detailed notes</strong> - Remember important details</li>
              <li><strong>Follow the checklist</strong> - Don't skip steps</li>
              <li><strong>Ask the AI agent</strong> - Get expert advice</li>
              <li><strong>Be persistent</strong> - The right deal will come</li>
            </ul>
          </div>
        </div>
      )
    },
    financial: {
      title: '💰 Financing Information',
      content: (
        <div className="how-to-section">
          <h3>Get Educational Financing Information</h3>
          <p>Use the Coach GPT to get educational information about interest rates, credit scores, debt-to-income ratios, and financing strategies.</p>
          
          <div className="disclaimer">
            <strong>⚠️ IMPORTANT DISCLAIMER:</strong> This tool provides educational information only and is NOT financial advice. 
            We are not licensed financial advisors. Always consult with qualified financial professionals before making financial decisions.
          </div>
          
          <div className="financial-guidance">
            <h4>🤖 Ask the Coach GPT About:</h4>
            
            <div className="guidance-category">
              <h5>📊 Interest Rates & Credit</h5>
              <ul>
                <li><strong>"What interest rate should I expect with a 720 credit score?"</strong></li>
                <li><strong>"How can I improve my credit score before applying?"</strong></li>
                <li><strong>"What's a good interest rate for a used car?"</strong></li>
                <li><strong>"Should I wait to improve my credit before buying?"</strong></li>
              </ul>
            </div>

            <div className="guidance-category">
              <h5>💳 Debt-to-Income Analysis</h5>
              <ul>
                <li><strong>"Is my debt-to-income ratio too high for a car loan?"</strong></li>
                <li><strong>"How much should I put down based on my income?"</strong></li>
                <li><strong>"Should I pay off other debt first?"</strong></li>
                <li><strong>"What's the maximum car payment I can afford?"</strong></li>
              </ul>
            </div>

            <div className="guidance-category">
              <h5>🏦 Financing Strategy</h5>
              <ul>
                <li><strong>"Should I get pre-approved before visiting dealers?"</strong></li>
                <li><strong>"What's better: dealer financing or bank loan?"</strong></li>
                <li><strong>"How do I negotiate a better interest rate?"</strong></li>
                <li><strong>"What documents do I need for financing?"</strong></li>
              </ul>
            </div>

            <div className="guidance-category">
              <h5>💡 Financial Planning</h5>
              <ul>
                <li><strong>"How much should I save for a down payment?"</strong></li>
                <li><strong>"What's the total cost of ownership?"</strong></li>
                <li><strong>"Should I buy or lease based on my situation?"</strong></li>
                <li><strong>"How do I budget for car insurance and maintenance?"</strong></li>
              </ul>
            </div>
          </div>

          <div className="coach-access">
            <h4>🎯 How to Access the Coach GPT</h4>
            <div className="access-methods">
              <div className="access-method">
                <h5>1. Main Dashboard</h5>
                <p>Click the <strong>"Ask Coach GPT"</strong> button on the home page</p>
              </div>
              <div className="access-method">
                <h5>2. Sidebar</h5>
                <p>Use the <strong>"Open Agent"</strong> button in the left sidebar</p>
              </div>
              <div className="access-method">
                <h5>3. Settings Page</h5>
                <p>Go to Settings → <strong>"Personal Negotiator Agent"</strong> section</p>
              </div>
            </div>
          </div>

          <div className="example-questions">
            <h4>💬 Example Questions to Ask</h4>
            <div className="question-examples">
              <div className="example-question">
                <strong>"I have a 680 credit score, $60k income, and $800/month in debt payments. What interest rate should I expect for a $25k car loan?"</strong>
              </div>
              <div className="example-question">
                <strong>"My debt-to-income ratio is 35%. Is that too high for a car loan? What can I do to improve it?"</strong>
              </div>
              <div className="example-question">
                <strong>"The dealer offered me 8.5% APR but I have good credit. How do I negotiate a better rate?"</strong>
              </div>
              <div className="example-question">
                <strong>"I'm self-employed with 2 years of tax returns. What do I need to know about financing?"</strong>
              </div>
            </div>
          </div>

          <div className="financial-tips">
            <h4>💡 Pro Financial Tips</h4>
            <ul>
              <li><strong>Get pre-approved first</strong> - Know your rate before visiting dealers</li>
              <li><strong>Shop multiple lenders</strong> - Banks, credit unions, and online lenders</li>
              <li><strong>Improve your credit first</strong> - Even 20-30 points can save thousands</li>
              <li><strong>Consider a co-signer</strong> - If your credit needs help</li>
              <li><strong>Negotiate the rate</strong> - Don't accept the first offer</li>
              <li><strong>Read all paperwork</strong> - Watch for rate changes in the finance office</li>
            </ul>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="how-to-use">
      <div className="how-to-header">
        <h1>📚 How to Use Car Deal Coach</h1>
        <p>Your complete guide to getting the best car deals</p>
        <button className="btn btn-secondary" onClick={() => navigate('/app/settings')}>
          ← Back to Settings
        </button>
      </div>

      <div className="how-to-content">
        <div className="section-nav">
          <h3>Choose a Section:</h3>
          <div className="nav-buttons">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                className={`nav-btn ${activeSection === key ? 'active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="section-content">
          <div className="section-header" style={{ color: '#ffffff' }}>
            <h2 style={{ color: '#ffffff' }}>{sections[activeSection].title}</h2>
          </div>
          <div className="section-body">
            {sections[activeSection].content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowToUse
