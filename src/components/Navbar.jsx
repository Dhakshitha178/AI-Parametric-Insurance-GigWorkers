// ─── src/components/Navbar.jsx ───────────────────────────────────────────────
// Sticky top navigation bar with step indicators and GigShield branding

import React from "react";
import { NAV_ITEMS } from "../data/constants";

export default function Navbar({ screen, activeIdx, onNavigate, workerData }) {
  return (
    <div
      style={{
        background: "#0a0f16",
        borderBottom: "1px solid #1e293b",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 840,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 62,
          gap: 16,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #00d4aa, #0066ff)",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🛡️
          </div>
          <div>
            <div
              className="bebas"
              style={{
                fontSize: 22,
                letterSpacing: 3,
                color: "#f1f5f9",
                lineHeight: 1,
              }}
            >
              GIGSHIELD
            </div>
            <div
              style={{
                fontSize: 8,
                color: "#475569",
                letterSpacing: 2,
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              Parametric Income Protection
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ display: "flex", gap: 2 }}>
          {NAV_ITEMS.map((item, idx) => {
            const isActive =
              screen === item.id ||
              (screen === "claim" && item.id === "monitor");
            const isAccessible = idx <= activeIdx || !!workerData;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isAccessible && item.id !== "claim") {
                    onNavigate(item.id);
                  }
                }}
                title={!isAccessible ? "Complete previous steps first" : ""}
                style={{
                  background: isActive ? "#00d4aa22" : "transparent",
                  border: "none",
                  borderRadius: 7,
                  padding: "5px 10px",
                  color: isActive
                    ? "#00d4aa"
                    : isAccessible
                    ? "#94a3b8"
                    : "#2d3748",
                  cursor: isAccessible ? "pointer" : "default",
                  fontSize: 11,
                  fontWeight: 600,
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>{item.icon}</span>
                <span className="hide-mobile">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
