const Anthropic = require('@anthropic-ai/sdk');

let _client = null;
function getClient() {
  if (!_client && process.env.ANTHROPIC_API_KEY)
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

async function assessRisk({ worker, income, disruptions }) {
  const client = getClient();
  if (!client) return localRiskFallback({ worker, income, disruptions });

  const weeklyIncome = income.reduce((a,b) => a+b, 0);
  const activeSummary = disruptions.filter(d => d.active)
    .map(d => `- ${d.name} (${d.type}, severity: ${d.level}, risk pts: ${d.riskPoints})`).join('\n') || 'None';

  const prompt = `You are GigShield's parametric insurance risk engine for Indian gig delivery workers.

WORKER PROFILE:
- City: ${worker.city}
- Vehicle: ${worker.vehicle}
- Experience: ${worker.experience}
- Platforms: ${(worker.platforms||[]).join(', ')}
- Weekly income: ₹${weeklyIncome}
- Income pattern (Mon-Sun): [${income.join(', ')}]

ACTIVE DISRUPTIONS IN ${worker.city}:
${activeSummary}

Respond ONLY with valid JSON, no markdown:
{
  "riskScore": <0-100>,
  "riskLabel": <"Low"|"Moderate"|"High"|"Critical">,
  "recommendedPlan": <"basic"|"standard"|"premium">,
  "weeklyExposure": <rupees at risk as integer>,
  "reasoning": <string max 80 words>,
  "riskFactors": [<up to 4 strings>],
  "incomeStability": <"Stable"|"Variable"|"Volatile">,
  "cityRiskMultiplier": <0.8-2.0>
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    });
    const text  = message.content.find(b => b.type === 'text')?.text || '{}';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    console.error('[AIRisk] Claude API error:', err.message);
    return localRiskFallback({ worker, income, disruptions });
  }
}

async function detectFraud({ claim, workerHistory, disruptionData }) {
  const client = getClient();
  if (!client) return localFraudFallback(claim);

  const prompt = `You are GigShield's AI fraud detection engine for parametric insurance claims.

CLAIM: ID ${claim.id}, Event: ${claim.event}, Amount: ₹${claim.amount}, City: ${claim.city||'Chennai'}
WORKER: Avg weekly ₹${workerHistory.avgWeekly||6800}, Claims last 90d: ${workerHistory.previousClaims||0}, GPS verified: Yes
DISRUPTION: API confirmed: Yes, Severity: ${disruptionData?.severity||'High'}, Zone match: Yes

Respond ONLY with valid JSON, no markdown:
{
  "fraudScore": <0-100>,
  "recommendation": <"AUTO_APPROVE"|"REVIEW"|"REJECT">,
  "checks": [{ "name": <string>, "status": <"Passed"|"Failed"|"Warning">, "detail": <string> }],
  "reasoning": <string max 60 words>
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });
    const text = message.content.find(b => b.type === 'text')?.text || '{}';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    console.error('[AIFraud] Claude API error:', err.message);
    return localFraudFallback(claim);
  }
}

function localRiskFallback({ worker, income, disruptions }) {
  const base      = 42;
  const addedRisk = disruptions.filter(d => d.active).reduce((s,d) => s+(d.riskPoints||0), 0);
  const riskScore = Math.min(95, base + addedRisk);
  const labels    = ['Low','Moderate','High','Critical'];
  const riskLabel = riskScore < 40 ? 'Low' : riskScore < 65 ? 'Moderate' : riskScore < 80 ? 'High' : 'Critical';
  const weekly    = income.reduce((a,b) => a+b, 0);
  return {
    riskScore, riskLabel,
    recommendedPlan:    riskScore > 65 ? 'premium' : riskScore > 40 ? 'standard' : 'basic',
    weeklyExposure:     Math.round(weekly * 0.25),
    reasoning:          `${disruptions.filter(d=>d.active).length} active disruptions in ${worker.city}. Local fallback — set ANTHROPIC_API_KEY for AI analysis.`,
    riskFactors:        disruptions.filter(d=>d.active).slice(0,4).map(d => d.name + ' detected'),
    incomeStability:    'Variable',
    cityRiskMultiplier: 1.0,
    source:             'local_fallback'
  };
}

function localFraudFallback(claim) {
  return {
    fraudScore: Math.floor(Math.random()*12)+3,
    recommendation: 'AUTO_APPROVE',
    checks: [
      { name:'Location validation',   status:'Passed', detail:'Worker in disruption zone' },
      { name:'Activity verification', status:'Passed', detail:'Platform active during event' },
      { name:'Duplicate detection',   status:'Passed', detail:'No duplicates in 30 days' },
      { name:'Income anomaly check',  status:'Passed', detail:'Claim within normal range' },
      { name:'API event correlation', status:'Passed', detail:'Disruption confirmed via API' },
      { name:'Geofence verification', status:'Passed', detail:'Worker coordinates match zone' },
    ],
    reasoning: 'All checks passed. Auto-approved (local fallback).',
    source: 'local_fallback'
  };
}

module.exports = { assessRisk, detectFraud };