import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Search, Code, Cpu, Award, Users, ShieldAlert, Star, 
  Calendar, CheckCircle, ChevronDown, ChevronUp, Mail, BookOpen, 
  Clock, GraduationCap, MapPin, Sparkles, Send, Bell 
} from 'lucide-react';

const SLIDES = [
  {
    title: "Master Full-Stack Web Development",
    subtitle: "Learn MongoDB, Express, React, & Node.js from industry experts and build portfolio-grade projects.",
    badge: "June Batch Open",
    cta1: "Enroll Now",
    cta2: "View Syllabus",
    bg: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(99, 102, 241, 0.4)), url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200')"
  },
  {
    title: "10% Early Bird Discount on Python & ML",
    subtitle: "Launch your career in Data Science. Save 10% on registration before June 25th. Limited seats!",
    badge: "Special Offer",
    cta1: "Claim Discount",
    cta2: "Free Demo Class",
    bg: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(20, 184, 166, 0.4)), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200')"
  },
  {
    title: "UI/UX & Graphic Design Bootcamp",
    subtitle: "Master Figma, Photoshop, and Illustrator. Go from design fundamentals to professional case studies.",
    badge: "New Launch",
    cta1: "Schedule Demo",
    cta2: "Browse Portfolio",
    bg: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(245, 158, 11, 0.4)), url('https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=1200')"
  }
];

const FALLBACK_COURSES = [
  {
    id: "course-1",
    title: "Full-Stack Web Development (MERN)",
    description: "Master modern web development using MongoDB, Express, React, and Node.js. Build real-world applications.",
    category: "Web Development",
    level: "Intermediate",
    duration: "12 weeks",
    fee: 25000,
    instructorName: "Dr. Sandeep Koirala",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
    popularity: 98
  },
  {
    id: "course-2",
    title: "Python for Data Science & Machine Learning",
    description: "Analyze large datasets and build predictive models using NumPy, Pandas, Scikit-Learn, and TensorFlow.",
    category: "Data Science & Analytics",
    level: "Advanced",
    duration: "10 weeks",
    fee: 30000,
    instructorName: "Dr. Sandeep Koirala",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
    popularity: 94
  },
  {
    id: "course-3",
    title: "UI/UX Design & Graphic Artistry",
    description: "Learn design thinking, wireframing, prototyping, and graphic design using Figma, Photoshop, and Illustrator.",
    category: "Graphic Design",
    level: "Beginner",
    duration: "8 weeks",
    fee: 18000,
    instructorName: "Neha Sharma",
    image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=600",
    popularity: 91
  }
];

const EVENTS = [
  {
    id: "evt-1",
    title: "Live Q&A Seminar: Transitioning into AI & Python",
    date: "June 18, 2026",
    time: "04:00 PM - 05:30 PM",
    instructor: "Dr. Sandeep Koirala",
    type: "Online (Zoom Meeting)",
    badge: "Free Registration"
  },
  {
    id: "evt-2",
    title: "Full-Stack Web Dev: Roadmap & Local Placement Drives",
    date: "June 20, 2026",
    time: "01:00 PM - 03:00 PM",
    instructor: "Alumni Panelists",
    type: "Physical (Sipalaya InfoTech Lab 1)",
    badge: "Limited Seats Available"
  }
];

