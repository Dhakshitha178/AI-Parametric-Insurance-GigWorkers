const { getCurrentWeather } = require('./weatherService');
const { getAQI }             = require('./aqiService');
const { checkPlatformStatus, checkPaymentGatewayStatus, checkWarehouseStatus } = require('./platformService');

const CITY_COORDS = {
  Chennai:   { lat: 13.0827, lon: 80.2707 },
  Mumbai:    { lat: 19.0760, lon: 72.8777 },
  Delhi:     { lat: 28.6139, lon: 77.2090 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
  Kolkata:   { lat: 22.5726, lon: 88.3639 },
  Pune:      { lat: 18.5204, lon: 73.8567 },
};

async function runDisruptionScan(city = 'Chennai', platforms = ['Swiggy','Zomato']) {
  const startTime = Date.now();

  const [weather, aqi, platformStatus, paymentStatus, warehouseStatus] = await Promise.all([
    getCurrentWeather(city).catch(err => ({ error: err.message, triggers: [] })),
    getAQI(city).catch(err => ({ error: err.message, triggered: false })),
    checkPlatformStatus(platforms).catch(() => []),
    checkPaymentGatewayStatus().catch(err => ({ error: err.message, triggered: false })),
    checkWarehouseStatus(city).catch(err => ({ error: err.message, triggered: false }))
  ]);

  const triggered = [];

  (weather.triggers || []).forEach(t => triggered.push({ ...t, source: 'OpenWeatherMap',
    data: { temp_c: weather.temp_c, rain_1h_mm: weather.rain_1h_mm, wind_kmh: weather.wind_kmh } }));

  if (aqi.triggered && aqi.trigger)
    triggered.push({ ...aqi.trigger, source: 'AQICN', data: { aqi: aqi.aqi, category: aqi.category } });

  platformStatus.forEach(p => {
    if (p.triggered && p.trigger)
      triggered.push({ ...p.trigger, source: 'Platform API', platform: p.name, data: { uptime: p.uptime_pct } });
  });

  if (paymentStatus.triggered && paymentStatus.trigger)
    triggered.push({ ...paymentStatus.trigger, source: 'Razorpay Status' });

  if (warehouseStatus.triggered && warehouseStatus.trigger)
    triggered.push({ ...warehouseStatus.trigger, source: 'WMS API' });

  return {
    city, platforms, triggered,
    triggeredCount:  triggered.length,
    raw:             { weather, aqi, platformStatus, paymentStatus, warehouseStatus },
    scannedAt:       new Date().toISOString(),
    scanDurationMs:  Date.now() - startTime,
    nextScanAt:      new Date(Date.now() + 5*60*1000).toISOString()
  };
}

module.exports = { runDisruptionScan, CITY_COORDS };