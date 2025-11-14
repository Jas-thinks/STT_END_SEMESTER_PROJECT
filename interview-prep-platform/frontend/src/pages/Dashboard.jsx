import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Flame, 
  Trophy,
  BookOpen,
  Calendar,
  AlertCircle,
  ChevronDown,
  Activity,
  Award,
  Zap
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [timeAnalytics, setTimeAnalytics] = useState([]);
  const [timePeriod, setTimePeriod] = useState('7');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [timePeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, categoryRes, weakRes, timeRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/analytics/category-performance'),
        api.get('/analytics/weak-areas'),
        api.get(`/analytics/time-analytics?period=${timePeriod}`)
      ]);

      setStats(statsRes.data.data || {});
      setCategoryPerformance(categoryRes.data.data || []);
      setWeakAreas(weakRes.data.data || []);
      setTimeAnalytics(timeRes.data.data || []);

      // Fetch recent attempts from quiz attempts
      const attemptsRes = await api.get('/quiz/attempts');
      setRecentAttempts((attemptsRes.data?.data || attemptsRes.data || []).slice(0, 10));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const calculateStreak = () => {
    // Simple streak calculation based on recent attempts
    if (!recentAttempts || recentAttempts.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < recentAttempts.length; i++) {
      const attemptDate = new Date(recentAttempts[i].completedAt || recentAttempts[i].createdAt);
      attemptDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - attemptDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '3px solid rgba(168, 85, 247, 0.2)',
            borderTopColor: '#a855f7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#cbd5e1', fontSize: '1.125rem' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glass-card {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(168, 85, 247, 0.2);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
        .stat-card {
          animation: fadeIn 0.6s ease-out;
        }
        .pulse-bg { animation: pulse 4s ease-in-out infinite; }
        .pulse-bg-delay-1 { animation: pulse 4s ease-in-out infinite; animation-delay: 1.5s; }
        .pulse-bg-delay-2 { animation: pulse 4s ease-in-out infinite; animation-delay: 0.75s; }
      `}</style>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '4rem'
      }}>
        {/* Animated Background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <div className="pulse-bg" style={{ position: 'absolute', top: '-15rem', right: '-15rem', width: '30rem', height: '30rem', backgroundColor: '#a855f7', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)' }} />
          <div className="pulse-bg-delay-1" style={{ position: 'absolute', bottom: '-15rem', left: '-15rem', width: '30rem', height: '30rem', backgroundColor: '#3b82f6', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>
              Dashboard
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Track your progress and performance
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="glass-card" style={{ padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#fca5a5' }} />
                <p style={{ color: '#fca5a5', margin: 0 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Overview Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* Total Quizzes */}
            <div className="glass-card hover-lift stat-card" style={{ padding: '2rem', borderRadius: '1.25rem', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Quizzes</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {stats?.totalQuizzes || 0}
                  </h3>
                </div>
                <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '0.75rem' }}>
                  <Trophy style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Completed attempts</p>
            </div>

            {/* Average Score */}
            <div className="glass-card hover-lift stat-card" style={{ padding: '2rem', borderRadius: '1.25rem', transition: 'all 0.3s ease', animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Average Score</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {stats?.averageScore?.toFixed(1) || 0}%
                  </h3>
                </div>
                <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '0.75rem' }}>
                  <Target style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Overall performance</p>
            </div>

            {/* Time Spent */}
            <div className="glass-card hover-lift stat-card" style={{ padding: '2rem', borderRadius: '1.25rem', transition: 'all 0.3s ease', animationDelay: '0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Time Spent</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {formatTime(stats?.totalTime || 0)}
                  </h3>
                </div>
                <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '0.75rem' }}>
                  <Clock style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Learning time</p>
            </div>

            {/* Current Streak */}
            <div className="glass-card hover-lift stat-card" style={{ padding: '2rem', borderRadius: '1.25rem', transition: 'all 0.3s ease', animationDelay: '0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Streak</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {calculateStreak()} days
                  </h3>
                </div>
                <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #f59e0b, #f97316)', borderRadius: '0.75rem' }}>
                  <Flame style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Keep it going!</p>
            </div>
          </div>

          {/* Performance Chart & Category Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            
            {/* Performance Chart */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                    Performance Trend
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Score trends over time</p>
                </div>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'rgba(168, 85, 247, 0.15)', 
                    border: '1px solid rgba(168, 85, 247, 0.3)', 
                    borderRadius: '0.5rem', 
                    color: '#e9d5ff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">All Time</option>
                </select>
              </div>

              {timeAnalytics.length > 0 ? (
                <div style={{ position: 'relative', height: '300px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y, i) => (
                      <line key={i} x1="0" y1={300 - (y * 3)} x2="500" y2={300 - (y * 3)} stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
                    ))}
                    
                    {/* Area */}
                    {(() => {
                      const points = timeAnalytics.map((item, i) => {
                        const x = (i / (timeAnalytics.length - 1)) * 500;
                        const y = 300 - ((item.averageScore || 0) * 3);
                        return `${x},${y}`;
                      });
                      return (
                        <polygon points={`0,300 ${points.join(' ')} 500,300`} fill="url(#areaGradient)" />
                      );
                    })()}
                    
                    {/* Line */}
                    <polyline
                      points={timeAnalytics.map((item, i) => {
                        const x = (i / (timeAnalytics.length - 1)) * 500;
                        const y = 300 - ((item.averageScore || 0) * 3);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Points */}
                    {timeAnalytics.map((item, i) => {
                      const x = (i / (timeAnalytics.length - 1)) * 500;
                      const y = 300 - ((item.averageScore || 0) * 3);
                      return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#a855f7" stroke="white" strokeWidth="2" />
                      );
                    })}
                  </svg>
                  
                  {/* Y-axis labels */}
                  <div style={{ position: 'absolute', left: '-3rem', top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                    {[100, 75, 50, 25, 0].map(v => <span key={v}>{v}%</span>)}
                  </div>
                </div>
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Activity style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No performance data yet</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Complete quizzes to see your progress</p>
                  </div>
                </div>
              )}
            </div>

            {/* Category Progress */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                Category Progress
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>Performance by subject</p>

              {categoryPerformance.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {categoryPerformance.map((cat, idx) => {
                    const colors = [
                      { from: '#a855f7', to: '#ec4899' },
                      { from: '#3b82f6', to: '#06b6d4' },
                      { from: '#10b981', to: '#34d399' },
                      { from: '#f59e0b', to: '#f97316' },
                      { from: '#8b5cf6', to: '#d946ef' },
                      { from: '#06b6d4', to: '#0ea5e9' },
                      { from: '#ec4899', to: '#f43f5e' },
                      { from: '#14b8a6', to: '#10b981' }
                    ];
                    const color = colors[idx % colors.length];
                    const percentage = cat.averageScore || 0;

                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>{cat.category}</span>
                          <span style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '700' }}>{percentage.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${percentage}%`, 
                            height: '100%', 
                            background: `linear-gradient(to right, ${color.from}, ${color.to})`,
                            borderRadius: '9999px',
                            transition: 'width 1s ease-out'
                          }} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                          <span>{cat.quizzesTaken} quiz{cat.quizzesTaken !== 1 ? 'zes' : ''}</span>
                          <span>•</span>
                          <span>{cat.accuracy?.toFixed(1)}% accuracy</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <div style={{ textAlign: 'center' }}>
                    <BookOpen style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No category data yet</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Start practicing to track your progress</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Attempts & Weak Areas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '2rem' }}>
            
            {/* Recent Attempts */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                Recent Attempts
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>Your latest quiz attempts</p>

              {recentAttempts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentAttempts.map((attempt, idx) => (
                    <div key={idx} className="hover-lift" style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {attempt.subject}
                          </h4>
                          <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                            {attempt.difficulty?.charAt(0).toUpperCase() + attempt.difficulty?.slice(1)}
                          </p>
                        </div>
                        <div style={{ 
                          padding: '0.375rem 0.75rem', 
                          background: attempt.percentage >= 75 ? 'rgba(16, 185, 129, 0.2)' : attempt.percentage >= 50 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          borderRadius: '0.5rem'
                        }}>
                          <span style={{ 
                            color: attempt.percentage >= 75 ? '#34d399' : attempt.percentage >= 50 ? '#fbbf24' : '#fca5a5',
                            fontSize: '0.875rem',
                            fontWeight: '700'
                          }}>
                            {attempt.percentage?.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Target size={14} />
                          <span>{attempt.score}/{attempt.totalQuestions}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} />
                          <span>{formatTime(attempt.timeTaken)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} />
                          <span>{new Date(attempt.completedAt || attempt.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Trophy style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No attempts yet</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Take your first quiz to get started</p>
                  </div>
                </div>
              )}
            </div>

            {/* Weak Areas */}
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                Areas to Improve
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>Topics needing more practice</p>

              {weakAreas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {weakAreas.map((area, idx) => (
                    <div key={idx} style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#fca5a5' }} />
                          <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }}>
                            {area.topic}
                          </h4>
                        </div>
                        <span style={{ color: '#fca5a5', fontSize: '0.875rem', fontWeight: '700' }}>
                          {area.accuracy?.toFixed(1)}%
                        </span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        {area.attempts} attempt{area.attempts !== 1 ? 's' : ''} • Recommended for practice
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Award style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>Great job!</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>No weak areas detected. Keep up the good work!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
