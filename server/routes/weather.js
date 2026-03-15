const express = require('express');
const router  = express.Router();
const { getCurrentWeather, getWeatherAlerts } = require('../../client/src/services/weatherService');
const { CITY_COORDS } = require('../../client/src/services/disruptionService');

router.get('/:city', async (req, res, next) => {
  try {
    const data = await getCurrentWeather(req.params.city);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.get('/:city/alerts', async (req, res, next) => {
  try {
    const coords = CITY_COORDS[req.params.city];
    if (!coords) return res.json({ success: true, data: [] });
    const alerts = await getWeatherAlerts(coords.lat, coords.lon);
    res.json({ success: true, data: alerts });
  } catch (err) { next(err); }
});

module.exports = router;