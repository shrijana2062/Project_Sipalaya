import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Filter, Clock, GraduationCap, ChevronRight, X, Sparkles, CheckCircle, Star } from 'lucide-react';

export default function Courses() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [maxFee, setMaxFee] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [duration, setDuration] = useState('');

  // Modal State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Sync url search params
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
    setLevel(searchParams.get('level') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchReviews(selectedCourse.id);
    } else {
      setReviews([]);
    }
  }, [selectedCourse]);

  const fetchReviews = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews?courseId=${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      if (response.ok) {
        setCourses(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
  };

  const handleBookDemo = async (slotId) => {
    if (!bookingName || !bookingEmail || !bookingPhone) {
      alert("Please enter your name, email, and phone to book a demo slot.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/courses/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          courseId: selectedCourse.id, 
          slotId,
          name: bookingName,
          email: bookingEmail,
          phone: bookingPhone
        })
      });
      if (response.ok) {
        setBookingSuccess(true);
        // Refresh local courses list
        fetchCourses();
        // Update selected course demoSlots
        const updatedCourse = await response.json();
        setSelectedCourse(updatedCourse);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      alert("Could not connect to database.");
    }
  };

  // Filter and Sort implementation
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchQuery ? 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    
    const matchesLevel = level ? course.level === level : true;
    const matchesCategory = category ? course.category === category : true;
    const matchesFee = maxFee ? course.fee <= Number(maxFee) : true;

    const matchesDuration = duration ? (
      duration === 'short' ? parseInt(course.duration) < 10 : parseInt(course.duration) >= 10
    ) : true;

    return matchesSearch && matchesLevel && matchesCategory && matchesFee && matchesDuration;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.fee - b.fee;
    if (sortBy === 'price-high') return b.fee - a.fee;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return b.popularity - a.popularity; // Default: Popularity
  });

  return (
    <div className="container section animate-up">
      <h2 className="section-title">Explore Professional <span className="gradient-text">IT Courses</span></h2>
      <p className="section-subtitle">Upgrade your skills with our industry-led modules and secure your dream career.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem', marginTop: '1rem' }} className="courses-grid-layout">
        
        {/* FILTERS SIDEBAR */}
        <aside className="card" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Filter size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Filter & Sort</h3>
          </div>

          <div className="form-group">
            <label>Keyword Search</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Python, MERN"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Course Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="Graphic Design">Graphic Design</option>
            </select>
          </div>

          <div className="form-group">
            <label>Skill Level</label>
            <select className="form-control" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Course Duration</label>
            <select className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">All Durations</option>
              <option value="short">Short-term (&lt; 10 weeks)</option>
              <option value="long">Long-term (&gt;= 10 weeks)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Fee (NPR: {maxFee || 'Any'})</label>
            <input 
              type="range" 
              min="10000" 
              max="50000" 
              step="2000" 
              className="form-control" 
              value={maxFee} 
              onChange={(e) => setMaxFee(e.target.value)}
            />
            {maxFee && (
              <button 
                onClick={() => setMaxFee('')} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-teal)', fontSize: '0.8rem', marginTop: '0.25rem', cursor: 'pointer' }}
              >
                Clear price filter
              </button>
            )}
          </div>

          <div className="form-group">
            <label>Sort By</label>
            <select className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popularity">Popularity</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* COURSES LISTING */}
        <main>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No courses match your active filter criteria.</p>
              <button 
                onClick={() => { setLevel(''); setCategory(''); setMaxFee(''); setSearchQuery(''); setDuration(''); }} 
                className="btn btn-secondary btn-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredCourses.map(course => (
                <div key={course.id} className="card glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    style={{ width: '240px', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    className="course-list-img"
                  />
                  <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '250px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-blue">{course.category}</span>
                        <span className="badge badge-orange">{course.level}</span>
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{course.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {course.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {course.duration}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GraduationCap size={16} /> {course.instructorName.split(' ')[1] || course.instructorName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Rs. {course.fee.toLocaleString()}</span>
                        <button onClick={() => { setSelectedCourse(course); setBookingSuccess(false); setBookingSlot(null); }} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>Syllabus & Demo</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>

      {/* SYLLABUS & DEMO CLASS BOOKING MODAL */}
      {selectedCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(6px)'
        }}>
          <div className="card glass-card animate-up" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '2.5rem' }}>
            <button 
              onClick={() => setSelectedCourse(null)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ marginBottom: '2rem' }}>
              <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{selectedCourse.category}</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{selectedCourse.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{selectedCourse.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="modal-sections">
              
              {/* Left Column: Syllabus & Prerequisites */}
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: 'var(--text-primary)' }}>Detailed Syllabus</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {selectedCourse.syllabus.map((topic, i) => (
                    <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <CheckCircle size={16} style={{ color: 'var(--accent-teal)', marginTop: '0.2rem', minWidth: '16px' }} />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Prerequisites</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedCourse.prerequisites}</p>
              </div>

              {/* Right Column: Instructor & Demo Calendar */}
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: 'var(--text-primary)' }}>Instructor Profile</h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <img 
                    src={selectedCourse.id === 'course-3' ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={selectedCourse.instructorName} 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-primary)' }}
                  />
                  <div>
                    <h5 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{selectedCourse.instructorName}</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead Course Mentor</p>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: 'var(--text-primary)' }}>Schedule Demo Session</h4>
                {bookingSuccess ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-green)' }}>
                    <Sparkles size={28} style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>Demo booked successfully!</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>A calendar invitation has been sent to your email.</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Select an available live demo class below:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {selectedCourse.demoSlots.map(slot => (
                        <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                              <Calendar size={14} style={{ color: 'var(--accent-primary)' }} />
                              {slot.date}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{slot.time}</div>
                          </div>
                          {slot.booked ? (
                            <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>Full</span>
                          ) : (
                            <button onClick={() => setBookingSlot(slot)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
                              Book
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {bookingSlot && (
                      <div className="card" style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid var(--accent-primary)', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Booking for {bookingSlot.date}</span>
                          <button onClick={() => setBookingSlot(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', marginBottom: '0.5rem' }} 
                            placeholder="Enter your full name"
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                          />
                          <input 
                            type="email" 
                            className="form-control" 
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', marginBottom: '0.5rem' }} 
                            placeholder="Enter your email address"
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                          />
                          <input 
                            type="tel" 
                            className="form-control" 
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
                            placeholder="Enter your phone number"
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                          />
                        </div>
                        <button onClick={() => handleBookDemo(bookingSlot.id)} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                          Confirm Booking
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Course Reviews list */}
            <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Student Reviews &amp; Ratings</h4>
              {reviews.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No student reviews yet for this course. Be the first to enroll and leave a review!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{r.studentName}</strong>
                        <div style={{ display: 'flex', gap: '0.1rem' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < r.rating ? "#f59e0b" : "none"} color={i < r.rating ? "#f59e0b" : "var(--text-muted)"} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"{r.reviewText}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2.5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registration Deadline: <strong style={{ color: 'var(--text-primary)' }}>{selectedCourse.enrollmentDeadline}</strong></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Duration: <strong style={{ color: 'var(--text-primary)' }}>{selectedCourse.duration}</strong></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => { setSelectedCourse(null); navigate('/admission'); }} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                  Proceed to Admission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Style overrides for sidebar responsiveness */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .courses-grid-layout {
            grid-template-columns: 1fr !important;
          }
          .modal-sections {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .course-list-img {
            width: 100% !important;
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
}
