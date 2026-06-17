const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/apiControllers');

// Auth routes
router.post('/auth/login', ctrl.login);
router.post('/auth/register', ctrl.register);

// Course routes
router.get('/courses', ctrl.getCourses);
router.get('/courses/:id', ctrl.getCourseById);
router.post('/courses', ctrl.createCourse);
router.put('/courses/:id', ctrl.updateCourse);
router.delete('/courses/:id', ctrl.deleteCourse);
router.post('/courses/book-demo', ctrl.bookDemoSlot);

// Enrollment routes
router.post('/enrollments', ctrl.enroll);
router.get('/enrollments', ctrl.getEnrollments);

// Student portal routes
router.get('/student/dashboard/:userId', ctrl.getStudentDashboard);
router.post('/student/assignments/submit', ctrl.submitAssignment);

// Instructor portal routes
router.get('/instructor/dashboard/:instructorId', ctrl.getInstructorDashboard);
router.post('/instructor/assignments/grade', ctrl.gradeAssignment);
router.post('/instructor/assignments/create', ctrl.createAssignment);

// Admin portal routes
router.get('/admin/dashboard', ctrl.getAdminDashboard);
router.post('/admin/users', ctrl.adminCreateUser);
router.delete('/admin/users/:id', ctrl.adminDeleteUser);

// Blog, Job and Inquiry routes
router.get('/blogs', ctrl.getBlogs);
router.post('/blogs', ctrl.createBlog);
router.get('/jobs', ctrl.getJobs);
router.post('/jobs', ctrl.createJob);
router.post('/inquiries', ctrl.createInquiry);

// Review routes
router.get('/reviews', ctrl.getReviews);
router.post('/reviews', ctrl.createReview);

// Resources routes
router.get('/resources', ctrl.getResources);
router.post('/resources', ctrl.createResource);
router.delete('/resources/:id', ctrl.deleteResource);

// Demo Bookings route
router.get('/admin/demo-bookings', ctrl.getDemoBookings);

// Attendance self check-in
router.post('/student/attendance/check-in', ctrl.studentAttendanceCheckIn);

module.exports = router;
