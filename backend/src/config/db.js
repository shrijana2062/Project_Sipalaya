const mongoose = require('mongoose');
const dbStore = require('../models/dbStore');

let isMongoConnected = false;

// We can define simple Mongoose Schemas dynamically if Mongo is connected
const Schemas = {};
const Models = {};

const initMongoModels = () => {
  try {
    Schemas.User = new mongoose.Schema({
      id: { type: String, unique: true },
      name: String,
      email: { type: String, unique: true },
      password: { type: String },
      role: { type: String, enum: ['student', 'instructor', 'admin'] },
      phone: String,
      bio: String,
      avatar: String,
      qualifications: String,
      achievements: String,
      enrolledCourses: [String],
      progress: mongoose.Schema.Types.Mixed, // courseId -> percentage
      attendance: mongoose.Schema.Types.Mixed // courseId -> array of dates
    }, { timestamps: true });

    Schemas.Course = new mongoose.Schema({
      id: { type: String, unique: true },
      title: String,
      description: String,
      category: String,
      level: String,
      duration: String,
      fee: Number,
      instructorId: String,
      instructorName: String,
      enrollmentDeadline: String,
      prerequisites: String,
      syllabus: [String],
      demoSlots: [{ id: String, date: String, time: String, booked: Boolean }],
      image: String,
      popularity: Number
    }, { timestamps: true });

    Schemas.Enrollment = new mongoose.Schema({
      id: { type: String, unique: true },
      userId: String,
      userName: String,
      courseId: String,
      courseTitle: String,
      amountPaid: Number,
      paymentMethod: String,
      paymentStatus: String,
      transactionId: String,
      date: { type: Date, default: Date.now },
      installment: String,
      invoiceNo: String
    });

    Schemas.Assignment = new mongoose.Schema({
      id: { type: String, unique: true },
      title: String,
      description: String,
      courseId: String,
      dueDate: String,
      submissions: [{
        studentId: String,
        studentName: String,
        submissionText: String,
        submissionDate: { type: Date, default: Date.now },
        grade: String,
        feedback: String
      }]
    });

    Schemas.Inquiry = new mongoose.Schema({
      id: { type: String, unique: true },
      name: String,
      email: String,
      message: String,
      purpose: String,
      date: { type: Date, default: Date.now }
    });

    Schemas.Job = new mongoose.Schema({
      id: { type: String, unique: true },
      title: String,
      company: String,
      description: String,
      deadline: String,
      applicationLink: String,
      requirements: String
    });

    Schemas.Blog = new mongoose.Schema({
      id: { type: String, unique: true },
      title: String,
      excerpt: String,
      content: String,
      category: String,
      author: String,
      readTime: String,
      image: String,
      date: String
    }, { timestamps: true });

    Schemas.Resource = new mongoose.Schema({
      id: { type: String, unique: true },
      title: String,
      courseId: String,
      courseTitle: String,
      type: String,
      link: String,
      uploadedBy: String,
      date: { type: Date, default: Date.now }
    }, { timestamps: true });

    Schemas.DemoBooking = new mongoose.Schema({
      id: { type: String, unique: true },
      courseId: String,
      courseTitle: String,
      slotId: String,
      date: String,
      time: String,
      name: String,
      email: String,
      phone: String,
      status: { type: String, default: 'Confirmed' }
    }, { timestamps: true });

    Schemas.Review = new mongoose.Schema({
      id: { type: String, unique: true },
      courseId: String,
      courseTitle: String,
      studentId: String,
      studentName: String,
      rating: Number,
      reviewText: String,
      date: { type: Date, default: Date.now }
    }, { timestamps: true });

    Models.users = mongoose.models.User || mongoose.model('User', Schemas.User);
    Models.courses = mongoose.models.Course || mongoose.model('Course', Schemas.Course);
    Models.enrollments = mongoose.models.Enrollment || mongoose.model('Enrollment', Schemas.Enrollment);
    Models.assignments = mongoose.models.Assignment || mongoose.model('Assignment', Schemas.Assignment);
    Models.inquiries = mongoose.models.Inquiry || mongoose.model('Inquiry', Schemas.Inquiry);
    Models.jobs = mongoose.models.Job || mongoose.model('Job', Schemas.Job);
    Models.blogs = mongoose.models.Blog || mongoose.model('Blog', Schemas.Blog);
    Models.resources = mongoose.models.Resource || mongoose.model('Resource', Schemas.Resource);
    Models.demobookings = mongoose.models.DemoBooking || mongoose.model('DemoBooking', Schemas.DemoBooking);
    Models.reviews = mongoose.models.Review || mongoose.model('Review', Schemas.Review);
  } catch (err) {
    console.error("Failed to initialize Mongoose schemas:", err);
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log("⚠️ No MONGODB_URI environment variable found. Falling back to local JSON database storage.");
    return false;
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✨ Connected to MongoDB database successfully.");
    isMongoConnected = true;
    initMongoModels();
    
    // Seed initial data to MongoDB if empty
    await seedMongoData();
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️ Falling back to local JSON database storage.");
    isMongoConnected = false;
    return false;
  }
};

const seedMongoData = async () => {
  try {
    for (const key of ['users', 'courses', 'enrollments', 'assignments', 'inquiries', 'jobs', 'blogs', 'resources', 'demobookings', 'reviews']) {
      const count = await Models[key].countDocuments({});
      if (count === 0) {
        console.log(`Seeding initial data for ${key} collection in MongoDB...`);
        const data = dbStore.find(key); // Get local seed data
        await Models[key].insertMany(data);
      }
    }
  } catch (err) {
    console.error("Failed to seed MongoDB collections:", err);
  }
};

const dbService = {
  connect: connectDB,
  
  find: async (collection, filter = {}) => {
    if (isMongoConnected && Models[collection]) {
      return await Models[collection].find(filter).lean();
    }
    return dbStore.find(collection, filter);
  },

  findOne: async (collection, filter = {}) => {
    if (isMongoConnected && Models[collection]) {
      return await Models[collection].findOne(filter).lean();
    }
    return dbStore.findOne(collection, filter);
  },

  create: async (collection, doc) => {
    if (isMongoConnected && Models[collection]) {
      const newDoc = new Models[collection]({
        id: doc.id || `${collection.substring(0, 4)}-${Math.random().toString(36).substr(2, 9)}`,
        ...doc
      });
      return await newDoc.save();
    }
    return dbStore.create(collection, doc);
  },

  findByIdAndUpdate: async (collection, id, updates) => {
    if (isMongoConnected && Models[collection]) {
      return await Models[collection].findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
    }
    return dbStore.findByIdAndUpdate(collection, id, updates);
  },

  findByIdAndDelete: async (collection, id) => {
    if (isMongoConnected && Models[collection]) {
      const result = await Models[collection].deleteOne({ id });
      return result.deletedCount > 0;
    }
    return dbStore.findByIdAndDelete(collection, id);
  }
};

module.exports = dbService;
