// ─── src/pages/PolicyPage.jsx ─────────────────────────────────────────────────
import React, { useState } from "react";
import { generatePolicyId } from "../utils/apiService";
import { InfoRow, Checkbox, Badge, Card, SectionLabel } from "../components/UI";

const POLICY_ID  = generatePolicyId();
const START_DATE = new Date();
const END_DATE   = new Date(START_DATE.getTime() + 7 * 24 * 60 * 60 * 1000);
const fmt = (date) => date.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

export default function PolicyPage({ data, plan, onActivate }) {
  const [agreed,  setAgreed]  = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile } = data;

  const handleActivate = async () => {
    if (!agreed) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onActivate(POLICY_ID);
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div style={{
        background: "linear-gradient(145deg, #0f1923, #0d1520)",
        border: `1px solid ${plan.color}44`, borderRadius:16,
        padding:28, marginBottom:20, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, borderRadius:"50%", background: plan.color + "08" }} />

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10, color:"#475569", letterSpacing:2, textTransform:"uppercase" }}>PARAMETRIC INSURANCE POLICY</div>
          <div className="bebas" style={{ fontSize:30, color:"#f1f5f9", letterSpacing:1, lineHeight:1.1, marginTop:2 }}>
            GIGSHIELD {plan.label.toUpperCase()}
          </div>
          <div className="mono" style={{ fontSize:12, color:"#475569", marginTop:4 }}>{POLICY_ID}</div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          <InfoRow label="Policyholder"      value={profile.name} />
          <InfoRow label="Mobile"            value={profile.phone} />
          <InfoRow label="Platform"          value={profile.platform} />
          <InfoRow label="City / Zone"       value={`${profile.city} · ${profile.zone}`} />
          <InfoRow label="UPI Payout ID"     value={profile.upiId} />
          <InfoRow label="Vehicle Type"      value={profile.vehicleType || "Not specified"} />
          <InfoRow label="Policy Start"      value={fmt(START_DATE)} />
          <InfoRow label="Policy End"        value={fmt(END_DATE)} />
          <InfoRow label="Weekly Premium"    value={`₹${plan.premium.toFixed(2)}`}   highlight={plan.color} />
          <InfoRow label="Max Weekly Payout" value={`₹${plan.maxPayout.toFixed(0)}`} highlight="#22c55e" />
          <InfoRow label="Plan Type"         value={`${plan.label} (${plan.pct}% of weekly income)`} />
          <InfoRow label="Payout TAT"        value={plan.features[plan.features.length - 2]} />
        </div>

        <Card style={{ background:"#00000030", border:"1px solid #1e293b", marginBottom:16 }}>
          <SectionLabel>COVERED EVENTS (INCOME LOSS TRIGGERS ONLY)</SectionLabel>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {[
              "🌧️ Heavy Rain","🌡️ Extreme Heat","⛈️ Storm","🌀 Cyclone",
              "😷 High Pollution","🏭 Warehouse Downtime","💻 Server Failure",
              "💳 Payment Gateway Down","⚡ Power Outage","🚧 Road Blockade",
              "🚫 Civil Disruption","🌊 Local Flooding",
            ].map((e) => (
              <span key={e} style={{
                fontSize:11, background:plan.color+"11", color:plan.color,
                border:`1px solid ${plan.color}22`, padding:"3px 9px", borderRadius:5,
              }}>{e}</span>
            ))}
          </div>
        </Card>

        <div style={{ background:"#ef444411", border:"1px solid #ef444422", borderRadius:10, padding:14 }}>
          <div style={{ fontSize:10, color:"#ef4444", letterSpacing:1, marginBottom:6, textTransform:"uppercase", fontWeight:700 }}>
            ⚠️ STRICTLY EXCLUDED
          </div>
          <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.8 }}>
            Health insurance · Life insurance · Accident claims · Vehicle repair / damage · Personal medical expenses
          </div>
        </div>
      </div>

      <Card style={{ marginBottom:20 }}>
        <SectionLabel>HOW PARAMETRIC CLAIM WORKS</SectionLabel>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { step:"1", text:"AI monitors weather, platform status & traffic 24/7" },
            { step:"2", text:"Trigger threshold crossed → auto claim initiated (no action needed from you)" },
            { step:"3", text:"Fraud engine runs 6-point verification in seconds" },
            { step:"4", text:"Payout transferred directly to your UPI ID" },
          ].map((s) => (
            <div key={s.step} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <div style={{
                width:22, height:22, minWidth:22,
                background: plan.color + "22", color:plan.color,
                borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:800,
              }}>{s.step}</div>
              <span style={{ fontSize:13, color:"#94a3b8", lineHeight:1.5 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ background:"#0f1923", border:"1px solid #1e293b", borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
        <Checkbox
          checked={agreed} onChange={setAgreed} color={plan.color}
          label={`I confirm I am a gig delivery worker and understand that GigShield ${plan.label} covers income loss from external disruptions only — not health, life, accident, or vehicle-related claims. I agree to the weekly premium of ₹${plan.premium.toFixed(2)}.`}
        />
      </div>

      <button
        onClick={handleActivate} disabled={!agreed || loading}
        style={{
          width:"100%", padding:"16px 0",
          background: agreed && !loading ? plan.color : "#1e293b",
          color:      agreed && !loading ? "#0a0f16" : "#475569",
          border:"none", borderRadius:10, fontSize:20, fontWeight:900,
          cursor: agreed ? "pointer" : "not-allowed",
          fontFamily:"'Bebas Neue', cursive", letterSpacing:2, transition:"all 0.2s",
        }}
      >
        {loading ? "ACTIVATING POLICY..." : `ACTIVATE POLICY · ₹${plan.premium.toFixed(2)}/WEEK`}
      </button>
    </div>
  );
}