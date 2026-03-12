// ─── src/pages/OnboardingPage.jsx ────────────────────────────────────────────
// 3-step onboarding flow for gig workers:
//   Step 1 — Basic identity (name, phone, city, platform)
//   Step 2 — Work profile (zone, hours, experience, UPI ID)
//   Step 3 — 7-day income history + weekly summary

import React, { useState } from "react";
import { PLATFORMS, CITIES, ZONES, VEHICLE_TYPES, DAY_LABELS } from "../data/constants";
import { StepProgress, TextInput, SelectInput, Card, Checkbox } from "../components/UI";

const STEP_META = [
  { title: "WHO ARE YOU?",       sub: "Basic identity & platform details" },
  { title: "YOUR WORK PROFILE",  sub: "Zone, hours, experience & UPI payment info" },
  { title: "INCOME HISTORY",     sub: "Enter your daily earnings for the past week" },
];

export default function OnboardingPage({ onComplete }) {
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [agreed,  setAgreed]  = useState(false);

  const [profile, setProfile] = useState({
    name: "", phone: "", city: "", platform: "",
    zone: "", hoursPerDay: "", experience: "", upiId: "", vehicleType: "",
  });

  const [incomeDays, setIncomeDays] = useState(["", "", "", "", "", "", ""]);

  // ── Derived values ──
  const weeklyTotal  = incomeDays.reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const dailyAvg     = weeklyTotal / 7;
  const monthlyEstim = weeklyTotal * 4.3;

  const set = (key) => (val) => setProfile((p) => ({ ...p, [key]: val }));

  const updateDay = (i, val) => {
    const d = [...incomeDays];
    d[i] = val;
    setIncomeDays(d);
  };

  // ── Validation ──
  const step1Valid = profile.name.trim() && profile.phone.trim().length >= 10 && profile.city && profile.platform;
  const step2Valid = profile.zone && profile.hoursPerDay && profile.experience && profile.upiId.trim();
  const step3Valid = incomeDays.some((d) => parseFloat(d) > 0) && agreed;
  const stepValid  = step === 1 ? step1Valid : step === 2 ? step2Valid : step3Valid;

  // ── Submit ──
  const handleNext = async () => {
    if (step < 3) { setStep(step + 1); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    onComplete({
      profile,
      income: { days: incomeDays, weekly: weeklyTotal, daily: dailyAvg },
    });
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <StepProgress current={step} total={3} />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div className="bebas" style={{ fontSize: 28, color: "#f1f5f9", letterSpacing: 1 }}>
          {STEP_META[step - 1].title}
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
          {STEP_META[step - 1].sub}
        </div>
      </div>

      {/* ── Step 1: Identity ── */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <TextInput label="Full Name"       value={profile.name}     onChange={set("name")}     placeholder="e.g. Rajesh Kumar" />
          <TextInput label="Phone Number"    value={profile.phone}    onChange={set("phone")}    placeholder="9876543210" type="tel" />
          <SelectInput label="City"          value={profile.city}     onChange={set("city")}     options={CITIES} />
          <SelectInput label="Delivery Platform" value={profile.platform} onChange={set("platform")} options={PLATFORMS} />
        </div>
      )}

      {/* ── Step 2: Work Profile ── */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SelectInput label="Delivery Zone"           value={profile.zone}        onChange={set("zone")}        options={ZONES} />
          <TextInput   label="Avg Hours per Day"       value={profile.hoursPerDay} onChange={set("hoursPerDay")} placeholder="e.g. 9"   type="number" />
          <TextInput   label="Years of Experience"     value={profile.experience}  onChange={set("experience")}  placeholder="e.g. 2"   type="number" />
          <TextInput   label="UPI ID (for payouts)"    value={profile.upiId}       onChange={set("upiId")}       placeholder="name@upi" />
          <SelectInput label="Vehicle Type (Optional)" value={profile.vehicleType} onChange={set("vehicleType")} options={VEHICLE_TYPES} placeholder="Select Vehicle (Optional)" />
        </div>
      )}

      {/* ── Step 3: Income Input ── */}
      {step === 3 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {DAY_LABELS.map((day, i) => (
              <div key={day}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 5 }}>{day}</div>
                <div style={{ display:"flex", alignItems:"center", background:"#0f1923", border:"1px solid #1e293b", borderRadius:8, padding:"9px 12px" }}>
                  <span style={{ color:"#475569", marginRight:6, fontSize:14 }}>₹</span>
                  <input
                    type="number"
                    value={incomeDays[i]}
                    onChange={(e) => updateDay(i, e.target.value)}
                    placeholder="0"
                    style={{ background:"none", border:"none", outline:"none", color:"#f1f5f9", fontSize:15, fontFamily:"'Space Mono', monospace", width:"100%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Summary */}
          {weeklyTotal > 0 && (
            <Card accent="#00d4aa" style={{ marginBottom: 16, padding: "14px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontSize:10, color:"#64748b", marginBottom:2 }}>WEEKLY TOTAL</div>
                  <div className="mono" style={{ fontSize:22, fontWeight:800, color:"#00d4aa" }}>₹{weeklyTotal.toFixed(0)}</div>
                </div>
                <div>
                  <div style={{ fontSize:10, color:"#64748b", marginBottom:2 }}>DAILY AVG</div>
                  <div className="mono" style={{ fontSize:22, fontWeight:800, color:"#f1f5f9" }}>₹{dailyAvg.toFixed(0)}</div>
                </div>
                <div>
                  <div style={{ fontSize:10, color:"#64748b", marginBottom:2 }}>EST. MONTHLY</div>
                  <div className="mono" style={{ fontSize:18, fontWeight:800, color:"#a855f7" }}>₹{monthlyEstim.toFixed(0)}</div>
                </div>
              </div>
            </Card>
          )}

          {/* Terms agreement */}
          <div style={{ background:"#0f1923", border:"1px solid #1e293b", borderRadius:10, padding:"12px 16px", marginBottom:4 }}>
            <Checkbox
              checked={agreed}
              onChange={setAgreed}
              label="I confirm these are my actual earnings and I understand GigShield covers income loss only — not health, life, accident, or vehicle repair."
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display:"flex", gap:10, marginTop:28 }}>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{ padding:"13px 20px", background:"#1e293b", border:"none", borderRadius:10, color:"#94a3b8", fontSize:14, fontWeight:600, cursor:"pointer" }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={loading || !stepValid}
          style={{
            flex:1, padding:"13px 0",
            background: loading || !stepValid ? "#1e293b" : "#00d4aa",
            color:      loading || !stepValid ? "#475569" : "#0a0f16",
            border:"none", borderRadius:10, fontSize:18, fontWeight:900,
            cursor: loading || !stepValid ? "not-allowed" : "pointer",
            letterSpacing:2, fontFamily:"'Bebas Neue', cursive", transition:"all 0.2s",
          }}
        >
          {loading ? "ANALYZING..." : step < 3 ? "NEXT →" : "CALCULATE MY RISK →"}
        </button>
      </div>
    </div>
  );
}