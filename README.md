# 🛡️ GigShield — AI-Powered Parametric Income Insurance

>**Protecting India's delivery partners against income loss from uncontrollable external disruptions — automatically, intelligently, and instantly.**

Live Demo:
https://ai-parametric-insurance-gig-workers-nu.vercel.app/



## 📌 Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Persona-Based Scenarios and Workflow](#2-persona-based-scenarios-and-workflow)
3. [Weekly Premium Model](#3-weekly-premium-model)
4. [Parametric Triggers](#4-parametric-triggers)
5. [Platform Justification — Web vs Mobile](#5-platform-justification--web-vs-mobile)
6. [AI/ML Integration Plan](#6-aiml-integration-plan)
7. [Tech Stack](#7-tech-stack)
8. [Development Plan](#8-development-plan)
9. [Architecture Overview](#9-architecture-overview)
10. [API Integrations](#10-api-integrations)
11. [Fraud Detection System](#11-fraud-detection-system)
12. [Exclusions and Compliance](#12-exclusions-and-compliance)
13. [Getting Started](#13-getting-started)

---

## 1. Problem Statement

India's platform-based delivery partners — working for Swiggy, Zomato, Zepto, Amazon Flex, Blinkit, and others — are the invisible backbone of the country's digital economy. Yet they carry **zero financial safety net** against income loss caused by events entirely outside their control.

When a cyclone hits Chennai, when Swiggy's servers go down for two hours, when a flash flood closes 40% of Coimbatore's roads, or when AQI crosses 300 in Delhi — these workers simply stop earning. No deliveries. No income. No recourse.

**GigShield solves this** with a parametric income insurance platform that monitors real-time disruptions, automatically triggers claims when thresholds are breached, uses AI to assess risk and detect fraud, and settles payouts via UPI within minutes — no claim forms, no human adjudication.

### The Gap We Are Filling

| The Problem | The GigShield Solution |
|:---|:---|
| Workers lose 20–30% of monthly income to disruptions | Parametric payout triggered automatically — no action needed |
| No insurance product designed for gig workers exists | Weekly premium model aligned to gig earning cycles |
| Traditional insurance requires manual claim filing | API-confirmed triggers eliminate paperwork entirely |
| Fraud and disputes delay settlement by weeks | AI fraud detection settles valid claims in under 4 hours |
| Workers cannot access or afford insurance platforms | Simple 4-step onboarding via any mobile browser |

---

## 2. Persona-Based Scenarios and Workflow

### Persona 1 — Ravi Kumar, Swiggy Partner, Chennai

| Attribute | Detail |
|:---|:---|
| Age | 28 years old |
| Vehicle | Two-wheeler (Bike) |
| Experience | 4 years |
| Weekly Income | ₹7,200 average |
| Route | Velachery to T. Nagar, Chennai |
| Platform | Swiggy |

**Scenario — Heavy Rainfall**

Heavy rainfall of 22mm/hr hits Chennai on a Tuesday. Ravi cannot complete deliveries for 6 hours and loses approximately ₹900 in earnings.

**GigShield Workflow**

1. OpenWeatherMap API detects rainfall crossing the 15mm/hr threshold for Chennai
2. GigShield's disruption engine marks the trigger as active
3. Ravi's Standard Shield policy (3%) is active — auto-claim is initiated
4. Claude AI runs fraud detection: GPS confirms Ravi is in Chennai, platform login confirms activity before the rain
5. Claim auto-approved with a fraud score of 6/100
6. ₹720 (80% of estimated loss) transferred to Ravi's UPI ID within 4 hours

> Ravi did nothing. No app interaction. No form. Fully automatic.

---

### Persona 2 — Priya Devi, Zepto Partner, Bengaluru

| Attribute | Detail |
|:---|:---|
| Age | 24 years old |
| Vehicle | Bicycle |
| Experience | 1.5 years |
| Weekly Income | ₹5,400 average |
| Route | HSR Layout to Koramangala, Bengaluru |
| Platform | Zepto |

**Scenario — Platform Server Outage**

Zepto's platform experiences a server outage (uptime drops to 88%) for 90 minutes during peak lunch hours. Priya is unable to receive new order assignments.

**GigShield Workflow**

1. Platform monitoring detects Zepto uptime below the 95% threshold
2. Trigger fires for all active GigShield policyholders on Zepto
3. AI fraud check confirms inactivity window matches the outage period
4. ₹430 payout (80% of estimated ₹537 loss) transferred via UPI in under 2 hours

---

### Persona 3 — Mohammed Farhan, Amazon Flex, Delhi

| Attribute | Detail |
|:---|:---|
| Age | 32 years old |
| Vehicle | Car |
| Experience | 3 years |
| Weekly Income | ₹9,800 average |
| Route | Connaught Place to Lajpat Nagar, Delhi |
| Platform | Amazon Flex |

**Scenario — Multiple Simultaneous Triggers**

Delhi AQI hits 340 (Severe category). Road flooding from unexpected rain blocks 45% of delivery routes. Two simultaneous parametric triggers activate.

**GigShield Workflow**

1. AQICN API detects AQI above 200 — environmental trigger fires adding 6 risk points
2. Traffic API detects more than 40% route blockage — hyperlocal trigger fires adding 14 risk points
3. Two simultaneous triggers — combined payout calculated
4. Premium Shield (5%) policy — 100% income replacement
5. ₹1,200 estimated loss → ₹1,200 UPI transfer within 1 hour

---

### Application Workflow (End-to-End)

| Step | Action | Detail |
|:---|:---|:---|
| Step 1 | Profile | Name, Phone, Office Zone, Delivery Zone, Vehicle, Platform, UPI ID |
| Step 2 | Income Entry | Enter daily earnings Monday to Sunday |
| Step 3 | AI Risk Assessment | Claude analyses route risk using both zones, active disruptions, and platform reliability |
| Step 4 | Plan Selection | Worker selects Basic (2%), Standard (3%), or Premium (5%) |
| Ongoing | Background Scan | Disruption scanner runs every 5 minutes across all API sources |
| Automatic | Claim and Payout | API confirms trigger → AI fraud check → UPI payout processed |

---

## 3. Weekly Premium Model

GigShield uses a **weekly pricing model** aligned with the typical earnings and payout cycle of gig workers in India. Most platforms pay weekly — GigShield mirrors this cycle.

### Premium Plans

| Plan | Premium Rate | Max Payout | Settlement Time |
|:---|:---|:---|:---|
| Basic Shield | 2% of weekly income | 60% income replacement | Within 24 hours |
| Standard Shield | 3% of weekly income | 80% income replacement | Within 4 hours |
| Premium Shield | 5% of weekly income | 100% income replacement | Under 1 hour |

### Example Calculation

A worker earning ₹7,000 per week on Standard Shield:

| Item | Amount |
|:---|:---|
| Weekly income | ₹7,000 |
| Weekly premium at 3% | ₹210 (₹30 per day equivalent) |
| Max payout per event | ₹5,600 |
| Annual premium | ₹10,920 |
| Annual max coverage | Up to ₹2,91,200 across multiple events |

### Why Weekly Pricing?

- Gig workers earn and think in weekly cycles
- Weekly premiums feel affordable at ₹30 to ₹70 per day
- Aligns with platform payout schedules — most platforms credit weekly
- Reduces default risk — shorter commitment periods suit informal workers
- Easier to adjust coverage as income fluctuates week to week

### Dynamic Pricing via AI

| Factor | Impact on Premium |
|:---|:---|
| Worker route risk (office zone to delivery zone) | Higher risk routes attract higher premiums |
| City-level historical disruption frequency | Flood-prone or high-AQI cities have base adjustments |
| Active platform reliability scores | Unreliable platforms increase the operational risk factor |
| Seasonal risk factors | Monsoon season triggers automatic risk uplift |
| Individual claim history | Anti-gaming safeguard — excessive claims are flagged |

---

## 4. Parametric Triggers

Parametric insurance pays out based on **objective, verifiable events** — not on subjective claims. This eliminates disputes, delays, and fraud entirely.

### Environmental Triggers

| Trigger | API Source | Threshold | Risk Points |
|:---|:---|:---|:---|
| Heavy Rainfall | OpenWeatherMap | Rainfall above 15mm per hour | +15 |
| Heat Wave | OpenWeatherMap | Temperature above 42 degrees C | +8 |
| Cyclone or Storm | IMD India | Cyclone alert issued or wind above 90km/h | +25 |
| Severe Air Pollution | AQICN / CPCB | AQI above 200 (Very Poor category) | +6 |

### Operational Triggers

| Trigger | API Source | Threshold | Risk Points |
|:---|:---|:---|:---|
| Platform Server Outage | Platform Status APIs | Uptime below 95% for 30 or more minutes | +18 |
| Payment Gateway Failure | Razorpay Status | Error rate above 5% over 15 minutes | +12 |
| Power Outage at Fulfillment | Grid Monitor API | Fulfillment center reported offline | +9 |
| Warehouse Downtime | WMS API | Downtime exceeding 2 continuous hours | +4 |

### Hyperlocal Triggers

| Trigger | API Source | Threshold | Risk Points |
|:---|:---|:---|:---|
| Road Flooding | Traffic / Maps API | More than 40% of local routes blocked | +14 |
| Major Road Closures | Civic Events API | Arterial road closure in delivery zone | +7 |

### Why Parametric Over Traditional?

| Traditional Insurance | GigShield Parametric |
|:---|:---|
| Worker must file a claim form | Claim initiated automatically by API |
| Proof of loss required | Neutral third-party API data is irrefutable |
| Adjudication takes days to weeks | Algorithmic decision in minutes |
| Disputes are common and prolonged | Zero disputes — data cannot be argued |
| Workers can exaggerate losses | Workers cannot fake rain or a server outage |

---

## 5. Platform Justification — Web vs Mobile

GigShield is built as a **Progressive Web App (PWA)** — accessible via browser on any device without any installation required.

| Factor | Web PWA | Native Mobile App |
|:---|:---|:---|
| Development speed | Single codebase, faster delivery | iOS and Android require separate codebases |
| Distribution | Just a URL — shareable via WhatsApp or SMS | Requires Play Store or App Store approval |
| Device access | Works on any smartphone, tablet, or desktop | Device-specific build required |
| Update delivery | Instant — no user action required | Users must manually update the app |
| Onboarding friction | Open a link and start — zero install needed | Download required before onboarding begins |
| Development cost | Approximately 40% lower | Higher due to dual platform effort |

### Why This Matters for Gig Workers

Delivery partners in India use a wide range of Android devices across price points. Many hesitate to install new apps due to storage constraints and data costs. A WhatsApp-shareable URL with full mobile responsiveness eliminates the onboarding barrier entirely — the worker opens a link, completes 4 screens, and is covered.

### Future Mobile Strategy (Phase 2)

- React Native mobile app for iOS and Android
- Push notifications when a claim is auto-triggered
- GPS background tracking for location verification
- Integration with UPI apps such as GPay and PhonePe for one-tap payment confirmation

---

## 6. AI/ML Integration Plan

### Component 1 — Dynamic Risk Assessment (Claude AI)

| Item | Detail |
|:---|:---|
| What it does | Analyses worker profile, route, platform history, and live disruption data to compute a real-time risk score from 0 to 100 |
| Model used | Anthropic Claude Sonnet (claude-sonnet-4-20250514) via the Anthropic API |
| Input | Worker profile, 7-day income pattern, active disruptions in route corridor |
| Output | Risk score, risk label, recommended plan, income at risk in rupees, and plain-language reasoning |
| Why AI over rules | A rule engine cannot account for the interaction between a flood-prone zone, poor platform uptime, and a specific vehicle type during monsoon season — Claude synthesises all variables holistically |

### Component 2 — Fraud Detection (Claude AI)

Every auto-initiated claim is evaluated against six independent signals to assign a fraud probability score from 0 to 100.

| Fraud Check | Method | Auto-Action |
|:---|:---|:---|
| Location validation | GPS coordinates vs disruption zone boundary geofence | Pass or flag |
| Activity verification | Platform login timestamps during claimed disruption window | Pass or flag |
| Duplicate detection | 30-day rolling window, same event, same worker | Pass or reject |
| Income anomaly | Claimed loss vs 90-day baseline within 2 standard deviations | Pass or review |
| API event correlation | Cross-reference claim date and time vs API-confirmed disruption | Pass or reject |
| Geofence verification | Worker active delivery zone must intersect disruption boundary | Pass or flag |

| Fraud Score Range | Action |
|:---|:---|
| 0 to 15% | Auto-approved — UPI payout processed immediately |
| 15 to 35% | Flagged for human review within 24 hours |
| Above 35% | Claim held pending investigation |

### Component 3 — Premium Pricing Model (ML — Phase 2)

- Train a gradient boosting model (XGBoost) on historical claims data
- Features include city, zone, platform, vehicle, experience, seasonal factors, and disruption frequency per route
- Output is a personalised premium rate within IRDAI-compliant regulatory bands
- Model is retrained continuously as new claims data accumulates

### Component 4 — Predictive Risk Modelling (Phase 2)

- Ingest IMD 48-hour weather forecasts to pre-warn workers before disruptions occur
- Notify workers 24 hours in advance with messages such as: *"High rainfall expected in your zone tomorrow. Your coverage is active."*
- Dynamically adjust next week's premium based on forecast risk score

### Component 5 — Claim Amount Estimation

**Current formula:**

```
Estimated loss  =  Weekly Income x 0.25 x (disruption_hours / 40)
Payout          =  Estimated loss x plan coverage multiplier (0.6 / 0.8 / 1.0)
```

**Phase 2 enhancement:** Replace the fixed 25% loss estimate with an ML model trained on actual earnings drop data during past disruption events, segmented by disruption type, city, and time of day.

---

## 7. Tech Stack

### Frontend

| Layer | Technology | Reason |
|:---|:---|:---|
| Framework | React 18 | Component reuse, large ecosystem, fast rendering |
| Charts | Recharts | Lightweight, declarative, built for React |
| HTTP | Axios | Clean API calls with interceptors and error handling |
| Styling | Custom CSS with Variables | No framework bloat, fast load, full design control |
| Fonts | DM Sans and DM Mono | Professional and highly readable on all screen sizes |

### Backend

| Layer | Technology | Reason |
|:---|:---|:---|
| Runtime | Node.js v22 | Non-blocking I/O ideal for parallel API fan-out |
| Framework | Express.js | Lightweight, battle-tested, minimal overhead |
| Security | Helmet + CORS + Rate Limiting | Production-ready hardening out of the box |
| Logging | Morgan | Structured request logging for debugging |
| Process Manager | Nodemon / PM2 | Auto-restart in development and production |

### AI and External APIs

| Service | Provider | Purpose |
|:---|:---|:---|
| AI Risk and Fraud | Anthropic Claude API | Risk scoring, fraud detection, reasoning |
| Weather | OpenWeatherMap API | Rain, temperature, wind, and storm data |
| Air Quality | AQICN / CPCB API | Real-time AQI by city |
| Cyclone Alerts | IMD India | Severe weather warnings |
| Platform Status | Simulated in Phase 1, Partner APIs in Phase 2 | Uptime monitoring |
| Payouts | Razorpay Payouts API | UPI instant transfers to workers |
| Traffic | Simulated in Phase 1, MapMyIndia in Phase 2 | Road blockage data |

### Infrastructure (Phase 2)

| Component | Technology |
|:---|:---|
| Database | PostgreSQL for workers, policies, and claims |
| Cache | Redis for disruption scan results with 5-minute TTL |
| Queue | Bull for claim processing queue |
| Hosting | AWS EC2 or Railway.app |
| CDN | Cloudflare |
| Monitoring | Datadog and Sentry |

---

## 8. Development Plan

### Phase 1 — Prototype (Current — Completed)

| Feature | Status |
|:---|:---|
| 4-step worker onboarding with full validation | Complete |
| Office zone and destination zone input for route risk | Complete |
| Single platform selection | Complete |
| AI risk assessment via Claude API with local fallback | Complete |
| Weekly premium calculation at 2%, 3%, and 5% | Complete |
| 10 parametric triggers across 3 disruption categories | Complete |
| Live AQI data via AQICN API | Complete |
| Live weather data via OpenWeatherMap | Complete |
| Claims page with AI fraud detection | Complete |
| Simulated UPI payout flow | Complete |
| Analytics dashboard with charts | Complete |
| Full mock fallback for all external services | Complete |

### Phase 2 — MVP (8 Weeks)

| Feature | Priority |
|:---|:---|
| PostgreSQL database for persistent storage | High |
| Worker authentication via OTP on mobile number | High |
| Real Razorpay Payout API integration from sandbox to live | High |
| GPS location verification for fraud detection | High |
| Automated weekly premium deduction via UPI mandate | High |
| Web Push notifications for claim status updates | Medium |
| IMD cyclone alert webhook integration | Medium |
| Admin dashboard for claim review and manual override | Medium |
| Platform API partnerships for real uptime data | Medium |

### Phase 3 — Scale (12 Weeks)

| Feature | Priority |
|:---|:---|
| React Native mobile app for iOS and Android | High |
| ML-based dynamic premium pricing model | High |
| 48-hour predictive risk alerts from IMD forecasts | High |
| Multi-language support in Tamil, Hindi, Telugu, and Kannada | Medium |
| Official platform API integrations with Swiggy and Zomato | Medium |
| IRDAI regulatory compliance filing | High |
| B2B API for platforms to embed GigShield natively | Medium |
| Reinsurance partnerships for catastrophic event coverage | Low |

---

## 9. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                   CLIENT  (React PWA)                     │
│   Onboard  →  Dashboard  →  Policy  →  Disruptions       │
│   Claims  →  Analytics                                    │
└───────────────────────┬──────────────────────────────────┘
                        │  HTTP REST
┌───────────────────────▼──────────────────────────────────┐
│              EXPRESS.JS  API  SERVER                      │
│  /api/weather   /api/risk   /api/claims                   │
│  /api/disruptions   /api/payouts   /api/health            │
└──┬──────────┬──────────┬──────────┬──────────┬───────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
OpenWeather  AQICN   Anthropic  Razorpay  Platform
   API        API   Claude API Payout API Status API
```

| Layer | Component | Responsibility |
|:---|:---|:---|
| Presentation | React 18 PWA | Onboarding, dashboard, disruptions, claims, analytics |
| API Gateway | Express.js REST API | Route handling, auth, rate limiting, error handling |
| AI Layer | Anthropic Claude API | Risk scoring, fraud detection, premium recommendations |
| Data Layer | External APIs | Real-time parametric trigger evaluation |
| Payments | Razorpay Payouts API | UPI instant transfers on claim approval |
| Storage | In-memory (Phase 1) or PostgreSQL (Phase 2) | Worker profiles, policies, claims, payouts |

---

## 10. API Integrations

| API | Endpoint | Free Tier | Usage in GigShield |
|:---|:---|:---|:---|
| OpenWeatherMap | api.openweathermap.org/data/2.5/weather | 1,000 calls per day | Rain, heat, and storm triggers |
| AQICN | api.waqi.info/feed/{city}/ | Free with token | AQI triggers |
| Anthropic Claude | api.anthropic.com/v1/messages | Pay-per-use | Risk assessment and fraud detection |
| Razorpay Payouts | api.razorpay.com/v1/payouts | Sandbox free | UPI disbursals to workers |
| IMD India | imd.gov.in/api/alerts | Public | Cyclone and severe weather alerts |

---

## 11. Fraud Detection System

GigShield's multi-layer fraud detection ensures the system cannot be gamed by any individual or organised group.

| Layer | Method | What It Prevents |
|:---|:---|:---|
| Parametric Objectivity | Claims only initiated by API-confirmed events | Self-reported or fabricated disruptions |
| AI Anomaly Detection | Claude evaluates claim vs worker income baseline | Inflated claim amounts |
| Geofence Verification | Worker GPS zone must intersect disruption boundary | Claims from unaffected locations |
| Platform Activity Check | Platform login history cross-referenced with disruption window | False activity claims during outages |
| Duplicate Prevention | 30-day rolling window per worker per event type | Multiple claims for the same event |

---

## 12. Exclusions and Compliance

GigShield strictly excludes the following from coverage in alignment with IRDAI guidelines. These exclusions are hardcoded into the claim initiation logic and cannot be overridden.

| Excluded Event | Reason |
|:---|:---|
| Health, illness, or personal injury | Covered by separate health insurance products |
| Vehicle damage, breakdown, or maintenance | Covered by motor insurance — out of scope |
| Life insurance or accidental death | Regulated separately — requires separate licensing |
| Income loss due to personal or worker-initiated inactivity | Cannot be parametrically verified |
| Events without API-confirmed parametric triggers | No objective evidence — fraud risk too high |
| Duplicate claims for the same event window | Anti-gaming measure — 30-day window enforced |
| Scheduled platform maintenance windows | Pre-announced — workers can plan around these |

---

## 13. Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/gigshield-pro.git
cd gigshield-pro

# Install all dependencies
npm run install:all

# Set up environment variables
cd server
cp .env.example .env

# Edit .env and add your API keys (app works without keys too)

# Start the application
cd ..
npm run dev
```

Open **http://localhost:3000** in your browser.

### API Keys

The application runs fully on mock data without any API keys. Add keys to `server/.env` for live data:

| Key | Service | Where to Get It | Cost |
|:---|:---|:---|:---|
| ANTHROPIC_API_KEY | Claude AI | console.anthropic.com | Pay-per-use |
| OPENWEATHER_API_KEY | Weather data | openweathermap.org/api | Free tier |
| AQICN_TOKEN | AQI data | aqicn.org/api | Free |
| RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET | UPI payouts | dashboard.razorpay.com | Sandbox free |

### Project Structure

```
gigshield-pro/
├── package.json
├── client/
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.jsx
│       ├── context/AppStateContext.js
│       ├── components/Header.jsx  UI.jsx
│       ├── pages/Onboard.jsx  Dashboard.jsx  Policy.jsx
│       │         Disruptions.jsx  Claims.jsx  Analytics.jsx
│       ├── services/api.js  constants.js
│       └── styles/base.css  components.css  pages.css
└── server/
    ├── index.js
    ├── routes/weather.js  risk.js  claims.js  payouts.js  disruptions.js
    └── services/weatherService.js  aqiService.js  platformService.js
                aiRiskService.js  payoutService.js  disruptionService.js
```

---

## Business Model

| Revenue Stream | Description |
|:---|:---|
| Premium revenue | 2 to 5% of worker weekly income |
| B2B licensing | Platforms such as Swiggy and Zomato embed GigShield natively |
| Data insights | Anonymised disruption and earnings analytics for urban planners |
| Reinsurance | Partner with reinsurers to hedge catastrophic event exposure |

---

## Prototype Scope Summary

| Feature | Status |
|:---|:---|
| 4-step onboarding with office zone and destination zone | Live |
| Single platform selection | Live |
| AI risk assessment with Claude API and local fallback | Live |
| Weekly premium calculation at 2%, 3%, and 5% | Live |
| 10 parametric triggers with live rescan | Live |
| Live AQI via AQICN API | Live |
| Live weather via OpenWeatherMap | Live |
| Claims with AI fraud detection | Live |
| Simulated UPI payout processing | Live |
| Analytics dashboard with Recharts charts | Live |
| Full mock fallback without API keys | Live |

---

*Because the people who deliver your dinner deserve a safety net too.*