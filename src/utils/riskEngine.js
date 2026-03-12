// ─── src/utils/riskEngine.js ─────────────────────────────────────────────────
// AI-powered risk scoring engine
// Calculates risk score, level, and breakdown factors for each worker profile

import {
  CITY_RISK_SCORES,
  PLATFORM_RISK_SCORES,
} from "../data/constants";

/**
 * calculateRisk
 * Runs a multi-factor AI risk model on a worker profile.
 * Returns a detailed risk object with score, level, color, and factor breakdown.
 *
 * @param {Object} profile - Worker profile from onboarding
 * @returns {Object} risk - { score, level, color, factors, recommendation }
 */
export function calculateRisk(profile) {
  const factors = [];

  // ── Factor 1: City Risk ──
  const cityScore = CITY_RISK_SCORES[profile.city] || 6;
  factors.push({
    label: "City Risk Index",
    value: cityScore,
    max: 10,
    description: `${profile.city} environmental & infrastructure risk`,
    weight: 0.25,
  });

  // ── Factor 2: Platform Volatility ──
  const platformScore = PLATFORM_RISK_SCORES[profile.platform] || 7;
  factors.push({
    label: "Platform Volatility",
    value: platformScore,
    max: 10,
    description: `${profile.platform} operational stability index`,
    weight: 0.2,
  });

  // ── Factor 3: Daily Exposure Hours ──
  const hours = parseInt(profile.hoursPerDay) || 8;
  const hoursScore = hours > 12 ? 10 : hours > 10 ? 9 : hours > 8 ? 7 : hours > 6 ? 5 : 3;
  factors.push({
    label: "Exposure Duration",
    value: hoursScore,
    max: 10,
    description: `${hours} hrs/day on road = ${hoursScore}/10 exposure`,
    weight: 0.2,
  });

  // ── Factor 4: Experience Level ──
  const exp = parseFloat(profile.experience) || 1;
  const expScore = exp < 0.5 ? 9 : exp < 1 ? 8 : exp < 2 ? 6 : exp < 4 ? 4 : 2;
  factors.push({
    label: "Experience Factor",
    value: expScore,
    max: 10,
    description: `${exp} yr(s) experience — less = higher risk`,
    weight: 0.15,
  });

  // ── Factor 5: Zone Vulnerability ──
  const zone = profile.zone || "Central Zone";
  const zoneScore =
    zone === "South Zone" || zone === "East Zone"
      ? 8
      : zone === "North Zone"
      ? 7
      : zone === "West Zone"
      ? 6
      : 5;
  factors.push({
    label: "Zone Vulnerability",
    value: zoneScore,
    max: 10,
    description: `${zone} terrain & traffic complexity`,
    weight: 0.2,
  });

  // ── Weighted Score Calculation ──
  const weightedSum = factors.reduce(
    (acc, f) => acc + f.value * f.weight,
    0
  );
  const score = Math.round(weightedSum);

  // ── Risk Level ──
  const level =
    score >= 8
      ? "Critical"
      : score >= 6
      ? "High"
      : score >= 4
      ? "Medium"
      : "Low";

  const color =
    score >= 8
      ? "#ef4444"
      : score >= 6
      ? "#f97316"
      : score >= 4
      ? "#eab308"
      : "#22c55e";

  // ── Plan Recommendation ──
  const recommendation =
    score >= 7
      ? "premium"
      : score >= 5
      ? "standard"
      : "basic";

  return {
    score,
    level,
    color,
    factors,
    recommendation,
    summary: `Based on your city (${profile.city}), platform (${profile.platform}), and ${hours}hr daily exposure, our AI model assigns you a ${level} risk profile.`,
  };
}

/**
 * calculatePremium
 * Calculates weekly premium and max payout for a selected plan.
 *
 * @param {number} weeklyIncome
 * @param {Object} plan - from INSURANCE_PLANS
 * @returns {Object} { premium, maxPayout }
 */
export function calculatePremium(weeklyIncome, plan) {
  const premium = (weeklyIncome * plan.pct) / 100;
  const maxPayout = weeklyIncome * plan.maxPayoutMultiplier;
  return { premium, maxPayout };
}

/**
 * calculatePayoutAmount
 * Determines actual payout based on disruptions detected and income profile.
 *
 * @param {Array} disruptions - active disruption objects
 * @param {Object} income - { daily, weekly }
 * @param {Object} plan - selected insurance plan
 * @returns {Object} { eligible, estimated, lossPercent }
 */
export function calculatePayoutAmount(disruptions, income, plan) {
  if (!disruptions || disruptions.length === 0) return { eligible: 0, estimated: 0, lossPercent: 0 };

  const severityWeights = { low: 0.5, medium: 1.0, high: 1.5, critical: 2.0 };

  const totalLossPercent = disruptions.reduce((acc, d) => {
    const weight = severityWeights[d.severity] || 1;
    return acc + d.incomeLossEst * weight;
  }, 0);

  const cappedLossPercent = Math.min(totalLossPercent, 80); // max 80% loss cap
  const estimatedLoss = (income.daily * cappedLossPercent) / 100;
  const maxPayout = income.weekly * plan.maxPayoutMultiplier;
  const eligible = Math.min(estimatedLoss, maxPayout);

  return {
    eligible: parseFloat(eligible.toFixed(2)),
    estimated: parseFloat(estimatedLoss.toFixed(2)),
    lossPercent: parseFloat(cappedLossPercent.toFixed(1)),
  };
}