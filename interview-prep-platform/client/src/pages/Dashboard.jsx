import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProgressChart from '../components/dashboard/ProgressChart';
import PerformanceAnalytics from '../components/dashboard/PerformanceAnalytics';
import CategoryGrid from '../components/dashboard/CategoryGrid';
import Loader from '../components/common/Loader';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="dashboard">
            <h1>Welcome, {user.name}</h1>
            <ProgressChart />
            <PerformanceAnalytics />
            <CategoryGrid />
        </div>
    );
};

export default Dashboard;