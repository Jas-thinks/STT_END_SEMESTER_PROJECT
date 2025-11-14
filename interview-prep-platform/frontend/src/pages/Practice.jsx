import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Cpu,
  Database,
  Server,
  Layout,
  Globe,
  Brain,
  TrendingUp,
  Layers,
  Sparkles,
  Play,
  Shuffle,
  Clock,
  Target,
  ChevronRight,
  Zap,
  Award
} from 'lucide-react';
import api from '../services/api';

const Practice = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quiz/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      'code': Code,
      'cpu': Cpu,
      'database': Database,
      'server': Server,
      'layout': Layout,
      'globe': Globe,
      'brain': Brain,
      'trending-up': TrendingUp,
      'layers': Layers,
      'sparkles': Sparkles
    };
    return icons[iconName] || Code;
  };

  const getCategoryGradient = (index) => {
    const gradients = [
      { from: '#a855f7', to: '#ec4899' },   // Purple-Pink
      { from: '#3b82f6', to: '#06b6d4' },   // Blue-Cyan
      { from: '#10b981', to: '#34d399' },   // Green
      { from: '#f59e0b', to: '#f97316' },   // Orange
      { from: '#8b5cf6', to: '#d946ef' },   // Violet-Fuchsia
      { from: '#06b6d4', to: '#0ea5e9' },   // Cyan-Blue
      { from: '#ec4899', to: '#f43f5e' },   // Pink-Rose
      { from: '#14b8a6', to: '#10b981' },   // Teal-Green
      { from: '#6366f1', to: '#8b5cf6' },   // Indigo-Violet
      { from: '#f97316', to: '#fb923c' }    // Orange-Amber
    ];
    return gradients[index % gradients.length];
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowConfig(true);
  };

  const handleStartQuiz = async () => {
    if (!selectedCategory) return;

    try {
      const response = await api.get('/quiz/questions', {
        params: {
          subject: selectedCategory.name,
          difficulty: selectedDifficulty,
          count: 20
        }
      });

      // Navigate to quiz page with questions
      navigate('/quiz', {
        state: {
          questions: response.data.data.questions,
          subject: selectedCategory.name,
          difficulty: selectedDifficulty,
          timeLimit: response.data.data.timeLimit
        }
      });
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to load questions. Please try again.');
    }
  };

  const handleRandomQuiz = async () => {
    try {
      const response = await api.get('/quiz/random', {
        params: { count: 20 }
      });

      navigate('/quiz', {
        state: {
          questions: response.data.data.questions,
          subject: response.data.data.subject,
          difficulty: response.data.data.difficulty,
          timeLimit: response.data.data.timeLimit
        }
      });
    } catch (error) {
      console.error('Error starting random quiz:', error);
      alert('Failed to load random quiz. Please try again.');
    }
  };

  const getTimeForDifficulty = (difficulty) => {
    const times = {
      'easy': '10 min',
      'medium': '20 min',
      'hard': '30 min'
    };
    return times[difficulty] || '20 min';
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
          <p style={{ color: '#cbd5e1', fontSize: '1.125rem' }}>Loading categories...</p>
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
          transform: translateY(-8px);
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .category-card {
          animation: fadeIn 0.6s ease-out;
          cursor: pointer;
        }
        .pulse-bg { animation: pulse 4s ease-in-out infinite; }
        .pulse-bg-delay-1 { animation: pulse 4s ease-in-out infinite; animation-delay: 1.5s; }
        .pulse-bg-delay-2 { animation: pulse 4s ease-in-out infinite; animation-delay: 0.75s; }
        .difficulty-btn {
          transition: all 0.3s ease;
        }
        .difficulty-btn.active {
          background: linear-gradient(to right, #a855f7, #ec4899);
          color: white;
        }
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
          <div className="pulse-bg-delay-2" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '25rem', height: '25rem', backgroundColor: '#ec4899', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>
              Practice & <span style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Master</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '42rem', margin: '0 auto' }}>
              Choose a category and difficulty to start your learning journey
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <button
              onClick={handleRandomQuiz}
              className="glass-card hover-lift"
              style={{ padding: '2rem', borderRadius: '1.25rem', transition: 'all 0.3s ease', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', borderRadius: '1rem' }}>
                  <Shuffle style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>Random Quiz</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Challenge yourself</p>
                </div>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>Get a surprise quiz from any category and difficulty</p>
            </button>

            <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #f59e0b, #f97316)', borderRadius: '1rem' }}>
                  <Award style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>Daily Challenge</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Coming soon</p>
                </div>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', opacity: 0.7 }}>Complete daily challenges to earn bonus XP</p>
            </div>
          </div>

          {/* Categories Grid */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '2rem' }}>
              Choose a Category
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {categories.map((category, index) => {
                const Icon = getCategoryIcon(category.icon);
                const gradient = getCategoryGradient(index);
                const isSelected = selectedCategory?.name === category.name;

                return (
                  <div
                    key={category.name}
                    onClick={() => handleCategorySelect(category)}
                    className={`glass-card hover-lift category-card ${isSelected ? 'selected' : ''}`}
                    style={{
                      padding: '2rem',
                      borderRadius: '1.25rem',
                      transition: 'all 0.3s ease',
                      animationDelay: `${index * 0.1}s`,
                      border: isSelected ? `2px solid ${gradient.from}` : '1px solid rgba(168, 85, 247, 0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{ width: '0.75rem', height: '0.75rem', background: 'white', borderRadius: '50%' }} />
                      </div>
                    )}
                    
                    <div style={{
                      padding: '1.25rem',
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      borderRadius: '1rem',
                      width: 'fit-content',
                      marginBottom: '1.5rem'
                    }}>
                      <Icon style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                    </div>
                    
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                      {category.displayName}
                    </h3>
                    
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {category.totalQuestions} questions available
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: gradient.from,
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      <span>Select</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz Configuration Modal */}
          {showConfig && selectedCategory && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '2rem'
            }} onClick={() => setShowConfig(false)}>
              <div
                className="glass-card"
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  padding: '3rem',
                  borderRadius: '1.5rem',
                  animation: 'fadeIn 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>
                  Configure Your Quiz
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem' }}>
                  Selected: <span style={{ color: '#a855f7', fontWeight: '600' }}>{selectedCategory.displayName}</span>
                </p>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Select Difficulty
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {['easy', 'medium', 'hard'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`difficulty-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          background: selectedDifficulty === diff ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'rgba(255, 255, 255, 0.05)',
                          border: selectedDifficulty === diff ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.75rem',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        <div>{diff}</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
                          {getTimeForDifficulty(diff)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Target size={20} style={{ color: '#a855f7' }} />
                    <span style={{ color: 'white', fontSize: '0.875rem' }}>20 questions per quiz</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} style={{ color: '#a855f7' }} />
                    <span style={{ color: 'white', fontSize: '0.875rem' }}>
                      {getTimeForDifficulty(selectedDifficulty)} time limit
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setShowConfig(false)}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'linear-gradient(to right, #a855f7, #ec4899)',
                      border: 'none',
                      borderRadius: '0.75rem',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Play size={20} />
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Practice;
