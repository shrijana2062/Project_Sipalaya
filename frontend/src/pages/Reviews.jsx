import React, { useState, useEffect } from 'react';
import { Star, Video, Play, MessageSquare, Award, Users, CheckCircle } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      const data = await response.json();
      if (response.ok) {
        setReviews(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) : "5.0";

  // Counts of star ratings
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (ratingBreakdown[r.rating] !== undefined) {
      ratingBreakdown[r.rating]++;
    }
  });

  return (
    <div className="container section animate-up">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>Student Reviews & Feedback</span>
        <h2 className="section-title">What Our Students <span className="gradient-text">Say About Us</span></h2>
        <p className="section-subtitle">Real feedback from graduates who transitioned into software engineering roles at top firms.</p>
      </div>

      {/* Stats Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', marginBottom: '4rem' }} className="reviews-summary-layout">
        {/* Rating Breakdown card */}
        <div className="card glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '3.5rem', fontWeight: '800', margin: 0, lineHeight: 1, color: 'var(--text-primary)' }}>{averageRating}</h3>
          <div style={{ display: 'flex', gap: '0.15rem', margin: '0.75rem 0' }}>
            {[...Array(5)].map((_, i) => {
              const fullStar = i < Math.floor(averageRating);
              return <Star key={i} size={20} fill={fullStar ? "#f59e0b" : "none"} color={fullStar ? "#f59e0b" : "var(--text-muted)"} />;
            })}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Based on {totalReviews} Student Reviews</p>
        </div>

        {/* Rating Bars */}
        <div className="card glass-card" style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingBreakdown[stars];
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', margin: '0.2rem 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: '45px', display: 'inline-flex', gap: '0.15rem', alignItems: 'center', fontWeight: '600' }}>
                  {stars} <Star size={12} fill="#f59e0b" color="#f59e0b" />
                </span>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-teal))', borderRadius: '999px', transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', width: '35px', textAlign: 'right' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Testimonials Showcase */}
      <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Video Testimonials</h3>
      <div className="grid-2" style={{ marginBottom: '4.5rem' }}>
        <div className="card glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '260px' }}>
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600" 
            alt="MERN Video testimonial" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div style={{ cursor: 'pointer', transition: 'var(--transition)', color: 'var(--accent-teal)', marginBottom: '1rem' }} className="play-button-pulse">
              <Play size={48} fill="var(--accent-teal)" />
            </div>
            <h4 style={{ fontWeight: '700', color: 'white', fontSize: '1.15rem' }}>Rohan Adhikari - MERN Course Experience</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Transitioning from a mechanical background to Junior Web Developer</p>
          </div>
        </div>

        <div className="card glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: '260px' }}>
          <img 
            src="https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=600" 
            alt="UI/UX Video testimonial" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div style={{ cursor: 'pointer', transition: 'var(--transition)', color: 'var(--accent-primary)', marginBottom: '1rem' }} className="play-button-pulse">
              <Play size={48} fill="var(--accent-primary)" />
            </div>
            <h4 style={{ fontWeight: '700', color: 'white', fontSize: '1.15rem' }}>Sujata Shakya - UI/UX Graphics Experience</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Learning layout guidelines and Figma to launch design career</p>
          </div>
        </div>
      </div>

      {/* Written detailed reviews list */}
      <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Detailed Course Reviews</h3>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No reviews submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.map(r => (
            <div key={r.id} className="card glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.15rem' }}>{r.studentName}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: '600' }}>Course: {r.courseTitle}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < r.rating ? "#f59e0b" : "none"} color={i < r.rating ? "#f59e0b" : "var(--text-muted)"} />
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                "{r.reviewText}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Verified Student Review</span>
                <span>Submitted: {new Date(r.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .play-button-pulse:hover {
          transform: scale(1.1);
        }
        @media (max-width: 900px) {
          .reviews-summary-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
