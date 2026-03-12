// ─── src/components/UI.jsx ───────────────────────────────────────────────────
// All shared, reusable UI primitives used across GigShield pages

import React from "react";

// ── Spinner / Loader ──────────────────────────────────────────────────────────
export function Loader({ text = "Processing..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: "28px 0",
      }}
    >
      <div
        className="spinner"
        style={{
          width: 38,
          height: 38,
          border: "3px solid #1e293b",
          borderTop: "3px solid #00d4aa",
          borderRadius: "50%",
        }}
      />
      <span style={{ color: "#64748b", fontSize: 13, letterSpacing: 0.5 }}>
        {text}
      </span>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ text, color = "#00d4aa" }) {
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────────
export function MetricCard({ label, value, sub, color = "#00d4aa", icon }) {
  return (
    <div
      style={{
        background: "#0f1923",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: "16px 18px",
        flex: 1,
        minWidth: 130,
      }}
    >
      {icon && <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>}
      <div
        className="mono"
        style={{
          fontSize: 22,
          fontWeight: 800,
          color,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          fontSize: 10,
          color: "#475569",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {sub}
      </div>
      <div
        className="bebas"
        style={{ fontSize: 24, color: "#f1f5f9", letterSpacing: 1 }}
      >
        {title}
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, accent }) {
  return (
    <div
      style={{
        background: "#0f1923",
        border: `1px solid ${accent ? accent + "44" : "#1e293b"}`,
        borderRadius: 14,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 10, color = "#00d4aa", label, showValue = true }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 6 }}>
      {(label || showValue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          {label && (
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
          )}
          {showValue && (
            <span
              className="mono"
              style={{ fontSize: 12, color: "#f1f5f9" }}
            >
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          height: 5,
          background: "#1e293b",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 3,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, onClick, disabled, variant = "primary", color = "#00d4aa", fullWidth = false, size = "md" }) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 13 },
    md: { padding: "12px 24px", fontSize: 14 },
    lg: { padding: "15px 32px", fontSize: 18 },
  };

  const variants = {
    primary: {
      background: disabled ? "#1e293b" : color,
      color: disabled ? "#475569" : "#0a0f16",
    },
    outline: {
      background: "transparent",
      color: disabled ? "#475569" : color,
      border: `1px solid ${disabled ? "#1e293b" : color + "66"}`,
    },
    ghost: {
      background: disabled ? "transparent" : color + "14",
      color: disabled ? "#475569" : color,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : "auto",
        border: "none",
        borderRadius: 10,
        fontFamily: "inherit",
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: 1.5,
        transition: "all 0.2s",
        ...sizes[size],
        ...variants[variant],
      }}
    >
      {children}
    </button>
  );
}

// ── Text Input ────────────────────────────────────────────────────────────────
export function TextInput({ label, value, onChange, placeholder, type = "text", prefix }) {
  return (
    <div>
      {label && (
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#0f1923",
          border: "1px solid #1e293b",
          borderRadius: 9,
          padding: "10px 14px",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#00d4aa55")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
      >
        {prefix && (
          <span style={{ color: "#475569", marginRight: 6, fontSize: 14 }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: "#f1f5f9",
            fontSize: 14,
            fontFamily: "inherit",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

// ── Select Dropdown ───────────────────────────────────────────────────────────
export function SelectInput({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      {label && (
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#0f1923",
          border: "1px solid #1e293b",
          borderRadius: 9,
          padding: "11px 14px",
          color: value ? "#f1f5f9" : "#475569",
          fontSize: 14,
          outline: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
export function Checkbox({ checked, onChange, label, color = "#00d4aa" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        cursor: "pointer",
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{
          width: 20,
          height: 20,
          minWidth: 20,
          borderRadius: 5,
          border: `2px solid ${checked ? color : "#334155"}`,
          background: checked ? color : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          marginTop: 1,
        }}
      >
        {checked && (
          <span style={{ color: "#0a0f16", fontSize: 11, fontWeight: 900 }}>
            ✓
          </span>
        )}
      </div>
      <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
        {label}
      </span>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "16px 0",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
      {label && (
        <span
          style={{ fontSize: 11, color: "#475569", letterSpacing: 1 }}
        >
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
    </div>
  );
}

// ── Status Dot ────────────────────────────────────────────────────────────────
export function StatusDot({ active = true, label }) {
  const color = active ? "#22c55e" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        className={active ? "pulse-dot" : ""}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
        }}
      />
      {label && (
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{label}</span>
      )}
    </div>
  );
}

// ── Step Progress ─────────────────────────────────────────────────────────────
export function StepProgress({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: i < current ? "#00d4aa" : "#1e293b",
            transition: "background 0.4s",
          }}
        />
      ))}
    </div>
  );
}

// ── Info Row ──────────────────────────────────────────────────────────────────
export function InfoRow({ label, value, highlight }) {
  return (
    <div
      style={{
        background: "#ffffff08",
        borderRadius: 8,
        padding: "10px 14px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#475569",
          marginBottom: 2,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          color: highlight || "#f1f5f9",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}