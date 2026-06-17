import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeSwitcher from './components/ThemeSwitcher';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Admission from './pages/Admission';
import Placement from './pages/Placement';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';

// Portals
import StudentPortal from './portals/StudentPortal';
import InstructorPortal from './portals/InstructorPortal';
import AdminPortal from './portals/AdminPortal';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary, #0b0f19)' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.08)', borderTopColor: 'var(--accent-primary, #6366f1)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <ThemeSwitcher />
      
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/admission" element={<Admission user={user} />} />
          <Route path="/placement" element={<Placement />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Portals */}
          <Route 
            path="/student" 
            element={user && user.role === 'student' ? <StudentPortal user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/instructor" 
            element={user && user.role === 'instructor' ? <InstructorPortal user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin" 
            element={user && user.role === 'admin' ? <AdminPortal user={user} /> : <Navigate to="/" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
