import React from 'react';
import CategoryGrid from '../components/dashboard/CategoryGrid';
import PerformanceAnalytics from '../components/dashboard/PerformanceAnalytics';
import ProgressChart from '../components/dashboard/ProgressChart';

const Dashboard = () => (
  <div className="dashboard-page">
    <h2>Dashboard</h2>
    <CategoryGrid categories={[]} />
    <PerformanceAnalytics analytics={{}} />
    <ProgressChart progress={{}} />
  </div>
);

export default Dashboard;
