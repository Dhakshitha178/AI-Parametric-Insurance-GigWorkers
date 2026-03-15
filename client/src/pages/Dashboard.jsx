import React, { useEffect, useState } from 'react';
import { useAppState }    from '../context/AppStateContext';
import { scanDisruptions } from '../services/api';
import { DISRUPTIONS, fmt, riskColor, riskLabel } from '../services/constants';
import { Card, Metric, Alert, AIChip, IncomeDayBar } from '../components/UI';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const TIMELINE = [
  { title:'Auto-claim initiated: Heavy Rainfall (₹420 pending)',  time:'2 hrs ago',           type:'amber' },
  { title:'Payout received: Platform Outage — ₹310 via UPI',      time:'Yesterday, 4:12 PM',  type:'green' },
  { title:'Risk score updated: 62 → 74 (AQI trigger detected)',    time:'Yesterday, 11:00 AM', type:'blue'  },
  { title:'Weekly premium deducted via UPI',                       time:'Mar 10, 9:00 AM',     type:'green' },
  { title:'Policy renewed automatically for this week',            time:'Mar 10, 9:00 AM',     type:'green' },
];

export default function Dashboard() {
  const { worker, income, selectedPlan, policyActive, riskData } = useAppState();
  const [liveDisruptions, setLiveDisruptions] = useState([]);
  const [scanning,        setScanning]        = useState(false);

  const weekly     = income.reduce((a,b) => a+b, 0);
  const maxIncome  = Math.max(...income);
  const score      = riskData?.riskScore ?? 62;
  const scoreColor = riskColor(score);
  const scoreLabel = riskData?.riskLabel ?? riskLabel(score);
  const activeCount= liveDisruptions.filter(d => d.active).length;

  useEffect(() => {
    setLiveDisruptions(DISRUPTIONS.map((d,i) => ({
      ...d, active: [0,3,4,8].includes(i),
      time: [0,3,4,8].includes(i) ? '2 hrs ago' : 'No trigger'
    })));
    async function doScan() {
      setScanning(true);
      try {
        const result = await scanDisruptions(worker.city, worker.platforms);
        if (result?.triggered?.length > 0) {
          setLiveDisruptions(DISRUPTIONS.map(d => ({
            ...d, active: result.triggered.some(t => t.id === d.id),
            time: result.triggered.some(t => t.id === d.id) ? 'Just now' : 'Clear'
          })));
        }
      } catch {}
      finally { setScanning(false); }
    }
    doScan();
  }, [worker.city]);

  const activeAlerts = liveDisruptions.filter(d => d.active).slice(0, 4);

  return (
    <div>
      <div className="worker-profile-card">
        <div className="worker-avatar">{worker.name[0]}</div>
        <div className="worker-info">
          <div className="worker-name">{worker.name}</div>
          <div className="worker-meta">{worker.city} · {worker.vehicle} · {worker.platforms.join(', ')}</div>
        </div>
        <div className="worker-right">
          <span className={`badge ${policyActive ? 'badge-teal' : 'badge-amber'}`}>
            {policyActive && selectedPlan ? '✓ '+selectedPlan.name : 'No policy active'}
          </span>
          <div className="worker-member-since">Member since {worker.memberSince}</div>
        </div>
      </div>

      <div className="grid-4 mb-16">
        <Metric label="Weekly income"      value={fmt.currency(weekly)}  sub="↑ 8% vs last week" />
        <Metric label="Risk score"         value={score}                 sub={scoreLabel+' risk'} valueColor={scoreColor} />
        <Metric label="Active disruptions" value={activeCount}           sub={scanning ? 'scanning…' : 'in '+worker.city} />
        <Metric label="Total paid out"     value={fmt.currency(730)}     sub="this policy period" />
      </div>

      <div className="grid-2">
        <Card title="Weekly income breakdown" action={<span className="badge badge-teal">{fmt.currency(weekly)}</span>}>
          {DAYS.map((day,i) => <IncomeDayBar key={day} day={day} value={income[i]} max={maxIncome} />)}
        </Card>

        <Card title="Live disruption alerts" action={<AIChip label={scanning ? 'Scanning…' : 'AI monitoring'} />}>
          {activeAlerts.length > 0
            ? activeAlerts.map(d => (
                <div key={d.id} className={`alert alert-${d.level==='Critical'?'danger':d.level==='High'?'warning':'info'}`}>
                  <span className="alert-icon">{d.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:500, fontSize:13 }}>{d.name}</div>
                    <div style={{ fontSize:11, opacity:0.85, marginTop:2 }}>
                      {d.type} · {d.time} · Auto-claim initiated
                    </div>
                  </div>
                  <span className={`badge badge-${d.level==='Critical'?'red':d.level==='High'?'amber':'blue'}`}>{d.level}</span>
                </div>
              ))
            : <div style={{ padding:'20px 0', textAlign:'center', fontSize:13, color:'var(--text-muted)' }}>
                ✓ No active disruptions in your area
              </div>
          }
        </Card>
      </div>

      <Card title="Recent activity">
        <div className="timeline">
          {TIMELINE.map((t,i) => (
            <div key={i} className="timeline-item">
              <div className={`timeline-dot ${t.type}`} />
              <div className="timeline-title">{t.title}</div>
              <div className="timeline-time">{t.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}