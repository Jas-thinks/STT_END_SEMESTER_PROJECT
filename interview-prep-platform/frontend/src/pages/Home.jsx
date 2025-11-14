import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, TrendingUp, Code, Clock, Trophy, BookOpen, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import api from '../services/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [questionCount, setQuestionCount] = useState('1000+');
  const [topicCount, setTopicCount] = useState('50+');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/quiz/categories');
      if (response.data && response.data.data) {
        const categories = response.data.data;
        
        // Calculate total questions across all categories and difficulties
        let total = 0;
        categories.forEach(cat => {
          if (cat.difficulties) {
            cat.difficulties.forEach(diff => {
              total += diff.count || 0;
            });
          }
        });
        
        // Format the count
        if (total > 0) {
          setQuestionCount(total.toLocaleString());
        }
        
        // Count unique topics (approximate based on categories)
        const topicEstimate = categories.length * 5; // Rough estimate
        setTopicCount(`${topicEstimate}+`);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values
    }
  };

  const particles = [];
  for (let i = 0; i < 15; i++) {
    particles.push({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      delay: Math.random() * 3 + 's',
      duration: 4 + Math.random() * 6 + 's',
    });
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .floating-particle { animation: float ease-in-out infinite; }
        .pulse-bg { animation: pulse 4s ease-in-out infinite; }
        .pulse-bg-delay-1 { animation: pulse 4s ease-in-out infinite; animation-delay: 1.5s; }
        .pulse-bg-delay-2 { animation: pulse 4s ease-in-out infinite; animation-delay: 0.75s; }
        .animate-slide-up { animation: slideInUp 0.8s ease-out; }
        .animate-fade { animation: fadeIn 1s ease-out; }
        .hover-lift:hover { transform: translateY(-8px); }
        .glass-card {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(168, 85, 247, 0.2);
        }
      `}</style>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="pulse-bg" style={{ position: 'absolute', top: '-15rem', right: '-15rem', width: '30rem', height: '30rem', backgroundColor: '#a855f7', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)' }} />
          <div className="pulse-bg-delay-1" style={{ position: 'absolute', bottom: '-15rem', left: '-15rem', width: '30rem', height: '30rem', backgroundColor: '#3b82f6', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)' }} />
          <div className="pulse-bg-delay-2" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '25rem', height: '25rem', backgroundColor: '#ec4899', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)' }} />
        </div>

        {/* Floating Particles */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {particles.map((particle) => (
            <div key={particle.id} className="floating-particle" style={{ position: 'absolute', width: '3px', height: '3px', backgroundColor: 'white', borderRadius: '50%', opacity: 0.4, left: particle.left, top: particle.top, animationDelay: particle.delay, animationDuration: particle.duration }} />
          ))}
        </div>

        {/* Hero Section */}
        <div style={{ position: 'relative', zIndex: 10, paddingTop: '6rem', paddingBottom: '8rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center' }} className="animate-fade">
              
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '9999px', marginBottom: '3rem' }}>
                <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: '#c084fc' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e9d5ff' }}>#1 Interview Prep Platform</span>
              </div>

              {/* Main Heading */}
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '2rem' }} className="animate-slide-up">
                <span style={{ display: 'block', color: 'white', marginBottom: '1rem' }}>Master Your</span>
                <span style={{ display: 'block', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Interview Skills</span>
              </h1>
              
              <p style={{ maxWidth: '42rem', margin: '0 auto', fontSize: '1.25rem', color: '#cbd5e1', lineHeight: '1.8', marginBottom: '3rem' }} className="animate-slide-up">
                Practice coding questions, take quizzes, and track your progress with our comprehensive interview preparation platform.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '5rem' }} className="animate-slide-up">
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: 'linear-gradient(to right, #a855f7, #ec4899)', border: 'none', borderRadius: '0.75rem', color: 'white', fontSize: '1rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 10px 40px -10px rgba(168, 85, 247, 0.5)' }} className="hover-lift">
                        Go to Dashboard
                        <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                      </Link>
                      <Link to="/practice" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', color: 'white', fontSize: '1rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }} className="hover-lift">
                        Start Practicing
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: 'linear-gradient(to right, #a855f7, #ec4899)', border: 'none', borderRadius: '0.75rem', color: 'white', fontSize: '1rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 10px 40px -10px rgba(168, 85, 247, 0.5)' }} className="hover-lift">
                        Get Started Free
                        <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                      </Link>
                      <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.75rem', color: 'white', fontSize: '1rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }} className="hover-lift">
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '3rem', maxWidth: '56rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{questionCount}</div>
                  <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '0.5rem' }}>Questions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{topicCount}</div>
                  <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '0.5rem' }}>Topics</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '800', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>10k+</div>
                  <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '0.5rem' }}>Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ position: 'relative', zIndex: 10, paddingTop: '6rem', paddingBottom: '6rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', color: 'white', marginBottom: '1.5rem' }}>
                Everything You Need to <span style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Succeed</span>
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#cbd5e1', maxWidth: '42rem', margin: '0 auto' }}>
                Comprehensive tools and resources to ace your interviews
              </p>
            </div>

            {/* Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2.5rem' }}>
              
              {/* Feature 1 */}
              <div className="glass-card hover-lift" style={{ padding: '2.5rem', borderRadius: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                  <Code style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Practice Quizzes</h3>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.7' }}>
                  Test your knowledge with hundreds of curated questions across DSA, DBMS, OS, and more topics.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card hover-lift" style={{ padding: '2.5rem', borderRadius: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #a855f7, #9333ea)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                  <TrendingUp style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Track Progress</h3>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.7' }}>
                  Monitor your performance with detailed analytics and identify areas for improvement.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card hover-lift" style={{ padding: '2.5rem', borderRadius: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #ec4899, #db2777)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                  <Sparkles style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>AI Chatbot</h3>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.7' }}>
                  Get instant help and explanations from our AI-powered chatbot available 24/7.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-card hover-lift" style={{ padding: '2.5rem', borderRadius: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                  <Clock style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Timed Tests</h3>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.7' }}>
                  Practice under real interview conditions with timed tests to improve your speed.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="glass-card hover-lift" style={{ padding: '2.5rem', borderRadius: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                  <Trophy style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Leaderboard</h3>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.7' }}>
                  Compete with peers and see where you stand on our global leaderboard.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="glass-card hover-lift" style={{ padding: '2.5rem', borderRadius: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                  <BookOpen style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Multiple Topics</h3>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.7' }}>
                  Cover all essential topics from Data Structures to System Design and ML.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div style={{ position: 'relative', zIndex: 10, paddingTop: '4rem', paddingBottom: '8rem' }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
              <div className="glass-card" style={{ padding: '4rem 3rem', borderRadius: '2rem' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', color: 'white', marginBottom: '1.5rem' }}>
                  Ready to Ace Your Interview?
                </h2>
                <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '2.5rem', maxWidth: '42rem', margin: '0 auto 2.5rem' }}>
                  Join thousands of students preparing for their dream jobs
                </p>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 3rem', background: 'linear-gradient(to right, #a855f7, #ec4899)', border: 'none', borderRadius: '0.75rem', color: 'white', fontSize: '1.125rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 10px 40px -10px rgba(168, 85, 247, 0.5)' }} className="hover-lift">
                  Start Learning for Free
                  <ArrowRight style={{ width: '1.5rem', height: '1.5rem' }} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

