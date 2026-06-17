const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'db');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Helper to get filepath
const getFilePath = (collection) => path.join(DB_DIR, `${collection}.json`);

// Helper to read database collection
const readCollection = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    // Return default seed data or empty array
    const seed = getSeedData(collection);
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading collection ${collection}:`, err);
    return [];
  }
};

// Helper to write database collection
const writeCollection = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing collection ${collection}:`, err);
    return false;
  }
};

// Seed data to make the app work out of the box with realistic content
const getSeedData = (collection) => {
  switch (collection) {
    case 'users':
      return [
        {
          id: "admin-1",
          name: "Srijana Admin",
          email: "admin@it-tms.com",
          password: "adminpassword", // In a real app we'd bcrypt this, but keeping simple for local demo
          role: "admin",
          phone: "+977-9800000000"
        },
        {
          id: "inst-1",
          name: "Dr. Sandeep Koirala",
          email: "sandeep@it-tms.com",
          password: "password123",
          role: "instructor",
          phone: "+977-9811111111",
          bio: "Ph.D. in Computer Science with 12+ years of teaching and industrial development experience.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          qualifications: "Ph.D. CS, Certified Java Enterprise Architect",
          achievements: "Authored 3 books on Web Architecture"
        },
        {
          id: "inst-2",
          name: "Neha Sharma",
          email: "neha@it-tms.com",
          password: "password123",
          role: "instructor",
          phone: "+977-9822222222",
          bio: "Senior UI/UX Designer and Frontend Specialist. Worked with global design agencies.",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
          qualifications: "M.Des, Adobe Certified Expert",
          achievements: "Designed apps with 1M+ active users"
        },
        {
          id: "stud-1",
          name: "Rohan Adhikari",
          email: "rohan@gmail.com",
          password: "password123",
          role: "student",
          phone: "+977-9841234567",
          enrolledCourses: ["course-1"],
          progress: {
            "course-1": 65
          },
          attendance: {
            "course-1": ["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-05", "2026-06-08", "2026-06-09"]
          }
        }
      ];
    case 'courses':
      return [
        {
          id: "course-1",
          title: "Full-Stack Web Development (MERN)",
          description: "Master modern web development using MongoDB, Express, React, and Node.js. Build real-world applications.",
          category: "Web Development",
          level: "Intermediate",
          duration: "12 weeks",
          fee: 25000,
          instructorId: "inst-1",
          instructorName: "Dr. Sandeep Koirala",
          enrollmentDeadline: "2026-06-30",
          prerequisites: "Basic understanding of programming (HTML/CSS)",
          syllabus: [
            "Introduction to HTML5, CSS3, & Modern JS",
            "React.js Fundamentals & Hooks",
            "Routing, State Management (Redux/Context)",
            "Node.js & Express Server setup",
            "MongoDB Database Designing & Mongoose",
            "REST API Development & Authentication",
            "Deployment (Vercel, Heroku, AWS)"
          ],
          demoSlots: [
            { id: "slot-1", date: "2026-06-15", time: "11:00 AM - 12:30 PM", booked: false },
            { id: "slot-2", date: "2026-06-18", time: "03:00 PM - 04:30 PM", booked: false }
          ],
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
          popularity: 98,
          createdAt: "2026-05-01"
        },
        {
          id: "course-2",
          title: "Python for Data Science & Machine Learning",
          description: "Analyze large datasets and build predictive models using NumPy, Pandas, Scikit-Learn, and TensorFlow.",
          category: "Data Science & Analytics",
          level: "Advanced",
          duration: "10 weeks",
          fee: 30000,
          instructorId: "inst-1",
          instructorName: "Dr. Sandeep Koirala",
          enrollmentDeadline: "2026-07-05",
          prerequisites: "Basic Mathematics and programming logic",
          syllabus: [
            "Python Crash Course & Object-Oriented Concepts",
            "Data Analysis with Pandas and NumPy",
            "Data Visualization (Matplotlib, Seaborn)",
            "Supervised Learning: Regression & Classification",
            "Unsupervised Learning: Clustering & PCA",
            "Introduction to Deep Learning & Neural Networks"
          ],
          demoSlots: [
            { id: "slot-3", date: "2026-06-16", time: "01:00 PM - 02:30 PM", booked: false }
          ],
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
          popularity: 94,
          createdAt: "2026-05-10"
        },
        {
          id: "course-3",
          title: "UI/UX Design & Graphic Artistry",
          description: "Learn design thinking, wireframing, prototyping, and graphic design using Figma, Photoshop, and Illustrator.",
          category: "Graphic Design",
          level: "Beginner",
          duration: "8 weeks",
          fee: 18000,
          instructorId: "inst-2",
          instructorName: "Neha Sharma",
          enrollmentDeadline: "2026-06-25",
          prerequisites: "No prior experience required",
          syllabus: [
            "Design Fundamentals, Typography & Color Theory",
            "User Research & Wireframing (Figma)",
            "Interactive Prototyping & Micro-interactions",
            "Vector Graphics Creation (Adobe Illustrator)",
            "Photo Manipulation & Creative Art (Adobe Photoshop)",
            "Creating Professional Design Portfolios"
          ],
          demoSlots: [
            { id: "slot-4", date: "2026-06-14", time: "10:00 AM - 11:30 AM", booked: false }
          ],
          image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?w=600",
          popularity: 91,
          createdAt: "2026-05-15"
        }
      ];
    case 'enrollments':
      return [
        {
          id: "enroll-1",
          userId: "stud-1",
          userName: "Rohan Adhikari",
          courseId: "course-1",
          courseTitle: "Full-Stack Web Development (MERN)",
          amountPaid: 12500,
          paymentMethod: "eSewa",
          paymentStatus: "Paid",
          transactionId: "TXN-ESEWA-88493021",
          date: "2026-06-01T10:15:30Z",
          installment: "1st Installment",
          invoiceNo: "INV-2026-001"
        }
      ];
    case 'assignments':
      return [
        {
          id: "assign-1",
          title: "Build Responsive Personal Portfolio Website",
          description: "Create a fully responsive personal portfolio using clean semantic HTML and CSS. Deploy it on GitHub Pages.",
          courseId: "course-1",
          dueDate: "2026-06-20",
          submissions: [
            {
              studentId: "stud-1",
              studentName: "Rohan Adhikari",
              submissionText: "Here is my portfolio URL: rohandev.github.io/portfolio",
              submissionDate: "2026-06-08T14:30:00Z",
              grade: "A",
              feedback: "Excellent layout structure and typography! Great job on responsiveness."
            }
          ]
        }
      ];
    case 'inquiries':
      return [
        {
          id: "inq-1",
          name: "Binod Shrestha",
          email: "binod@outlook.com",
          message: "Interested in the next Python batch. Are there weekend options available?",
          purpose: "Course Inquiry",
          date: "2026-06-09T08:12:00Z"
        }
      ];
    case 'jobs':
      return [
        {
          id: "job-1",
          title: "Junior React Developer",
          company: "TechCraft Solutions (Kathmandu)",
          description: "We are looking for a motivated React developer. Familiarity with state management and Tailwind CSS is a plus.",
          deadline: "2026-06-30",
          applicationLink: "https://techcraft.com.np/careers",
          requirements: "React.js, Javascript, CSS, Git"
        },
        {
          id: "job-2",
          title: "Associate UI/UX Designer",
          company: "CreativeEdge Agency",
          description: "Design mockups, interactive prototypes and maintain design systems for client web applications.",
          deadline: "2026-07-15",
          applicationLink: "https://creativeedge.org/jobs",
          requirements: "Figma, Adobe XD, Portfolio showcasing design process"
        }
      ];
    case 'blogs':
      return [
        {
          id: "blog-1",
          title: "Why MERN Stack is the Ultimate Choice for Web Developers in 2026",
          excerpt: "Unpacking the dominance of React, Node, Express, and MongoDB. Learn why this ecosystem remains top-tier for building modern SaaS products.",
          content: "In 2026, web development is faster and more dynamic than ever. The MERN stack continues to be the industry favorite because of its single-language ecosystem (JavaScript/TypeScript from database to frontend). React allows developers to build smooth, fluid user interfaces. Node and Express handle high-throughput server requirements with ease, and MongoDB gives the ultimate schema flexibility. In this post, we discuss the core advantages of learning MERN and how it increases your hireability in the tech ecosystem...",
          category: "Tech Trends",
          author: "Admin Team",
          readTime: "5 min read",
          image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600",
          date: "2026-06-01"
        },
        {
          id: "blog-2",
          title: "How to Build a Successful Career in Tech: A Step-by-Step Guide",
          excerpt: "Struggling to find your first developer role? Here is a practical roadmap detailing portfolio building, networking, and interview prep.",
          content: "Breaking into the tech industry can feel overwhelming with the sheer number of frameworks and concepts. The secret lies in structured learning and consistency. First, select a solid core path—whether it is design, coding, or data science. Second, build micro-projects that demonstrate you can solve problems. Third, work on your communication. A developer who can speak well and write clean documentation is twice as valuable. Read on to see our recommended job-hunting timeline...",
          category: "Career Advice",
          author: "Sandeep Koirala",
          readTime: "7 min read",
          image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600",
          date: "2026-06-05"
        }
      ];
    case 'resources':
      return [
        {
          id: "res-1",
          title: "MERN Stack Module 1: ES6 Javascript Basics & DOM",
          courseId: "course-1",
          courseTitle: "Full-Stack Web Development (MERN)",
          type: "PDF Document",
          link: "https://javascript.info/",
          uploadedBy: "Dr. Sandeep Koirala",
          date: "2026-06-02T10:00:00Z"
        },
        {
          id: "res-2",
          title: "React Hooks Deep Dive - Live Class Video",
          courseId: "course-1",
          courseTitle: "Full-Stack Web Development (MERN)",
          type: "Video Lecture",
          link: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
          uploadedBy: "Dr. Sandeep Koirala",
          date: "2026-06-06T14:30:00Z"
        },
        {
          id: "res-3",
          title: "Typography and Color Principles Handout",
          courseId: "course-3",
          courseTitle: "UI/UX Design & Graphic Artistry",
          type: "PDF Document",
          link: "https://fonts.google.com/knowledge",
          uploadedBy: "Neha Sharma",
          date: "2026-06-05T09:15:00Z"
        }
      ];
    case 'demobookings':
      return [
        {
          id: "bk-1",
          courseId: "course-1",
          courseTitle: "Full-Stack Web Development (MERN)",
          slotId: "slot-1",
          date: "2026-06-15",
          time: "11:00 AM - 12:30 PM",
          name: "Aashish Giri",
          email: "aashish@gmail.com",
          phone: "9851012345",
          status: "Confirmed"
        }
      ];
    case 'reviews':
      return [
        {
          id: "rev-1",
          courseId: "course-1",
          courseTitle: "Full-Stack Web Development (MERN)",
          studentId: "stud-1",
          studentName: "Rohan Adhikari",
          rating: 5,
          reviewText: "The MERN stack program at Sipalaya is exceptional. The curriculum is purely hands-on, covering everything from core ES6 JS up to deploying production react applications. The instructor provided valuable support on every assignment.",
          date: "2026-06-10T09:00:00.000Z"
        },
        {
          id: "rev-2",
          courseId: "course-1",
          courseTitle: "Full-Stack Web Development (MERN)",
          studentId: "stud-2",
          studentName: "Aashish Giri",
          rating: 5,
          reviewText: "Superb course! I entered with minimal JS skills, and now I can comfortably build complete REST APIs. The placement coordinator also helped refine my resume for F1Soft internships.",
          date: "2026-06-12T14:20:00.000Z"
        },
        {
          id: "rev-3",
          courseId: "course-3",
          courseTitle: "UI/UX Design & Graphic Artistry",
          studentId: "stud-3",
          studentName: "Sujata Shakya",
          rating: 5,
          reviewText: "Great experience learning from Neha Sharma. The course runs from design fundamentals to wireframing and interactive prototyping. Highly recommended for aspiring UI/UX designers in Nepal.",
          date: "2026-06-13T10:15:30.000Z"
        }
      ];
    default:
      return [];
  }
};

// Database APIs matching standard basic MongoDB commands
const dbStore = {
  find: (collection, filter = {}) => {
    const items = readCollection(collection);
    return items.filter(item => {
      for (let key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
  },

  findOne: (collection, filter = {}) => {
    const items = readCollection(collection);
    return items.find(item => {
      for (let key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    }) || null;
  },

  create: (collection, doc) => {
    const items = readCollection(collection);
    const newDoc = {
      id: doc.id || `${collection.substring(0, 4)}-${Math.random().toString(36).substr(2, 9)}`,
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString()
    };
    items.push(newDoc);
    writeCollection(collection, items);
    return newDoc;
  },

  findByIdAndUpdate: (collection, id, updates) => {
    const items = readCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    writeCollection(collection, items);
    return items[index];
  },

  findByIdAndDelete: (collection, id) => {
    const items = readCollection(collection);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    writeCollection(collection, filtered);
    return true;
  }
};

module.exports = dbStore;
