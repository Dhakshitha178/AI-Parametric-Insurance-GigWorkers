// ─── src/pages/ClaimPage.jsx ─────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { runFraudDetection, processUPIPayout, generateClaimId } from "../utils/apiService";
import { Badge, Card, CheckRow, SectionLabel, Loader } from "../components/UI";

const CLAIM_ID = generateClaimId();

export default function ClaimPage({ claimData, data, plan, policyId, onComplete }) {
  const [phase,         setPhase]         = useState("fraud");
  const [fraudResult,   setFraudResult]   = useState(null);
  const [payoutResult,  setPayoutResult]  = useState(null);
  const [visibleChecks, setVisibleChecks] = useState([]);

  useEffect(() => {
    const run = async () => {
      const fraud = await runFraudDetection(claimData, data.profile, policyId);
      for (let i = 0; i < fraud.checks.length; i++) {
        await new Promise((r) => setTimeout(r, 380));
        setVisibleChecks((prev) => [...prev, fraud.checks[i]]);
      }
      setFraudResult(fraud);
      await new Promise((r) => setTimeout(r, 600));
      setPhase("payout");
      const payout = await processUPIPayout({
        amount: claimData.amount, upiId: data.profile.upiId,
        workerName: data.profile.name, claimId: CLAIM_ID,
      });
      setPayoutResult(payout);
      setPhase("done");
    };
    run();
  }, []); // eslint-disable-line

  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>

      {/* Claim Header */}
      <Card style={{ marginBottom:16, padding:"14px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div>
            <div style={{ fontSize:10, color:"#64748b", letterSpacing:1 }}>CLAIM REFERENCE</div>
            <div className="mono" style={{ fontSize:14, color:"#f1f5f9", fontWeight:700 }}>{CLAIM_ID}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"#64748b" }}>AMOUNT CLAIMED</div>
            <div className="mono" style={{ fontSize:22, fontWeight:900, color:"#22c55e" }}>₹{claimData.amount.toFixed(2)}</div>
          </div>
        </div>
      </Card>

      {/* Triggered Disruptions */}
      <Card style={{ marginBottom:16 }}>
        <SectionLabel>⚡ CLAIM TRIGGERS ({claimData.disruptions.length} EVENTS)</SectionLabel>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {claimData.disruptions.map((d) => (
            <span key={d.id} style={{ background:"#f9731622", color:"#f97316", border:"1px solid #f9731633", padding:"3px 10px", borderRadius:6, fontSize:12 }}>
              {d.icon} {d.label}
            </span>
          ))}
        </div>
        <div style={{ marginTop:10, fontSize:11, color:"#64748b" }}>
          Estimated income loss: {claimData.lossPercent}% · Based on ₹{data.income.daily.toFixed(0)}/day income
        </div>
      </Card>

      {/* Phase 1: Fraud Detection */}
      <Card style={{ marginBottom:16 }}>
        <SectionLabel>🔍 AI FRAUD DETECTION ENGINE</SectionLabel>
        {visibleChecks.length === 0 ? (
          <Loader text="Initializing fraud detection algorithms..." />
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {visibleChecks.map((check) => (
              <CheckRow key={check.id} label={check.label} detail={check.detail} status={check.status} score={check.score} />
            ))}
          </div>
        )}
        {fraudResult && (
          <div style={{ marginTop:14, padding:"12px 16px", background:"#22c55e11", border:"1px solid #22c55e33", borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#22c55e" }}>✅ {fraudResult.decision} — All checks passed</div>
              <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{fraudResult.message}</div>
            </div>
            <div className="mono" style={{ fontSize:20, fontWeight:900, color:"#22c55e" }}>
              {fraudResult.overallScore}<span style={{ fontSize:11, color:"#475569" }}>/100</span>
            </div>
          </div>
        )}
      </Card>

      {/* Phase 2: Payout Processing */}
      {(phase === "payout" || phase === "done") && (
        <Card style={{ marginBottom:16 }}>
          <SectionLabel>💸 UPI PAYOUT PROCESSING — RAZORPAY</SectionLabel>
          {phase === "payout" && !payoutResult ? (
            <Loader text="Initiating instant UPI transfer to your account..." />
          ) : payoutResult ? (
            <div>
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:52 }}>✅</div>
                <div className="mono" style={{ fontSize:36, fontWeight:900, color:"#22c55e", margin:"8px 0" }}>₹{payoutResult.amount.toFixed(2)}</div>
                <div style={{ fontSize:14, color:"#94a3b8" }}>Successfully sent to <strong style={{ color:"#f1f5f9" }}>{payoutResult.upiId}</strong></div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { label:"Transaction ID",  value: payoutResult.txnId },
                  { label:"Payment Method",  value: payoutResult.method },
                  { label:"Bank",            value: payoutResult.bank },
                  { label:"Status",          value: payoutResult.status },
                  { label:"Settlement Time", value: payoutResult.settlementTime },
                  { label:"Processed At",    value: payoutResult.timestamp },
                  { label:"Reference",       value: payoutResult.reference },
                  { label:"Source",          value: payoutResult.source },
                ].map((item) => (
                  <div key={item.label} style={{ background:"#ffffff08", borderRadius:8, padding:"9px 12px" }}>
                    <div style={{ fontSize:9, color:"#475569", textTransform:"uppercase", letterSpacing:0.5 }}>{item.label}</div>
                    <div style={{ fontSize:11, color:"#f1f5f9", fontWeight:600, marginTop:2, wordBreak:"break-all" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Card>
      )}

      {/* Done */}
      {phase === "done" && payoutResult && (
        <button onClick={onComplete} style={{ width:"100%", padding:"15px 0", background:"#00d4aa", color:"#0a0f16", border:"none", borderRadius:10, fontSize:20, fontWeight:900, cursor:"pointer", fontFamily:"'Bebas Neue', cursive", letterSpacing:2 }}>
          VIEW ANALYTICS DASHBOARD →
        </button>
      )}
    </div>
  );
}
