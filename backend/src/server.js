import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import {conn} from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
conn();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('DevSnippet API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});