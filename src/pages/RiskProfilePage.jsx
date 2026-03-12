// ─── src/pages/RiskProfilePage.jsx ───────────────────────────────────────────
// Displays the AI-generated risk profile and all 3 insurance plan options.
// Worker selects a plan here; premium is calculated live from their income.

import React from "react";
import { INSURANCE_PLANS } from "../data/constants";
import { calculatePremium } from "../utils/riskEngine";
import { Badge, MetricCard, ProgressBar, Card, SectionLabel } from "../components/UI";

export default function RiskProfilePage({ data, onSelectPlan }) {
  const { profile, income, risk } = data;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>

      {/* ── Worker Header ── */}
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28, flexWrap:"wrap" }}>
        <div style={{
          width:56, height:56, borderRadius:"50%",
          background: risk.color + "22",
          border: `2px solid ${risk.color}`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
        }}>
          🛵
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, color:"#64748b" }}>AI Risk Profile for</div>
          <div className="bebas" style={{ fontSize:24, color:"#f1f5f9", letterSpacing:1, lineHeight:1.1 }}>
            {profile.name}
          </div>
          <div style={{ fontSize:13, color:"#64748b" }}>{profile.platform} · {profile.city}</div>
        </div>
        <Badge text={`${risk.level} Risk`} color={risk.color} />
      </div>

      {/* ── Risk Score Card ── */}
      <Card accent={risk.color} style={{ marginBottom:20 }}>
        <SectionLabel>AI RISK ASSESSMENT — 5 FACTOR MODEL</SectionLabel>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:10, color:"#64748b", letterSpacing:1 }}>OVERALL RISK SCORE</div>
            <div className="mono" style={{ fontSize:56, fontWeight:900, color:risk.color, lineHeight:1 }}>
              {risk.score}
              <span style={{ fontSize:20, color:"#475569" }}>/10</span>
            </div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>{risk.summary}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"#64748b" }}>RECOMMENDATION</div>
            <div style={{ fontSize:14, color:"#f1f5f9", fontWeight:700, textTransform:"capitalize", marginTop:2 }}>
              {risk.recommendation} plan
            </div>
            <div style={{ fontSize:11, color:"#475569", marginTop:6 }}>Zone: {profile.zone}</div>
            <div style={{ fontSize:11, color:"#475569" }}>UPI: {profile.upiId}</div>
          </div>
        </div>

        {/* Factor Bars */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {risk.factors.map((f) => (
            <div key={f.label}>
              <ProgressBar label={f.label} value={f.value} max={f.max} color={risk.color} showValue={true} />
              <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>{f.description}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Income Summary ── */}
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        <MetricCard label="Weekly Income" value={`₹${income.weekly.toFixed(0)}`}          icon="💰" color="#00d4aa" />
        <MetricCard label="Daily Average" value={`₹${income.daily.toFixed(0)}`}           icon="📅" color="#f1f5f9" />
        <MetricCard label="Est. Monthly"  value={`₹${(income.weekly * 4.3).toFixed(0)}`} icon="📊" color="#a855f7" />
      </div>

      {/* ── Plan Selection ── */}
      <SectionLabel>CHOOSE YOUR WEEKLY SHIELD PLAN</SectionLabel>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {INSURANCE_PLANS.map((plan) => {
          const { premium, maxPayout } = calculatePremium(income.weekly, plan);
          const isRecommended = plan.id === risk.recommendation;

          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan({ ...plan, premium, maxPayout, weeklyIncome: income.weekly })}
              style={{
                background: "#0f1923",
                border: `1px solid ${isRecommended ? plan.color : plan.color + "44"}`,
                borderRadius: 12, padding: "18px 20px",
                cursor: "pointer", transition: "all 0.2s",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = plan.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = isRecommended ? plan.color : plan.color + "44")}
            >
              {isRecommended && (
                <div style={{
                  position:"absolute", top:0, right:0,
                  background: plan.color, color:"#0a0f16",
                  fontSize:9, fontWeight:800, padding:"3px 10px", letterSpacing:1,
                }}>
                  AI RECOMMENDED
                </div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:800, color:plan.color, fontSize:17 }}>{plan.label}</span>
                    <Badge text={`${plan.pct}% of Weekly Income`} color={plan.color} />
                  </div>
                  <div style={{ fontSize:12, color:"#64748b", marginBottom:10 }}>{plan.desc}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {plan.features.map((f) => (
                      <span key={f} style={{ fontSize:11, color:"#94a3b8" }}>✓ {f}</span>
                    ))}
                  </div>
                  <div style={{ marginTop:10, display:"flex", flexWrap:"wrap", gap:6 }}>
                    {plan.covered.map((c) => (
                      <span key={c} style={{
                        fontSize:10, background:plan.color+"11", color:plan.color,
                        border:`1px solid ${plan.color}22`, padding:"2px 7px", borderRadius:4,
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:"right", minWidth:110 }}>
                  <div style={{ fontSize:10, color:"#64748b" }}>WEEKLY PREMIUM</div>
                  <div className="mono" style={{ fontSize:26, fontWeight:900, color:plan.color }}>
                    ₹{premium.toFixed(0)}
                  </div>
                  <div style={{ fontSize:10, color:"#475569", marginBottom:6 }}>per week</div>
                  <div style={{ fontSize:11, color:"#64748b" }}>Max Payout</div>
                  <div className="mono" style={{ fontSize:15, fontWeight:700, color:"#22c55e" }}>
                    ₹{maxPayout.toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}