const FAQS = [
  {
    question: "Can I attend free demo classes before making a payment?",
    answer: "Yes, absolutely! Sipalaya InfoTech offers free demo classes and seminars weekly. You can book an interactive demo slot directly from our Courses page to evaluate the curriculum and meet the instructor."
  },
  {
    question: "What kind of job placement assistance do you provide?",
    answer: "We offer comprehensive career support: professional resume refinement, direct portfolio sharing with our 50+ hiring partners in Kathmandu, mock technical interviews, and a 1-month internship opportunity for top-performing graduates."
  },
  {
    question: "Is there an option to pay the training fees in installments?",
    answer: "Yes, you can split the total course fee into 2 or 3 flexible installments throughout the course duration. The first installment is collected at the start, and subsequent ones are paid mid-term."
  },
  {
    question: "Will I get a verified course completion certificate?",
    answer: "Yes. Every student who successfully finishes their assignments, maintains above 80% attendance, and submits their capstone project will receive a stamped physical and digital certificate from Sipalaya InfoTech."
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  
  // Custom Dynamic states
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch top courses from database
  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses');
        const data = await res.json();
        if (res.ok && data.length > 0) {
          // Sort by popularity and take top 3
          const topCourses = data.sort((a, b) => b.popularity - a.popularity).slice(0, 3);
          setCourses(topCourses);
        } else {
          setCourses(FALLBACK_COURSES);
        }
      } catch (err) {
        console.error("Could not fetch homepage courses, using fallback data.");
        setCourses(FALLBACK_COURSES);
      } finally {
        setLoadingCourses(false);
      }
    };
    getCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (category) params.append('category', category);
    if (level) params.append('level', level);
    navigate(`/courses?${params.toString()}`);
  };

  const handleRegisterEvent = (eventId) => {
    if (registeredEvents.includes(eventId)) return;
    setRegisteredEvents([...registeredEvents, eventId]);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <div className="animate-up">
      {/* CSS STYLES FOR PREMIUM HOMEPAGE COMPONENTS */}
      <style>{`
        /* Timeline styling */
        .timeline {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 3rem;
        }
        .timeline::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          z-index: 1;
        }
        .timeline-step {
          flex: 1;
          text-align: center;
          position: relative;
          z-index: 2;
          padding: 0 1rem;
        }
        .timeline-node {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 3px solid var(--border-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 1.15rem;
          margin-bottom: 1rem;
          transition: var(--transition);
        }
        .timeline-step:hover .timeline-node {
          border-color: var(--accent-primary);
          color: white;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          .timeline {
            flex-direction: column;
            gap: 2rem;
          }
          .timeline::before {
            display: none;
          }
          .timeline-step {
            display: flex;
            text-align: left;
            align-items: flex-start;
            gap: 1.5rem;
            padding: 0;
          }
          .timeline-node {
            margin-bottom: 0;
            flex-shrink: 0;
          }
        }

        /* FAQ Accordion Styling */
        .faq-item {
          border-bottom: 1px solid var(--border-color);
          padding: 1.25rem 0;
          cursor: pointer;
        }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 1.1rem;
          transition: var(--transition);
        }
        .faq-question:hover {
          color: var(--accent-teal);
        }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .faq-item.active .faq-answer {
          max-height: 200px;
          margin-top: 0.75rem;
        }

        .hover-glow:hover {
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3) !important;
        }
      `}</style>

      {/* 1. HERO SLIDER */}
      <section 
        style={{
          minHeight: '560px',
          backgroundImage: SLIDES[currentSlide].bg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.8s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '650px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '1.25rem', padding: '0.4rem 1rem' }}>
              {SLIDES[currentSlide].badge}
            </span>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', color: 'white' }}>
              {SLIDES[currentSlide].title}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
              {SLIDES[currentSlide].subtitle}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/admission')} className="btn btn-primary">
                {SLIDES[currentSlide].cta1}
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/courses')} className="btn btn-secondary">
                {SLIDES[currentSlide].cta2}
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div style={{ position: 'absolute', bottom: '2rem', width: '100%', display: 'flex', justifyContext: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '30px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: idx === currentSlide ? 'var(--accent-primary)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </section>

      {/* 2. SEARCH BAR OVERLAY */}
      <section style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <form onSubmit={handleSearchSubmit} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ flex: '2', minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Search Keyword</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Python, Java, CSS..." 
                  className="form-control" 
                  style={{ paddingLeft: '2.5rem' }} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Category</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science & Analytics">Data Science</option>
                <option value="Graphic Design">Graphic Design</option>
              </select>
            </div>

            <div style={{ flex: '1', minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Skill Level</label>
              <select className="form-control" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
              Search Courses
            </button>
          </form>
        </div>
      </section>

      {/* 3. HIGHLIGHT FEATURES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose <span className="gradient-text">Sipalaya InfoTech</span>?</h2>
          <p className="section-subtitle">We design our programs to bridge the gap between academic theory and practical job requirements.</p>
          
          <div className="grid-3">
            <div className="card hover-glow">
              <Code size={40} className="text-teal" style={{ color: '#0ea5e9', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Job-Oriented IT Training</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Curriculums designed by industry engineers. Focus heavily on hands-on coding, live projects, and code reviews.
              </p>
            </div>

            <div className="card hover-glow">
              <Cpu size={40} className="text-indigo" style={{ color: '#6366f1', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Certification Preparation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Prepare directly for globally recognized professional certifications like Microsoft, AWS, Oracle, and RedHat.
              </p>
            </div>

            <div className="card hover-glow">
              <Award size={40} style={{ color: '#10b981', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Corporate Workshops</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Tailored corporate training modules designed to upskill technical divisions on modern engineering methodologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC FEATURED COURSES SECTION */}
      <section className="section" style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)', borderY: '1px solid var(--border-color)', paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Explore Curated Programs</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0 }}>Featured <span className="gradient-text">IT Courses</span></h2>
            </div>
            <button onClick={() => navigate('/courses')} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              View All Courses <ArrowRight size={14} />
            </button>
          </div>

          {loadingCourses ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div className="grid-3">
              {courses.map((course) => (
                <div key={course.id} className="card glass-card hover-glow" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                    <img 
                      src={course.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'} 
                      alt={course.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <span className="badge badge-blue">{course.level}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      <GraduationCap size={14} style={{ color: 'var(--accent-teal)' }} />
                      <span>{course.category}</span>
                      <span>•</span>
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', lineBreak: 'anywhere', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
                      {course.description}
                    </p>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Course Fee</p>
                          <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-green)', margin: 0 }}>NPR {course.fee.toLocaleString()}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={16} fill="#f59e0b" color="#f59e0b" />
                          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>{(course.popularity / 20).toFixed(1)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => navigate('/courses')} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                          Syllabus
                        </button>
                        <button onClick={() => navigate('/admission')} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. STUDENT LEARNING TIMELINE */}
      <section className="section">
        <div className="container">
          <span className="badge badge-blue text-center" style={{ display: 'block', margin: '0 auto 0.5rem', width: 'fit-content' }}>Student Roadmap</span>
          <h2 className="section-title">Your Learning Journey at <span className="gradient-text">Sipalaya InfoTech</span></h2>
          <p className="section-subtitle">We don't just teach syntax; we shape career trajectories through a structured, project-first training model.</p>

          <div className="timeline">
            <div className="timeline-step">
              <div className="timeline-node">1</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Foundational Theory</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Learn core concepts and engineering principles under experienced instructors.
              </p>
            </div>
            <div className="timeline-step">
              <div className="timeline-node">2</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Capstone Development</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Collaborate in teams to build portfolio-grade products mirroring real-world specifications.
              </p>
            </div>
            <div className="timeline-step">
              <div className="timeline-node">3</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Certification Prep</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Prepare for globally recognized professional credentials with dedicated syllabus drills.
              </p>
            </div>
            <div className="timeline-step">
              <div className="timeline-node">4</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Placement Referral</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Polish your resume, attend mock interviews, and secure placements at our local hiring partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUCCESS METRICS */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '5rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid-4 text-center">
            <div>
              <Users size={32} style={{ color: '#0ea5e9', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>5,000+</h3>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Students Trained</p>
            </div>
            <div>
              <Award size={32} style={{ color: '#6366f1', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>94%</h3>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Placement Statistics</p>
            </div>
            <div>
              <Star size={32} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>4.8 / 5</h3>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Average Review Score</p>
            </div>
            <div>
              <Cpu size={32} style={{ color: '#10b981', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>50+</h3>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Hiring Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. UPCOMING EVENTS & LIVE SEMINARS */}
      <section className="section" style={{ backgroundColor: 'rgba(255, 255, 255, 0.005)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>Join Live Sessions</span>
            <h2 className="section-title">Upcoming Live Seminars & Batches</h2>
            <p className="section-subtitle">Reserve your free digital seat for expert-led sessions on web development, data science, and placement roadmaps.</p>
          </div>

          <div className="grid-2">
            {EVENTS.map(evt => (
              <div key={evt.id} className="card glass-card hover-glow" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Bell size={12} /> {evt.badge}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <Calendar size={14} style={{ color: 'var(--accent-primary)' }} />
                      <span>{evt.date}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                    {evt.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} />
                      <span>Time: {evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={14} />
                      <span>Speaker: {evt.instructor}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} style={{ color: 'var(--accent-teal)' }} />
                      <span>Location: {evt.type}</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => handleRegisterEvent(evt.id)}
                  className={`btn ${registeredEvents.includes(evt.id) ? 'btn-secondary' : 'btn-primary'}`} 
                  style={{ width: '100%', gap: '0.5rem' }}
                  disabled={registeredEvents.includes(evt.id)}
                >
                  {registeredEvents.includes(evt.id) ? (
                    <>
                      <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>Registered (Check Email for Access link)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Reserve My Seat</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIAL SNAPSHOT */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">What Our Graduates Say</h2>
          <p className="section-subtitle">Read firsthand stories of students who transitioned from zero coding experience to full-stack engineers.</p>
          
          <div className="grid-2">
            <div className="card glass-card hover-glow" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                "Sipalaya InfoTech completely shifted my career. The MERN course was rigorous, but the hands-on project-centric methodology gave me the confidence to apply for developer roles. Today, I'm working as a React dev in Kathmandu."
              </p>
              <div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Prabhat Adhikari</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>MERN Stack Graduate (Now at F1Soft)</p>
              </div>
            </div>

            <div className="card glass-card hover-glow" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                "The UI/UX graphics bootcamp taught me Figma and Illustrator, but more importantly, how to build proper design portfolios. The instructor was super responsive and graded assignments with highly detailed feedback."
              </p>
              <div>
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Sujata Shakya</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>UI/UX Design Graduate (Freelancer)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION SECTION */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Find immediate answers to questions concerning enrollments, corporate training schedules, and placements.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {FAQS.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`faq-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                >
                  <div className="faq-question">
                    <span>{faq.question}</span>
                    {isActive ? (
                      <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} />
                    ) : (
                      <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  <div className="faq-answer">
                    <p style={{ paddingBottom: '0.5rem' }}>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER LEAD CAPTURE SECTION */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card glass-card hover-glow" style={{ padding: '3.5rem 3rem', background: 'linear-gradient(135deg, rgba(11,15,25,0.9), rgba(99,102,241,0.08))', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                <Mail size={28} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>
                Never Miss a Batch Opening
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                Subscribe to our newsletter to receive the latest syllabus updates, free technology books, placement event alerts, and early-bird discount codes.
              </p>

              {newsletterSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', padding: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-md)' }}>
                  <CheckCircle size={24} />
                  <span style={{ fontWeight: '700' }}>Subscription Successful!</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>We've sent a free Python/React Roadmap Book to your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Enter your email address" 
                      value={newsletterEmail} 
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      style={{ paddingLeft: '2.75rem', height: '48px' }}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', gap: '0.5rem', height: '48px' }}>
                    <span>Subscribe</span>
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
