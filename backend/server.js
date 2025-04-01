import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'; // Fixed import

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes); // Fixed - removed .js extension

// Assessment submission
app.post('/api/assessment', async (req, res) => {
  try {
    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Process assessment data from request body
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ message: 'Assessment data required' });

    // Process assessment (example)
    const recommendations = [
      {
        title: "Software Developer",
        matchScore: 85,
        description: "Based on your technical skills assessment..."
      }
    ];

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Return dashboard data (example)
    res.json({
      recommendations: [
        {
          title: "Software Developer",
          matchScore: 85,
          description: "Your skills match well with this career path...",
          steps: ["Learn advanced JavaScript", "Build portfolio projects"]
        }
      ],
      skillGap: {
        technicalSkills: 75,
        softSkills: 60
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));