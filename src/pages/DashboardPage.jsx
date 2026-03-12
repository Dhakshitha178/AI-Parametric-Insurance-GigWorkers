// ─── src/pages/DashboardPage.jsx ─────────────────────────────────────────────
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DAY_LABELS } from "../data/constants";
import { MetricCard, Badge, Card, SectionLabel, ProgressBar } from "../components/UI";

function IncomeTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0f1923", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px" }}>
      <div style={{ fontSize:11, color:"#64748b" }}>{label}</div>
      <div className="mono" style={{ fontSize:16, fontWeight:800, color:"#00d4aa" }}>₹{payload[0].value}</div>
    </div>
  );
}

export default function DashboardPage({ data, plan, policyId, claimHistory }) {
  const { profile, income, risk } = data;
  const totalRecovered = claimHistory.reduce((s, c) => s + (c.amount || 0), 0);
  const coverageRatio  = income.weekly > 0 ? ((totalRecovered / income.weekly) * 100).toFixed(0) : 0;
  const chartData      = DAY_LABELS.map((day, i) => ({ day, income: parseFloat(income.days[i]) || 0 }));
  const maxIncome      = Math.max(...chartData.map((d) => d.income), 1);
  const startDate      = new Date();
  const endDate        = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const fmt            = (d) => d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* Top Metrics */}
      <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="Weekly Income"   value={`₹${income.weekly.toFixed(0)}`}          icon="💰" color="#00d4aa" />
        <MetricCard label="Weekly Premium"  value={`₹${plan.premium.toFixed(0)}`}            icon="🛡️" color={plan.color} />
        <MetricCard label="Claims Settled"  value={claimHistory.length}                       icon="✅" color="#22c55e" />
        <MetricCard label="Total Recovered" value={`₹${totalRecovered.toFixed(0)}`}          icon="📈" color="#a855f7" />
        <MetricCard label="Coverage Ratio"  value={`${coverageRatio}%`}                      icon="📊" color="#eab308" />
      </div>

      {/* Income Bar Chart */}
      <Card style={{ marginBottom:18 }}>
        <SectionLabel>📊 WEEKLY INCOME BREAKDOWN</SectionLabel>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top:5, right:10, left:-10, bottom:5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:"#64748b", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
            <Tooltip content={<IncomeTooltip />} cursor={{ fill:"#ffffff08" }} />
            <Bar dataKey="income" radius={[4,4,0,0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.income === maxIncome ? "#00d4aa" : entry.income > 0 ? "#00d4aa66" : "#1e293b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, flexWrap:"wrap", gap:8 }}>
          <div style={{ fontSize:11, color:"#475569" }}>Avg: ₹{income.daily.toFixed(0)}/day · Best day: ₹{Math.max(...chartData.map(d=>d.income)).toFixed(0)}</div>
          <div style={{ fontSize:11, color:"#475569" }}>Est. Monthly: ₹{(income.weekly * 4.3).toFixed(0)}</div>
        </div>
      </Card>

      {/* Policy + Risk */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
        <Card accent={plan.color}>
          <SectionLabel>📋 ACTIVE POLICY</SectionLabel>
          <div style={{ fontSize:16, fontWeight:800, color:plan.color, marginBottom:4 }}>{plan.label}</div>
          <div className="mono" style={{ fontSize:11, color:"#475569", marginBottom:12 }}>{policyId}</div>
          {[
            { k:"Platform",    v: profile.platform },
            { k:"City / Zone", v: `${profile.city} · ${profile.zone}` },
            { k:"Payout UPI",  v: profile.upiId },
            { k:"Coverage",    v: `${fmt(startDate)} → ${fmt(endDate)}` },
            { k:"Premium",     v: `₹${plan.premium.toFixed(2)}/week` },
            { k:"Max Payout",  v: `₹${plan.maxPayout.toFixed(0)}/week` },
          ].map(({ k, v }) => (
            <div key={k} style={{ marginBottom:7 }}>
              <div style={{ fontSize:9, color:"#475569", textTransform:"uppercase", letterSpacing:0.5 }}>{k}</div>
              <div style={{ fontSize:12, color:"#f1f5f9", fontWeight:600 }}>{v}</div>
            </div>
          ))}
          <div style={{ marginTop:10 }}>
            {plan.features.map((f) => <div key={f} style={{ fontSize:11, color:"#94a3b8", marginBottom:3 }}>✓ {f}</div>)}
          </div>
        </Card>

        <Card accent={risk.color}>
          <SectionLabel>🧠 AI RISK PROFILE</SectionLabel>
          <div className="mono" style={{ fontSize:44, fontWeight:900, color:risk.color, lineHeight:1, marginBottom:6 }}>
            {risk.score}<span style={{ fontSize:16, color:"#475569" }}>/10</span>
          </div>
          <Badge text={`${risk.level} Risk`} color={risk.color} />
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
            {risk.factors.map((f) => (
              <ProgressBar key={f.label} label={f.label} value={f.value} max={f.max} color={risk.color} />
            ))}
          </div>
        </Card>
      </div>

      {/* Worker Profile */}
      <Card style={{ marginBottom:18 }}>
        <SectionLabel>👤 WORKER PROFILE</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
          {[
            { label:"Name",       value: profile.name },
            { label:"Phone",      value: profile.phone },
            { label:"Platform",   value: profile.platform },
            { label:"City",       value: profile.city },
            { label:"Zone",       value: profile.zone },
            { label:"Hrs/Day",    value: `${profile.hoursPerDay} hrs` },
            { label:"Experience", value: `${profile.experience} yr(s)` },
            { label:"Vehicle",    value: profile.vehicleType || "N/A" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:"#ffffff08", borderRadius:8, padding:"8px 12px" }}>
              <div style={{ fontSize:9, color:"#475569", textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
              <div style={{ fontSize:12, color:"#f1f5f9", fontWeight:600, marginTop:1 }}>{value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Claims History */}
      <Card>
        <SectionLabel>📜 CLAIMS HISTORY</SectionLabel>
        {claimHistory.length === 0 ? (
          <div style={{ textAlign:"center", color:"#475569", padding:"24px 0", fontSize:13 }}>
            No claims yet. Your AI monitor is watching 24/7 for qualifying disruptions.
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"8px 12px", marginBottom:6 }}>
              {["Claim ID","Triggers","Payout","Status"].map((h) => (
                <div key={h} style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
              ))}
            </div>
            {claimHistory.map((c, i) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"12px", borderTop:"1px solid #1e293b", alignItems:"center" }}>
                <div className="mono" style={{ fontSize:11, color:"#64748b" }}>{c.claimId || `CLM-${i+1}`}</div>
                <div style={{ fontSize:12, color:"#f1f5f9" }}>{c.disruptions?.length || 0} event(s)</div>
                <div className="mono" style={{ fontSize:14, fontWeight:800, color:"#22c55e" }}>₹{(c.amount||0).toFixed(2)}</div>
                <Badge text="SETTLED" color="#22c55e" />
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"12px", borderTop:"1px solid #334155", background:"#ffffff05", borderRadius:"0 0 8px 8px" }}>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:700 }}>TOTAL</div>
              <div />
              <div className="mono" style={{ fontSize:15, fontWeight:900, color:"#a855f7" }}>₹{totalRecovered.toFixed(2)}</div>
              <div />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}