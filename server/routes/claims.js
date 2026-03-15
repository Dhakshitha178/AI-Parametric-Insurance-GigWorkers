const express  = require('express');
const router   = express.Router();
const { v4: uuid } = require('uuid');
const { detectFraud }      = require('../../client/src/services/aiRiskService');
const { processUpiPayout } = require('../../client/src/services/payoutService');

const claimsStore = new Map();

router.post('/initiate', async (req, res, next) => {
  try {
    const { workerId, workerName, upiId, disruptionId, eventName, weeklyIncome, plan, city } = req.body;
    if (!workerId || !disruptionId || !weeklyIncome || !plan)
      return res.status(400).json({ success: false, error: 'Missing required fields' });

    const coverageMultipliers = { basic: 0.6, standard: 0.8, premium: 1.0 };
    const multiplier   = coverageMultipliers[plan.id] || 0.8;
    const estimatedLoss = Math.round(weeklyIncome * 0.25);
    const payoutAmount  = Math.round(estimatedLoss * multiplier);
    const claimId = 'CLM-' + Math.floor(Math.random() * 9000 + 1000);

    const fraudResult = await detectFraud({
      claim: { id: claimId, event: eventName, amount: payoutAmount, date: new Date().toISOString(), city },
      workerHistory: { avgWeekly: weeklyIncome, previousClaims: 0, accountAge: '6 months' },
      disruptionData: { confirmed: true, severity: 'High', zoneMatch: true }
    });

    const claim = {
      id: claimId, workerId, disruptionId,
      event: eventName, amount: payoutAmount,
      status: fraudResult.recommendation === 'REJECT' ? 'Denied' : 'Processing',
      fraudScore: fraudResult.fraudScore,
      fraudChecks: fraudResult.checks,
      recommendation: fraudResult.recommendation,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      upiId, city
    };

    claimsStore.set(claimId, claim);
    if (fraudResult.recommendation === 'AUTO_APPROVE')
      setTimeout(() => autoSettle(claimId, workerName), 2000);

    res.json({ success: true, data: claim });
  } catch (err) { next(err); }
});

router.get('/:id', (req, res) => {
  const claim = claimsStore.get(req.params.id);
  if (!claim) return res.status(404).json({ success: false, error: 'Claim not found' });
  res.json({ success: true, data: claim });
});

router.post('/:id/approve', async (req, res, next) => {
  try {
    const claim = claimsStore.get(req.params.id);
    if (!claim) return res.status(404).json({ success: false, error: 'Claim not found' });
    await autoSettle(req.params.id, req.body.workerName || 'Worker');
    res.json({ success: true, data: claimsStore.get(req.params.id) });
  } catch (err) { next(err); }
});

router.get('/', (req, res) => {
  res.json({ success: true, data: Array.from(claimsStore.values()) });
});

async function autoSettle(claimId, workerName) {
  const claim = claimsStore.get(claimId);
  if (!claim || claim.status === 'Paid') return;
  try {
    const payout = await processUpiPayout({
      upiId: claim.upiId || 'worker@upi',
      amount: claim.amount, claimId,
      workerName: workerName || 'Worker',
      eventName: claim.event
    });
    claim.status        = payout.success ? 'Paid' : 'Failed';
    claim.transactionId = payout.transactionId;
    claim.utrNumber     = payout.utrNumber;
    claim.settledAt     = payout.settledAt;
    claimsStore.set(claimId, claim);
  } catch (err) {
    claim.status = 'Failed';
    claimsStore.set(claimId, claim);
  }
}

module.exports = router;