import React, { useState } from 'react';
import { AppStateContext } from './context/AppStateContext';
import Header      from './components/Header';
import Onboard     from './pages/Onboard';
import Dashboard   from './pages/Dashboard';
import Policy      from './pages/Policy';
import Disruptions from './pages/Disruptions';
import Claims      from './pages/Claims';
import Analytics   from './pages/Analytics';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';

const PAGE_COMPONENTS = {
  onboard: Onboard, dashboard: Dashboard, policy: Policy,
  disruptions: Disruptions, claims: Claims, analytics: Analytics,
};

export default function App() {
  const [currentPage,  setCurrentPage]  = useState('onboard');
  const [policyActive, setPolicyActive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [worker, setWorker] = useState({
    name: 'Ravi Kumar', phone: '9876543210', city: 'Chennai',
    vehicle: 'Two-wheeler (Bike)', experience: '5+ years',
    upi: 'ravi.kumar@upi', platforms: ['Swiggy','Zomato'], memberSince: 'Mar 2025'
  });
  const [income,      setIncome]      = useState([920,1050,780,1120,960,840,1100]);
  const [riskData,    setRiskData]    = useState(null);
  const [claims,      setClaims]      = useState([]);
  const [disruptions, setDisruptions] = useState([]);

  const ctx = {
    currentPage, setCurrentPage, policyActive, setPolicyActive,
    selectedPlan, setSelectedPlan, worker, setWorker,
    income, setIncome, riskData, setRiskData,
    claims, setClaims, disruptions, setDisruptions,
    weeklyIncome: income.reduce((a,b) => a+b, 0),
    dailyAvg:     Math.round(income.reduce((a,b) => a+b, 0) / 7),
  };

  const PageComponent = PAGE_COMPONENTS[currentPage] || Onboard;

  return (
    <AppStateContext.Provider value={ctx}>
      <div className="app-shell">
        <Header />
        <main className="app-main"><PageComponent /></main>
      </div>
    </AppStateContext.Provider>
  );
}