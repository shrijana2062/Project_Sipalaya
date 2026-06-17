import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, ShieldCheck, Download, Award, CheckCircle2, X } from 'lucide-react';

export default function Admission({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  
  // Form Fields
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [paymentPref, setPaymentPref] = useState('eSewa');
  const [installment, setInstallment] = useState('Full Payment');
  
  // Payment gateway simulation states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFields, setPaymentFields] = useState({ accountId: '', pin: '', cardNo: '', expiry: '', cvc: '' });
  
  // Invoice state
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      if (response.ok) {
        setCourses(data);
        if (data.length > 0) setSelectedCourseId(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert("Please select a course to enroll.");
      return;
    }
    // Clear invoice and open gateway modal
    setGeneratedInvoice(null);
    setShowPaymentModal(true);
  };

  const executePaymentEnrollment = async () => {
    setIsProcessing(true);
    
    // Simulate gateway delay
    setTimeout(async () => {
      try {
        const course = courses.find(c => c.id === selectedCourseId);
        const amountToPay = installment === '50% First Installment' ? course.fee / 2 : course.fee;

        // In a real app we'd get student id from auth user context. Let's find Rohan or create a student on-the-fly.
        // If not logged in, we register a mock student or use current student user id.
        let studentId = user?.id || "stud-1"; // Fallback to Rohan Adhikari

        const response = await fetch('http://localhost:5000/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id || null,
            name,
            email,
            phone,
            courseId: selectedCourseId,
            amountPaid: amountToPay,
            paymentMethod: paymentPref,
            installment: installment
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          setGeneratedInvoice(data.enrollment);
          setShowPaymentModal(false);
          setBookingFieldsEmpty();
        } else {
          alert("Admissions Error: " + data.message);
        }
      } catch (err) {
        alert("Server connection failed. Storing enrollment locally.");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const setBookingFieldsEmpty = () => {
    setPaymentFields({ accountId: '', pin: '', cardNo: '', expiry: '', cvc: '' });
  };

  const getAmount = () => {
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) return 0;
    return installment === '50% First Installment' ? course.fee / 2 : course.fee;
  };

  return (
    <div className="container section animate-up">
      <div className="grid-2">
        
        {/* Left Column: Steps to Enroll */}
        <div>
          <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>Admission Portal</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Quick Steps to <span className="gradient-text">Get Started</span></h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center', fontWeight: '700', minWidth: '40px' }}>1</div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Browse & Select Course</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Choose from our list of programming, database, and design modules designed by experts.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center', fontWeight: '700', minWidth: '40px' }}>2</div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Register Online</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill in your contact coordinates, select your course, and state payment preference.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center', fontWeight: '700', minWidth: '40px' }}>3</div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Simulated Checkout</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Authenticate payment using local (eSewa, Khalti) or international (Stripe, Paypal) options.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center', fontWeight: '700', minWidth: '40px' }}>4</div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Access Dashboard</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your login is enabled instantly. View schedules, submit assignments, and track attendance.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Online Registration Form */}
        <div>
          <div className="card glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Online Enrollment Form</h3>
            <form onSubmit={handleRegisterClick}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Rohan Adhikari" 
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
                  placeholder="rohan@gmail.com" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+977 9841234567" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Select Desired IT Course</label>
                <select className="form-control" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} (Rs. {course.fee.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label>Payment Preference</label>
                  <select className="form-control" value={paymentPref} onChange={(e) => setPaymentPref(e.target.value)}>
                    <option value="eSewa">eSewa (Local)</option>
                    <option value="Khalti">Khalti (Local)</option>
                    <option value="Stripe">Stripe (Card)</option>
                    <option value="PayPal">PayPal (Intl)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Type</label>
                  <select className="form-control" value={installment} onChange={(e) => setInstallment(e.target.value)}>
                    <option value="Full Payment">Full Payment</option>
                    <option value="50% First Installment">50% Installment</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Proceed to Secure Payment
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* GENERATED INVOICE SECTION */}
      {generatedInvoice && (
        <section className="section animate-up" style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <div className="card glass-card" style={{ maxWidth: '650px', margin: '0 auto', padding: '3rem', color: '#1e293b', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.5rem' }}>Sipalaya InfoTech</h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Kathmandu, Nepal | info@srijanait.com</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ color: '#0ea5e9', fontWeight: '700', fontSize: '1.25rem' }}>RECEIPT</h3>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{generatedInvoice.invoiceNo}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
              <div>
                <h4 style={{ color: '#475569', fontWeight: '700', marginBottom: '0.4rem' }}>Billed To:</h4>
                <p style={{ fontWeight: '600', color: '#0f172a' }}>{generatedInvoice.userName}</p>
                <p style={{ color: '#64748b' }}>{email}</p>
                <p style={{ color: '#64748b' }}>{phone}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ color: '#475569', fontWeight: '700', marginBottom: '0.4rem' }}>Payment Info:</h4>
                <p style={{ color: '#64748b' }}>Method: <strong style={{ color: '#0f172a' }}>{generatedInvoice.paymentMethod}</strong></p>
                <p style={{ color: '#64748b' }}>Installment: <strong style={{ color: '#0f172a' }}>{generatedInvoice.installment}</strong></p>
                <p style={{ color: '#64748b' }}>Txn ID: <code>{generatedInvoice.transactionId}</code></p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2.5rem', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem 0', fontWeight: '700' }}>Description</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: '700' }}>Amount (NPR)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{generatedInvoice.courseTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>IT Certification Program</div>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: '600' }}>Rs. {generatedInvoice.amountPaid.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Status:</span>
                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={16} /> PAID</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Paid:</span>
                <div style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.5rem' }}>Rs. {generatedInvoice.amountPaid.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-outline" style={{ color: '#0f172a', borderColor: '#cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                <Download size={16} /> Print/Download Invoice
              </button>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>Thank you for enrolling in Sipalaya InfoTech. Login details have been sent to your email.</p>
            </div>
          </div>
        </section>
      )}

      {/* SECURE SIMULATED GATEWAY CHECKOUT MODAL */}
      {showPaymentModal && (
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
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card animate-up" style={{ width: '100%', maxWidth: '440px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setShowPaymentModal(false)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {/* Header Brand Integration */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {paymentPref === 'eSewa' && <h3 style={{ color: '#60bb46', fontWeight: '800', fontSize: '1.6rem' }}>eSewa <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '400' }}>checkout</span></h3>}
              {paymentPref === 'Khalti' && <h3 style={{ color: '#5c2d91', fontWeight: '800', fontSize: '1.6rem' }}>Khalti <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '400' }}>checkout</span></h3>}
              {paymentPref === 'Stripe' && <h3 style={{ color: '#635bff', fontWeight: '800', fontSize: '1.6rem' }}>Stripe <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '400' }}>payment</span></h3>}
              {paymentPref === 'PayPal' && <h3 style={{ color: '#003087', fontWeight: '800', fontSize: '1.6rem' }}>PayPal <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '400' }}>payment</span></h3>}
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Securely paying <strong style={{ color: 'var(--text-primary)' }}>Rs. {getAmount().toLocaleString()}</strong>
              </div>
            </div>

            {/* Input Forms */}
            {(paymentPref === 'eSewa' || paymentPref === 'Khalti') && (
              <div>
                <div className="form-group">
                  <label>{paymentPref} Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="98********" 
                    value={paymentFields.accountId} 
                    onChange={(e) => setPaymentFields({ ...paymentFields, accountId: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>M-PIN / Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••" 
                    value={paymentFields.pin} 
                    onChange={(e) => setPaymentFields({ ...paymentFields, pin: e.target.value })}
                    required 
                  />
                </div>
              </div>
            )}

            {paymentPref === 'Stripe' && (
              <div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="4242 4242 4242 4242" 
                    value={paymentFields.cardNo} 
                    onChange={(e) => setPaymentFields({ ...paymentFields, cardNo: e.target.value })}
                    required 
                  />
                </div>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="MM/YY" 
                      value={paymentFields.expiry} 
                      onChange={(e) => setPaymentFields({ ...paymentFields, expiry: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="123" 
                      value={paymentFields.cvc} 
                      onChange={(e) => setPaymentFields({ ...paymentFields, cvc: e.target.value })}
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentPref === 'PayPal' && (
              <div>
                <div className="form-group">
                  <label>PayPal Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="name@paypal.com" 
                    value={paymentFields.accountId} 
                    onChange={(e) => setPaymentFields({ ...paymentFields, accountId: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>PayPal Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                    value={paymentFields.pin} 
                    onChange={(e) => setPaymentFields({ ...paymentFields, pin: e.target.value })}
                    required 
                  />
                </div>
              </div>
            )}

            <button 
              onClick={executePaymentEnrollment} 
              disabled={isProcessing} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1.25rem', gap: '0.75rem' }}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Simulate Payment Gateways</span>
                </>
              )}
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
              This is a secure mock payment sandbox. No real funds are transferred.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
