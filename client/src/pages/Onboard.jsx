import React, { useState } from 'react';
import { useAppState }  from '../context/AppStateContext';
import { assessRisk }   from '../services/api';
import { PLANS, CITIES, DISRUPTIONS, fmt, riskColor, riskLabel } from '../services/constants';
import { Card, Metric, Button, Spinner, Alert, AIChip, RiskBar, SectionHeader } from '../components/UI';

const PLATFORMS = [
  ['🟠','Swiggy'],['🔴','Zomato'],['🟢','Zepto'],
  ['🔵','Amazon Flex'],['🟡','Dunzo'],['🟣','Blinkit'],['⚫','Porter'],['🟤','Shadowfax'],
];
const DAYS     = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const EXP_OPTS = ['Less than 1 year','1–2 years','2–5 years','5+ years'];

export default function Onboard() {
  const { worker, setWorker, income, setIncome,
          setSelectedPlan, setPolicyActive, setCurrentPage, setRiskData } = useAppState();

  const [step,        setStep]        = useState(1);
  const [localWorker, setLocalWorker] = useState({ ...worker });
  const [localIncome, setLocalIncome] = useState([...income]);
  const [riskResult,  setRiskResult]  = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [chosenPlan,  setChosenPlan]  = useState(null);

  const weeklyIncome = localIncome.reduce((a,b) => a+b, 0);
  const dailyAvg     = Math.round(weeklyIncome / 7);

  function goStep(n) {
    if (n === 3) runRiskAnalysis();
    setStep(n);
  }

  function togglePlatform(name) {
    setLocalWorker(prev => ({
      ...prev,
      platforms: prev.platforms.includes(name)
        ? prev.platforms.filter(p => p !== name)
        : [...prev.platforms, name]
    }));
  }

  async function runRiskAnalysis() {
    setLoading(true); setRiskResult(null);
    try {
      const activeMock = DISRUPTIONS.filter((_,i) => [0,3,4,8].includes(i)).map(d => ({ ...d, active:true }));
      const result = await assessRisk({ worker: localWorker, income: localIncome, disruptions: activeMock });
      setRiskResult(result); setRiskData(result);
    } catch {
      const score = 62;
      setRiskResult({ riskScore:score, riskLabel:riskLabel(score), recommendedPlan:'standard',
        weeklyExposure: Math.round(weeklyIncome*0.25), reasoning:'Local fallback estimate.',
        riskFactors:['Heavy Rainfall detected','Platform Outage active','Road Flooding reported','High AQI'],
        incomeStability:'Variable' });
    } finally { setLoading(false); }
  }

  function activatePolicy() {
    if (!chosenPlan) { alert('Please select a plan.'); return; }
    setWorker(localWorker); setIncome(localIncome);
    const weekly   = localIncome.reduce((a,b) => a+b, 0);
    const premium  = Math.round(weekly * chosenPlan.pct / 100);
    const coverage = Math.round(weekly * chosenPlan.coverageMultiplier);
    setSelectedPlan({ ...chosenPlan, premium, coverage });
    setPolicyActive(true);
    setCurrentPage('dashboard');
  }

  return (
    <div>
      <Card>
        <div className="step-indicator" style={{ marginBottom:24 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className={`step-bar ${i < step ? 'done' : i === step ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:16, letterSpacing:'0.4px' }}>
          STEP {step} OF 4
        </div>

        {step === 1 && (
          <div>
            <SectionHeader title="Welcome to GigShield" sub="Income protection for delivery partners — set up in 2 minutes. No paperwork." />
            <div className="form-row">
              <div>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input className="form-input" value={localWorker.name}
                    onChange={e => setLocalWorker(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile number</label>
                  <input className="form-input" value={localWorker.phone}
                    onChange={e => setLocalWorker(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <select className="form-select" value={localWorker.city}
                    onChange={e => setLocalWorker(p => ({ ...p, city: e.target.value }))}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label className="form-label">Vehicle type</label>
                  <select className="form-select" value={localWorker.vehicle}
                    onChange={e => setLocalWorker(p => ({ ...p, vehicle: e.target.value }))}>
                    {['Two-wheeler (Bike)','Bicycle','Three-wheeler','Car'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Years as gig worker</label>
                  <select className="form-select" value={localWorker.experience}
                    onChange={e => setLocalWorker(p => ({ ...p, experience: e.target.value }))}>
                    {EXP_OPTS.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">UPI ID (for instant payouts)</label>
                  <input className="form-input" value={localWorker.upi}
                    onChange={e => setLocalWorker(p => ({ ...p, upi: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Active platforms</label>
              <div className="platform-tags">
                {PLATFORMS.map(([icon, name]) => (
                  <span key={name}
                    className={`platform-tag ${localWorker.platforms.includes(name) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(name)}>
                    {icon} {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="ob-nav">
              <div />
              <Button onClick={() => goStep(2)}>Continue →</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <SectionHeader title="Daily Income This Week" sub="Enter earnings for each day. This sets your premium and coverage amount." />
            {DAYS.map((day, i) => (
              <div key={day} style={{ display:'flex', alignItems:'center', gap:12, padding:'7px 0', borderBottom:'1px solid var(--border-light)' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)', width:34, fontFamily:'var(--font-mono)' }}>{day}</span>
                <span style={{ fontSize:13, color:'var(--text-secondary)' }}>₹</span>
                <input className="form-input" type="number" style={{ flex:1, maxWidth:150 }}
                  value={localIncome[i]}
                  onChange={e => { const n=[...localIncome]; n[i]=parseInt(e.target.value)||0; setLocalIncome(n); }} />
                <div style={{ flex:1, height:8, background:'var(--bg-secondary)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:'var(--green-400)', borderRadius:4,
                    width: Math.min(100, Math.round(localIncome[i]/1500*100))+'%' }} />
                </div>
                <span style={{ fontSize:12, width:60, textAlign:'right', fontFamily:'var(--font-mono)' }}>
                  {fmt.currency(localIncome[i])}
                </span>
              </div>
            ))}
            <div style={{ display:'flex', gap:12, marginTop:14 }}>
              <Metric label="Weekly total" value={fmt.currency(weeklyIncome)} />
              <Metric label="Daily average" value={fmt.currency(dailyAvg)} />
            </div>
            <div className="ob-nav">
              <Button variant="secondary" onClick={() => goStep(1)}>← Back</Button>
              <Button onClick={() => goStep(3)}>Calculate Risk →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <SectionHeader title="AI Risk Profile" sub="Our AI analyses your location, platforms, income, and live disruption data." />
            {loading && <Spinner text="Analysing disruption data, checking weather, AQI and platform status…" />}
            {!loading && riskResult && (
              <div>
                <div className="grid-3" style={{ marginBottom:16 }}>
                  <Metric label="Risk score"     value={riskResult.riskScore}
                    sub={riskResult.riskLabel+' risk'} valueColor={riskColor(riskResult.riskScore)} />
                  <Metric label="Weekly income"  value={fmt.currency(weeklyIncome)} sub={fmt.currency(dailyAvg)+' / day'} />
                  <Metric label="Income at risk" value={fmt.currency(riskResult.weeklyExposure||0)} sub="estimated this week" />
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                    <span style={{ color:'var(--text-secondary)' }}>Overall risk level</span>
                    <span style={{ fontWeight:500, color:riskColor(riskResult.riskScore) }}>
                      {riskResult.riskLabel} ({riskResult.riskScore}/100)
                    </span>
                  </div>
                  <RiskBar score={riskResult.riskScore} color={riskColor(riskResult.riskScore)} />
                </div>
                {riskResult.riskFactors?.length > 0 && (
                  <>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.4px' }}>
                      Risk factors detected
                    </div>
                    {riskResult.riskFactors.map((f, i) => (
                      <div key={i} style={{ display:'flex', gap:8, padding:'4px 0', fontSize:12, borderBottom:'1px solid var(--border-light)' }}>
                        <span>⚠</span><span style={{ color:'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </>
                )}
                <Alert type="info" icon="ℹ" style={{ marginTop:12 }}>{riskResult.reasoning}</Alert>
              </div>
            )}
            <div className="ob-nav">
              <Button variant="secondary" onClick={() => goStep(2)}>← Back</Button>
              <Button onClick={() => goStep(4)} disabled={loading}>Choose Plan →</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <SectionHeader title="Choose Your Plan" sub="Weekly premium deducted automatically. Coverage activates immediately." />
            <div className="grid-3" style={{ marginBottom:16 }}>
              {PLANS.map((plan) => {
                const premium  = Math.round(weeklyIncome * plan.pct / 100);
                const coverage = Math.round(weeklyIncome * plan.coverageMultiplier);
                const isRec    = riskResult?.recommendedPlan === plan.id || (!riskResult && plan.recommended);
                const isChosen = chosenPlan?.id === plan.id;
                return (
                  <div key={plan.id}
                    className={`plan-card ${isRec ? 'recommended' : ''} ${isChosen ? 'selected' : ''}`}
                    onClick={() => setChosenPlan(plan)}>
                    {isRec && <div className="plan-rec-badge">AI Recommended</div>}
                    <div className="plan-name">{plan.name}</div>
                    <div className="plan-pct">{plan.pct}%</div>
                    <div className="plan-pct-label">of weekly income</div>
                    <div className="plan-price">{fmt.currency(premium)} / week</div>
                    <div className="plan-coverage">Max payout: {fmt.currency(coverage)} / event</div>
                    <div className="plan-desc">{plan.desc}</div>
                  </div>
                );
              })}
            </div>
            {chosenPlan && (
              <div className="plan-summary-box">
                <div className="plan-summary-label">{chosenPlan.name} · {chosenPlan.pct}% of weekly income</div>
                <div className="plan-summary-amt">{fmt.currency(Math.round(weeklyIncome * chosenPlan.pct / 100))} / week</div>
                <div className="plan-summary-cov">Max payout: {fmt.currency(Math.round(weeklyIncome * chosenPlan.coverageMultiplier))} per event</div>
              </div>
            )}
            <div className="ob-nav">
              <Button variant="secondary" onClick={() => goStep(3)}>← Back</Button>
              <Button size="lg" onClick={activatePolicy}>Activate Policy ✓</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}