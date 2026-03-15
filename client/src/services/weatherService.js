const axios = require('axios');

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const KEY      = () => process.env.OPENWEATHER_API_KEY;

const THRESHOLDS = {
  rain_mm_per_hr: 15,
  temp_celsius:   42,
  wind_kmh:       90,
};

async function getCurrentWeather(city) {
  if (!KEY()) return getMockWeather(city);
  try {
    const res = await axios.get(`${OWM_BASE}/weather`, {
      params: { q: `${city},IN`, appid: KEY(), units: 'metric' },
      timeout: 8000
    });
    return parseWeatherResponse(res.data, city);
  } catch (err) {
    console.warn(`[WeatherService] Failed for ${city}:`, err.message);
    return getMockWeather(city);
  }
}

async function getWeatherAlerts(lat, lon) {
  if (!KEY()) return [];
  try {
    const res = await axios.get(`${OWM_BASE}/onecall`, {
      params: { lat, lon, appid: KEY(), exclude: 'minutely,daily,hourly' },
      timeout: 8000
    });
    return (res.data.alerts || []).map(a => ({
      event: a.event, description: a.description,
      start: new Date(a.start * 1000).toISOString(),
      end:   new Date(a.end   * 1000).toISOString(),
    }));
  } catch (err) { return []; }
}

function parseWeatherResponse(d, city) {
  const tempC   = d.main?.temp        || 28;
  const rainMm  = d.rain?.['1h']      || 0;
  const windKmh = (d.wind?.speed || 0) * 3.6;
  const triggers = [];
  if (rainMm  >= THRESHOLDS.rain_mm_per_hr) triggers.push({ id: 'env-rain',    value: rainMm,  threshold: THRESHOLDS.rain_mm_per_hr, unit: 'mm/hr' });
  if (tempC   >= THRESHOLDS.temp_celsius)   triggers.push({ id: 'env-heat',    value: tempC,   threshold: THRESHOLDS.temp_celsius,   unit: '°C' });
  if (windKmh >= THRESHOLDS.wind_kmh)       triggers.push({ id: 'env-cyclone', value: windKmh, threshold: THRESHOLDS.wind_kmh,       unit: 'km/h' });
  return {
    city, temp_c: +tempC.toFixed(1), feels_like: +(d.main?.feels_like||tempC).toFixed(1),
    humidity: d.main?.humidity||70, rain_1h_mm: +rainMm.toFixed(2),
    wind_kmh: +windKmh.toFixed(1), visibility_m: d.visibility||10000,
    condition: d.weather?.[0]?.main||'Clear',
    description: d.weather?.[0]?.description||'',
    triggers, timestamp: new Date().toISOString(), source: 'OpenWeatherMap'
  };
}

function getMockWeather(city) {
  const defaults = {
    Chennai:   { temp_c: 38.4, rain_1h_mm: 18.2, wind_kmh: 35, condition: 'Rain' },
    Mumbai:    { temp_c: 32.1, rain_1h_mm: 22.5, wind_kmh: 28, condition: 'Thunderstorm' },
    Delhi:     { temp_c: 44.2, rain_1h_mm: 0,    wind_kmh: 18, condition: 'Haze' },
    Bengaluru: { temp_c: 29.8, rain_1h_mm: 5.1,  wind_kmh: 22, condition: 'Clouds' },
    Hyderabad: { temp_c: 40.1, rain_1h_mm: 0,    wind_kmh: 20, condition: 'Clear' },
    Kolkata:   { temp_c: 35.3, rain_1h_mm: 12.0, wind_kmh: 30, condition: 'Rain' },
  };
  const d = defaults[city] || { temp_c: 33, rain_1h_mm: 8, wind_kmh: 20, condition: 'Clouds' };
  const triggers = [];
  if (d.rain_1h_mm >= THRESHOLDS.rain_mm_per_hr)
    triggers.push({ id: 'env-rain', value: d.rain_1h_mm, threshold: THRESHOLDS.rain_mm_per_hr, unit: 'mm/hr' });
  if (d.temp_c >= THRESHOLDS.temp_celsius)
    triggers.push({ id: 'env-heat', value: d.temp_c, threshold: THRESHOLDS.temp_celsius, unit: '°C' });
  return { ...d, city, humidity: 72, visibility_m: 5000, triggers,
    timestamp: new Date().toISOString(), source: 'Mock (set OPENWEATHER_API_KEY)' };
}

module.exports = { getCurrentWeather, getWeatherAlerts, THRESHOLDS };