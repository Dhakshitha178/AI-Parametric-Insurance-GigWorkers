const express = require('express');
const router  = express.Router();
const { assessRisk, detectFraud } = require('../../client/src/services/aiRiskService');

router.post('/assess', async (req, res, next) => {
  try {
    const { worker, income, disruptions } = req.body;
    if (!worker || !income || !Array.isArray(income) || income.length !== 7)
      return res.status(400).json({ success: false, error: 'worker and income[7] required' });
    const result = await assessRisk({ worker, income, disruptions: disruptions || [] });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/fraud', async (req, res, next) => {
  try {
    const { claim, workerHistory, disruptionData } = req.body;
    if (!claim) return res.status(400).json({ success: false, error: 'claim required' });
    const result = await detectFraud({ claim, workerHistory: workerHistory || {}, disruptionData: disruptionData || {} });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

module.exports = router;