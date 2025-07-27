import React, { useState } from 'react';

import OrganizationView from './OrganizationView';
import ApplicationView from './ApplicationView';
import UserView from './UserView';
import ReportsView from './ReportsView';
import ReportsD3View from './ReportsD3View';

type ActiveTab = 'organizations' | 'applications' | 'users' | 'reports' | 'reportd3';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('organizations');

  const handleTabChange = (tab: ActiveTab): void => {
    setActiveTab(tab);
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '8px 0',
    fontSize: '1.1rem',
    color: '#000',
    backgroundColor: 'transparent',
    border: 'none',
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="d-flex flex-column p-3 bg-light" style={{ width: '280px', height: '100vh' }}>
        <h4>Dashboard</h4>
        <div>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button style={linkStyle} onClick={() => handleTabChange('organizations')}>
                Manage Organizations
              </button>
            </li>
            <li className="nav-item">
              <button style={linkStyle} onClick={() => handleTabChange('applications')}>
                Manage Applications
              </button>
            </li>
            <li className="nav-item">
              <button style={linkStyle} onClick={() => handleTabChange('users')}>
                Manage Users
              </button>
            </li>
            <li className="nav-item">
              <button style={linkStyle} onClick={() => handleTabChange('reports')}>
                Reports ECharts
              </button>
            </li>
            <li className="nav-item">
              <button style={linkStyle} onClick={() => handleTabChange('reportd3')}>
                Reports D3
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-fluid p-4" style={{ flex: 1 }}>
        <div>
          {activeTab === 'organizations' && (
            <div>
              <OrganizationView />
            </div>
          )}
          {activeTab === 'applications' && (
            <div>
              <ApplicationView />
            </div>
          )}
          {activeTab === 'users' && (
            <div>
              <UserView />
            </div>
          )}
          {activeTab === 'reports' && (
            <div>
              <ReportsView />
            </div>
          )}
          {activeTab === 'reportd3' && (
            <div>
              <ReportsD3View />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
