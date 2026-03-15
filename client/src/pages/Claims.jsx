import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { approveClaim, initiateClaim } from '../services/api';
import { FRAUD_CHECKS_TEMPLATE, fmt } from '../services/constants';
import { Card, Metric, Alert, AIChip, FraudBar, StatusBadge, Button } from '../components/UI';

const DEMO_CLAIMS = [
  { id:'CLM-2847', event:'Heavy Rainfall (Chennai)',  date:'Mar 14, 2025', status:'Paid',       amount:420, fraudScore:8,  disruptionId:'env-rain'     },
  { id:'CLM-2831', event:'Platform Outage (Swiggy)',  date:'Mar 12, 2025', status:'Paid',       amount:310, fraudScore:5,  disruptionId:'ops-platform'  },
  { id:'CLM-2816', event:'Road Flooding (T. Nagar)',  date:'Mar 10, 2025', status:'Processing', amount:380, fraudScore:12, disruptionId:'hyp-flood'     },
  { id:'CLM-2799', event:'Heat Wave (42°C recorded)', date:'Mar 7, 2025',  status:'Paid',       amount:290, fraudScore:7,  disruptionId:'env-heat'      },
];

export default function Claims() {
  const { worker, income, selectedPlan } = useAppState();
  const [claims,     setClaims]     = useState(DEMO_CLAIMS);
  const [processing, setProcessing] = useState(null);
  const [newClaim,   setNewClaim]   = useState(null);

  const weekly    = income.reduce((a,b) => a+b, 0);
  const paid      = claims.filter(c => c.status === 'Paid');
  const pending   = claims.filter(c => c.status === 'Processing');
  const totalPaid = paid.reduce((s,c) => s+c.amount, 0);

  async function triggerTestClaim() {
    if (!selectedPlan) { alert('Activate a policy first.'); return; }
    setProcessing('new');
    try {
      const result = await initiateClaim({
        workerId:'worker-001', workerName:worker.name, upiId:worker.upi,
        disruptionId:'env-rain', eventName:'Heavy Rainfall (Test)',
        weeklyIncome:weekly, plan:selectedPlan, city:worker.city
      });
      setNewClaim(result);
      setClaims(prev => [{ ...result, status: result.status||'Processing' }, ...prev]);
    } catch (err) { alert('Could not initiate claim: '+err.message); }
    finally { setProcessing(null); }
  }

  async function processNow(claimId) {
    setProcessing(claimId);
    try {
      await approveClaim(claimId, worker.name);
      setClaims(prev => prev.map(c => c.id===claimId ? { ...c, status:'Paid' } : c));
    } catch {
      setClaims(prev => prev.map(c => c.id===claimId ? { ...c, status:'Paid' } : c));
    } finally { setProcessing(null); }
  }

  return (
    <div>
      {newClaim && (
        <Alert type="success" icon="✓">
          Claim {newClaim.id} initiated — {fmt.currency(newClaim.amount)} processing via UPI
        </Alert>
      )}

      <div className="grid-4 mb-16">
        <Metric label="Total claims"    value={claims.length}          sub="all time" />
        <Metric label="Paid out"        value={paid.length}            sub="claims settled" />
        <Metric label="Processing"      value={pending.length}         sub="in progress" />
        <Metric label="Total recovered" value={fmt.currency(totalPaid)} sub="via UPI" />
      </div>

      <div className="grid-2">
        <Card title="All claims" action={<AIChip label="Auto-initiated" />}>
          <Button variant="ghost" size="sm" style={{ marginBottom:12 }}
            onClick={triggerTestClaim} disabled={processing==='new'}>
            + Trigger test claim
          </Button>
          {claims.map(c => (
            <div key={c.id} className="claim-card">
              <div className="claim-header">
                <div>
                  <div className="claim-event">{c.event}</div>
                  <div className="claim-id">{c.id} · {c.date}</div>
                </div>
                <div>
                  <div className="claim-amount">{fmt.currency(c.amount)}</div>
                  <div style={{ marginTop:4, textAlign:'right' }}><StatusBadge status={c.status} /></div>
                </div>
              </div>
              <FraudBar score={c.fraudScore} />
              <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>
                  Parametric auto-trigger · No manual claim needed
                </span>
                {c.status === 'Processing'
                  ? <Button variant="secondary" size="sm"
                      onClick={() => processNow(c.id)} disabled={processing===c.id}>
                      Process now
                    </Button>
                  : <span style={{ fontSize:11, color:'var(--green-600)' }}>✓ UPI transferred</span>
                }
              </div>
            </div>
          ))}
        </Card>

        <Card title="Fraud detection" action={<AIChip label="AI engine" />}>
          <Alert type="success" icon="✓">All fraud checks passed for most recent claim (CLM-2847)</Alert>
          {FRAUD_CHECKS_TEMPLATE.map(f => (
            <div key={f.name} className="check-row">
              <div>
                <div className="check-name">{f.name}</div>
                <div className="check-detail">{f.detail}</div>
              </div>
              <span className="badge badge-teal">✓ Passed</span>
            </div>
          ))}
          <div style={{ marginTop:12, padding:10, background:'var(--bg-secondary)', borderRadius:'var(--radius-md)' }}>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.4px' }}>
              Anomaly detection
            </div>
            <div style={{ fontSize:12, color:'var(--text-secondary)' }}>
              Validates against GPS location, platform login timestamps, correlated API records,
              30-day income baseline, and geo-fenced disruption zones. Claims deviating &gt;2σ
              from baseline are flagged for manual review.
            </div>
          </div>
        </Card>
      </div>

      <Card title="Payout history">
        <Alert type="success" icon="✓">
          {fmt.currency(totalPaid)} total paid out this period via UPI instant transfer
        </Alert>
        {paid.map(c => (
          <div key={c.id} className="payout-item">
            <div className="payout-left">
              <div className="payout-event">{c.event}</div>
              <div className="payout-meta">
                {c.id} · {c.date} · UPI instant ·{' '}
                <span style={{ fontFamily:'var(--font-mono)' }}>{worker.upi}</span>
              </div>
            </div>
            <div className="payout-amount">{fmt.currency(c.amount)}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}