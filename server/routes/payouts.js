const express = require('express');
const router  = express.Router();
const { processUpiPayout, getPayoutStatus } = require('../../client/src/services/payoutService');

router.post('/process', async (req, res, next) => {
  try {
    const { upiId, amount, claimId, workerName, eventName } = req.body;
    if (!upiId || !amount || !claimId)
      return res.status(400).json({ success: false, error: 'upiId, amount, claimId required' });
    const result = await processUpiPayout({ upiId, amount, claimId, workerName, eventName });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get('/:txnId/status', async (req, res, next) => {
  try {
    const data = await getPayoutStatus(req.params.txnId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

module.exports = router;