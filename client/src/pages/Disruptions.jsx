import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';
import { scanDisruptions, fetchAQI } from '../services/api';
import { DISRUPTIONS, fmt } from '../services/constants';
import { Card, AIChip, Alert, Button, LevelBadge, Badge } from '../components/UI';

const API_SOURCES = [
  { icon:'🌦', name:'OpenWeatherMap API',        scope:'Rain, temperature, wind, storm',       status:'Connected' },
  { icon:'🌡', name:'IMD (India Met. Dept)',      scope:'Cyclone alerts, severe weather',        status:'Connected' },
  { icon:'💨', name:'AQICN / CPCB AQI API',      scope:'Real-time Air Quality Index',           status:'Connected' },
  { icon:'📱', name:'Platform Status APIs',       scope:'Swiggy, Zomato, Zepto, Amazon Flex',   status:'Simulated' },
  { icon:'💳', name:'Payment Gateway Status',     scope:'Razorpay, PayU error rates',            status:'Simulated' },
  { icon:'🚦', name:'Traffic / Maps API',         scope:'Road blockages, flood zones',           status:'Simulated' },
  { icon:'🏭', name:'WMS / Grid Monitor',         scope:'Warehouse downtime, power outages',     status:'Simulated' },
];

export default function Disruptions() {
  const { worker } = useAppState();
  const [disruptions, setDisruptions] = useState(
    DISRUPTIONS.map((d,i) => ({ ...d, active:[0,3,4,8].includes(i), time:[0,3,4,8].includes(i)?'2 hrs ago':'No trigger' }))
  );
  const [aqiData,  setAqiData]  = useState(null);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  useEffect(() => {
    fetchAQI(worker.city).then(setAqiData).catch(()=>{});
  }, [worker.city]);

  async function doScan() {
    setScanning(true);
    try {
      const result = await scanDisruptions(worker.city, worker.platforms);
      if (result?.triggered) {
        setDisruptions(DISRUPTIONS.map(d => ({
          ...d,
          active: result.triggered.some(t => t.id === d.id),
          time:   result.triggered.some(t => t.id === d.id) ? 'Just now' : 'Clear',
        })));
        setLastScan(new Date().toLocaleTimeString());
      }
    } catch {}
    finally { setScanning(false); }
  }

  const activeCount = disruptions.filter(d => d.active).length;
  const env = disruptions.filter(d => d.type === 'Environmental');
  const ops = disruptions.filter(d => d.type === 'Operational');
  const hyp = disruptions.filter(d => d.type === 'Hyperlocal');

  return (
    <div>
      <Card>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <AIChip label={scanning ? 'Scanning…' : 'AI monitoring active'} />
            <span style={{ fontSize:13, color:'var(--text-secondary)' }}>
              Scanning all parametric triggers · {worker.city}
            </span>
            {lastScan && <span style={{ fontSize:11, color:'var(--text-muted)' }}>Last: {lastScan}</span>}
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {activeCount > 0
              ? <Badge variant="amber">{activeCount} active trigger{activeCount>1?'s':''}</Badge>
              : <Badge variant="green">All clear</Badge>
            }
            <Button variant="secondary" size="sm" onClick={doScan} disabled={scanning}>
              {scanning ? '↻ Scanning…' : '↻ Rescan now'}
            </Button>
          </div>
        </div>
      </Card>

      {aqiData && (
        <div style={{ marginBottom:14 }}>
          <Alert type={aqiData.aqi > 200 ? 'warning' : 'info'} icon="💨">
            <strong>Live AQI — {worker.city}:</strong> {aqiData.aqi} ({aqiData.category})
            {aqiData.pm25 && <> · PM2.5: {aqiData.pm25}</>}
            {aqiData.aqi > 200 && ' · ⚠ Trigger threshold exceeded'}
          </Alert>
        </div>
      )}

      <Card>
        <div className="card-title">All parametric triggers — {disruptions.length} monitored</div>
        {disruptions.map(d => (
          <div key={d.id} className="disruption-item">
            <div className="dis-left">
              <div className="dis-icon" style={{ background: d.bgColor }}>{d.icon}</div>
              <div>
                <div className="dis-name">{d.name}</div>
                <div className="dis-meta">
                  {d.type} · {d.api} ·{' '}
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:10 }}>{d.trigger}</span>
                </div>
              </div>
            </div>
            <div className="dis-right">
              <LevelBadge level={d.level} />
              <div className="dis-time" style={{ marginTop:4 }}>{d.time}</div>
              {d.active && <div className="dis-auto-tag">● Auto-claim initiated</div>}
            </div>
          </div>
        ))}
      </Card>

      <div className="grid-2">
        <TriggerPanel title="Environmental Triggers" items={env} />
        <TriggerPanel title="Operational & Hyperlocal" items={[...ops,...hyp]} />
      </div>

      <Card>
        <div className="card-title">Data sources & API integrations</div>
        {API_SOURCES.map(s => (
          <div key={s.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid var(--border-light)', fontSize:13 }}>
            <div>
              <span>{s.icon} {s.name}</span>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{s.scope}</div>
            </div>
            <Badge variant={s.status==='Connected'?'teal':'blue'}>{s.status}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

function TriggerPanel({ title, items }) {
  return (
    <Card>
      <div className="card-title">{title}</div>
      {items.map(d => (
        <div key={d.id} className="trigger-item">
          <div className="trigger-header">
            <span className="trigger-name">{d.icon} {d.name}</span>
            <Badge variant={d.active?'amber':'green'}>{d.active?'Active':'Clear'}</Badge>
          </div>
          <div className="trigger-threshold">{d.trigger} · {d.api}</div>
          <div className="risk-bar-wrap" style={{ marginTop:6 }}>
            <div className="risk-bar-fill" style={{ width: d.riskPoints*3+'%', background: d.active?'#EF9F27':'#1D9E75' }} />
          </div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>Risk contribution: +{d.riskPoints} pts</div>
        </div>
      ))}
    </Card>
  );
}