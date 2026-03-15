const axios = require('axios');

const RAZORPAY_BASE = 'https://api.razorpay.com/v1';

function getAuth() {
  return { username: process.env.RAZORPAY_KEY_ID||'', password: process.env.RAZORPAY_KEY_SECRET||'' };
}

function isConfigured() {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

async function processUpiPayout({ upiId, amount, claimId, workerName, eventName }) {
  if (!isConfigured()) return mockPayout({ upiId, amount, claimId });

  try {
    const contact = await axios.post(`${RAZORPAY_BASE}/contacts`,
      { name: workerName, contact: '9999999999', type: 'employee', reference_id: 'GS-'+claimId },
      { auth: getAuth() });

    const fundAccount = await axios.post(`${RAZORPAY_BASE}/fund_accounts`,
      { contact_id: contact.data.id, account_type: 'vpa', vpa: { address: upiId } },
      { auth: getAuth() });

    const res = await axios.post(`${RAZORPAY_BASE}/payouts`, {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      fund_account_id: fundAccount.data.id,
      amount: amount * 100, currency: 'INR', mode: 'UPI', purpose: 'payout',
      queue_if_low_balance: true, reference_id: claimId,
      narration: `GigShield claim: ${eventName}`,
      notes: { claim_id: claimId, event: eventName, platform: 'GigShield' }
    }, { auth: getAuth() });

    const p = res.data;
    return {
      success: true, transactionId: p.id, utrNumber: p.utr||null,
      amount: p.amount/100, status: p.status, upiId, claimId,
      settledAt: p.created_at ? new Date(p.created_at*1000).toISOString() : new Date().toISOString(),
      message: `₹${amount} transferred to ${upiId}`, source: 'Razorpay'
    };
  } catch (err) {
    console.error('[Payout] Razorpay error:', err.response?.data||err.message);
    return mockPayout({ upiId, amount, claimId, error: err.message });
  }
}

function mockPayout({ upiId, amount, claimId, error }) {
  return {
    success: !error, transactionId: 'TXN'+Date.now(),
    utrNumber: 'UTR'+Math.floor(Math.random()*1e12),
    amount, status: error ? 'failed' : 'processed',
    upiId, claimId, settledAt: new Date().toISOString(),
    message: error ? `Payout failed: ${error}` : `₹${amount} transferred to ${upiId} (mock — set Razorpay keys for live)`,
    source: 'Mock'
  };
}

async function getPayoutStatus(transactionId) {
  if (!isConfigured()) return { id: transactionId, status: 'processed', source: 'mock' };
  try {
    const res = await axios.get(`${RAZORPAY_BASE}/payouts/${transactionId}`, { auth: getAuth() });
    return res.data;
  } catch (err) { return { id: transactionId, status: 'unknown', error: err.message }; }
}

module.exports = { processUpiPayout, getPayoutStatus, isConfigured };