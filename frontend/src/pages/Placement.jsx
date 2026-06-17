import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Star, Building2, MapPin } from 'lucide-react';

export default function Placement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="animate-up">
      {/* 1. HERO BANNER */}
      <section className="section text-center" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Placement Assistance</span>
          <h2 className="section-title">Launch Your Career in the <span className="gradient-text">IT Sector</span></h2>
          <p className="section-subtitle">We don't just train; we actively connect graduates with leading technology partners across the nation.</p>
        </div>
      </section>

      {/* 2. PLACEMENT METRICS & PARTNERS */}
      <section className="section">
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '2.5rem' }}>Our Active Hiring Partners</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', opacity: 0.85 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <Building2 style={{ color: '#0ea5e9' }} />
              <strong style={{ color: 'var(--text-primary)' }}>F1Soft International</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <Building2 style={{ color: '#6366f1' }} />
              <strong style={{ color: 'var(--text-primary)' }}>Deerwalk Systems</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <Building2 style={{ color: '#10b981' }} />
              <strong style={{ color: 'var(--text-primary)' }}>LogPoint Nepal</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <Building2 style={{ color: '#f59e0b' }} />
              <strong style={{ color: 'var(--text-primary)' }}>TechCraft Solutions</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACTIVE JOB BOARD */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderY: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 className="section-title">Latest IT <span className="gradient-text">Job Openings</span></h2>
          <p className="section-subtitle">Exclusively curated openings from our networks. Fast-track your application today.</p>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : jobs.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No jobs listed currently. Check back soon!</p>
            </div>
          ) : (
            <div className="grid-2">
              {jobs.map(job => (
                <div key={job.id} className="card glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={12} /> Full Time</span>
                      <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>Deadline: {job.deadline}</span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{job.title}</h3>
                    <h5 style={{ color: 'var(--accent-teal)', fontWeight: '600', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Building2 size={16} /> {job.company}</h5>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{job.description}</p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      <strong>Requirements:</strong> {job.requirements}
                    </div>
                  </div>

                  <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>
                    Apply For Role
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. ALUMNI SUCCESS STORIES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Alumni <span className="gradient-text">Success Stories</span></h2>
          <p className="section-subtitle">Real students. Real transformations. See where a Sipalaya InfoTech certification can lead.</p>

          <div className="grid-3">
            <div className="card text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                alt="Aayush" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', display: 'block', margin: '0 auto 1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Aayush Shrestha</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Associate Dev, Deerwalk</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                "The MERN Stack course pushed my bounds. The instructors are software engineers who taught us code reviews and architecture patterns. Got hired immediately after final project display."
              </p>
            </div>

            <div className="card text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" 
                alt="Karuna" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-teal)', display: 'block', margin: '0 auto 1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Karuna Thapa</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Frontend Eng, LogPoint</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                "As a CS student, I lacked practical web application deployment expertise. Sipalaya InfoTech's bootcamp filled exactly those holes. The career support team helped polish my resume."
              </p>
            </div>

            <div className="card text-center">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" 
                alt="Manish" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-green)', display: 'block', margin: '0 auto 1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Manish Basnet</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>UI/UX Lead, TechCraft</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                "Enrolled for design training. Learned mockup design, interactions, and customer heuristics. The portfolio reviews were incredibly constructive and key to landing my job."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
