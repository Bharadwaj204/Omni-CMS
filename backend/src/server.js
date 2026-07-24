const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const Page = require('./models/Page');
const { seedDatabase } = require('./controllers/pageController');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for development ease; configure specifically in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files if any (optional)
app.get('/', (req, res) => {
  res.json({ message: 'CMS Backend API is running. Decoupled and production-ready.' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', pageRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Exception:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Setup Port
const PORT = process.env.PORT || 5000;

// Start Server and Connect Database
const startServer = async () => {
  // Connect to database
  await connectDB();

  // Run auto-seeder if database has no pages
  try {
    const pageCount = await Page.countDocuments();
    if (pageCount === 0) {
      console.log('Database empty. Triggering automatic seeder...');
      // We mimic standard req/res objects for the seeder function
      const mockReq = {};
      const mockRes = {
        status: (code) => ({
          json: (data) => console.log('Auto-seed completed:', data.message)
        })
      };
      await seedDatabase(mockReq, mockRes);
    }
  } catch (seedErr) {
    console.error('Error running auto-seeder:', seedErr.message);
  }

  // Start listening
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
};

startServer();
