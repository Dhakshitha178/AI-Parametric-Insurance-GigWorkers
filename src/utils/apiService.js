// ─── src/utils/apiService.js ─────────────────────────────────────────────────
// Mock API layer simulating:
//   - Weather API (OpenWeatherMap)
//   - Platform Status API
//   - Traffic API (Google Maps)
//   - Payment / UPI payout API
//   - Fraud Detection Engine
//
// In production, replace each function's internals with real API calls.

import { DISRUPTIONS, CITY_DISRUPTION_MAP } from "../data/constants";

// ── Helper: delay ─────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Helper: random range ──────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * fetchWeatherData
 * Simulates OpenWeatherMap API call for a city.
 * Production: GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}
 *
 * @param {string} city
 * @returns {Object} weather data
 */
export async function fetchWeatherData(city) {
  await delay(600);

  const weatherProfiles = {
    Mumbai: { temp: 32, rainfall: 65, wind: 45, aqi: 120, condition: "Heavy Rain" },
    Chennai: { temp: 38, rainfall: 80, wind: 90, aqi: 85, condition: "Cyclone Watch" },
    Delhi: { temp: 46, rainfall: 0, wind: 20, aqi: 450, condition: "Extreme Heat & Pollution" },
    Bangalore: { temp: 28, rainfall: 55, wind: 30, aqi: 110, condition: "Moderate Rain" },
    Hyderabad: { temp: 44, rainfall: 5, wind: 25, aqi: 200, condition: "Extreme Heat" },
    Kolkata: { temp: 35, rainfall: 70, wind: 85, aqi: 180, condition: "Storm Warning" },
    Pune: { temp: 30, rainfall: 60, wind: 35, aqi: 90, condition: "Heavy Rain" },
    Ahmedabad: { temp: 47, rainfall: 0, wind: 30, aqi: 280, condition: "Extreme Heat" },
    Jaipur: { temp: 45, rainfall: 10, wind: 70, aqi: 200, condition: "Dust Storm" },
    Surat: { temp: 33, rainfall: 75, wind: 40, aqi: 130, condition: "Heavy Rain" },
  };

  const profile = weatherProfiles[city] || weatherProfiles["Mumbai"];
  return {
    city,
    temperature: profile.temp,
    rainfall: profile.rainfall,
    windSpeed: profile.wind,
    aqi: profile.aqi,
    condition: profile.condition,
    humidity: rand(60, 95),
    visibility: rand(2, 10),
    fetchedAt: new Date().toLocaleString("en-IN"),
    source: "OpenWeatherMap API (Mock)",
  };
}

/**
 * fetchPlatformStatus
 * Simulates platform operational status check.
 * Production: Hit platform status page APIs or internal webhook feeds.
 *
 * @param {string} platform
 * @returns {Object} platform status data
 */
export async function fetchPlatformStatus(platform) {
  await delay(400);

  const statuses = {
    Zomato: { serverUp: true, paymentGateway: true, warehouseOp: true },
    Swiggy: { serverUp: true, paymentGateway: false, warehouseOp: true },
    Zepto: { serverUp: false, paymentGateway: true, warehouseOp: false },
    Amazon: { serverUp: true, paymentGateway: true, warehouseOp: true },
    Dunzo: { serverUp: false, paymentGateway: false, warehouseOp: true },
    Blinkit: { serverUp: true, paymentGateway: true, warehouseOp: false },
    Porter: { serverUp: true, paymentGateway: true, warehouseOp: true },
    BigBasket: { serverUp: true, paymentGateway: false, warehouseOp: true },
  };

  const s = statuses[platform] || { serverUp: true, paymentGateway: true, warehouseOp: true };

  return {
    platform,
    serverStatus: s.serverUp ? "Operational" : "Degraded",
    paymentGateway: s.paymentGateway ? "Online" : "Down",
    warehouseSystem: s.warehouseOp ? "Operational" : "Partial Outage",
    powerGrid: rand(0, 10) > 2 ? "Stable" : "Outage Detected",
    lastChecked: new Date().toLocaleTimeString("en-IN"),
    source: "Platform Status API (Mock)",
  };
}

/**
 * fetchTrafficData
 * Simulates Google Maps Traffic API for hyperlocal disruptions.
 * Production: GET https://maps.googleapis.com/maps/api/directions/json?...
 *
 * @param {string} city
 * @param {string} zone
 * @returns {Object} traffic disruption data
 */
export async function fetchTrafficData(city, zone) {
  await delay(500);

  const hyperlocal = rand(0, 10);

  return {
    city,
    zone,
    roadBlockages: hyperlocal > 7 ? rand(1, 3) : 0,
    floodingReported: hyperlocal > 8,
    civilDisruption: hyperlocal > 9,
    avgDeliveryDelay: hyperlocal > 6 ? `${rand(20, 90)} mins` : "Normal",
    affectedPincodes: hyperlocal > 7 ? [`${rand(400000, 400099)}`, `${rand(400000, 400099)}`] : [],
    source: "Google Maps Traffic API (Mock)",
    fetchedAt: new Date().toLocaleTimeString("en-IN"),
  };
}

/**
 * fetchDisruptionData
 * Aggregates all API sources (weather, platform, traffic) into a unified
 * list of active disruption events for a city + platform combination.
 *
 * @param {string} city
 * @param {string} platform
 * @param {string} zone
 * @returns {Array} activeDisruptions
 */
