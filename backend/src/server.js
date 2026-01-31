import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import { conn } from './config/db.js';

dotenv.config();

const app = express();

// ----------------------
// Fix __dirname for ES modules
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------
// Middleware
// ----------------------
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(cookieParser());

// ----------------------
// Database connection
// ----------------------
conn();

// ----------------------
// API Routes
// ----------------------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// ----------------------
// Production Frontend
// ----------------------
if (process.env.NODE_ENV === 'production') {
  // Path from backend/src/server.js to frontend/dist
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  const frontendIndex = path.join(frontendPath, 'index.html');

  console.log('🔍 Looking for frontend at:', frontendPath);
  console.log('🔍 Looking for index.html at:', frontendIndex);

  if (!fs.existsSync(frontendIndex)) {
    console.error('❌ Frontend index.html not found!');
    console.error('   Make sure you ran: npm run build --prefix frontend');
  } else {
    console.log('✅ Frontend index.html found!');
  }

  // Serve static files (CSS, JS, images)
  app.use(express.static(frontendPath));

  // Catch-all route for React Router (must be last)
  app.get(/.*/, (req, res) => {
    res.sendFile(frontendIndex, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error loading application');
      }
    });
  });
} else {
  // Development root route
  app.get('/', (req, res) => {
    res.send('iPaskil API is running...');
  });
}

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
console.log('🚀 NODE_ENV =', process.env.NODE_ENV);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});