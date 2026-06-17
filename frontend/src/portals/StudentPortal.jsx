import React, { useState, useEffect } from 'react';
import { BookOpen, Award, CheckSquare, Calendar as CalendarIcon, Upload, ArrowUpRight, GraduationCap, Video, FileText, FileArchive, Check, Star } from 'lucide-react';

export default function StudentPortal({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  // Assignment submission form
  const [selectedAssignId, setSelectedAssignId] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Review submission state
  const [reviewCourseId, setReviewCourseId] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchResources();
  }, [user]);

  const fetchDashboard = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/student/dashboard/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
        if (data.availableAssignments && data.availableAssignments.length > 0) {
          setSelectedAssignId(data.availableAssignments[0].id);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/resources?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setResources(data);
      }
      setLoadingResources(false);
    } catch (err) {
      console.error(err);
      setLoadingResources(false);
    }
  };

  const handleAttendanceCheckIn = async (courseId) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await fetch('http://localhost:5000/api/student/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId, date: today })
      });
      if (response.ok) {
        setCheckInSuccess(true);
        fetchDashboard(); // Refresh attendance list
        setTimeout(() => setCheckInSuccess(false), 3000);
      } else {
        alert("Failed to mark attendance.");
      }
    } catch (err) {
      alert("Error checking in.");
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!submissionText) return;

    try {
      const response = await fetch('http://localhost:5000/api/student/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedAssignId,
          studentId: user.id,
          studentName: user.name,
          submissionText: submissionText
        })
      });
      if (response.ok) {
        setSubmitSuccess(true);
        setSubmissionText('');
        fetchDashboard(); // Refresh submissions list
      }
    } catch (err) {
      alert("Submission error.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewCourseId || !reviewText) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: reviewCourseId,
          studentId: user.id,
          studentName: user.name,
          rating: reviewRating,
          reviewText: reviewText
        })
      });
      if (response.ok) {
        setReviewSubmitSuccess(true);
        setReviewText('');
        setReviewCourseId('');
        setReviewRating(5);
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      alert("Error submitting review.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container section text-center">
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load dashboard data. Please make sure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className="portal-container animate-up">
      {/* PORTAL SIDEBAR */}
      <aside className="portal-sidebar">
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" 
              alt="Avatar" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '2px solid var(--accent-primary)' }}
            />
            <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student Account</p>
          </div>

          <ul className="portal-menu">
            <li onClick={() => setActiveTab('overview')} className={`portal-menu-link ${activeTab === 'overview' ? 'active' : ''}`}>
              <BookOpen size={18} />
              <span>Overview</span>
            </li>
            <li onClick={() => setActiveTab('assignments')} className={`portal-menu-link ${activeTab === 'assignments' ? 'active' : ''}`}>
              <CheckSquare size={18} />
              <span>Assignments</span>
            </li>
            <li onClick={() => setActiveTab('attendance')} className={`portal-menu-link ${activeTab === 'attendance' ? 'active' : ''}`}>
              <CalendarIcon size={18} />
              <span>Attendance</span>
            </li>
            <li onClick={() => setActiveTab('resources')} className={`portal-menu-link ${activeTab === 'resources' ? 'active' : ''}`}>
              <Upload size={18} />
              <span>Study Resources</span>
            </li>
            <li onClick={() => setActiveTab('reviews')} className={`portal-menu-link ${activeTab === 'reviews' ? 'active' : ''}`}>
              <Star size={18} />
              <span>Write a Review</span>
            </li>
          </ul>
        </div>
        
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Batch ID: SRJ-2026-A
        </div>
      </aside>

      {/* PORTAL CONTENT */}
      <main className="portal-content">
        
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>!</h2>
            
            {/* Quick Metrics */}
            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
              <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>{dashboardData.courses.length}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Enrolled Courses</p>
                </div>
              </div>

              <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {dashboardData.submissions.filter(s => s.grade !== 'Pending').length}
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Graded Submissions</p>
                </div>
              </div>

              <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-orange)' }}>
                  <CheckSquare size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {dashboardData.availableAssignments.length - dashboardData.submissions.length}
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending Tasks</p>
                </div>
              </div>
            </div>

            {/* Course Progress Circles */}
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Course Progress Tracker</h3>
            {dashboardData.courses.length === 0 ? (
              <div className="card text-center" style={{ padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>You are not registered in any course yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {dashboardData.courses.map(course => (
                  <div key={course.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="progress-ring-container">
                        {/* Simple SVG progress circle */}
                        <svg width="80" height="80">
                          <circle cx="40" cy="40" r="34" stroke="var(--border-color)" strokeWidth="6" fill="transparent" />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="34" 
                            stroke="var(--accent-primary)" 
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray="213.6"
                            strokeDashoffset={213.6 - (213.6 * (course.progress || 0)) / 100}
                            strokeLinecap="round"
                            transform="rotate(-90 40 40)"
                          />
                        </svg>
                        <span className="progress-text" style={{ fontSize: '1rem' }}>{course.progress}%</span>
                      </div>
                      <div>
                        <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{course.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instructor: {course.instructorName}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                        <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{course.duration}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Attendance Rate:</span>
                        <div style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>
                          {course.attendance ? Math.min(100, Math.round((course.attendance.length / 10) * 100)) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ASSIGNMENTS PANEL */}
        {activeTab === 'assignments' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="assignments-layout">
              
              {/* Submission Form */}
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Submit Assignment</h3>
                {dashboardData.availableAssignments.length === 0 ? (
                  <div className="card" style={{ padding: '2rem' }}><p style={{ color: 'var(--text-secondary)' }}>No assignments assigned.</p></div>
                ) : (
                  <div className="card glass-card">
                    {submitSuccess ? (
                      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <CheckSquare size={32} style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }} />
                        <h4 style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Assignment Submitted</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem' }}>Your code/url link has been sent to your instructor for evaluation.</p>
                        <button onClick={() => setSubmitSuccess(false)} className="btn btn-secondary btn-sm">Submit another</button>
                      </div>
                    ) : (
                      <form onSubmit={handleAssignmentSubmit}>
                        <div className="form-group">
                          <label>Select Assignment Topic</label>
                          <select className="form-control" value={selectedAssignId} onChange={(e) => setSelectedAssignId(e.target.value)}>
                            {dashboardData.availableAssignments.map(assign => (
                              <option key={assign.id} value={assign.id}>
                                {assign.title} (Due: {assign.dueDate})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Submission Text / Shareable Repository URL</label>
                          <textarea 
                            className="form-control" 
                            rows="5" 
                            placeholder="e.g. Here is my portfolio code sandbox link: sandbox.io/my-portfolio"
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            required
                          />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                          <Upload size={16} />
                          Submit Assignment
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Submissions & Evaluation Board */}
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Grades & Evaluation</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dashboardData.submissions.length === 0 ? (
                    <div className="card text-center" style={{ padding: '2rem' }}><p style={{ color: 'var(--text-secondary)' }}>You haven't submitted any assignments yet.</p></div>
                  ) : (
                    dashboardData.submissions.map(sub => (
                      <div key={sub.assignmentId} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${sub.grade === 'Pending' ? 'var(--accent-orange)' : 'var(--accent-green)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{sub.assignmentTitle}</h4>
                          <span className={`badge ${sub.grade === 'Pending' ? 'badge-orange' : 'badge-green'}`}>
                            {sub.grade}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.75rem' }}>"{sub.submissionText}"</p>
                        {sub.feedback && (
                          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Instructor Feedback:</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{sub.feedback}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ATTENDANCE PANEL */}
        {activeTab === 'attendance' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Class Attendance Tracker</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Below is the calendar history of days you logged into lectures and completed the practical modules.</p>

            {checkInSuccess && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                ✔ Attendance registered for today. Keep up the consistent learning!
              </div>
            )}

            <div className="grid-2">
              {dashboardData.courses.map(course => {
                const todayStr = new Date().toISOString().split('T')[0];
                const attendedToday = course.attendance && course.attendance.includes(todayStr);
                return (
                  <div key={course.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{course.title}</h4>
                      {!attendedToday ? (
                        <button onClick={() => handleAttendanceCheckIn(course.id)} className="btn btn-primary btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          Check-in Today
                        </button>
                      ) : (
                        <span className="badge badge-green" style={{ fontSize: '0.65rem', display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                          <Check size={12} /> Checked-in
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                      {/* Render a mock calendar dates grid */}
                      {[...Array(10)].map((_, idx) => {
                        const dayStr = `2026-06-0${idx + 1}`;
                        const present = course.attendance && course.attendance.includes(dayStr);
                        return (
                          <div 
                            key={idx} 
                            style={{
                              padding: '0.75rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              textAlign: 'center',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              backgroundColor: present ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                              color: present ? 'var(--accent-green)' : 'var(--text-muted)',
                              border: present ? '1px solid var(--accent-green)' : '1px solid var(--border-color)'
                            }}
                          >
                            <div>June {idx + 1}</div>
                            <div style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>{present ? "Present" : "Absent"}</div>
                          </div>
                        );
                      })}
                      {/* If today checked in and not in mock June 1-10 range, show today block */}
                      {attendedToday && !course.attendance.some(d => d.startsWith('2026-06-0')) && (
                        <div 
                          style={{
                            padding: '0.75rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: 'var(--accent-green)',
                            border: '1px solid var(--accent-green)',
                            gridColumn: 'span 2'
                          }}
                        >
                          <div>Today ({todayStr})</div>
                          <div style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>Present</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RESOURCES PANEL */}
        {activeTab === 'resources' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Learning Materials & Study Resources</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Access code archives, lecture slides, and video recordings published by your course mentors.</p>
            
            {loadingResources ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading resources...</p>
            ) : resources.length === 0 ? (
              <div className="card text-center" style={{ padding: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No study materials published yet for your enrolled courses.</p>
              </div>
            ) : (
              <div className="grid-3">
                {resources.map(r => {
                  const isVideo = r.type.includes('Video');
                  const isZip = r.type.includes('ZIP') || r.type.includes('Code');
                  return (
                    <div key={r.id} className="card glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '1.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{r.type}</span>
                          <div style={{ color: 'var(--accent-primary)' }}>
                            {isVideo ? <Video size={20} /> : isZip ? <FileArchive size={20} /> : <FileText size={20} />}
                          </div>
                        </div>
                        <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.25rem', lineHeight: '1.4' }}>{r.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Course: <strong style={{ color: 'var(--accent-teal)' }}>{r.courseTitle}</strong></p>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {r.uploadedBy.split(' ')[1] || r.uploadedBy}</span>
                        <a href={r.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          Open Link
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS PANEL */}
        {activeTab === 'reviews' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Rate &amp; Review Course</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Share your learning experience and feedback about your enrolled courses to help us improve.</p>

            <div className="card glass-card" style={{ maxWidth: '600px' }}>
              {reviewSubmitSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <Award size={32} style={{ color: 'var(--accent-green)', marginBottom: '0.5rem', display: 'inline-block' }} />
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Review Submitted!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1rem' }}>Thank you for sharing your feedback with the community.</p>
                  <button onClick={() => setReviewSubmitSuccess(false)} className="btn btn-secondary btn-sm">Write another review</button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label>Select Enrolled Course</label>
                    <select className="form-control" value={reviewCourseId} onChange={(e) => setReviewCourseId(e.target.value)} required>
                      <option value="">-- Choose Course --</option>
                      {dashboardData.courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Rating (1 to 5 Stars)</label>
                    <div style={{ display: 'flex', gap: '0.4rem', margin: '0.5rem 0' }}>
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setReviewRating(starVal)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          <Star 
                            size={28} 
                            fill={starVal <= reviewRating ? "#f59e0b" : "none"} 
                            color={starVal <= reviewRating ? "#f59e0b" : "var(--text-muted)"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Your Detailed Review</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="What did you like about the course? How was the instructor and curriculum?"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Submit Detailed Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      <style>{`
        @media (max-width: 900px) {
          .assignments-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
