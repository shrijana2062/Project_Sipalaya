import React, { useState, useEffect } from 'react';
import { Users, Banknote, HelpCircle, UserCheck, Plus, Trash2, ShieldCheck, Mail, Calendar, Phone, BookOpen } from 'lucide-react';

export default function AdminPortal({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoBookings, setDemoBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // User Creator State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [createSuccess, setCreateSuccess] = useState(false);

  // Course Management State
  const [coursesList, setCoursesList] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Course Creator Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('Programming');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [courseDuration, setCourseDuration] = useState('8 weeks');
  const [courseFee, setCourseFee] = useState('');
  const [courseInstructorName, setCourseInstructorName] = useState('');
  const [courseDeadline, setCourseDeadline] = useState('');
  const [coursePrerequisites, setCoursePrerequisites] = useState('');
  const [courseSyllabus, setCourseSyllabus] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const [courseCreateSuccess, setCourseCreateSuccess] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchDemoBookings();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      if (response.ok) {
        setCoursesList(data);
      }
      setLoadingCourses(false);
    } catch (err) {
      console.error(err);
      setLoadingCourses(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const syllabusArray = courseSyllabus
        ? courseSyllabus.split(/[,\n]+/).map(item => item.trim()).filter(Boolean)
        : [];

      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseTitle,
          description: courseDescription,
          category: courseCategory,
          level: courseLevel,
          duration: courseDuration,
          fee: Number(courseFee),
          instructorName: courseInstructorName || "Lead Instructor",
          enrollmentDeadline: courseDeadline || "2026-07-01",
          prerequisites: coursePrerequisites || "None",
          syllabus: syllabusArray,
          image: courseImage || undefined
        })
      });

      if (response.ok) {
        setCourseCreateSuccess(true);
        setCourseTitle('');
        setCourseDescription('');
        setCourseFee('');
        setCourseInstructorName('');
        setCourseDeadline('');
        setCoursePrerequisites('');
        setCourseSyllabus('');
        setCourseImage('');
        fetchCourses();
        fetchDashboard();
        setTimeout(() => setCourseCreateSuccess(false), 5000);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to create course");
      }
    } catch (err) {
      alert("Error reaching server");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchCourses();
        fetchDashboard();
      } else {
        alert("Failed to delete course");
      }
    } catch (err) {
      alert("Error reaching server");
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard');
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchDemoBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/demo-bookings');
      const data = await response.json();
      if (response.ok) {
        setDemoBookings(data);
      }
      setLoadingBookings(false);
    } catch (err) {
      console.error(err);
      setLoadingBookings(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPass,
          phone: newUserPhone,
          role: newUserRole
        })
      });
      if (response.ok) {
        setCreateSuccess(true);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPass('');
        setNewUserPhone('');
        fetchDashboard(); // Refresh users list
      } else {
        const data = await response.json();
        alert(data.message || "Failed to create user");
      }
    } catch (err) {
      alert("Error reaching server");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchDashboard();
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      alert("Error reaching server");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="portal-container animate-up">
      {/* SIDEBAR */}
      <aside className="portal-sidebar">
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
              alt="Avatar" 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '2px solid var(--accent-primary)' }}
            />
            <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Super Admin</p>
          </div>

          <ul className="portal-menu">
            <li onClick={() => setActiveTab('overview')} className={`portal-menu-link ${activeTab === 'overview' ? 'active' : ''}`}>
              <Users size={18} />
              <span>User Registry</span>
            </li>
            <li onClick={() => setActiveTab('courses')} className={`portal-menu-link ${activeTab === 'courses' ? 'active' : ''}`}>
              <BookOpen size={18} />
              <span>Courses Registry</span>
            </li>
            <li onClick={() => setActiveTab('financials')} className={`portal-menu-link ${activeTab === 'financials' ? 'active' : ''}`}>
              <Banknote size={18} />
              <span>Payments Ledger</span>
            </li>
            <li onClick={() => setActiveTab('demo-bookings')} className={`portal-menu-link ${activeTab === 'demo-bookings' ? 'active' : ''}`}>
              <Calendar size={18} />
              <span>Demo Bookings {demoBookings.length > 0 && <span className="badge badge-blue" style={{ marginLeft: '0.5rem', padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>{demoBookings.length}</span>}</span>
            </li>
            <li onClick={() => setActiveTab('inquiries')} className={`portal-menu-link ${activeTab === 'inquiries' ? 'active' : ''}`}>
              <HelpCircle size={18} />
              <span>Inquiries Inbox {dashboardData.inquiries.length > 0 && <span className="badge badge-orange" style={{ marginLeft: '0.5rem', padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>{dashboardData.inquiries.length}</span>}</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* PORTAL CONTENT */}
      <main className="portal-content" style={{ maxWidth: '1000px' }}>
        
        {/* OVERVIEW PANEL - USER MANAGEMENT */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>System Administration</h2>
            
            {/* Quick Metrics */}
            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
              <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                  <Users size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>{dashboardData.stats.totalStudents}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Students</p>
                </div>
              </div>

              <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)' }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>{dashboardData.stats.totalInstructors}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instructors</p>
                </div>
              </div>

              <div className="card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>
                  <Banknote size={20} />
                </div>
                <div>
                  <h5 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Rs. {dashboardData.stats.totalRevenue.toLocaleString()}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Sales Revenue</p>
                </div>
              </div>
            </div>

            {/* Analytics Chart Block */}
            <div className="card glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Revenue Analytics by Course</h3>
              
              {/* Pure CSS Bar Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Full-Stack Web Development (MERN)</span>
                    <span style={{ color: 'var(--accent-teal)' }}>Rs. {dashboardData.stats.totalRevenue.toLocaleString()} (100% of current share)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-teal))', borderRadius: '9999px', transition: 'width 1s ease' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Python for Data Science</span>
                    <span style={{ color: 'var(--text-muted)' }}>Rs. 0 (0% of current share)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-teal))', borderRadius: '9999px' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>UI/UX Design & Graphic Artistry</span>
                    <span style={{ color: 'var(--text-muted)' }}>Rs. 0 (0% of current share)</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-teal))', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout: User Table + User Creator */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="admin-user-layout">
              
              {/* Users Table */}
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>User Directory</h3>
                <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-primary)' }}>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Role</th>
                        <th style={{ padding: '1rem' }}>Phone</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className={`badge ${u.role === 'instructor' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: '0.65rem' }}>{u.role}</span>
                          </td>
                          <td style={{ padding: '1rem' }}>{u.phone}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <button 
                              disabled={u.id === 'admin-1' || u.id === 'inst-1' || u.id === 'stud-1'} 
                              onClick={() => handleDeleteUser(u.id)} 
                              className="btn btn-outline btn-sm" 
                              style={{ padding: '0.3rem', color: 'var(--accent-red)', border: 'none' }}
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User Creator Form */}
              <div>
                <div className="card glass-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Add New Account</h4>
                  
                  {createSuccess && (
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                      ✔ User account generated and active.
                    </div>
                  )}

                  <form onSubmit={handleCreateUser}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Ramesh Giri" 
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="ramesh@gmail.com" 
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Login Password</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder="••••••••" 
                        value={newUserPass}
                        onChange={(e) => setNewUserPass(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="98********" 
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>System Role</label>
                      <select className="form-control" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                        <option value="student">Student Account</option>
                        <option value="instructor">Instructor Account</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <Plus size={16} />
                      Generate Account
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FINANCIALS TAB - ENROLLMENTS & INVOICES */}
        {activeTab === 'financials' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Payments Ledger</h2>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-primary)' }}>
                    <th style={{ padding: '1rem' }}>Invoice No</th>
                    <th style={{ padding: '1rem' }}>Student Name</th>
                    <th style={{ padding: '1rem' }}>Course Title</th>
                    <th style={{ padding: '1rem' }}>Method</th>
                    <th style={{ padding: '1rem' }}>Installment</th>
                    <th style={{ padding: '1rem' }}>Txn ID</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.enrollments.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>{e.invoiceNo}</td>
                      <td style={{ padding: '1rem' }}>{e.userName}</td>
                      <td style={{ padding: '1rem', color: 'var(--accent-teal)' }}>{e.courseTitle}</td>
                      <td style={{ padding: '1rem' }}>{e.paymentMethod}</td>
                      <td style={{ padding: '1rem' }}><span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{e.installment}</span></td>
                      <td style={{ padding: '1rem' }}><code>{e.transactionId}</code></td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>Rs. {e.amountPaid.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Inquiries Inbox</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dashboardData.inquiries.length === 0 ? (
                <div className="card text-center" style={{ padding: '3rem' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>Inbox is empty.</p>
                </div>
              ) : (
                dashboardData.inquiries.map(inq => (
                  <div key={inq.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{inq.name}</h4>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Mail size={12} /> {inq.email}</span>
                          <span>Purpose: <strong style={{ color: 'var(--accent-teal)' }}>{inq.purpose}</strong></span>
                        </div>
                      </div>
                      <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                        {new Date(inq.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>"{inq.message}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {/* DEMO BOOKINGS TAB */}
        {activeTab === 'demo-bookings' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Demo Session Bookings</h2>
            {loadingBookings ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading bookings...</p>
            ) : demoBookings.length === 0 ? (
              <div className="card text-center" style={{ padding: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No demo bookings registered yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-primary)' }}>
                      <th style={{ padding: '1rem' }}>Interested Student</th>
                      <th style={{ padding: '1rem' }}>Target Course</th>
                      <th style={{ padding: '1rem' }}>Demo Date</th>
                      <th style={{ padding: '1rem' }}>Demo Time Slot</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{b.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.email} | {b.phone}</div>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--accent-teal)', fontWeight: '500' }}>{b.courseTitle}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{b.date}</td>
                        <td style={{ padding: '1rem' }}>{b.time}</td>
                        <td style={{ padding: '1rem' }}><span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* COURSES TAB - COURSE MANAGEMENT */}
        {activeTab === 'courses' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Courses Management</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="admin-course-layout">
              
              {/* Courses Table */}
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>Course Catalog</h3>
                {loadingCourses ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Loading courses...</p>
                ) : coursesList.length === 0 ? (
                  <div className="card text-center" style={{ padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No courses registered yet.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-primary)' }}>
                          <th style={{ padding: '1rem' }}>Course Details</th>
                          <th style={{ padding: '1rem' }}>Category/Level</th>
                          <th style={{ padding: '1rem' }}>Fee</th>
                          <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesList.map(c => (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <img src={c.image} alt={c.title} style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div>
                                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{c.title}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor: {c.instructorName}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span className="badge badge-blue" style={{ fontSize: '0.65rem', alignSelf: 'flex-start' }}>{c.category}</span>
                                <span className="badge badge-orange" style={{ fontSize: '0.65rem', alignSelf: 'flex-start' }}>{c.level}</span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Rs. {c.fee.toLocaleString()}</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <button 
                                onClick={() => handleDeleteCourse(c.id)} 
                                className="btn btn-outline btn-sm" 
                                style={{ padding: '0.3rem', color: 'var(--accent-red)', border: 'none' }}
                                title="Delete Course"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Course Creator Form */}
              <div>
                <div className="card glass-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Add New Course</h4>
                  
                  {courseCreateSuccess && (
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                      ✔ New course successfully registered in catalog.
                    </div>
                  )}

                  <form onSubmit={handleCreateCourse}>
                    <div className="form-group">
                      <label>Course Title *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. React Native Mobile Development" 
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Course Description</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Detailed description of the course..." 
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Category</label>
                        <select className="form-control" value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)}>
                          <option value="Programming">Programming</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Data Science & Analytics">Data Science & Analytics</option>
                          <option value="Graphic Design">Graphic Design</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Skill Level</label>
                        <select className="form-control" value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Duration</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. 8 weeks" 
                          value={courseDuration}
                          onChange={(e) => setCourseDuration(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Course Fee (NPR) *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="e.g. 15000" 
                          value={courseFee}
                          onChange={(e) => setCourseFee(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Lead Instructor *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Dr. Sunil Adhikari" 
                        value={courseInstructorName}
                        onChange={(e) => setCourseInstructorName(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Enrollment Deadline</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={courseDeadline}
                        onChange={(e) => setCourseDeadline(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Prerequisites</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Basic JS, HTML/CSS" 
                        value={coursePrerequisites}
                        onChange={(e) => setCoursePrerequisites(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Syllabus Topics (one per line or comma-separated)</label>
                      <textarea 
                        className="form-control" 
                        placeholder="e.g. Introduction to React&#10;State and Props&#10;Hooks & Custom Hooks" 
                        value={courseSyllabus}
                        onChange={(e) => setCourseSyllabus(e.target.value)}
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Course Cover Image URL</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="https://unsplash.com/..." 
                        value={courseImage}
                        onChange={(e) => setCourseImage(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <Plus size={16} />
                      Publish Course
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      <style>{`
        @media (max-width: 900px) {
          .admin-user-layout, .admin-course-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
