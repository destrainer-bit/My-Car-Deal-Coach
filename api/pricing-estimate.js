// ESM module for Vercel
import { estimate } from '../lib/pricingEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const data = estimate(body || {});
    return res.status(200).json(data);
  } catch (e) {
    return res.status(400).json({ error: String(e.message || e) });
  }
}
