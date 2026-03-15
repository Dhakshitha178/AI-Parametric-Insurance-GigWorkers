import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { COVERED_EVENTS, EXCLUDED_EVENTS, fmt } from '../services/constants';
import { Card, Metric, Alert, Button, StatusBadge } from '../components/UI';

export default function Policy() {
  const { selectedPlan, policyActive, worker, income, setCurrentPage } = useAppState();
  const weekly = income.reduce((a,b) => a+b, 0);

  if (!policyActive || !selectedPlan) {
    return (
      <Card>
        <div style={{ textAlign:'center', padding:'40px 0' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🛡</div>
          <div style={{ fontSize:16, fontWeight:500, marginBottom:6 }}>No active policy</div>
          <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
            Complete onboarding to activate your income protection.
          </div>
          <Button onClick={() => setCurrentPage('onboard')}>Start Onboarding →</Button>
        </div>
      </Card>
    );
  }

  const policyNum = 'GS-2025-' + Math.floor(7000 + Math.random()*2000);

  const premiumHistory = [
    { week:'Mar 10–16, 2025', income: weekly, premium: selectedPlan.premium, status:'Active' },
    { week:'Mar 3–9, 2025',   income: 6840,   premium: Math.round(6840  * selectedPlan.pct/100), status:'Paid' },
    { week:'Feb 24–Mar 2',    income: 7200,   premium: Math.round(7200  * selectedPlan.pct/100), status:'Paid' },
    { week:'Feb 17–23',       income: 6950,   premium: Math.round(6950  * selectedPlan.pct/100), status:'Paid' },
    { week:'Feb 10–16',       income: 6400,   premium: Math.round(6400  * selectedPlan.pct/100), status:'Paid' },
  ];

  return (
    <div>
      <Card>
        <div className="policy-hero">
          <div>
            <div className="policy-name">{selectedPlan.name}</div>
            <div className="policy-id">Policy #{policyNum}</div>
          </div>
          <span className="badge badge-teal" style={{ fontSize:12 }}>✓ Active</span>
        </div>
        <div className="grid-4" style={{ marginBottom:16 }}>
          <Metric label="Weekly premium"   value={fmt.currency(selectedPlan.premium)}  sub={selectedPlan.pct+'% of income'} />
          <Metric label="Max payout/event" value={fmt.currency(selectedPlan.coverage)} sub="per disruption" />
          <Metric label="Total paid out"   value={fmt.currency(730)}                   sub="since inception" />
          <Metric label="Next renewal"     value="Mar 17"                              sub="Auto-renews" />
        </div>
        <div className="policy-upi">
          Payout channel: <strong>UPI</strong> ·{' '}
          <span style={{ fontFamily:'var(--font-mono)' }}>{worker.upi}</span> ·{' '}
          <span style={{ color:'var(--green-600)' }}>Instant settlement on approval</span>
        </div>
      </Card>

      <Card title="Coverage details">
        <div className="grid-2">
          <div className="coverage-col">
            <h4 style={{ color:'var(--green-800)' }}>✓ Covered events</h4>
            {COVERED_EVENTS.map(e => (
              <div key={e} className="coverage-item">
                <span className="coverage-icon" style={{ color:'var(--green-400)' }}>✓</span>
                <span>{e}</span>
              </div>
            ))}
          </div>
          <div className="coverage-col">
            <h4 style={{ color:'var(--red-600)' }}>✗ Strictly excluded</h4>
            {EXCLUDED_EVENTS.map(e => (
              <div key={e} className="coverage-item">
                <span className="coverage-icon" style={{ color:'var(--red-400)' }}>✗</span>
                <span>{e}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Premium history">
        {premiumHistory.map(row => (
          <div key={row.week} className="premium-row">
            <span style={{ color:'var(--text-secondary)' }}>{row.week}</span>
            <span>{fmt.currency(row.income)} income</span>
            <span style={{ fontWeight:500 }}>{fmt.currency(row.premium)} premium</span>
            <StatusBadge status={row.status} />
          </div>
        ))}
      </Card>
    </div>
  );
}