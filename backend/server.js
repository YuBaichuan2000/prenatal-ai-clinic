// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting - more generous for chat
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased for chat usage
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default
    'http://localhost:3000', // CRA fallback
    'http://127.0.0.1:5173', // Alternative localhost
    'http://127.0.0.1:3000', // Alternative localhost
    process.env.FRONTEND_URL // Production frontend URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Request-ID']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Increased for longer chat messages
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// API Routes
app.use('/api', chatRoutes);

// Basic health check route (keep for compatibility)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Prenatal AI Clinic Backend',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Prenatal AI Clinic Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      chat: 'POST /api/chat',
      conversations: 'GET /api/conversations/:user_id',
      messages: 'GET /api/conversations/:conversation_id/messages',
      newConversation: 'POST /api/conversations/new',
      deleteConversation: 'DELETE /api/conversations/:conversation_id',
      // Favorites endpoints
      addFavorite: 'POST /api/favorites',
      removeFavorite: 'DELETE /api/favorites/:message_id',
      getFavorites: 'GET /api/favorites/:user_id',
      checkFavorite: 'GET /api/favorites/:user_id/check/:message_id'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Global error:', err);
  
  // MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(503).json({
      error: 'Database service unavailable',
      message: 'Please try again later'
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.message
    });
  }
  
  // Default error response
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 FastAPI URL: ${process.env.FASTAPI_URL || 'http://localhost:8001'}`);
  console.log(`📦 MongoDB: ${process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017'}`);
});

module.exports = app;