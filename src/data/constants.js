// ─── src/data/constants.js ───────────────────────────────────────────────────
// All static data: platforms, cities, plans, disruption definitions

export const PLATFORMS = [
  "Zomato",
  "Swiggy",
  "Zepto",
  "Amazon",
  "Dunzo",
  "Blinkit",
  "Porter",
  "BigBasket",
];

export const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Surat",
];

export const ZONES = [
  "North Zone",
  "South Zone",
  "East Zone",
  "West Zone",
  "Central Zone",
];

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Insurance Plans ──────────────────────────────────────────────────────────
export const INSURANCE_PLANS = [
  {
    id: "basic",
    label: "Basic Shield",
    pct: 2,
    color: "#00d4aa",
    maxPayoutMultiplier: 3,
    desc: "Essential coverage for low-risk zones",
    features: [
      "Environmental triggers",
      "Basic fraud detection",
      "48hr payout",
      "Email support",
    ],
    covered: [
      "Heavy Rain",
      "Extreme Heat",
      "High Pollution",
      "Warehouse Downtime",
    ],
  },
  {
    id: "standard",
    label: "Standard Guard",
    pct: 3,
    color: "#ff6b35",
    maxPayoutMultiplier: 5,
    desc: "Balanced protection for active workers",
    features: [
      "All Basic features",
      "Operational triggers",
      "24hr payout",
      "Priority support",
    ],
    covered: [
      "All Basic triggers",
      "Storm / Cyclone",
      "Server Failure",
      "Payment Gateway Failure",
      "Power Outage",
    ],
  },
  {
    id: "premium",
    label: "Premium Fort",
    pct: 5,
    color: "#a855f7",
    maxPayoutMultiplier: 7,
    desc: "Complete coverage for high-risk areas",
    features: [
      "All Standard features",
      "Hyperlocal triggers",
      "Instant payout",
      "Dedicated claims officer",
    ],
    covered: [
      "All Standard triggers",
      "Road Blockade",
      "Civil Disruption",
      "Local Flooding",
    ],
  },
];

// ── Disruption Definitions ───────────────────────────────────────────────────
export const DISRUPTIONS = {
  environmental: [
    {
      id: "heavy_rain",
      label: "Heavy Rain",
      icon: "🌧️",
      threshold: "Rainfall > 50mm/hr",
      severity: "high",
      apiSource: "OpenWeatherMap",
    },
    {
      id: "high_temp",
      label: "Extreme Heat",
      icon: "🌡️",
      threshold: "Temp > 45°C",
      severity: "medium",
      apiSource: "OpenWeatherMap",
    },
    {
      id: "storm",
      label: "Thunderstorm",
      icon: "⛈️",
      threshold: "Wind > 80 km/hr",
      severity: "high",
      apiSource: "IMD API",
    },
    {
      id: "cyclone",
      label: "Cyclone Alert",
      icon: "🌀",
      threshold: "Category 1+",
      severity: "critical",
      apiSource: "IMD API",
    },
    {
      id: "pollution",
      label: "High Pollution",
      icon: "😷",
      threshold: "AQI > 400",
      severity: "medium",
      apiSource: "CPCB API",
    },
  ],
  operational: [
    {
      id: "warehouse_down",
      label: "Warehouse Downtime",
      icon: "🏭",
      threshold: "> 2hr outage",
      severity: "medium",
      apiSource: "Platform API",
    },
    {
      id: "server_fail",
      label: "Platform Server Failure",
      icon: "💻",
      threshold: "Platform down > 1hr",
      severity: "high",
      apiSource: "Platform Status API",
    },
    {
      id: "payment_fail",
      label: "Payment Gateway Failure",
      icon: "💳",
      threshold: "Gateway down > 30min",
      severity: "medium",
      apiSource: "Razorpay / Paytm API",
    },
    {
      id: "power_outage",
      label: "Power Outage",
      icon: "⚡",
      threshold: "Grid failure > 2hr",
      severity: "high",
      apiSource: "POSOCO Grid API",
    },
  ],
  hyperlocal: [
    {
      id: "road_block",
      label: "Road Blockade",
      icon: "🚧",
      threshold: "Zone blocked > 1hr",
      severity: "medium",
      apiSource: "Google Maps Traffic API",
    },
    {
      id: "protest",
      label: "Civil Disruption",
      icon: "🚫",
      threshold: "Movement restricted",
      severity: "high",
      apiSource: "Local Authority Feed",
    },
    {
      id: "flooding",
      label: "Local Flooding",
      icon: "🌊",
      threshold: "Street flood > 30cm",
      severity: "critical",
      apiSource: "Flood Monitoring API",
    },
  ],
};

// ── City-specific disruption mappings (for mock API) ─────────────────────────
export const CITY_DISRUPTION_MAP = {
  Mumbai: ["heavy_rain", "flooding", "server_fail"],
  Chennai: ["cyclone", "heavy_rain", "flooding"],
  Delhi: ["pollution", "high_temp", "power_outage"],
  Bangalore: ["heavy_rain", "road_block", "server_fail"],
  Hyderabad: ["high_temp", "power_outage", "warehouse_down"],
  Kolkata: ["cyclone", "flooding", "payment_fail"],
  Pune: ["heavy_rain", "road_block", "protest"],
  Ahmedabad: ["high_temp", "power_outage", "pollution"],
  Jaipur: ["high_temp", "storm", "payment_fail"],
  Surat: ["flooding", "heavy_rain", "warehouse_down"],
};

// ── Risk scoring weights (for AI engine) ─────────────────────────────────────
export const CITY_RISK_SCORES = {
  Mumbai: 8,
  Chennai: 9,
  Kolkata: 7,
  Hyderabad: 6,
  Delhi: 8,
  Bangalore: 5,
  Pune: 5,
  Ahmedabad: 6,
  Jaipur: 6,
  Surat: 7,
};

export const PLATFORM_RISK_SCORES = {
  Zomato: 7,
  Swiggy: 7,
  Zepto: 8,
  Amazon: 6,
  Dunzo: 8,
  Blinkit: 7,
  Porter: 6,
  BigBasket: 5,
};

export const SEVERITY_COLORS = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

export const NAV_ITEMS = [
  { id: "onboarding", label: "Onboard", icon: "👤" },
  { id: "risk", label: "Risk Profile", icon: "🧠" },
  { id: "policy", label: "Policy", icon: "📋" },
  { id: "monitor", label: "Live Monitor", icon: "📡" },
  { id: "dashboard", label: "Dashboard", icon: "📊" },
];