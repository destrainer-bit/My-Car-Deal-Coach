// ESM module
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function monthlyPayment(apr, principal, months) {
  const r = apr / 12;
  if (r === 0) return +(principal / months).toFixed(2);
  const pmt = (r * principal) / (1 - Math.pow(1 + r, -months));
  return +pmt.toFixed(2);
}

function clamp(n, lo, hi) { return Math.min(Math.max(n, lo), hi); }

function pickBand(score, bands) {
  return bands.find(b => score >= b.min && score <= b.max) || null;
}

function aprWithAdjusters(baseApr, ctx, adjusters) {
  let apr = baseApr;
  for (const rule of adjusters || []) {
    const w = rule.when || {};
    const checks = [];
    if ('used' in w) checks.push(ctx.used === w.used);
    if ('termMin' in w) checks.push(ctx.term >= w.termMin);
    if ('termMax' in w) checks.push(ctx.term <= w.termMax);
    if ('ltvMin' in w) checks.push(ctx.ltv >= w.ltvMin);
    if ('ltvMax' in w) checks.push(ctx.ltv <= w.ltvMax);
    if ('state' in w) checks.push(ctx.state === w.state);
    if (checks.every(Boolean)) apr += (rule.aprAdd || 0);
  }
  return apr;
}

export function estimate(body) {
  const {
    state = 'GA',
    score = 700,
    vehiclePrice = 20000,
    downPayment = 2000,
    tradeInValue = 0,
    estTaxesAndFees = 1200,
    term = 60,
    vehicleYear = 2018,
    mileage = 80000,
    product = 'auto-used'
  } = body || {};

  const rulesPath = path.join(process.cwd(), 'finance-engine', 'rules.json');
  const fallbackPath = path.join(__dirname, '..', 'finance-engine', 'rules.json');
  const rules = JSON.parse(
    fs.readFileSync(fs.existsSync(rulesPath) ? rulesPath : fallbackPath, 'utf-8')
  );

  const band = pickBand(score, rules.scoreBands);
  if (!band) throw new Error('Score out of supported range');

  const loanAmount = clamp(
    vehiclePrice - downPayment - tradeInValue + estTaxesAndFees,
    0,
    Number.MAX_SAFE_INTEGER
  );
  const ltv = loanAmount / Math.max(vehiclePrice, 1);

  const ctx = {
    state,
    term,
    used: product === 'auto-used',
    ltv,
    vehicleYear,
    mileage
  };

  const eligible = rules.lenders
    .filter(L =>
      L.states.includes(state) &&
      L.products.includes(product) &&
      L.terms.includes(term) &&
      ltv <= (L.caps?.maxLTV ?? 2) &&
      vehicleYear >= (L.caps?.minYear ?? 1900) &&
      mileage <= (L.caps?.maxMiles ?? 9e12) &&
      (L.baseAprByBand[band.id] || 0) > 0
    )
    .map(L => {
      const base = L.baseAprByBand[band.id];
      const apr = aprWithAdjusters(base, ctx, L.adjusters);
      const aprLow = Math.max(apr - 0.005, 0);
      const aprHigh = apr + 0.005;
      const pmtLow = monthlyPayment(aprLow, loanAmount, term);
      const pmtHigh = monthlyPayment(aprHigh, loanAmount, term);

      return {
        lenderId: L.id,
        lenderName: L.name,
        aprLow: +aprLow.toFixed(4),
        aprHigh: +aprHigh.toFixed(4),
        paymentLow: pmtLow,
        paymentHigh: pmtHigh,
        term,
        loanAmount: +loanAmount.toFixed(2),
        notes: [
          product === 'auto-used' ? 'Used vehicle add-on included' : null,
          term >= 61 ? 'Longer-term add-on included' : null,
          ltv > 1.0 ? 'High LTV add-on included' : null
        ].filter(Boolean),
        caps: L.caps
      };
    })
    .sort((a, b) => a.aprLow - b.aprLow);

  return {
    meta: rules.meta,
    band,
    inputs: { state, score, vehiclePrice, downPayment, tradeInValue, estTaxesAndFees, term, vehicleYear, mileage, product },
    results: eligible
  };
}
