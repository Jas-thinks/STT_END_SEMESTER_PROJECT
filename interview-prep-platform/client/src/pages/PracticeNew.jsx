import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { quizAPI } from '../services/apiService';
import '../style.css';
import './Practice.css';

const Practice = () => {
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      icon: '🧮',
      description: 'Arrays, Strings, Trees, Graphs, Dynamic Programming',
      color: '#6366f1',
      count: 500,
    },
    {
      id: 'system-design',
      name: 'System Design',
      icon: '🏗️',
      description: 'Scalability, Load Balancing, Databases, Caching',
      color: '#10b981',
      count: 100,
    },
    {
      id: 'dbms',
      name: 'Database Management',
      icon: '🗄️',
      description: 'SQL, NoSQL, Normalization, Transactions',
      color: '#f59e0b',
      count: 200,
    },
    {
      id: 'os',
      name: 'Operating Systems',
      icon: '💻',
      description: 'Processes, Threads, Memory Management, Scheduling',
      color: '#ef4444',
      count: 150,
    },
    {
      id: 'networks',
      name: 'Computer Networks',
      icon: '🌐',
      description: 'TCP/IP, HTTP, DNS, Security, Protocols',
      color: '#8b5cf6',
      count: 120,
    },
    {
      id: 'ml',
      name: 'Machine Learning',
      icon: '🤖',
      description: 'Algorithms, Neural Networks, Deep Learning',
      color: '#ec4899',
      count: 180,
    },
    {
      id: 'aptitude',
      name: 'Aptitude',
      icon: '🧠',
      description: 'Logical Reasoning, Quantitative Ability',
      color: '#14b8a6',
      count: 250,
    },
    {
      id: 'gen-ai',
      name: 'Generative AI',
      icon: '✨',
      description: 'LLMs, Transformers, Prompt Engineering',
      color: '#f97316',
      count: 80,
    },
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', icon: '🟢', description: 'Perfect for beginners' },
    { id: 'medium', name: 'Medium', icon: '🟡', description: 'Intermediate level' },
    { id: 'hard', name: 'Hard', icon: '🔴', description: 'Advanced concepts' },
  ];

  const handleStartQuiz = async () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Navigate to quiz page with selected parameters
      const params = new URLSearchParams({
        category: selectedCategory,
        difficulty: selectedDifficulty || 'all',
      });
      history.push(`/quiz?${params.toString()}`);
    } catch (err) {
      setError('Failed to start quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="practice-page">
      <div className="page-wrapper">
        <div className="container">
          {/* Header */}
          <div className="page-header text-center fade-in">
            <h1 className="page-title">Practice Questions</h1>
            <p className="page-subtitle">
              Choose a category and difficulty level to start practicing
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Category Selection */}
          <div className="practice-section">
            <h2 className="section-title">
              <span className="step-number">1</span>
              Select Category
            </h2>
            <div className="grid grid-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-item card ${
                    selectedCategory === category.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ borderTopColor: category.color }}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <p className="text-muted">{category.description}</p>
                  <div className="category-count">
                    <span className="badge badge-primary">{category.count} Questions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="practice-section">
            <h2 className="section-title">
              <span className="step-number">2</span>
              Select Difficulty <span className="optional-text">(Optional)</span>
            </h2>
            <div className="grid grid-3">
              {difficulties.map((difficulty) => (
                <div
                  key={difficulty.id}
                  className={`difficulty-item card ${
                    selectedDifficulty === difficulty.id ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setSelectedDifficulty(
                      selectedDifficulty === difficulty.id ? null : difficulty.id
                    )
                  }
                >
                  <div className="difficulty-icon">{difficulty.icon}</div>
                  <h3>{difficulty.name}</h3>
                  <p className="text-muted">{difficulty.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Configuration Summary */}
          {selectedCategory && (
            <div className="quiz-summary card fade-in">
              <h3>Quiz Configuration</h3>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="summary-label">Category:</span>
                  <span className="summary-value">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Difficulty:</span>
                  <span className="summary-value">
                    {selectedDifficulty
                      ? difficulties.find((d) => d.id === selectedDifficulty)?.name
                      : 'All Levels'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Questions:</span>
                  <span className="summary-value">10</span>
                </div>
              </div>
              <button
                onClick={handleStartQuiz}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.5rem' }}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex-center gap-2">
                    <div className="spinner-small-white"></div>
                    Loading Quiz...
                  </div>
                ) : (
                  'Start Quiz →'
                )}
              </button>
            </div>
          )}

          {/* Recent Activity */}
          <div className="practice-section">
            <h2 className="section-title">Continue Where You Left Off</h2>
            <div className="recent-activity">
              <div className="activity-card card">
                <div className="activity-icon" style={{ background: '#6366f1' }}>
                  🧮
                </div>
                <div className="activity-info">
                  <h4>Data Structures & Algorithms</h4>
                  <p className="text-muted">Medium • 7/10 completed</p>
                </div>
                <div className="activity-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '70%' }}></div>
                  </div>
                  <span className="progress-text">70%</span>
                </div>
              </div>

              <div className="activity-card card">
                <div className="activity-icon" style={{ background: '#10b981' }}>
                  🏗️
                </div>
                <div className="activity-info">
                  <h4>System Design</h4>
                  <p className="text-muted">Hard • 3/10 completed</p>
                </div>
                <div className="activity-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '30%' }}></div>
                  </div>
                  <span className="progress-text">30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
