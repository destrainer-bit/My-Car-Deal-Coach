// ESM module
import express from 'express';
import cors from 'cors';
import { estimate } from '../lib/pricingEngine.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/pricing-estimate', (req, res) => {
  try {
    const data = estimate(req.body || {});
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Dev API running at http://localhost:${PORT}`);
});
