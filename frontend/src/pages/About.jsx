import React from 'react';
import { Target, Eye, ShieldCheck, Milestone, Briefcase } from 'lucide-react';

export default function About() {
  return (
    <div className="animate-up">
      {/* 1. HERO SECTION */}
      <section className="section text-center" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Our Story</span>
          <h2 className="section-title">Pioneering Industry-Ready <span className="gradient-text">IT Education</span></h2>
          <p className="section-subtitle">Established with a vision to train, mentor, and place the next generation of engineers in leading organizations.</p>
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="card glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Target size={28} style={{ color: '#0ea5e9' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Our Mission</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                To provide high-quality, practical, and mentor-led IT training that aligns with the evolving tech industry, transforming aspiring candidates into skilled, industry-ready professionals.
              </p>
            </div>

            <div className="card glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <Eye size={28} style={{ color: '#6366f1' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Our Vision</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                To become the leading hub for technical education and job placement in South Asia, recognized for our innovative pedagogical model and success in student career transformations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HISTORY & MILESTONES */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderY: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 className="section-title"><span className="gradient-text">Milestones</span> of Growth</h2>
          <p className="section-subtitle">Our journey from a small training center in Kathmandu to a premier IT institute.</p>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--border-color)' }} className="timeline-line" />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
              {/* Milestone 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }} className="timeline-item">
                <div style={{ width: '45%', textAlign: 'right' }} className="timeline-content-left">
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>2022: Inception</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Started with a single classroom and 15 students in a basic web development course.</p>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-teal)', border: '4px solid var(--bg-secondary)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
                <div style={{ width: '45%' }} />
              </div>

              {/* Milestone 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }} className="timeline-item">
                <div style={{ width: '45%' }} />
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', border: '4px solid var(--bg-secondary)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
                <div style={{ width: '45%', textAlign: 'left' }} className="timeline-content-right">
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>2024: Corporate Partnership</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Formed collaborations with 20+ software companies in Nepal to facilitate direct placement.</p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }} className="timeline-item">
                <div style={{ width: '45%', textAlign: 'right' }} className="timeline-content-left">
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>2026: 5000+ Graduated</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Successfully certified over 5,000 students across 10 distinct IT training pathways.</p>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', border: '4px solid var(--bg-secondary)', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
                <div style={{ width: '45%' }} />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. TEAM INTRODUCTION */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Meet Our <span className="gradient-text">Lead Instructors</span></h2>
          <p className="section-subtitle">Learn from professionals who have designed systems for major international and local organizations.</p>

          <div className="grid-2">
            <div className="card glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                alt="Dr. Sandeep Koirala" 
                style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
              />
              <div style={{ flex: '1' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Dr. Sandeep Koirala</h4>
                <span className="badge badge-blue" style={{ margin: '0.25rem 0 0.75rem', fontSize: '0.75rem' }}>Full Stack & ML Mentor</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Ph.D. in Computer Science with over a decade of industrial experience. Specialized in enterprise architecture design.
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Achievements:</strong> Authored 3 books on Web Architecture. Certified Java Architect.
                </div>
              </div>
            </div>

            <div className="card glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" 
                alt="Neha Sharma" 
                style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-teal)' }}
              />
              <div style={{ flex: '1' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Neha Sharma</h4>
                <span className="badge badge-orange" style={{ margin: '0.25rem 0 0.75rem', fontSize: '0.75rem' }}>UI/UX & Graphics Specialist</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Senior designer having worked with global agency clients. Deep expertise in human-computer interaction (HCI).
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Achievements:</strong> Designed user experiences for 1M+ active user apps. Adobe Certified Expert.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PARTNERSHIPS & AFFILIATIONS */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', paddingBottom: '6rem' }}>
        <div className="container text-center">
          <h2 className="section-title">Our <span className="gradient-text">Affiliations</span> & Partnerships</h2>
          <p className="section-subtitle" style={{ marginBottom: '4rem' }}>Collaborating with global certification bodies and regional software organizations to guarantee student career placement.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={40} style={{ color: '#0ea5e9' }} />
              <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Microsoft</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authorized Learning Partner</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={40} style={{ color: '#6366f1' }} />
              <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Cisco</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Academy Support Member</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={40} style={{ color: '#10b981' }} />
              <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>RedHat</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Training Partner</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .timeline-line {
            left: 20px !important;
          }
          .timeline-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding-left: 40px;
          }
          .timeline-content-left, .timeline-content-right {
            width: 100% !important;
            text-align: left !important;
          }
          .timeline-item > div:nth-child(2) {
            left: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
