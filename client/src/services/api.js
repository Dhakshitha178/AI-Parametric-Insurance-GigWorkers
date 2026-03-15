import axios from 'axios';

const BASE = '/api';
const api  = axios.create({ baseURL: BASE, timeout: 15000 });

export const fetchWeather       = (city)           => api.get(`/weather/${city}`).then(r => r.data.data);
export const fetchWeatherAlerts = (city)           => api.get(`/weather/${city}/alerts`).then(r => r.data.data);
export const scanDisruptions    = (city, platforms)=> api.get('/disruptions/scan', { params:{ city, platforms: platforms.join(',') }}).then(r => r.data.data);
export const fetchAQI           = (city)           => api.get(`/disruptions/aqi/${city}`).then(r => r.data.data);
export const fetchPlatforms     = (names)          => api.get('/disruptions/platforms', { params:{ names: names.join(',') }}).then(r => r.data.data);
export const assessRisk         = (payload)        => api.post('/risk/assess', payload).then(r => r.data.data);
export const detectFraud        = (payload)        => api.post('/risk/fraud', payload).then(r => r.data.data);
export const initiateClaim      = (payload)        => api.post('/claims/initiate', payload).then(r => r.data.data);
export const getClaim           = (id)             => api.get(`/claims/${id}`).then(r => r.data.data);
export const approveClaim       = (id, workerName) => api.post(`/claims/${id}/approve`, { workerName }).then(r => r.data.data);
export const processUpiPayout   = (payload)        => api.post('/payouts/process', payload).then(r => r.data.data);
export const getPayoutStatus    = (txnId)          => api.get(`/payouts/${txnId}/status`).then(r => r.data.data);
export const checkHealth        = ()               => api.get('/health').then(r => r.data);