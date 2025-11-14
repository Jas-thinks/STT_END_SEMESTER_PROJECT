import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight, Github, Chrome, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      // You might want to handle this with your error system
      alert('Passwords do not match!');
      return;
    }

    if (!formData.acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    try {
      await register({ 
        name: formData.name,
        email: formData.email, 
        password: formData.password 
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const particles = [];
  for (let i = 0; i < 20; i++) {
    particles.push({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      delay: Math.random() * 2 + 's',
      duration: 3 + Math.random() * 4 + 's',
    });
  }

  return (
    <>
      <style>{`
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(2rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .floating-particle { animation: float 3s ease-in-out infinite; }
        .pulse-bg { animation: pulse 3s ease-in-out infinite; }
        .pulse-bg-delay-1 { animation: pulse 3s ease-in-out infinite; animation-delay: 1s; }
        .pulse-bg-delay-2 { animation: pulse 3s ease-in-out infinite; animation-delay: 0.5s; }
        .hover-scale:hover { transform: scale(1.05); }
        .hover-scale-110:hover { transform: scale(1.1); }
        .group:hover .group-hover-translate { transform: translateX(0.25rem); }
        .social-button:hover { background-color: rgba(71, 85, 105, 0.5); color: white; transform: scale(1.05); }
        .main-button:hover:not(:disabled) { background: linear-gradient(to right, #9333ea, #db2777); transform: scale(1.05); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25); }
        .checkbox-container { display: flex; align-items: center; gap: 0.5rem; }
        .custom-checkbox {
          width: 1rem; height: 1rem; border: 1px solid #475569; border-radius: 0.25rem;
          background-color: rgba(51, 65, 85, 0.5); cursor: pointer; transition: all 0.3s ease; position: relative;
        }
        .custom-checkbox:hover { border-color: #a855f7; }
        .custom-checkbox.checked { background-color: #a855f7; border-color: #a855f7; }
        .custom-checkbox.checked::after {
          content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          color: white; font-size: 0.75rem; font-weight: bold;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="pulse-bg" style={{ position: 'absolute', top: '-10rem', right: '-10rem', width: '20rem', height: '20rem', backgroundColor: '#a855f7', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(4rem)', opacity: 0.2 }} />
          <div className="pulse-bg-delay-1" style={{ position: 'absolute', bottom: '-10rem', left: '-10rem', width: '20rem', height: '20rem', backgroundColor: '#3b82f6', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(4rem)', opacity: 0.2 }} />
          <div className="pulse-bg-delay-2" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20rem', height: '20rem', backgroundColor: '#ec4899', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(4rem)', opacity: 0.1 }} />
        </div>

        <div style={{ position: 'absolute', inset: 0 }}>
          {particles.map((particle) => (
            <div key={particle.id} className="floating-particle" style={{ position: 'absolute', width: '4px', height: '4px', backgroundColor: 'white', borderRadius: '50%', opacity: 0.3, left: particle.left, top: particle.top, animationDelay: particle.delay, animationDuration: particle.duration }} />
          ))}
        </div>

        <div style={{ width: '100%', maxWidth: '28rem', backgroundColor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative', zIndex: 10, animation: 'slideInFromBottom 1s ease-out', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="hover-scale-110" style={{ width: '3rem', height: '3rem', background: 'linear-gradient(to right, #a855f7, #ec4899)', borderRadius: '0.75rem', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease' }}>
              <UserPlus style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '0 0 0.5rem 0' }}>Create Account</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Join us to start your journey</p>
          </div>

          {authError && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', color: '#ef4444' }} />
              <span style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{authError}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button className="social-button hover-scale" style={{ flex: 1, padding: '0.75rem', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid #475569', borderRadius: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Github style={{ width: '1rem', height: '1rem' }} />
              GitHub
            </button>
            <button className="social-button hover-scale" style={{ flex: 1, padding: '0.75rem', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid #475569', borderRadius: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Chrome style={{ width: '1rem', height: '1rem' }} />
              Google
            </button>
          </div>

          <div style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#475569' }} />
            <span style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '0 0.5rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Or continue with</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#475569' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Name Field */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', color: focusedField === 'name' ? '#c084fc' : '#94a3b8', marginBottom: '0.5rem', transition: 'color 0.2s ease' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: focusedField === 'name' ? '#c084fc' : '#94a3b8', transition: 'color 0.2s ease' }} />
                <input id="name" type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder="John Doe" style={{ width: '100%', padding: '0.75rem', paddingLeft: '2.5rem', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: focusedField === 'name' ? '1px solid #a855f7' : '1px solid #475569', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none', transition: 'all 0.3s ease', boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(168, 85, 247, 0.1)' : 'none' }} required />
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: 'linear-gradient(to right, #a855f7, #ec4899)', transition: 'width 0.3s ease', width: focusedField === 'name' ? '100%' : '0%' }} />
              </div>
            </div>

            {/* Email Field */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', color: focusedField === 'email' ? '#c084fc' : '#94a3b8', marginBottom: '0.5rem', transition: 'color 0.2s ease' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: focusedField === 'email' ? '#c084fc' : '#94a3b8', transition: 'color 0.2s ease' }} />
                <input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="john@example.com" style={{ width: '100%', padding: '0.75rem', paddingLeft: '2.5rem', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: focusedField === 'email' ? '1px solid #a855f7' : '1px solid #475569', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none', transition: 'all 0.3s ease', boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(168, 85, 247, 0.1)' : 'none' }} required />
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: 'linear-gradient(to right, #a855f7, #ec4899)', transition: 'width 0.3s ease', width: focusedField === 'email' ? '100%' : '0%' }} />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', color: focusedField === 'password' ? '#c084fc' : '#94a3b8', marginBottom: '0.5rem', transition: 'color 0.2s ease' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: focusedField === 'password' ? '#c084fc' : '#94a3b8', transition: 'color 0.2s ease' }} />
                <input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: focusedField === 'password' ? '1px solid #a855f7' : '1px solid #475569', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none', transition: 'all 0.3s ease', boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(168, 85, 247, 0.1)' : 'none' }} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'white')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  {showPassword ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                </button>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: 'linear-gradient(to right, #a855f7, #ec4899)', transition: 'width 0.3s ease', width: focusedField === 'password' ? '100%' : '0%' }} />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div style={{ position: 'relative' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', color: focusedField === 'confirmPassword' ? '#c084fc' : '#94a3b8', marginBottom: '0.5rem', transition: 'color 0.2s ease' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: focusedField === 'confirmPassword' ? '#c084fc' : '#94a3b8', transition: 'color 0.2s ease' }} />
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', paddingLeft: '2.5rem', paddingRight: '2.5rem', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: focusedField === 'confirmPassword' ? '1px solid #a855f7' : '1px solid #475569', borderRadius: '0.5rem', color: 'white', fontSize: '0.875rem', outline: 'none', transition: 'all 0.3s ease', boxShadow: focusedField === 'confirmPassword' ? '0 0 0 3px rgba(168, 85, 247, 0.1)' : 'none' }} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'white')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  {showConfirmPassword ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                </button>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: 'linear-gradient(to right, #a855f7, #ec4899)', transition: 'width 0.3s ease', width: focusedField === 'confirmPassword' ? '100%' : '0%' }} />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="checkbox-container">
              <div className={formData.acceptedTerms ? 'custom-checkbox checked' : 'custom-checkbox'} onClick={() => handleInputChange('acceptedTerms', !formData.acceptedTerms)} />
              <label style={{ fontSize: '0.875rem', color: '#94a3b8', cursor: 'pointer' }} onClick={() => handleInputChange('acceptedTerms', !formData.acceptedTerms)}>
                I accept the <span style={{ color: '#c084fc' }}>terms and conditions</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="main-button group" style={{ width: '100%', padding: '0.75rem 1rem', background: 'linear-gradient(to right, #a855f7, #ec4899)', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: '600', fontSize: '0.875rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="group-hover-translate" style={{ width: '1rem', height: '1rem', transition: 'transform 0.2s ease' }} />}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#d8b4fe')} onMouseLeave={(e) => (e.currentTarget.style.color = '#c084fc')}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
