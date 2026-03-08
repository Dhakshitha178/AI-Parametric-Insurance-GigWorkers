let selectedPlan = null;

// ── Navigate to a page ──
function goTo(n) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.step').forEach(s => {
    s.classList.remove('active', 'done');
  });
  document.getElementById('page-' + n).classList.add('active');
  document.getElementById('step-' + n).classList.add('active');

  // Mark previous steps as done
  for (let i = 1; i < n; i++) {
    document.getElementById('step-' + i).classList.add('done');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Page 1: Register ──
function register() {
  const name = document.getElementById('reg-name').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const city = document.getElementById('reg-city').value;

  if (!name) { toast('⚠️', 'Please enter your name.'); return; }
  if (!phone) { toast('⚠️', 'Please enter your phone number.'); return; }
  if (!city) { toast('⚠️', 'Please select your city.'); return; }

  toast('✅', 'Registered successfully! Choose your plan.');
  setTimeout(() => goTo(2), 900);
}

// ── Platform chip select ──
function pickChip(el) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
}

// ── Page 2: Pick plan ──
function pickPlan(level, el) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedPlan = level;

  const labels = {
    low: 'Low Risk Plan — ₹20/week',
    med: 'Medium Risk Plan — ₹35/week',
    high: 'High Risk Plan — ₹50/week'
  };
  const info = document.getElementById('sel-info');
  info.innerHTML = 'Selected: <strong>' + labels[level] + '</strong>';
}

function subscribe() {
  if (!selectedPlan) { toast('⚠️', 'Please select a plan first.'); return; }
  toast('⚡', 'Plan activated! Watch the disruption detection.');
  setTimeout(() => goTo(3), 900);
}

// ── Toast helper ──
function toast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('t-icon').textContent = icon;
  document.getElementById('t-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
// NEW: calculate plan based on income
function calculateIncomePlan(){

  let dailyIncome = document.getElementById("dailyIncome").value;

  if(!dailyIncome) return;

  let weeklyIncome = dailyIncome * 7;

  let suggestedPlan = "";

  if(weeklyIncome < 3500){
    suggestedPlan = "Low Risk Plan (₹20/week)";
  }
  else if(weeklyIncome <= 7000){
    suggestedPlan = "Medium Risk Plan (₹35/week)";
  }
  else{
    suggestedPlan = "High Risk Plan (₹50/week)";
  }

  toast("💡 Suggested plan based on income: " + suggestedPlan);
}
