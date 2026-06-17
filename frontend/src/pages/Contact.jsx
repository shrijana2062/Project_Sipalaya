import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, purpose, message })
      });
      if (response.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert("Submission failed. Try again.");
      }
    } catch (err) {
      alert("Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section animate-up">
      <h2 className="section-title">Get In Touch With <span className="gradient-text">Our Team</span></h2>
      <p className="section-subtitle">Have questions about courses, pricing, or schedules? Submit an inquiry and our team will reply shortly.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', marginTop: '1rem' }} className="contact-grid">
        
        {/* Left Column: Details & Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <MapPin size={24} style={{ color: '#0ea5e9', minWidth: '24px' }} />
            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Physical Address</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Level 3, Koirala Complex, Putalisadak, Kathmandu</p>
            </div>
          </div>

          <div className="card glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Phone size={24} style={{ color: '#6366f1', minWidth: '24px' }} />
            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Phone Numbers</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+977-1-4433221, +977-9841234567</p>
            </div>
          </div>

          <div className="card glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Mail size={24} style={{ color: '#10b981', minWidth: '24px' }} />
            <div>
              <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Email Address</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>admissions@srijanait.edu.np, info@srijanait.com</p>
            </div>
          </div>

          {/* Styled Google Map Mockup */}
          <div style={{
            position: 'relative',
            height: '220px',
            backgroundColor: '#1e293b',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: "radial-gradient(circle, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)"
          }}>
            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <MapPin size={32} style={{ color: 'var(--accent-red)', animation: 'pulse 2s infinite' }} />
              <h5 style={{ fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.5rem' }}>Putalisadak, Kathmandu</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location map mockup</p>
            </div>
            {/* Grid overlay to look like a map */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              opacity: 0.7
            }} />
          </div>

        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div>
          <div className="card glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Send Us an Inquiry</h3>
            
            {success ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--accent-green)', marginBottom: '1rem', display: 'inline-block' }} />
                <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.5rem' }}>Inquiry Submitted!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Thank you. Our admissions counselor will contact you back within 24 working hours.</p>
                <button onClick={() => setSuccess(false)} className="btn btn-secondary btn-sm">Submit another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Rohan Adhikari" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Inquiry Purpose</label>
                  <select className="form-control" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                    <option value="Course Inquiry">Course Inquiry</option>
                    <option value="Schedule Demo">Schedule Demo</option>
                    <option value="Placement Service">Placement Service</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Tell us what you want to learn..." 
                    required 
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', gap: '0.5rem' }}>
                  <Send size={16} />
                  <span>{loading ? "Sending..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
