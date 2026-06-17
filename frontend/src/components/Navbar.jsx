import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Menu, X, Eye, EyeOff, KeyRound, ShieldAlert, Mail, Lock } from 'lucide-react';

export default function Navbar({ user, onLogin, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleQuickLogin = (role) => {
    if (role === 'student') {
      setEmail('rohan@gmail.com');
      setPassword('password123');
    } else if (role === 'instructor') {
      setEmail('sandeep@it-tms.com');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@it-tms.com');
      setPassword('adminpassword');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
        setShowLoginModal(false);
        setEmail('');
        setPassword('');
        // Redirect to appropriate portal
        if (data.role === 'admin') navigate('/admin');
        else if (data.role === 'instructor') navigate('/instructor');
        else navigate('/student');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError('Could not connect to server. Ensure backend is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const triggerLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container navbar">
          <Link to="/" className="logo" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={26} style={{ color: 'var(--accent-teal)' }} />
              <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Sipalaya <span style={{ color: 'var(--accent-primary)' }}>InfoTech</span>
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.08em', color: 'var(--text-muted)', paddingLeft: '2.1rem', textTransform: 'uppercase' }}>
              Training &amp; Placement Partner
            </span>
          </Link>

          {/* Desktop Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ul className="nav-links" style={{ display: isOpen ? 'flex' : 'none' || 'flex' }}>
              <li><Link to="/courses" className={isActive('/courses')}>Courses</Link></li>
              <li><Link to="/placement" className={isActive('/placement')}>Career / Placement</Link></li>
              <li><Link to="/about" className={isActive('/about')}>About Us</Link></li>
              <li><Link to="/reviews" className={isActive('/reviews')}>Reviews</Link></li>
              <li><Link to="/blog" className={isActive('/blog')}>Blog</Link></li>
              <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Link to={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/student'} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={16} />
                    <span>Dashboard ({user.name.split(' ')[0]})</span>
                  </Link>
                  <button onClick={triggerLogout} className="btn btn-outline btn-sm" style={{ padding: '0.4rem', borderRadius: '50%' }} title="Logout">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="btn btn-primary btn-sm">
                  Login Portal
                </button>
              )}

              {/* Mobile menu toggle */}
              <button className="btn btn-secondary mobile-menu-btn" style={{ display: 'none', padding: '0.5rem' }} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>

        {/* CSS stylesheet rule for mobile-menu-btn, list visibility and modal backdrop */}
        <style>{`
          @media (max-width: 900px) {
            .nav-links {
              display: ${isOpen ? 'flex' : 'none'} !important;
              flex-direction: column;
              position: absolute;
              top: 80px;
              left: 0;
              width: 100%;
              background: var(--bg-secondary);
              border-bottom: 1px solid var(--border-color);
              padding: 1.5rem;
              gap: 1rem;
              box-shadow: var(--shadow-lg);
            }
            .mobile-menu-btn {
              display: inline-flex !important;
            }
          }
          @keyframes login-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
          }
          .shake-error {
            animation: login-shake 0.3s ease-in-out;
          }
          .demo-autofill-btn {
            flex: 1;
            padding: 0.6rem 0.25rem;
            font-size: 0.75rem;
            border-color: var(--border-color);
            background: rgba(255, 255, 255, 0.02);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            color: var(--text-secondary);
          }
          .demo-autofill-btn:hover {
            color: white;
            transform: translateY(-1px);
          }
          .demo-autofill-btn.student:hover {
            background: rgba(16, 185, 129, 0.08);
            border-color: rgba(16, 185, 129, 0.4);
          }
          .demo-autofill-btn.instructor:hover {
            background: rgba(14, 165, 233, 0.08);
            border-color: rgba(14, 165, 233, 0.4);
          }
          .demo-autofill-btn.admin:hover {
            background: rgba(99, 102, 241, 0.08);
            border-color: rgba(99, 102, 241, 0.4);
          }
          .modal-close-btn {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
          }
          .modal-close-btn:hover {
            color: white !important;
            background: rgba(255, 255, 255, 0.08);
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(11, 15, 25, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            animation: fadeIn 0.25s ease-out forwards;
          }
        `}</style>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          onClick={() => { setShowLoginModal(false); setLoginError(''); setShowPassword(false); }}
          className="modal-backdrop"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`glass-card animate-up ${loginError ? 'shake-error' : ''}`} 
            style={{ 
              width: 'calc(100% - 2rem)', 
              maxWidth: '420px', 
              position: 'relative', 
              padding: '2.5rem', 
              margin: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            <button 
              onClick={() => { setShowLoginModal(false); setLoginError(''); setShowPassword(false); }} 
              className="modal-close-btn"
            >
              <X size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                <KeyRound size={22} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'white', margin: 0 }}>
                Portal Sign In
              </h3>
            </div>
            
            {loginError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <ShieldAlert size={16} style={{ minWidth: '16px' }} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="e.g. rohan@gmail.com" 
                    style={{ paddingLeft: '2.75rem' }}
                    required 
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.25rem'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }} disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                    Authenticating...
                  </>
                ) : "Sign In to Dashboard"}
              </button>
            </form>

            <div style={{ marginTop: '1.75rem', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Autofill Demo Roles:</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => handleQuickLogin('student')}
                  className="btn demo-autofill-btn student"
                >
                  Student
                </button>
                <button 
                  type="button" 
                  onClick={() => handleQuickLogin('instructor')}
                  className="btn demo-autofill-btn instructor"
                >
                  Instructor
                </button>
                <button 
                  type="button" 
                  onClick={() => handleQuickLogin('admin')}
                  className="btn demo-autofill-btn admin"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
