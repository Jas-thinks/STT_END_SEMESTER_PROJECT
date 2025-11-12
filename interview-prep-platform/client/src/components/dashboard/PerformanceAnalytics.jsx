import React, { useEffect, useState } from 'react';
import { fetchPerformanceData } from '../../services/api';
import { Line } from 'react-chartjs-2';
import './PerformanceAnalytics.css';

const PerformanceAnalytics = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPerformanceData = async () => {
            try {
                const data = await fetchPerformanceData();
                setPerformanceData(data);
            } catch (error) {
                console.error('Error fetching performance data:', error);
            } finally {
                setLoading(false);
            }
        };

        getPerformanceData();
    }, []);

    const chartData = {
        labels: performanceData.map(entry => entry.date),
        datasets: [
            {
                label: 'Performance Score',
                data: performanceData.map(entry => entry.score),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    return (
        <div className="performance-analytics">
            <h2>Performance Analytics</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Line data={chartData} />
            )}
        </div>
    );
};

export default PerformanceAnalytics;