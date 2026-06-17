const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbService = require('./config/db');
const apiRoutes = require('./routes/api');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow connections from any frontend origin during local development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: "online",
    message: "IT Training Management System API is running smoothly",
    timestamp: new Date().toISOString()
  });
});

// Initialize database & Start Server
const startServer = async () => {
  // Connect database (handles MongoDB fallback internally)
  await dbService.connect();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  console.error("Critical server startup error:", err);
});
