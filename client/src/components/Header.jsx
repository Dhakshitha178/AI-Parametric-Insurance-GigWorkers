import React from 'react';
import { useAppState } from '../context/AppStateContext';

const NAV = [
  { id:'onboard',     label:'Onboard'      },
  { id:'dashboard',   label:'Dashboard'    },
  { id:'policy',      label:'Policy'       },
  { id:'disruptions', label:'Disruptions'  },
  { id:'claims',      label:'Claims'       },
  { id:'analytics',   label:'Analytics'    },
];

export default function Header() {
  const { currentPage, setCurrentPage, policyActive, selectedPlan } = useAppState();
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-name">GigShield</span>
            <span className="logo-tagline">Parametric Income Insurance</span>
          </div>
        </div>
        <nav className="main-nav">
          {NAV.map(item => (
            <button key={item.id}
              className={`nav-btn${currentPage === item.id ? ' active' : ''}`}
              onClick={() => setCurrentPage(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-status">
          <span className={`status-dot${policyActive ? ' active' : ' inactive'}`} />
          <span className="status-label">
            {policyActive && selectedPlan ? selectedPlan.name+' active' : 'No policy'}
          </span>
        </div>
      </div>
    </header>
  );
}