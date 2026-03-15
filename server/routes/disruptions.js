const express = require('express');
const router  = express.Router();
const { runDisruptionScan }    = require('../../client/src/services/disruptionService');
const { getAQI }               = require('../../client/src/services/aqiService');
const { checkPlatformStatus, checkPaymentGatewayStatus } = require('../../client/src/services/platformService');

router.get('/scan', async (req, res, next) => {
  try {
    const city      = req.query.city || 'Chennai';
    const platforms = req.query.platforms ? req.query.platforms.split(',') : ['Swiggy','Zomato'];
    const result    = await runDisruptionScan(city, platforms);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get('/aqi/:city', async (req, res, next) => {
  try {
    const data = await getAQI(req.params.city);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/platforms', async (req, res, next) => {
  try {
    const platforms = req.query.names ? req.query.names.split(',') : [];
    const [platformStatus, paymentStatus] = await Promise.all([
      checkPlatformStatus(platforms),
      checkPaymentGatewayStatus()
    ]);
    res.json({ success: true, data: { platforms: platformStatus, payment: paymentStatus } });
  } catch (err) { next(err); }
});

module.exports = router;