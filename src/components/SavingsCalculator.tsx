import React, { useMemo, useState } from 'react'
import './savings-calculator.css'

function monthlyPayment(principal: number, aprPercent: number, months: number): number {
  const i = (aprPercent / 100) / 12
  if (principal <= 0 || months <= 0) return 0
  if (i === 0) return principal / months
  return principal * (i / (1 - Math.pow(1 + i, -months)))
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export default function SavingsCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(30000)
  const [downPayment, setDownPayment] = useState(3000)
  const [termMonths, setTermMonths] = useState(60)

  const [aprWithout, setAprWithout] = useState(9.5)
  const [aprWith, setAprWith] = useState(7.5)

  const [dealerMarkupPct, setDealerMarkupPct] = useState(3)
  const [addOnsAvoided, setAddOnsAvoided] = useState(800)
  const [docFeesAvoided, setDocFeesAvoided] = useState(200)
  const [tradeInImprovement, setTradeInImprovement] = useState(500)

  const price = Math.max(0, vehiclePrice)
  const down = clamp(downPayment, 0, price)
  const markupPct = clamp(dealerMarkupPct, 0, 25)

  const inflatedPrice = useMemo(() => price * (1 + markupPct / 100), [price, markupPct])
  const principalWithout = Math.max(0, inflatedPrice - down)
  const monthlyWithout = monthlyPayment(principalWithout, aprWithout, termMonths)
  const totalPayWithout = monthlyWithout * termMonths
  const totalInterestWithout = Math.max(0, totalPayWithout - principalWithout)

  const principalWith = Math.max(0, price - down)
  const monthlyWith = monthlyPayment(principalWith, aprWith, termMonths)
  const totalPayWith = monthlyWith * termMonths
  const totalInterestWith = Math.max(0, totalPayWith - principalWith)

  const extrasSavings =
    Math.max(0, addOnsAvoided) + Math.max(0, docFeesAvoided) + Math.max(0, tradeInImprovement)

  const coreDelta = (inflatedPrice + totalInterestWithout) - (price + totalInterestWith)

  const estimatedSavings = Math.max(0, coreDelta + extrasSavings)

  const usd = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  const usdCents = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

  return (
    <section className="calc-wrap" aria-labelledby="savings-heading">
      <header className="calc-header">
        <h2 id="savings-heading">Estimate Your Savings</h2>
        <p className="sub">
          Plug in your numbers. See the difference your coach makes—before you step into the dealership.
        </p>
      </header>

      <div className="calc-grid">
        <div className="card form">
          <h3>Your Deal Inputs</h3>

          <div className="field">
            <label htmlFor="vehiclePrice">Vehicle Price</label>
            <input
              id="vehiclePrice"
              type="number"
              min={0}
              step={100}
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="downPayment">Down Payment</label>
            <input
              id="downPayment"
              type="number"
              min={0}
              step={100}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="termMonths">Loan Term</label>
            <select
              id="termMonths"
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
            >
              <option value={36}>36 months</option>
              <option value={48}>48 months</option>
              <option value={60}>60 months</option>
              <option value={72}>72 months</option>
            </select>
          </div>

          <div className="split">
            <div className="field">
              <label htmlFor="aprWithout">APR (Without App)</label>
              <input
                id="aprWithout"
                type="number"
                min={0}
                max={40}
                step={0.1}
                value={aprWithout}
                onChange={(e) => setAprWithout(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label htmlFor="aprWith">APR (With App)</label>
              <input
                id="aprWith"
                type="number"
                min={0}
                max={40}
                step={0.1}
                value={aprWith}
                onChange={(e) => setAprWith(Number(e.target.value))}
              />
            </div>
          </div>

          <hr className="divider" />

          <h4>Dealer Tactics You Avoid</h4>

          <div className="field">
            <label htmlFor="dealerMarkupPct">Dealer Markup Avoided (%)</label>
            <input
              id="dealerMarkupPct"
              type="number"
              min={0}
              max={25}
              step={0.5}
              value={dealerMarkupPct}
              onChange={(e) => setDealerMarkupPct(Number(e.target.value))}
            />
          </div>

          <div className="split">
            <div className="field">
              <label htmlFor="addOnsAvoided">Add-Ons Avoided ($)</label>
              <input
                id="addOnsAvoided"
                type="number"
                min={0}
                step={50}
                value={addOnsAvoided}
                onChange={(e) => setAddOnsAvoided(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label htmlFor="docFeesAvoided">Doc/Admin Fees Reduced ($)</label>
              <input
                id="docFeesAvoided"
                type="number"
                min={0}
                step={25}
                value={docFeesAvoided}
                onChange={(e) => setDocFeesAvoided(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="tradeInImprovement">Trade-In Improvement ($)</label>
            <input
              id="tradeInImprovement"
              type="number"
              min={0}
              step={50}
              value={tradeInImprovement}
              onChange={(e) => setTradeInImprovement(Number(e.target.value))}
            />
          </div>

          <p className="hint">
            Tip: Set “Dealer Markup Avoided” to 0–5% (typical). Add-ons often run $500–$2,000.
          </p>
        </div>

        <div className="card results">
          <h3>Results</h3>

          <div className="result-block">
            <div className="row">
              <span>Price w/ Markup (No App)</span>
              <strong>{usd(inflatedPrice)}</strong>
            </div>
            <div className="row">
              <span>Principal (No App)</span>
              <strong>{usd(principalWithout)}</strong>
            </div>
            <div className="row">
              <span>Monthly (No App @ {aprWithout.toFixed(1)}%)</span>
              <strong>{usdCents(monthlyWithout)}</strong>
            </div>
            <div className="row">
              <span>Total Interest (No App)</span>
              <strong>{usd(totalInterestWithout)}</strong>
            </div>
          </div>

          <div className="result-block">
            <div className="row">
              <span>Price (With App)</span>
              <strong>{usd(price)}</strong>
            </div>
            <div className="row">
              <span>Principal (With App)</span>
              <strong>{usd(principalWith)}</strong>
            </div>
            <div className="row">
              <span>Monthly (With App @ {aprWith.toFixed(1)}%)</span>
              <strong>{usdCents(monthlyWith)}</strong>
            </div>
            <div className="row">
              <span>Total Interest (With App)</span>
              <strong>{usd(totalInterestWith)}</strong>
            </div>
          </div>

          <div className="result-block highlight">
            <div className="row">
              <span>Core Deal Delta (Markup + APR)</span>
              <strong>{usd(Math.max(0, coreDelta))}</strong>
            </div>
            <div className="row">
              <span>Extras Saved (Add-Ons + Fees + Trade-In)</span>
              <strong>{usd(extrasSavings)}</strong>
            </div>
            <div className="row total">
              <span>Estimated Total Savings</span>
              <strong>{usd(estimatedSavings)}</strong>
            </div>
          </div>

          {estimatedSavings >= 1000 && (
            <div className="cta-block">
              <button
                className="cta"
                onClick={() => {
                  localStorage.setItem('highlightTier', '90 Days')
                  const el = document.getElementById('pricing')
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  } else {
                    window.location.hash = '#pricing'
                  }
                }}
              >
                You’re set to save {usd(estimatedSavings)} — Get 90 Days (Best Value)
              </button>
            </div>
          )}

          <p className="fineprint">
            Estimates only. Real savings vary by lender, market conditions, credit profile, and negotiation outcomes.
          </p>
        </div>
      </div>
    </section>
  )
}

