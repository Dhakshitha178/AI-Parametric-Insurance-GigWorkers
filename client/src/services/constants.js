export const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export const PLANS = [
  {
    id: 'basic',
    name: 'Basic Shield',
    pct: 2,
    coverageMultiplier: 0.60,
    desc: 'Essential protection for low-risk zones',
    recommended: false,
    features: ['60% income replacement', 'Environmental triggers only', 'UPI payout within 24hrs'],
  },
  {
    id: 'standard',
    name: 'Standard Shield',
    pct: 3,
    coverageMultiplier: 0.80,
    desc: 'Best value — recommended for most workers',
    recommended: false,
    features: ['80% income replacement', 'All trigger types', 'UPI payout within 4hrs', 'AI fraud protection'],
  },
  {
    id: 'premium',
    name: 'Premium Shield',
    pct: 5,
    coverageMultiplier: 1.00,
    desc: 'Full protection for high-risk zones',
    recommended: false,
    features: ['100% income replacement', 'All trigger types', 'Instant UPI payout', 'Priority support'],
  },
];

export const DISRUPTIONS = [
  { id: 'env-rain',     name: 'Heavy Rainfall',         type: 'Environmental', icon: '🌧', level: 'High',     riskPoints: 15, bgColor: '#E6F1FB', trigger: 'Rain > 15mm/hr',         api: 'OpenWeatherMap' },
  { id: 'env-heat',     name: 'Heat Wave',               type: 'Environmental', icon: '🌡', level: 'Medium',   riskPoints: 8,  bgColor: '#FAEEDA', trigger: 'Temp > 42°C',            api: 'OpenWeatherMap' },
  { id: 'env-cyclone',  name: 'Cyclone / Storm',         type: 'Environmental', icon: '🌀', level: 'Critical', riskPoints: 25, bgColor: '#FCEBEB', trigger: 'Wind > 90km/h',          api: 'IMD API' },
  { id: 'env-aqi',      name: 'Severe Air Pollution',    type: 'Environmental', icon: '💨', level: 'Medium',   riskPoints: 6,  bgColor: '#EAF3DE', trigger: 'AQI > 200',              api: 'AQICN API' },
  { id: 'ops-platform', name: 'Platform Server Outage',  type: 'Environmental', icon: '📱', level: 'High',     riskPoints: 18, bgColor: '#EEEDFE', trigger: 'Uptime < 95%',           api: 'Platform API' },
  { id: 'ops-payment',  name: 'Payment Gateway Failure', type: 'Operational',   icon: '💳', level: 'High',     riskPoints: 12, bgColor: '#FAECE7', trigger: 'Error rate > 5%',        api: 'Razorpay Status' },
  { id: 'ops-power',    name: 'Power Outage',            type: 'Operational',   icon: '⚡', level: 'Medium',   riskPoints: 9,  bgColor: '#FAEEDA', trigger: 'Grid failure reported',  api: 'Grid Monitor' },
  { id: 'ops-warehouse',name: 'Warehouse Downtime',      type: 'Operational',   icon: '🏭', level: 'Low',      riskPoints: 4,  bgColor: '#F5F4F1', trigger: 'Downtime > 2hrs',        api: 'WMS API' },
  { id: 'hyp-flood',    name: 'Road Flooding',           type: 'Hyperlocal',    icon: '🚧', level: 'High',     riskPoints: 14, bgColor: '#E6F1FB', trigger: '> 40% routes blocked',   api: 'Traffic API' },
  { id: 'hyp-closure',  name: 'Road Closures',           type: 'Hyperlocal',    icon: '🚨', level: 'Medium',   riskPoints: 7,  bgColor: '#FBEAF0', trigger: 'Major closure reported', api: 'Civic API' },
];

export const COVERED_EVENTS = [
  'Heavy rainfall (> 15mm/hr recorded)',
  'Cyclone / tropical storm alerts (IMD)',
  'Extreme heat wave (> 42°C sustained)',
  'Severe air pollution (AQI > 200)',
  'Platform server outages (> 30 min)',
  'Payment gateway failures (> 5% error rate)',
  'Power outages at fulfillment centers',
  'Warehouse downtime (> 2 continuous hours)',
  'Road flooding blocking > 40% local routes',
  'Major road closures in delivery zone',
];

export const EXCLUDED_EVENTS = [
  'Health, illness, or personal injury',
  'Vehicle damage or mechanical failures',
  'Life insurance or accidental death',
  'Self-reported disruptions (no API validation)',
  'Duplicate claims for the same event',
  'Claims without valid location data',
  'Scheduled platform maintenance windows',
];

export const CITIES = [
  'Chennai', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad',
  'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur',
  'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur',
  'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam', 'Kochi',
];

export const FRAUD_CHECKS_TEMPLATE = [
  { name: 'Location validation',   detail: 'Worker confirmed in disruption zone via GPS' },
  { name: 'Activity verification', detail: 'Platform app login confirmed during event window' },
  { name: 'Duplicate detection',   detail: 'No duplicate claims found in 30-day window' },
  { name: 'Income anomaly check',  detail: 'Claim amount within 2σ of income baseline' },
  { name: 'API event correlation', detail: 'Disruption independently confirmed via API' },
  { name: 'Geofence verification', detail: 'Worker coordinates match disruption boundary' },
];

export const PLATFORMS = [
  '🟠 Swiggy',
  '🔴 Zomato',
  '🟢 Zepto',
  '🔵 Amazon Flex',
  '🟡 Dunzo',
  '🟣 Blinkit',
  '⚫ Porter',
  '🟤 Shadowfax',
];

export const fmt = {
  currency: (n) => '₹' + Number(n).toLocaleString('en-IN'),
  num:      (n) => Number(n).toLocaleString('en-IN'),
  pct:      (n) => n.toFixed(1) + '%',
};

export const riskColor = (score) => {
  if (score < 40) return '#3B6D11';
  if (score < 65) return '#854F0B';
  if (score < 80) return '#A32D2D';
  return '#791F1F';
};

export const riskLabel = (score) => {
  if (score < 40) return 'Low';
  if (score < 65) return 'Moderate';
  if (score < 80) return 'High';
  return 'Critical';
};