export async function fetchDisruptionData(city, platform = "", zone = "") {
  // Fetch all data sources in parallel
  const [weather, platformStatus, traffic] = await Promise.all([
    fetchWeatherData(city),
    fetchPlatformStatus(platform || "Zomato"),
    fetchTrafficData(city, zone),
  ]);

  const activeIds = CITY_DISRUPTION_MAP[city] || ["heavy_rain"];
  const allDisruptions = [
    ...DISRUPTIONS.environmental,
    ...DISRUPTIONS.operational,
    ...DISRUPTIONS.hyperlocal,
  ];

  // Add extra operational disruptions based on live platform data
  const extraIds = [];
  if (platformStatus.serverStatus === "Degraded") extraIds.push("server_fail");
  if (platformStatus.paymentGateway === "Down") extraIds.push("payment_fail");
  if (platformStatus.warehouseSystem.includes("Outage")) extraIds.push("warehouse_down");
  if (platformStatus.powerGrid === "Outage Detected") extraIds.push("power_outage");

  // Add hyperlocal disruptions from traffic data
  if (traffic.roadBlockages > 0) extraIds.push("road_block");
  if (traffic.floodingReported) extraIds.push("flooding");
  if (traffic.civilDisruption) extraIds.push("protest");

  const allActiveIds = [...new Set([...activeIds, ...extraIds])];

  const active = allDisruptions
    .filter((d) => allActiveIds.includes(d.id))
    .map((d) => ({
      ...d,
      confidence: rand(72, 97),
      incomeLossEst: rand(15, 45),
      detectedAt: new Date(Date.now() - rand(0, 3600000)).toLocaleTimeString("en-IN"),
      rawData: {
        weather: weather.condition,
        platform: platformStatus.serverStatus,
        traffic: traffic.avgDeliveryDelay,
      },
    }));

  return {
    disruptions: active,
    weatherSummary: weather,
    platformSummary: platformStatus,
    trafficSummary: traffic,
    scanTime: new Date().toLocaleTimeString("en-IN"),
  };
}

/**
 * runFraudDetection
 * AI fraud detection engine:
 *   - Location validation
 *   - Activity pattern analysis
 *   - Duplicate claim prevention
 *   - Disruption cross-validation
 *   - Policy status check
 *
 * @param {Object} claimData
 * @param {Object} workerProfile
 * @param {string} policyId
 * @returns {Object} fraudResult
 */
export async function runFraudDetection(claimData, workerProfile, policyId) {
  await delay(2200);

  const checks = [
    {
      id: "location",
      label: "Location Verification",
      detail: `Worker GPS matches ${workerProfile.city} · ${workerProfile.zone}`,
      status: "PASS",
      score: rand(88, 99),
    },
    {
      id: "activity",
      label: "Activity Pattern Analysis",
      detail: `${workerProfile.hoursPerDay}hr/day pattern consistent with claim period`,
      status: "PASS",
      score: rand(85, 97),
    },
    {
      id: "duplicate",
      label: "Duplicate Claim Detection",
      detail: "No duplicate claims found in last 7 days",
      status: "PASS",
      score: 100,
    },
    {
      id: "cross_validate",
      label: "Disruption Cross-Validation",
      detail: `${claimData.disruptions.length} triggers confirmed across ${claimData.disruptions.length} data sources`,
      status: "PASS",
      score: rand(90, 99),
    },
    {
      id: "policy",
      label: "Policy Status Verification",
      detail: `Policy ${policyId} active and premium current`,
      status: "PASS",
      score: 100,
    },
    {
      id: "anomaly",
      label: "Anomaly Detection (ML Model)",
      detail: "No unusual claim patterns detected by AI model",
      status: "PASS",
      score: rand(87, 96),
    },
  ];

  const overallScore = Math.round(
    checks.reduce((s, c) => s + c.score, 0) / checks.length
  );

  return {
    passed: true,
    checks,
    overallScore,
    decision: "APPROVED",
    message: "All fraud checks passed. Claim approved for auto-payout.",
    processedAt: new Date().toLocaleString("en-IN"),
  };
}

/**
 * processUPIPayout
 * Simulates UPI payout via payment gateway (Razorpay/PayU sandbox).
 * Production: POST https://api.razorpay.com/v1/payouts
 *
 * @param {Object} payoutDetails - { amount, upiId, workerName, claimId }
 * @returns {Object} payout result
 */
export async function processUPIPayout(payoutDetails) {
  await delay(1800);

  const txnId = "GIG" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return {
    success: true,
    txnId,
    amount: payoutDetails.amount,
    upiId: payoutDetails.upiId,
    workerName: payoutDetails.workerName,
    method: "UPI",
    bank: "HDFC Bank (Mock)",
    status: "SUCCESS",
    timestamp: new Date().toLocaleString("en-IN"),
    settlementTime: "Instant",
    reference: `RAZORPAY-${txnId}`,
    source: "Razorpay Payout API (Mock/Sandbox)",
  };
}

/**
 * generatePolicyId
 * Creates a unique policy ID.
 *
 * @returns {string}
 */
export function generatePolicyId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "GS-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/**
 * generateClaimId
 * Creates a unique claim reference ID.
 *
 * @returns {string}
 */
export function generateClaimId() {
  return "CLM-" + Date.now().toString(36).toUpperCase();
}