// ─── src/pages/MonitoringPage.jsx ────────────────────────────────────────────
import React from "react";
import { useDisruptions } from "../hooks/useDisruptions";
import { calculatePayoutAmount } from "../utils/riskEngine";
import { DISRUPTIONS, SEVERITY_COLORS } from "../data/constants";
import { Loader, Badge, MetricCard, Card, SectionLabel, StatusDot } from "../components/UI";

export default function MonitoringPage({ data, plan, policyId, onClaim }) {
  const { profile, income } = data;
  const { data: scanData, loading, error, rescan, lastScan, scanCount } =
    useDisruptions(profile.city, profile.platform, profile.zone);

  const disruptions = scanData?.disruptions || [];
  const weather     = scanData?.weatherSummary;
  const platformS   = scanData?.platformSummary;
  const traffic     = scanData?.trafficSummary;
  const payout      = calculatePayoutAmount(disruptions, income, plan);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>

      {/* Status Bar */}
      <Card style={{ marginBottom:18, padding:"12px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <StatusDot active={!loading} label={loading ? "Scanning..." : "LIVE MONITOR"} />
            <Badge text={`Policy ${policyId}`} color="#00d4aa" />
            {scanCount > 0 && <span style={{ fontSize:11, color:"#475569" }}>Scan #{scanCount}</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {lastScan && <span style={{ fontSize:11, color:"#475569" }}>Last scan: {lastScan}</span>}
            <button onClick={rescan} disabled={loading} style={{
              background:"#1e293b", border:"none", borderRadius:7,
              padding:"6px 14px", color:"#94a3b8", fontSize:12,
              cursor: loading ? "not-allowed" : "pointer", fontFamily:"inherit",
            }}>
              {loading ? "⟳ Scanning..." : "↻ Rescan Now"}
            </button>
          </div>
        </div>
      </Card>

      {/* API Data Summary */}
      {scanData && !loading && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
          <Card style={{ padding:14 }}>
            <SectionLabel>🌤 WEATHER API</SectionLabel>
            <div style={{ fontSize:13, color:"#f1f5f9", fontWeight:700, marginBottom:4 }}>{weather?.condition}</div>
            <div style={{ fontSize:11, color:"#64748b" }}>Temp: {weather?.temperature}°C</div>
            <div style={{ fontSize:11, color:"#64748b" }}>Rain: {weather?.rainfall} mm/hr</div>
            <div style={{ fontSize:11, color:"#64748b" }}>Wind: {weather?.windSpeed} km/hr</div>
            <div style={{ fontSize:11, color:"#64748b" }}>AQI: {weather?.aqi}</div>
          </Card>
          <Card style={{ padding:14 }}>
            <SectionLabel>💻 PLATFORM API</SectionLabel>
            <div style={{ fontSize:13, color:"#f1f5f9", fontWeight:700, marginBottom:4 }}>{profile.platform}</div>
            {[
              { k:"Server",    v: platformS?.serverStatus },
              { k:"Payment",   v: platformS?.paymentGateway },
              { k:"Warehouse", v: platformS?.warehouseSystem },
              { k:"Grid",      v: platformS?.powerGrid },
            ].map(({ k, v }) => (
              <div key={k} style={{ fontSize:11, color: v?.includes("Down") || v?.includes("Degraded") || v?.includes("Outage") ? "#f97316" : "#64748b" }}>
                {k}: {v}
              </div>
            ))}
          </Card>
          <Card style={{ padding:14 }}>
            <SectionLabel>🚦 TRAFFIC API</SectionLabel>
            <div style={{ fontSize:13, color:"#f1f5f9", fontWeight:700, marginBottom:4 }}>{profile.zone}</div>
            <div style={{ fontSize:11, color:"#64748b" }}>Blockages: {traffic?.roadBlockages}</div>
            <div style={{ fontSize:11, color: traffic?.floodingReported ? "#f97316" : "#64748b" }}>Flooding: {traffic?.floodingReported ? "YES" : "No"}</div>
            <div style={{ fontSize:11, color: traffic?.civilDisruption ? "#f97316" : "#64748b" }}>Civil: {traffic?.civilDisruption ? "YES" : "No"}</div>
            <div style={{ fontSize:11, color:"#64748b" }}>Congestion: {traffic?.congestionLevel}</div>
          </Card>
        </div>
      )}

      {/* Active Disruptions */}
      <Card style={{ marginBottom:18 }}>
        <SectionLabel>⚡ AI DISRUPTION SCANNER — {profile.city.toUpperCase()}</SectionLabel>
        {loading ? (
          <Loader text="Fetching live data from Weather, Platform & Traffic APIs..." />
        ) : error ? (
          <div style={{ color:"#ef4444", textAlign:"center", padding:20, fontSize:13 }}>{error}</div>
        ) : disruptions.length === 0 ? (
          <div style={{ textAlign:"center", color:"#22c55e", padding:24, fontSize:13 }}>
            ✅ No active disruptions detected in {profile.city}. Your income is safe.
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {disruptions.map((d) => {
              const sColor = SEVERITY_COLORS[d.severity] || "#94a3b8";
              return (
                <div key={d.id} className="fade-in-up" style={{
                  background: sColor+"0e", border:`1px solid ${sColor}33`,
                  borderRadius:10, padding:"12px 16px",
                  display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
                    <span style={{ fontSize:24 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:14 }}>{d.label}</div>
                      <div style={{ fontSize:11, color:"#64748b" }}>Threshold: {d.threshold} · Source: {d.apiSource}</div>
                      <div style={{ fontSize:11, color:"#475569" }}>Detected: {d.detectedAt} · Category: {d.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <Badge text={d.severity.toUpperCase()} color={sColor} />
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>AI Confidence: {d.confidence}%</div>
                    <div style={{ fontSize:12, color:"#f97316", fontWeight:700, marginTop:2 }}>~{d.incomeLossEst}% income loss</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* All Monitored Events */}
      <Card style={{ marginBottom:18 }}>
        <SectionLabel>📋 ALL MONITORED DISRUPTION EVENTS</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
          {Object.entries(DISRUPTIONS).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontSize:10, color:"#475569", letterSpacing:1, textTransform:"uppercase", marginBottom:8, fontWeight:700 }}>{cat}</div>
              {items.map((item) => {
                const isActive = disruptions.some((d) => d.id === item.id);
                return (
                  <div key={item.id} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                    <span style={{ fontSize:13 }}>{item.icon}</span>
                    <span style={{ fontSize:11, color: isActive ? "#22c55e" : "#475569" }}>{item.label}</span>
                    {isActive && <span style={{ fontSize:9, color:"#22c55e", fontWeight:700 }}>●</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Payout Eligibility */}
      {disruptions.length > 0 && !loading && (
        <div style={{ background:"linear-gradient(135deg, #0f1923, #0a1a0f)", border:"1px solid #22c55e44", borderRadius:14, padding:24, marginBottom:4 }}>
          <SectionLabel>💸 PARAMETRIC PAYOUT CALCULATION</SectionLabel>
          <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
            <MetricCard label="Active Triggers"  value={disruptions.length}                   icon="⚡" color="#f97316" />
            <MetricCard label="Est. Income Loss" value={`₹${payout.estimated.toFixed(0)}`}   icon="📉" color="#ef4444" />
            <MetricCard label="Eligible Payout"  value={`₹${payout.eligible.toFixed(0)}`}    icon="💸" color="#22c55e" />
            <MetricCard label="Loss %"           value={`${payout.lossPercent}%`}             icon="📊" color="#eab308" />
          </div>
          <div style={{ fontSize:12, color:"#64748b", marginBottom:16, padding:"10px 14px", background:"#ffffff08", borderRadius:8 }}>
            Payout is auto-calculated based on disruption severity, income data, and your plan limits.
            No manual claim filing required — trigger detected = claim initiated.
          </div>
          <button
            onClick={() => onClaim({ disruptions, amount: payout.eligible, lossEstimate: payout.estimated, lossPercent: payout.lossPercent })}
            style={{ width:"100%", padding:"15px 0", background:"#22c55e", color:"#0a0f16", border:"none", borderRadius:10, fontSize:20, fontWeight:900, cursor:"pointer", fontFamily:"'Bebas Neue', cursive", letterSpacing:2 }}
          >
            INITIATE AUTO-CLAIM · ₹{payout.eligible.toFixed(2)} PAYOUT
          </button>
        </div>
      )}
    </div>
  );
}