import React, { useState } from 'react';
import { useAppState }  from '../context/AppStateContext';
import { assessRisk }   from '../services/api';
import { PLANS, DISRUPTIONS, fmt, riskColor, riskLabel, PLATFORMS } from '../services/constants';
import { Card, Metric, Button, Spinner, Alert, RiskBar, SectionHeader } from '../components/UI';

const DAYS     = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EXP_OPTS = ['Less than 1 year', '1–2 years', '2–5 years', '5+ years'];
const VEHICLES = ['Two-wheeler (Bike)', 'Bicycle', 'Three-wheeler', 'Car'];

export default function Onboard() {
  const {
    setWorker, setIncome,
    setSelectedPlan, setPolicyActive, setCurrentPage, setRiskData
  } = useAppState();

  const [step, setStep] = useState(1);

  // Step 1 — empty worker profile
  const [localWorker, setLocalWorker] = useState({
    name:        '',
    phone:       '',
    officeZone:  '',   // e.g. "Peelamedu, Coimbatore"
    destZone:    '',   // e.g. "Gandhipuram, Coimbatore"
    vehicle:     '',
    experience:  '',
    upi:         '',
    platform:    '',   // single platform
  });

  // Step 2 — all zeroes, user fills in
  const [localIncome, setLocalIncome] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [riskResult,  setRiskResult]  = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [chosenPlan,  setChosenPlan]  = useState(null);

  const weeklyIncome = localIncome.reduce((a, b) => a + b, 0);
  const dailyAvg     = Math.round(weeklyIncome / 7);

  // Validation before moving steps
  function validateStep1() {
    if (!localWorker.name.trim())       { alert('Please enter your full name.');       return false; }
    if (!localWorker.phone.trim())      { alert('Please enter your mobile number.');   return false; }
    if (!localWorker.officeZone.trim()) { alert('Please enter your office/pickup zone.'); return false; }
    if (!localWorker.destZone.trim())   { alert('Please enter your delivery/destination zone.'); return false; }
    if (!localWorker.vehicle)           { alert('Please select your vehicle type.');   return false; }
    if (!localWorker.experience)        { alert('Please select your experience.');     return false; }
    if (!localWorker.upi.trim())        { alert('Please enter your UPI ID.');          return false; }
    if (!localWorker.platform)          { alert('Please select your platform.');       return false; }
    return true;
  }

  function validateStep2() {
    if (weeklyIncome === 0) { alert('Please enter your daily income for at least one day.'); return false; }
    return true;
  }

  function goStep(n) {
    if (n === 2 && !validateStep1()) return;
    if (n === 3 && !validateStep2()) return;
    if (n === 3) runRiskAnalysis();
    setStep(n);
  }

  // AI risk assessment using both zones
  async function runRiskAnalysis() {
    setLoading(true);
    setRiskResult(null);
    try {
      const activeMock = DISRUPTIONS
        .filter((_, i) => [0, 3, 4, 8].includes(i))
        .map(d => ({ ...d, active: true }));

      const result = await assessRisk({
        worker: {
          ...localWorker,
          // Pass both zones so AI can assess route risk
          city: `${localWorker.officeZone} → ${localWorker.destZone}`,
          platforms: [localWorker.platform],
        },
        income:      localIncome,
        disruptions: activeMock,
      });
      setRiskResult(result);
      setRiskData(result);
    } catch {
      const score = 62;
      setRiskResult({
        riskScore:      score,
        riskLabel:      riskLabel(score),
        recommendedPlan: 'standard',
        weeklyExposure:  Math.round(weeklyIncome * 0.25),
        reasoning:       'Local fallback estimate based on active disruptions.',
        riskFactors:     [
          'Heavy Rainfall detected',
          'Platform Outage active',
          'Road Flooding reported',
          'High AQI levels',
        ],
        incomeStability: 'Variable',
      });
    } finally {
      setLoading(false);
    }
  }

  function activatePolicy() {
    if (!chosenPlan) { alert('Please select a plan.'); return; }
    setWorker({
      ...localWorker,
      city:        localWorker.officeZone,
      platforms:   [localWorker.platform],
      memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    });
    setIncome(localIncome);
    const weekly   = localIncome.reduce((a, b) => a + b, 0);
    const premium  = Math.round(weekly * chosenPlan.pct / 100);
    const coverage = Math.round(weekly * chosenPlan.coverageMultiplier);
    setSelectedPlan({ ...chosenPlan, premium, coverage });
    setPolicyActive(true);
    setCurrentPage('dashboard');
  }

  return (
    <div>
      <Card>
        {/* Step progress bar */}
        <div className="step-indicator" style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`step-bar ${i < step ? 'done' : i === step ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, letterSpacing: '0.4px' }}>
          STEP {step} OF 4
        </div>

        {/* ── STEP 1: Worker Profile ── */}
        {step === 1 && (
          <div>
            <SectionHeader
              title="Welcome to GigShield"
              sub="Set up your income protection in 2 minutes. No paperwork."
            />

            <div className="form-row">
              {/* Left column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input className="form-input" placeholder="e.g. Ravi Kumar"
                    value={localWorker.name}
                    onChange={e => setLocalWorker(p => ({ ...p, name: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile number</label>
                  <input className="form-input" placeholder="e.g. 9876543210" maxLength={10}
                    value={localWorker.phone}
                    onChange={e => setLocalWorker(p => ({ ...p, phone: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Office / Pickup zone</label>
                  <input className="form-input" placeholder="e.g. Peelamedu, Coimbatore"
                    value={localWorker.officeZone}
                    onChange={e => setLocalWorker(p => ({ ...p, officeZone: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery / Destination zone</label>
                  <input className="form-input" placeholder="e.g. Gandhipuram, Coimbatore"
                    value={localWorker.destZone}
                    onChange={e => setLocalWorker(p => ({ ...p, destZone: e.target.value }))} />
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Vehicle type</label>
                  <select className="form-select"
                    value={localWorker.vehicle}
                    onChange={e => setLocalWorker(p => ({ ...p, vehicle: e.target.value }))}>
                    <option value="">-- Select vehicle --</option>
                    {VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Years as gig worker</label>
                  <select className="form-select"
                    value={localWorker.experience}
                    onChange={e => setLocalWorker(p => ({ ...p, experience: e.target.value }))}>
                    <option value="">-- Select experience --</option>
                    {EXP_OPTS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">UPI ID (for instant payouts)</label>
                  <input className="form-input" placeholder="e.g. ravi.kumar@upi"
                    value={localWorker.upi}
                    onChange={e => setLocalWorker(p => ({ ...p, upi: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Single platform selection */}
            <div className="form-group">
              <label className="form-label">Select your platform</label>
              <div className="platform-tags">
                {PLATFORMS.map(name => (
                  <span
                    key={name}
                    className={`platform-tag ${localWorker.platform === name ? 'selected' : ''}`}
                    onClick={() => setLocalWorker(p => ({ ...p, platform: name }))}>
                    {name}
                  </span>
                ))}
              </div>
              {localWorker.platform && (
                <div style={{ fontSize: 12, color: 'var(--green-600)', marginTop: 8 }}>
                  ✓ Selected: <strong>{localWorker.platform}</strong>
                </div>
              )}
            </div>

            <div className="ob-nav">
              <div />
              <Button onClick={() => goStep(2)}>Continue →</Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Daily Income ── */}
        {step === 2 && (
          <div>
            <SectionHeader
              title="Daily Income This Week"
              sub="Enter your earnings for each day. Leave as 0 for days you didn't work."
            />

            {DAYS.map((day, i) => (
              <div key={day} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '7px 0', borderBottom: '1px solid var(--border-light)'
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 34, fontFamily: 'var(--font-mono)' }}>
                  {day}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>₹</span>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  style={{ flex: 1, maxWidth: 150 }}
                  value={localIncome[i] === 0 ? '' : localIncome[i]}
                  onChange={e => {
                    const next = [...localIncome];
                    next[i] = parseInt(e.target.value) || 0;
                    setLocalIncome(next);
                  }}
                />
                <div style={{
                  flex: 1, height: 8, background: 'var(--bg-secondary)',
                  borderRadius: 4, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', background: 'var(--green-400)', borderRadius: 4,
                    width: localIncome[i] > 0
                      ? Math.min(100, Math.round(localIncome[i] / 1500 * 100)) + '%'
                      : '0%'
                  }} />
                </div>
                <span style={{ fontSize: 12, width: 60, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {localIncome[i] > 0 ? fmt.currency(localIncome[i]) : '—'}
                </span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              <Metric label="Weekly total" value={weeklyIncome > 0 ? fmt.currency(weeklyIncome) : '₹0'} />
              <Metric label="Daily average" value={dailyAvg > 0 ? fmt.currency(dailyAvg) : '₹0'} />
            </div>

            <div className="ob-nav">
              <Button variant="secondary" onClick={() => goStep(1)}>← Back</Button>
              <Button onClick={() => goStep(3)}>Calculate Risk →</Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: AI Risk Profile ── */}
        {step === 3 && (
          <div>
            <SectionHeader
              title="AI Risk Profile"
              sub={`Analysing route risk: ${localWorker.officeZone} → ${localWorker.destZone}`}
            />

            {loading && (
              <Spinner text="Analysing disruption data, checking weather, AQI, platform status and route risk…" />
            )}

            {!loading && riskResult && (
              <div>
                {/* Zone info */}
                <div style={{
                  display: 'flex', gap: 10, marginBottom: 16,
                  padding: '10px 14px', background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)', fontSize: 12
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Route:</span>
                  <span style={{ fontWeight: 500 }}>
                    {localWorker.officeZone}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                  <span style={{ fontWeight: 500 }}>
                    {localWorker.destZone}
                  </span>
                </div>

                <div className="grid-3" style={{ marginBottom: 16 }}>
                  <Metric
                    label="Risk score"
                    value={riskResult.riskScore}
                    sub={riskResult.riskLabel + ' risk'}
                    valueColor={riskColor(riskResult.riskScore)}
                  />
                  <Metric
                    label="Weekly income"
                    value={fmt.currency(weeklyIncome)}
                    sub={fmt.currency(dailyAvg) + ' / day'}
                  />
                  <Metric
                    label="Income at risk"
                    value={fmt.currency(riskResult.weeklyExposure || 0)}
                    sub="estimated this week"
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Overall risk level</span>
                    <span style={{ fontWeight: 500, color: riskColor(riskResult.riskScore) }}>
                      {riskResult.riskLabel} ({riskResult.riskScore}/100)
                    </span>
                  </div>
                  <RiskBar score={riskResult.riskScore} color={riskColor(riskResult.riskScore)} />
                </div>

                {riskResult.riskFactors?.length > 0 && (
                  <>
                    <div style={{
                      fontSize: 11, color: 'var(--text-muted)', marginBottom: 8,
                      textTransform: 'uppercase', letterSpacing: '0.4px'
                    }}>
                      Risk factors on your route
                    </div>
                    {riskResult.riskFactors.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 8, padding: '4px 0',
                        fontSize: 12, borderBottom: '1px solid var(--border-light)'
                      }}>
                        <span>⚠</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </>
                )}

                <Alert type="info" icon="ℹ" style={{ marginTop: 12 }}>
                  {riskResult.reasoning}
                </Alert>
              </div>
            )}

            <div className="ob-nav">
              <Button variant="secondary" onClick={() => goStep(2)}>← Back</Button>
              <Button onClick={() => goStep(4)} disabled={loading}>Choose Plan →</Button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Plan Selection ── */}
        {step === 4 && (
          <div>
            <SectionHeader
              title="Choose Your Plan"
              sub="Weekly premium deducted automatically. Coverage activates immediately."
            />

            <div className="grid-3" style={{ marginBottom: 16 }}>
              {PLANS.map(plan => {
                const premium  = Math.round(weeklyIncome * plan.pct / 100);
                const coverage = Math.round(weeklyIncome * plan.coverageMultiplier);
                const isChosen = chosenPlan?.id === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`plan-card ${isChosen ? 'selected' : ''}`}
                    onClick={() => setChosenPlan(plan)}
                  >
                    {/* No AI Recommended badge on any plan */}
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
                <div className="plan-summary-label">
                  {chosenPlan.name} · {chosenPlan.pct}% of weekly income
                </div>
                <div className="plan-summary-amt">
                  {fmt.currency(Math.round(weeklyIncome * chosenPlan.pct / 100))} / week
                </div>
                <div className="plan-summary-cov">
                  Max payout: {fmt.currency(Math.round(weeklyIncome * chosenPlan.coverageMultiplier))} per disruption event
                </div>
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