const UPTIME_TRIGGER     = 95;
const ERROR_RATE_TRIGGER = 0.05;

const PLATFORM_CONFIGS = [
  { id:'swiggy',      name:'Swiggy',       icon:'🟠', mockState:{ uptime_pct:91.4, error_rate:0.086, status:'DEGRADED',    incidents:['API latency elevated','Order assignment delays'] }},
  { id:'zomato',      name:'Zomato',       icon:'🔴', mockState:{ uptime_pct:99.8, error_rate:0.002, status:'OPERATIONAL', incidents:[] }},
  { id:'zepto',       name:'Zepto',        icon:'🟢', mockState:{ uptime_pct:98.2, error_rate:0.018, status:'OPERATIONAL', incidents:[] }},
  { id:'amazon_flex', name:'Amazon Flex',  icon:'🔵', mockState:{ uptime_pct:99.5, error_rate:0.005, status:'OPERATIONAL', incidents:[] }},
  { id:'dunzo',       name:'Dunzo',        icon:'🟡', mockState:{ uptime_pct:95.1, error_rate:0.049, status:'DEGRADED',    incidents:['Checkout delays in Bangalore'] }},
  { id:'blinkit',     name:'Blinkit',      icon:'🟣', mockState:{ uptime_pct:99.1, error_rate:0.009, status:'OPERATIONAL', incidents:[] }},
];

async function checkPlatformStatus(platformNames = []) {
  const configs = platformNames.length > 0
    ? PLATFORM_CONFIGS.filter(p => platformNames.includes(p.name))
    : PLATFORM_CONFIGS;
  return Promise.all(configs.map(fetchPlatformStatus));
}

async function fetchPlatformStatus(config) {
  const s = config.mockState;
  const triggered = s.uptime_pct < UPTIME_TRIGGER || s.error_rate > ERROR_RATE_TRIGGER;
  return {
    id: config.id, name: config.name, icon: config.icon,
    uptime_pct: s.uptime_pct, error_rate: s.error_rate,
    status: s.status, incidents: s.incidents, triggered,
    trigger: triggered ? {
      id: 'ops-platform', platform: config.name,
      value: s.uptime_pct, threshold: UPTIME_TRIGGER, unit: '% uptime',
      reason: `${config.name} uptime: ${s.uptime_pct}% (threshold: ${UPTIME_TRIGGER}%)`
    } : null,
    checkedAt: new Date().toISOString(), source: 'Simulated'
  };
}

async function checkPaymentGatewayStatus() {
  const mock = { error_rate: 0.021, uptime_pct: 99.2, status: 'OPERATIONAL' };
  const triggered = mock.error_rate > ERROR_RATE_TRIGGER;
  return {
    provider: 'Razorpay', ...mock, triggered,
    trigger: triggered ? { id:'ops-payment', value: mock.error_rate*100, threshold: ERROR_RATE_TRIGGER*100, unit:'% error rate' } : null,
    checkedAt: new Date().toISOString(), source: 'Simulated'
  };
}

async function checkWarehouseStatus(city) {
  const mock = { downtime_minutes: 0, status: 'OPERATIONAL' };
  return {
    city, ...mock, triggered: mock.downtime_minutes > 120,
    trigger: mock.downtime_minutes > 120 ? { id:'ops-warehouse', value: mock.downtime_minutes, threshold: 120, unit:'minutes' } : null,
    checkedAt: new Date().toISOString(), source: 'Simulated'
  };
}

module.exports = { checkPlatformStatus, checkPaymentGatewayStatus, checkWarehouseStatus };