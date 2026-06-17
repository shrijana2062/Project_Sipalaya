import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Linkedin, Instagram, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          <div>
            <div style={{ marginBottom: '0.25rem' }}>
              <div className="logo" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen style={{ color: 'var(--accent-teal)' }} />
                  <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Sipalaya <span style={{ color: 'var(--accent-primary)' }}>InfoTech</span></span>
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: '600', letterSpacing: '0.08em', color: 'var(--text-muted)', paddingLeft: '1.75rem', textTransform: 'uppercase' }}>Training &amp; Placement Partner</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Empowering Nepal's next-generation IT professionals with industry-aligned skills. Join our expert-led batches to launch and grow your tech career.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}><Facebook size={18} /></a>
              <a href="#" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}><Linkedin size={18} /></a>
              <a href="#" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}><Instagram size={18} /></a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/courses" style={{ hover: { color: 'white' } }}>All Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/admission">Admission Process</Link></li>
              <li><Link to="/placement">Job Placements</Link></li>
              <li><Link to="/blog">Industry Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Popular Courses</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/courses">Full-Stack Web (MERN)</Link></li>
              <li><Link to="/courses">Python & Machine Learning</Link></li>
              <li><Link to="/courses">UI/UX Design & Graphic Art</Link></li>
              <li><Link to="/courses">Data Science & Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Newsletter</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Stay updated with new batch launches, tech events, and discount alerts.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email address" className="form-control" style={{ fontSize: '0.85rem' }} />
              <button className="btn btn-primary" style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-md)' }}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <p>© 2026 Sipalaya InfoTech Pvt. Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
