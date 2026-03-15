const axios = require('axios');

const AQICN_BASE  = 'https://api.waqi.info/feed';
const TOKEN       = () => process.env.AQICN_TOKEN;
const AQI_TRIGGER = 200;

function getAQICategory(aqi) {
  if (aqi <= 50)  return { label: 'Good',      color: '#3B6D11' };
  if (aqi <= 100) return { label: 'Moderate',  color: '#854F0B' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#BA7517' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#993C1D' };
  if (aqi <= 300) return { label: 'Very Poor', color: '#A32D2D' };
  return           { label: 'Severe',          color: '#791F1F' };
}

async function getAQI(city) {
  if (!TOKEN()) return getMockAQI(city);
  try {
    const res = await axios.get(`${AQICN_BASE}/${encodeURIComponent(city)}/`,
      { params: { token: TOKEN() }, timeout: 8000 });
    if (res.data.status !== 'ok') throw new Error('AQI API error');
    const d   = res.data.data;
    const aqi = d.aqi;
    const cat = getAQICategory(aqi);
    return {
      city, aqi, category: cat.label, color: cat.color,
      pm25: d.iaqi?.pm25?.v ?? null, pm10: d.iaqi?.pm10?.v ?? null,
      no2:  d.iaqi?.no2?.v  ?? null, o3:   d.iaqi?.o3?.v   ?? null,
      triggered: aqi > AQI_TRIGGER,
      trigger: aqi > AQI_TRIGGER ? { id: 'env-aqi', value: aqi, threshold: AQI_TRIGGER, unit: 'AQI' } : null,
      timestamp: new Date().toISOString(), source: 'AQICN'
    };
  } catch (err) {
    console.warn(`[AQIService] Failed for ${city}:`, err.message);
    return getMockAQI(city);
  }
}

function getMockAQI(city) {
  const cityAQI = { Chennai: 215, Mumbai: 198, Delhi: 312, Bengaluru: 145, Hyderabad: 178, Kolkata: 230 };
  const aqi = cityAQI[city] || 180;
  const cat = getAQICategory(aqi);
  return {
    city, aqi, category: cat.label, color: cat.color,
    pm25: Math.round(aqi*0.45), pm10: Math.round(aqi*0.85),
    no2:  Math.round(aqi*0.29), o3:   Math.round(aqi*0.18),
    triggered: aqi > AQI_TRIGGER,
    trigger: aqi > AQI_TRIGGER ? { id: 'env-aqi', value: aqi, threshold: AQI_TRIGGER, unit: 'AQI' } : null,
    timestamp: new Date().toISOString(), source: 'Mock (set AQICN_TOKEN)'
  };
}

module.exports = { getAQI, getAQICategory, AQI_TRIGGER };