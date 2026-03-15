require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const rateLimit = require('express-rate-limit');

const weatherRoutes    = require('./routes/weather');
const riskRoutes       = require('./routes/risk');
const claimsRoutes     = require('./routes/claims');
const payoutRoutes     = require('./routes/payouts');
const disruptionRoutes = require('./routes/disruptions');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.use('/api/weather',     weatherRoutes);
app.use('/api/risk',        riskRoutes);
app.use('/api/claims',      claimsRoutes);
app.use('/api/payouts',     payoutRoutes);
app.use('/api/disruptions', disruptionRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      anthropic:   !!process.env.ANTHROPIC_API_KEY,
      openweather: !!process.env.OPENWEATHER_API_KEY,
      aqicn:       !!process.env.AQICN_TOKEN,
      razorpay:    !!process.env.RAZORPAY_KEY_ID,
    }
  });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🛡  GigShield API → http://localhost:${PORT}`);
  console.log(`   Anthropic: ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗ missing'}`);
  console.log(`   OpenWeather: ${process.env.OPENWEATHER_API_KEY ? '✓' : '✗ missing'}`);
  console.log(`   AQICN: ${process.env.AQICN_TOKEN ? '✓' : '✗ missing'}`);
  console.log(`   Razorpay: ${process.env.RAZORPAY_KEY_ID ? '✓' : '✗ missing'}\n`);
});

module.exports = app;