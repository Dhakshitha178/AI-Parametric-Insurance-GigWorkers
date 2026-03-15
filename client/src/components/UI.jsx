import React from 'react';

export function Card({ children, style, title, action }) {
  return (
    <div className="card" style={style}>
      {(title || action) && (
        <div className="card-header">
          {title && <div className="card-title">{title}</div>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Metric({ label, value, sub, valueColor }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={valueColor ? { color: valueColor } : {}}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

export function Button({ children, onClick, variant='primary', size, disabled, style }) {
  return (
    <button className={`btn btn-${variant}${size ? ' btn-'+size : ''}`}
      onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}

export function Badge({ children, variant='gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function Alert({ children, type='info', icon, style }) {
  return (
    <div className={`alert alert-${type}`} style={style}>
      {icon && <span className="alert-icon">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

export function AIChip({ label='AI monitoring' }) {
  return <span className="ai-chip"><span className="ai-pulse" />{label}</span>;
}

export function Spinner({ text }) {
  return (
    <div style={{ textAlign:'center', padding:'36px 0' }}>
      <div className="spinner" />
      {text && <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:12 }}>{text}</div>}
    </div>
  );
}

export function RiskBar({ score, color }) {
  return (
    <div className="risk-bar-wrap">
      <div className="risk-bar-fill" style={{ width: score+'%', background: color }} />
    </div>
  );
}

export function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:20, fontWeight:500, marginBottom:4 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:'var(--text-secondary)' }}>{sub}</div>}
    </div>
  );
}

export function LevelBadge({ level }) {
  const map = { Critical:'red', High:'amber', Medium:'blue', Low:'gray' };
  return <Badge variant={map[level]||'gray'}>{level}</Badge>;
}

export function StatusBadge({ status }) {
  const map = { Paid:'teal', Processing:'amber', Denied:'red', Active:'teal', Failed:'red' };
  return <Badge variant={map[status]||'gray'}>{status}</Badge>;
}

export function FraudBar({ score }) {
  const color = score < 15 ? '#1D9E75' : score < 35 ? '#EF9F27' : '#E24B4A';
  return (
    <div className="fraud-row">
      <span className="fraud-label">Fraud risk</span>
      <div className="fraud-bar-wrap">
        <div className="fraud-bar-fill" style={{ width: score+'%', background: color }} />
      </div>
      <span className="fraud-pct">{score}%</span>
    </div>
  );
}

export function IncomeDayBar({ day, value, max }) {
  const pct = Math.round((value / (max||1)) * 100);
  return (
    <div className="income-day-row">
      <span className="income-day-label">{day}</span>
      <div className="income-day-bar-wrap">
        <div className="income-day-bar" style={{ width: `${pct}%` }} />
      </div>
      <span className="income-day-val">₹{Number(value).toLocaleString('en-IN')}</span>
    </div>
  );
}