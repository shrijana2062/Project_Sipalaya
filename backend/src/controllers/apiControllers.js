const dbService = require('../config/db');

// --- AUTHENTICATION ---
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await dbService.findOne('users', { email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Create copy without password for safety
    const userResponse = { ...user };
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await dbService.findOne('users', { email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = await dbService.create('users', {
      name,
      email,
      password,
      phone,
      role: role || 'student',
      enrolledCourses: [],
      progress: {},
      attendance: {}
    });

    const userResponse = { ...newUser };
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- COURSES ---
exports.getCourses = async (req, res) => {
  try {
    const courses = await dbService.find('courses');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await dbService.findOne('courses', { id: req.params.id });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  const { title, description, category, level, duration, fee, instructorId, instructorName, enrollmentDeadline, prerequisites, syllabus, image } = req.body;
  if (!title || !fee || !instructorName) {
    return res.status(400).json({ message: "Course title, fee, and instructor name are required" });
  }

  try {
    const id = `course-${Math.random().toString(36).substr(2, 9)}`;
    const newCourse = await dbService.create('courses', {
      id,
      title,
      description,
      category: category || "Programming",
      level: level || "Beginner",
      duration: duration || "8 weeks",
      fee: Number(fee),
      instructorId: instructorId || "inst-1",
      instructorName,
      enrollmentDeadline,
      prerequisites: prerequisites || "None",
      syllabus: syllabus || [],
      image: image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
      demoSlots: [
        { id: `slot-${Math.random().toString(36).substr(2, 5)}`, date: "2026-06-20", time: "11:00 AM - 12:30 PM", booked: false }
      ],
      popularity: 50
    });
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const updated = await dbService.findByIdAndUpdate('courses', req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await dbService.findByIdAndDelete('courses', req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bookDemoSlot = async (req, res) => {
  const { courseId, slotId, name, email, phone } = req.body;
  try {
    const course = await dbService.findOne('courses', { id: courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const slot = course.demoSlots.find(s => s.id === slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const slots = course.demoSlots.map(s => {
      if (s.id === slotId) {
        return { ...s, booked: true };
      }
      return s;
    });

    // Update the slot inside the course
    const updated = await dbService.findByIdAndUpdate('courses', courseId, { demoSlots: slots });

    // Create a booking record
    await dbService.create('demobookings', {
      courseId,
      courseTitle: course.title,
      slotId,
      date: slot.date,
      time: slot.time,
      name: name || "Anonymous Student",
      email: email || "student@example.com",
      phone: phone || "N/A",
      status: "Confirmed"
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- ENROLLMENTS & ADMISSIONS ---
exports.enroll = async (req, res) => {
  const { userId, name, email, phone, courseId, amountPaid, paymentMethod, installment } = req.body;
  if (!courseId || !amountPaid || !paymentMethod) {
    return res.status(400).json({ message: "Course, Amount, and Payment Method are required" });
  }

  try {
    let student;
    if (userId) {
      student = await dbService.findOne('users', { id: userId });
    }
    if (!student && email) {
      student = await dbService.findOne('users', { email });
    }
    if (!student) {
      if (!name || !email || !phone) {
        return res.status(400).json({ message: "Name, email, and phone number are required for new student enrollment" });
      }
      const id = `stud-${Math.random().toString(36).substr(2, 9)}`;
      student = await dbService.create('users', {
        id,
        name,
        email,
        password: phone, // Mobile number as password
        phone,
        role: 'student',
        enrolledCourses: [],
        progress: {},
        attendance: {}
      });
      console.log(`✨ Automatically registered new student: ${email} with password ${phone}`);
    }

    const course = await dbService.findOne('courses', { id: courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const invoiceNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const transactionId = `TXN-${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Create Enrollment Record
    const newEnrollment = await dbService.create('enrollments', {
      userId: student.id,
      userName: student.name,
      courseId,
      courseTitle: course.title,
      amountPaid: Number(amountPaid),
      paymentMethod,
      paymentStatus: "Paid",
      transactionId,
      date: new Date().toISOString(),
      installment: installment || "Full Payment",
      invoiceNo
    });

    // Update User's Enrolled Courses list and initiate progress
    const enrolledCourses = [...(student.enrolledCourses || [])];
    if (!enrolledCourses.includes(courseId)) {
      enrolledCourses.push(courseId);
    }
    const progress = { ...(student.progress || {}) };
    if (progress[courseId] === undefined) {
      progress[courseId] = 0; // start at 0%
    }
    const attendance = { ...(student.attendance || {}) };
    if (!attendance[courseId]) {
      attendance[courseId] = [];
    }

    await dbService.findByIdAndUpdate('users', student.id, { enrolledCourses, progress, attendance });

    res.status(201).json({
      message: "Enrollment successful",
      enrollment: newEnrollment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEnrollments = async (req, res) => {
  const { userId } = req.query;
  try {
    let enrollments;
    if (userId) {
      enrollments = await dbService.find('enrollments', { userId });
    } else {
      enrollments = await dbService.find('enrollments');
    }
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- PORTALS SERVICE (STUDENT & INSTRUCTOR & ADMIN) ---
exports.getStudentDashboard = async (req, res) => {
  const { userId } = req.params;
  try {
    const student = await dbService.findOne('users', { id: userId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Fetch all courses info enrolled by student
    const enrolledIds = student.enrolledCourses || [];
    const allCourses = await dbService.find('courses');
    const studentCourses = allCourses.filter(c => enrolledIds.includes(c.id));

    // Fetch student assignment submissions
    const allAssignments = await dbService.find('assignments');
    const studentSubmissions = [];
    allAssignments.forEach(assign => {
      const sub = assign.submissions.find(s => s.studentId === userId);
      if (sub) {
        studentSubmissions.push({
          assignmentId: assign.id,
          assignmentTitle: assign.title,
          dueDate: assign.dueDate,
          ...sub
        });
      }
    });

    res.json({
      courses: studentCourses.map(c => ({
        ...c,
        progress: student.progress[c.id] || 0,
        attendance: student.attendance[c.id] || []
      })),
      submissions: studentSubmissions,
      availableAssignments: allAssignments.filter(a => enrolledIds.includes(a.courseId))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  const { assignmentId, studentId, studentName, submissionText } = req.body;
  if (!assignmentId || !studentId || !submissionText) {
    return res.status(400).json({ message: "Assignment ID, Student ID, and submission are required" });
  }

  try {
    const assignment = await dbService.findOne('assignments', { id: assignmentId });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submission = {
      studentId,
      studentName: studentName || "Student",
      submissionText,
      submissionDate: new Date().toISOString(),
      grade: "Pending",
      feedback: ""
    };

    // Replace if exists, else push
    const submissions = assignment.submissions.filter(s => s.studentId !== studentId);
    submissions.push(submission);

    const updated = await dbService.findByIdAndUpdate('assignments', assignmentId, { submissions });
    res.json({ message: "Assignment submitted successfully", assignment: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInstructorDashboard = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const instructor = await dbService.findOne('users', { id: instructorId });
    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    const courses = await dbService.find('courses', { instructorId });
    const courseIds = courses.map(c => c.id);

    // Get all students enrolled in these courses
    const allUsers = await dbService.find('users', { role: 'student' });
    const students = allUsers.filter(u => 
      u.enrolledCourses && u.enrolledCourses.some(cid => courseIds.includes(cid))
    ).map(s => {
      const studentCourses = s.enrolledCourses.filter(cid => courseIds.includes(cid));
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        courses: studentCourses.map(cid => ({
          courseId: cid,
          title: courses.find(c => c.id === cid)?.title || "Course",
          progress: s.progress[cid] || 0,
          attendanceCount: s.attendance[cid]?.length || 0
        }))
      };
    });

    // Get all assignments for these courses
    const allAssignments = await dbService.find('assignments');
    const instructorAssignments = allAssignments.filter(a => courseIds.includes(a.courseId));

    res.json({
      courses,
      students,
      assignments: instructorAssignments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.gradeAssignment = async (req, res) => {
  const { assignmentId, studentId, grade, feedback } = req.body;
  if (!assignmentId || !studentId || !grade) {
    return res.status(400).json({ message: "Assignment ID, Student ID, and Grade are required" });
  }

  try {
    const assignment = await dbService.findOne('assignments', { id: assignmentId });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submissions = assignment.submissions.map(sub => {
      if (sub.studentId === studentId) {
        return { ...sub, grade, feedback: feedback || "" };
      }
      return sub;
    });

    await dbService.findByIdAndUpdate('assignments', assignmentId, { submissions });
    
    // Optionally update student progress when they get graded (simulated boost)
    const student = await dbService.findOne('users', { id: studentId });
    if (student) {
      const currentProgress = { ...(student.progress || {}) };
      const courseId = assignment.courseId;
      if (currentProgress[courseId] !== undefined) {
        // Increase progress slightly as feedback is received
        currentProgress[courseId] = Math.min(100, currentProgress[courseId] + 10);
        await dbService.findByIdAndUpdate('users', studentId, { progress: currentProgress });
      }
    }

    res.json({ message: "Assignment graded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAssignment = async (req, res) => {
  const { title, description, courseId, dueDate } = req.body;
  if (!title || !courseId || !dueDate) {
    return res.status(400).json({ message: "Title, Course ID, and Due Date are required" });
  }
  try {
    const newAssign = await dbService.create('assignments', {
      title,
      description: description || "",
      courseId,
      dueDate,
      submissions: []
    });
    res.status(201).json(newAssign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- ADMIN PORTAL ---
exports.getAdminDashboard = async (req, res) => {
  try {
    const students = await dbService.find('users', { role: 'student' });
    const instructors = await dbService.find('users', { role: 'instructor' });
    const courses = await dbService.find('courses');
    const enrollments = await dbService.find('enrollments');
    const inquiries = await dbService.find('inquiries');

    const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

    res.json({
      stats: {
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalCourses: courses.length,
        totalRevenue,
        totalInquiries: inquiries.length
      },
      users: [...students, ...instructors].map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone })),
      enrollments,
      inquiries
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminCreateUser = async (req, res) => {
  const { name, email, password, role, phone, bio, qualifications } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required" });
  }
  try {
    const existing = await dbService.findOne('users', { email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newUser = await dbService.create('users', {
      name,
      email,
      password,
      role,
      phone: phone || "",
      bio: bio || "",
      qualifications: qualifications || "",
      enrolledCourses: [],
      progress: {},
      attendance: {}
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminDeleteUser = async (req, res) => {
  try {
    const success = await dbService.findByIdAndDelete('users', req.params.id);
    if (!success) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- BLOGS, INQUIRIES & JOBS ---
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await dbService.find('blogs');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBlog = async (req, res) => {
  const { title, excerpt, content, category, author, readTime, image } = req.body;
  try {
    const newBlog = await dbService.create('blogs', {
      title,
      excerpt,
      content,
      category: category || "Tech Trends",
      author: author || "Admin",
      readTime: readTime || "5 min read",
      image: image || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600",
      date: new Date().toISOString().split('T')[0]
    });
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await dbService.find('jobs');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createJob = async (req, res) => {
  const { title, company, description, deadline, applicationLink, requirements } = req.body;
  try {
    const newJob = await dbService.create('jobs', {
      title,
      company,
      description,
      deadline,
      applicationLink,
      requirements
    });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createInquiry = async (req, res) => {
  const { name, email, message, purpose } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }
  try {
    const newInquiry = await dbService.create('inquiries', {
      name,
      email,
      message,
      purpose: purpose || "General Inquiry",
      date: new Date().toISOString()
    });
    res.status(201).json(newInquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- RESOURCES ---
exports.getResources = async (req, res) => {
  const { courseId, userId } = req.query;
  try {
    let query = {};
    if (courseId) {
      query = { courseId };
    } else if (userId) {
      // Find courses student is enrolled in
      const student = await dbService.findOne('users', { id: userId });
      if (student && student.enrolledCourses) {
        const resources = await dbService.find('resources');
        const studentResources = resources.filter(resItem => student.enrolledCourses.includes(resItem.courseId));
        return res.json(studentResources);
      }
      return res.json([]);
    }
    const resources = await dbService.find('resources', query);
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createResource = async (req, res) => {
  const { title, courseId, type, link, uploadedBy } = req.body;
  if (!title || !courseId || !type || !link) {
    return res.status(400).json({ message: "Title, Course ID, Type, and Link are required" });
  }
  try {
    const course = await dbService.findOne('courses', { id: courseId });
    const newResource = await dbService.create('resources', {
      title,
      courseId,
      courseTitle: course ? course.title : "General",
      type,
      link,
      uploadedBy: uploadedBy || "Instructor",
      date: new Date().toISOString()
    });
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const deleted = await dbService.findByIdAndDelete('resources', req.params.id);
    if (!deleted) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- DEMO BOOKINGS ---
exports.getDemoBookings = async (req, res) => {
  try {
    const bookings = await dbService.find('demobookings');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- STUDENT CHECK-IN ---
exports.studentAttendanceCheckIn = async (req, res) => {
  const { userId, courseId, date } = req.body;
  if (!userId || !courseId || !date) {
    return res.status(400).json({ message: "User ID, Course ID, and Date are required" });
  }
  try {
    const student = await dbService.findOne('users', { id: userId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const attendance = { ...(student.attendance || {}) };
    if (!attendance[courseId]) {
      attendance[courseId] = [];
    }

    if (!attendance[courseId].includes(date)) {
      attendance[courseId].push(date);
      // Automatically increment progress slightly as reward for check-in
      const progress = { ...(student.progress || {}) };
      if (progress[courseId] !== undefined) {
        progress[courseId] = Math.min(100, progress[courseId] + 5);
      }

      await dbService.findByIdAndUpdate('users', userId, { attendance, progress });
    }

    res.json({ message: "Attendance checked in successfully", attendance: attendance[courseId] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- REVIEWS ---
exports.getReviews = async (req, res) => {
  const { courseId } = req.query;
  try {
    let query = {};
    if (courseId) {
      query = { courseId };
    }
    const reviews = await dbService.find('reviews', query);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  const { courseId, studentId, studentName, rating, reviewText } = req.body;
  if (!courseId || !studentId || !rating || !reviewText) {
    return res.status(400).json({ message: "Course ID, Student ID, Rating, and Review Text are required" });
  }

  try {
    const course = await dbService.findOne('courses', { id: courseId });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const newReview = await dbService.create('reviews', {
      courseId,
      courseTitle: course.title,
      studentId,
      studentName: studentName || "Anonymous Student",
      rating: Number(rating),
      reviewText,
      date: new Date().toISOString()
    });

    // Boost course popularity slightly on positive reviews
    const currentPopularity = course.popularity || 50;
    const newPopularity = Math.min(100, currentPopularity + (Number(rating) >= 4 ? 2 : 0));
    await dbService.findByIdAndUpdate('courses', courseId, { popularity: newPopularity });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
