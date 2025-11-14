import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { authAPI } from '../services/apiService.js';
import '../style.css';
import './Home.css';

const Home = () => {
  const history = useHistory();
  const isAuthenticated = authAPI.isAuthenticated();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      history.push('/dashboard');
    } else {
      history.push('/register');
    }
  };

  const features = [
    {
      icon: '📚',
      title: 'Comprehensive Question Bank',
      description: 'Access thousands of interview questions across multiple domains including DSA, System Design, DBMS, and more.',
    },
    {
      icon: '🎯',
      title: 'Practice by Category',
      description: 'Choose from various categories and difficulty levels to focus on your weak areas and improve systematically.',
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics, visualizations, and insights into your performance over time.',
    },
    {
      icon: '🏆',
      title: 'Leaderboard & Gamification',
      description: 'Compete with peers, earn badges, and climb the leaderboard to stay motivated throughout your preparation.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Chatbot',
      description: 'Get instant help with our AI assistant that can answer your queries and provide explanations.',
    },
    {
      icon: '⏱️',
      title: 'Timed Quizzes',
      description: 'Simulate real interview conditions with timed quizzes and improve your time management skills.',
    },
  ];

  const categories = [
    { name: 'Data Structures & Algorithms', count: '500+ Questions', color: '#6366f1' },
    { name: 'System Design', count: '100+ Questions', color: '#10b981' },
    { name: 'Database Management', count: '200+ Questions', color: '#f59e0b' },
    { name: 'Operating Systems', count: '150+ Questions', color: '#ef4444' },
    { name: 'Networks', count: '120+ Questions', color: '#8b5cf6' },
    { name: 'Machine Learning', count: '180+ Questions', color: '#ec4899' },
  ];

  const testimonials = [
    {
      name: 'Rahul Kumar',
      role: 'Software Engineer @ Google',
      image: '👨‍💻',
      text: 'This platform helped me crack my dream job at Google. The comprehensive question bank and analytics were game-changers!',
    },
    {
      name: 'Priya Sharma',
      role: 'Full Stack Developer @ Microsoft',
      image: '👩‍💻',
      text: 'The best interview preparation platform out there. The AI chatbot feature is incredibly helpful for clearing doubts.',
    },
    {
      name: 'Arjun Patel',
      role: 'Data Scientist @ Amazon',
      image: '👨‍🔬',
      text: 'I improved my problem-solving skills significantly. The timed quizzes really helped me manage time during actual interviews.',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Ace Your Next <span className="gradient-text">Technical Interview</span>
            </h1>
            <p className="hero-subtitle">
              Practice with thousands of curated interview questions, track your progress with advanced analytics,
              and land your dream job with confidence.
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </button>
              <Link to="/practice" className="btn btn-outline btn-lg">
                Explore Questions
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Questions</p>
              </div>
              <div className="stat-item">
                <h3>50K+</h3>
                <p>Users</p>
              </div>
              <div className="stat-item">
                <h3>95%</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-4">
        <div className="container">
          <div className="section-header text-center">
            <h2>Why Choose Our Platform?</h2>
            <p className="text-muted">Everything you need to prepare for technical interviews</p>
          </div>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-4">
        <div className="container">
          <div className="section-header text-center">
            <h2>Explore Categories</h2>
            <p className="text-muted">Practice questions from various technical domains</p>
          </div>
          <div className="grid grid-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-card card"
                style={{ borderTop: `4px solid ${category.color}` }}
              >
                <h3>{category.name}</h3>
                <p className="text-muted">{category.count}</p>
                <Link to={`/practice?category=${category.name.toLowerCase()}`} className="btn btn-sm btn-outline">
                  Start Practicing →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-4">
        <div className="container">
          <div className="section-header text-center">
            <h2>Success Stories</h2>
            <p className="text-muted">Hear from our users who landed their dream jobs</p>
          </div>
          <div className="grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card card">
                <div className="testimonial-icon">{testimonial.image}</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p className="text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-4">
        <div className="container">
          <div className="cta-card card text-center">
            <h2>Ready to Start Your Journey?</h2>
            <p className="text-muted mb-3">
              Join thousands of successful candidates who prepared with our platform
            </p>
            <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
              {isAuthenticated ? 'Continue Learning' : 'Sign Up Now - It\'s Free!'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
