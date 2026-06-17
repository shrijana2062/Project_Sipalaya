import React, { useState, useEffect } from 'react';
import { BookOpen, User, Clipboard, Plus, Check, Star, BookOpenCheck, Upload, Trash2 } from 'lucide-react';

export default function InstructorPortal({ user }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assignment Creator state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Grading State
  const [selectedSub, setSelectedSub] = useState(null);
  const [grade, setGrade] = useState('A');
  const [feedback, setFeedback] = useState('');
  const [gradeSuccess, setGradeSuccess] = useState(false);

  // Resource Upload state
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('PDF Document');
  const [resourceLink, setResourceLink] = useState('');
  const [resourceSuccess, setResourceSuccess] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchResources();
  }, [user]);

  const fetchDashboard = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/instructor/dashboard/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
        if (data.courses && data.courses.length > 0) {
          setSelectedCourseId(data.courses[0].id);
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
      const response = await fetch('http://localhost:5000/api/resources');
      const data = await response.json();
      if (response.ok) {
        setResources(data.filter(r => r.uploadedBy === user.name));
      }
      setLoadingResources(false);
    } catch (err) {
      console.error(err);
      setLoadingResources(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/instructor/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          courseId: selectedCourseId,
          dueDate: newDueDate
        })
      });
      if (response.ok) {
        setAssignSuccess(true);
        setNewTitle('');
        setNewDesc('');
        setNewDueDate('');
        fetchDashboard();
      }
    } catch (err) {
      alert("Error creating assignment.");
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/instructor/assignments/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedSub.assignmentId,
          studentId: selectedSub.studentId,
          grade,
          feedback
        })
      });
      if (response.ok) {
        setGradeSuccess(true);
        setSelectedSub(null);
        setFeedback('');
        fetchDashboard();
      }
    } catch (err) {
      alert("Error grading assignment.");
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    if (!resourceTitle || !resourceLink) return;
    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resourceTitle,
          courseId: selectedCourseId,
          type: resourceType,
          link: resourceLink,
          uploadedBy: user.name
        })
      });
      if (response.ok) {
        setResourceSuccess(true);
        setResourceTitle('');
        setResourceLink('');
        fetchResources();
        setTimeout(() => setResourceSuccess(false), 3000);
      } else {
        alert("Failed to upload resource");
      }
    } catch (err) {
      alert("Error uploading resource");
    }
  };

  const handleDeleteResource = async (resId) => {
    if (!window.confirm("Delete this learning material?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/resources/${resId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchResources();
      } else {
        alert("Failed to delete resource");
      }
    } catch (err) {
      alert("Error deleting resource");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Get pending submissions list from all instructor assignments
  const pendingSubmissions = [];
  if (dashboardData) {
    dashboardData.assignments.forEach(assign => {
      assign.submissions.forEach(sub => {
        if (sub.grade === 'Pending') {
          pendingSubmissions.push({
            assignmentId: assign.id,
            assignmentTitle: assign.title,
            ...sub
          });
        }
      });
    });
  }

  return (
    <div className="portal-container animate-up">
      {/* SIDEBAR */}
      <aside className="portal-sidebar">
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt="Avatar" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '2px solid var(--accent-primary)' }}
            />
            <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead Instructor</p>
          </div>

          <ul className="portal-menu">
            <li onClick={() => setActiveTab('courses')} className={`portal-menu-link ${activeTab === 'courses' ? 'active' : ''}`}>
              <BookOpen size={18} />
              <span>My Courses</span>
            </li>
            <li onClick={() => setActiveTab('assignments')} className={`portal-menu-link ${activeTab === 'assignments' ? 'active' : ''}`}>
              <Clipboard size={18} />
              <span>Assignments Creator</span>
            </li>
            <li onClick={() => setActiveTab('grading')} className={`portal-menu-link ${activeTab === 'grading' ? 'active' : ''}`}>
              <BookOpenCheck size={18} />
              <span>Grading Center {pendingSubmissions.length > 0 && <span className="badge badge-orange" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem', marginLeft: '0.5rem' }}>{pendingSubmissions.length}</span>}</span>
            </li>
            <li onClick={() => setActiveTab('resources')} className={`portal-menu-link ${activeTab === 'resources' ? 'active' : ''}`}>
              <Upload size={18} />
              <span>Upload Resources</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="portal-content">
        
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Instructor Dashboard</h2>
            
            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              <div className="card glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Active Classes</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {dashboardData.courses.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{c.title}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.duration} | {c.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>Enrolled Students Log</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {dashboardData.students.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No student enrolled yet.</p>
                  ) : (
                    dashboardData.students.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <div>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{s.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email} | {s.phone}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {s.courses.map(sc => (
                            <div key={sc.courseId} style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>
                              Progress: <strong>{sc.progress}%</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Create Course Assignments</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="instructor-assign-layout">
              
              <div>
                <div className="card glass-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>New Assignment Form</h4>
                  {assignSuccess ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                      <Check size={32} style={{ color: 'var(--accent-green)', marginBottom: '0.5rem', display: 'inline-block' }} />
                      <h4 style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Assignment Created Successfully</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1rem' }}>It is now active on enrolled student dashboards.</p>
                      <button onClick={() => setAssignSuccess(false)} className="btn btn-secondary btn-sm">Add another one</button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateAssignment}>
                      <div className="form-group">
                        <label>For Course</label>
                        <select className="form-control" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                          {dashboardData.courses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Assignment Title</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={newTitle} 
                          onChange={(e) => setNewTitle(e.target.value)} 
                          placeholder="e.g. Build React Calculator" 
                          required 
                        />
                      </div>

                      <div className="form-group">
                        <label>Description & Objectives</label>
                        <textarea 
                          className="form-control" 
                          rows="4" 
                          value={newDesc} 
                          onChange={(e) => setNewDesc(e.target.value)} 
                          placeholder="State prerequisites, objectives, and evaluation models..." 
                          required 
                        />
                      </div>

                      <div className="form-group">
                        <label>Due Date</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          value={newDueDate} 
                          onChange={(e) => setNewDueDate(e.target.value)} 
                          required 
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                        <Plus size={16} />
                        Publish Assignment
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Active Assignments</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dashboardData.assignments.map(a => (
                    <div key={a.id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{a.title}</strong>
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>Due: {a.dueDate}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{a.description}</p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Submissions: {a.submissions.length} total
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* GRADING TAB */}
        {activeTab === 'grading' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Grading & Evaluations</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="instructor-assign-layout">
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Pending Submissions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingSubmissions.length === 0 ? (
                    <div className="card text-center" style={{ padding: '2.5rem' }}><p style={{ color: 'var(--text-secondary)' }}>All submissions have been evaluated!</p></div>
                  ) : (
                    pendingSubmissions.map(sub => (
                      <div 
                        key={`${sub.assignmentId}-${sub.studentId}`} 
                        className="card" 
                        style={{ 
                          padding: '1.25rem', 
                          cursor: 'pointer', 
                          border: selectedSub && selectedSub.studentId === sub.studentId ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          backgroundColor: selectedSub && selectedSub.studentId === sub.studentId ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-secondary)'
                        }}
                        onClick={() => { setSelectedSub(sub); setGradeSuccess(false); }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{sub.studentName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.assignmentTitle}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"{sub.submissionText}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Evaluation Panel</h4>
                {selectedSub ? (
                  <div className="card glass-card" style={{ padding: '2rem' }}>
                    <h5 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Grading: {selectedSub.studentName}</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Topic: {selectedSub.assignmentTitle}</p>
                    
                    <form onSubmit={handleGradeSubmit}>
                      <div className="form-group">
                        <label>Grade Card</label>
                        <select className="form-control" value={grade} onChange={(e) => setGrade(e.target.value)}>
                          <option value="A">Grade A (Excellent)</option>
                          <option value="B">Grade B (Good)</option>
                          <option value="C">Grade C (Satisfactory)</option>
                          <option value="F">Grade F (Fail / Redo)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Written Feedback / Corrections</label>
                        <textarea 
                          className="form-control" 
                          rows="4" 
                          placeholder="Provide descriptive feedback for student..." 
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Submit Grade & Feedback
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="card text-center" style={{ padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Select a student submission from the left panel to begin evaluation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Upload Study Materials</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '2rem' }} className="instructor-assign-layout">
              <div>
                <div className="card glass-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Material Registry</h4>
                  
                  {resourceSuccess && (
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                      ✔ Resource published successfully and logged in course archive.
                    </div>
                  )}

                  <form onSubmit={handleResourceSubmit}>
                    <div className="form-group">
                      <label>Select Course</label>
                      <select className="form-control" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                        {dashboardData.courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Resource Title</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. MERN Lecture 3: React Router Setup" 
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Material Format Type</label>
                      <select className="form-control" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                        <option value="PDF Document">PDF Slides / Documentation</option>
                        <option value="Video Lecture">Video Recording Link</option>
                        <option value="Code ZIP">ZIP Code Repository</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Attach File / Lecture URL</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. https://youtube.com/watch?v=..." 
                        value={resourceLink}
                        onChange={(e) => setResourceLink(e.target.value)}
                        required 
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                      <Plus size={16} />
                      Publish Study Material
                    </button>
                  </form>
                </div>
              </div>

              {/* Published materials log */}
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Published Study Materials</h4>
                {loadingResources ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Loading resources...</p>
                ) : resources.length === 0 ? (
                  <div className="card text-center" style={{ padding: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No resources uploaded yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {resources.map(r => (
                      <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div>
                            <span className="badge badge-blue" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>{r.type}</span>
                            <h5 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{r.title}</h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>{r.courseTitle}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteResource(r.id)} 
                            className="btn btn-outline btn-sm" 
                            style={{ padding: '0.3rem', color: 'var(--accent-red)', border: 'none' }}
                            title="Delete Resource"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                          Link: <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>{r.link}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @media (max-width: 900px) {
          .instructor-assign-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
