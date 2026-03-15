import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { DISRUPTIONS, fmt, riskColor } from '../services/constants';
import { Card, Metric } from '../components/UI';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const WEEKS = ['W1','W2','W3','W4','W5','W6','W7','W8'];
const PIE_DATA = [
  { name:'Heavy Rain',      value:35, color:'#378ADD' },
  { name:'Platform Outage', value:25, color:'#534AB7' },
  { name:'Road Flooding',   value:20, color:'#185FA5' },
  { name:'Heat Wave',       value:12, color:'#854F0B' },
  { name:'AQI',             value:8,  color:'#3B6D11' },
];
const RISK_TREND  = [45,52,48,61,58,67,72,74].map((v,i) => ({ week:WEEKS[i], score:v }));
const INCOME_HIST = [6200,6800,5900,7100,6700,7400,6950].map((v,i) => ({
  week: WEEKS[i], income: v, payout: [0,310,0,420,290,0,380][i]
}));
const TIP = { background:'var(--bg-primary)', border:'1px solid var(--border-light)', borderRadius:8, fontSize:12 };

export default function Analytics() {
  const { income, riskData } = useAppState();
  const weekly       = income.reduce((a,b) => a+b, 0);
  const score        = riskData?.riskScore ?? 74;
  const totalPremium = 2847;
  const totalPaid    = 730;
  const ratio        = Math.round((totalPaid / totalPremium) * 100);
  const chartData    = [...INCOME_HIST, { week:'Now', income: weekly, payout: 730 }];

  return (
    <div>
      <div className="grid-4 mb-16">
        <Metric label="Total premium collected" value={fmt.currency(totalPremium)} sub="Last 13 weeks" />
        <Metric label="Total payouts"           value={fmt.currency(totalPaid)}    sub="4 claims" />
        <Metric label="Avg settlement time"     value="4.2 hrs"                   sub="claim to UPI" />
        <Metric label="Protection ratio"        value={ratio+'%'}                 sub="Payout / premium" />
      </div>

      <div className="grid-2">
        <Card title="Claims by disruption type">
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:10, fontSize:12, color:'var(--text-secondary)' }}>
            {PIE_DATA.map(d => (
              <div key={d.name} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:d.color }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                dataKey="value" paddingAngle={2}>
                {PIE_DATA.map((d,i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={TIP} formatter={v => v+'%'} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Risk score trend (8 weeks)">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={[...RISK_TREND, { week:'Now', score }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize:11 }} />
              <YAxis domain={[0,100]} tick={{ fontSize:11 }} />
              <Tooltip contentStyle={TIP} />
              <Line type="monotone" dataKey="score" stroke="#0F6E56" strokeWidth={2}
                dot={{ fill:'#0F6E56', r:4 }} activeDot={{ r:6 }} name="Risk Score" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Income vs payouts (weekly)">
        <div style={{ display:'flex', gap:14, marginBottom:10, fontSize:12, color:'var(--text-secondary)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:'#1D9E75' }} />Weekly income
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:'#0F6E56' }} />Payout received
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={20} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="week" tick={{ fontSize:11 }} />
            <YAxis tick={{ fontSize:11 }} tickFormatter={v => '₹'+(v/1000).toFixed(0)+'k'} />
            <Tooltip contentStyle={TIP}
              formatter={(v,name) => [fmt.currency(v), name==='income'?'Weekly Income':'Payout']} />
            <Bar dataKey="income" fill="rgba(29,158,117,0.35)" stroke="#1D9E75" strokeWidth={1} radius={[3,3,0,0]} />
            <Bar dataKey="payout" fill="rgba(15,110,86,0.8)"  stroke="#0F6E56" strokeWidth={1} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Disruption breakdown — all monitored events">
        <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0 8px',
          borderBottom:'1px solid var(--border-light)', fontSize:11, color:'var(--text-muted)' }}>
          <span style={{ flex:2 }}>Event</span>
          <span style={{ flex:1 }}>Type</span>
          <span style={{ flex:1, textAlign:'center' }}>Level</span>
          <span style={{ flex:1, textAlign:'center' }}>Risk pts</span>
          <span style={{ flex:1, textAlign:'right' }}>Claims</span>
          <span style={{ flex:1, textAlign:'right' }}>Paid out</span>
        </div>
        {DISRUPTIONS.map(d => {
          const claims = d.id==='env-rain'?1:d.id==='ops-platform'?1:0;
          const paid   = d.id==='env-rain'?420:d.id==='ops-platform'?310:0;
          return (
            <div key={d.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'8px 0', borderBottom:'1px solid var(--border-light)', fontSize:12 }}>
              <span style={{ flex:2 }}>{d.name}</span>
              <span style={{ flex:1, color:'var(--text-secondary)' }}>{d.type}</span>
              <span style={{ flex:1, textAlign:'center' }}>
                <span className={`badge badge-${d.level==='Critical'?'red':d.level==='High'?'amber':d.level==='Medium'?'blue':'gray'}`}>
                  {d.level}
                </span>
              </span>
              <span style={{ flex:1, textAlign:'center', fontFamily:'var(--font-mono)' }}>+{d.riskPoints}</span>
              <span style={{ flex:1, textAlign:'right' }}>{claims}</span>
              <span style={{ flex:1, textAlign:'right', fontWeight:500, color: paid>0?'var(--green-600)':'var(--text-muted)' }}>
                {paid>0 ? fmt.currency(paid) : '—'}
              </span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}