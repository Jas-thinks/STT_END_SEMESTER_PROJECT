import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import './Timer.css';

const Timer = ({ initialTime, onTimeEnd, onTimeUpdate, autoSubmit = true }) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [showWarning, setShowWarning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate percentage for progress bar
    const getPercentage = () => {
        return (timeRemaining / initialTime) * 100;
    };

    // Get color based on time remaining
    const getColor = () => {
        const percentage = getPercentage();
        if (percentage > 50) return '#10b981'; // Green
        if (percentage > 25) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(interval);
                    if (autoSubmit && onTimeEnd) {
                        onTimeEnd();
                    }
                    return 0;
                }

                const newTime = prevTime - 1;

                // Show warning at 5 minutes (300 seconds)
                if (newTime === 300 && !showWarning) {
                    setShowWarning(true);
                    // Optional: Play sound or show notification
                }

                // Update parent component
                if (onTimeUpdate) {
                    onTimeUpdate(newTime);
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, autoSubmit, onTimeEnd, onTimeUpdate, showWarning]);

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const closeWarning = () => {
        setShowWarning(false);
    };

    return (
        <div className="timer-container">
            {/* Warning Modal */}
            {showWarning && timeRemaining <= 300 && (
                <div className="timer-warning-overlay">
                    <div className="timer-warning-modal">
                        <div className="timer-warning-icon">
                            <AlertTriangle size={48} className="warning-icon-svg" />
                        </div>
                        <h3>5 Minutes Remaining!</h3>
                        <p>You have 5 minutes left to complete the quiz.</p>
                        <button onClick={closeWarning} className="timer-warning-btn">
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* Timer Display */}
            <div className={`timer-display ${timeRemaining <= 300 ? 'timer-warning' : ''} ${timeRemaining <= 60 ? 'timer-critical' : ''}`}>
                <div className="timer-icon">
                    <Clock size={20} />
                </div>
                <div className="timer-content">
                    <div className="timer-label">Time Remaining</div>
                    <div className="timer-time" style={{ color: getColor() }}>
                        {formatTime(timeRemaining)}
                    </div>
                </div>
                
                {/* Progress bar */}
                <div className="timer-progress-bar">
                    <div 
                        className="timer-progress-fill" 
                        style={{ 
                            width: `${getPercentage()}%`,
                            backgroundColor: getColor()
                        }}
                    />
                </div>
            </div>

            {/* Pause/Resume button (optional) */}
            {/* <button onClick={handlePause} className="timer-pause-btn">
                {isPaused ? 'Resume' : 'Pause'}
            </button> */}
        </div>
    );
};

export default Timer;
