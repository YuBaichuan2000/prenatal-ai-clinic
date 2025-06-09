// backend/routes/chat.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// MongoDB connection
let db;
const connectDB = async () => {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017');
    await client.connect();
    db = client.db(process.env.DB_NAME || 'prenatal_chatbot');
    console.log('📊 Connected to MongoDB for chat history');
  }
  return db;
};

// Chat Collections Schema
/*
conversations: {
  _id: ObjectId,
  conversation_id: string (UUID),
  user_id: string,
  title: string,
  created_at: Date,
  updated_at: Date,
  message_count: number,
  last_message_preview: string
}

messages: {
  _id: ObjectId,
  conversation_id: string,
  message_id: string (UUID), 
  type: 'user' | 'ai',
  content: string,
  timestamp: Date,
  metadata: object (optional)
}

favorites: {
  _id: ObjectId,
  favorite_id: string (UUID),
  user_id: string,
  message_id: string,
  conversation_id: string,
  message_content: string,
  message_timestamp: Date,
  favorited_at: Date,
  metadata: object (optional)
}
*/

// Initialize collections with indexes
const initializeDB = async () => {
  const database = await connectDB();
  
  // Create indexes for better performance
  await database.collection('conversations').createIndex({ conversation_id: 1 }, { unique: true });
  await database.collection('conversations').createIndex({ user_id: 1, updated_at: -1 });
  await database.collection('messages').createIndex({ conversation_id: 1, timestamp: 1 });
  
  // Favorites collection indexes
  await database.collection('favorites').createIndex({ user_id: 1, favorited_at: -1 });
  await database.collection('favorites').createIndex({ user_id: 1, message_id: 1 }, { unique: true });
  await database.collection('favorites').createIndex({ conversation_id: 1 });
  
  console.log('✅ Database indexes created');
};

// FastAPI Configuration
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8001';

// 1. POST /api/chat - Main chat endpoint with real-time saving
router.post('/chat', async (req, res) => {
  try {
    const { message, conversation_id, user_id } = req.body;
    
    // Validation
    if (!message || !user_id) {
      return res.status(400).json({ 
        error: 'Message and user_id are required' 
      });
    }

    const database = await connectDB();
    let currentConversationId = conversation_id;

    // Step 1: Create new conversation if needed
    if (!currentConversationId) {
      currentConversationId = uuidv4();
      
      await database.collection('conversations').insertOne({
        conversation_id: currentConversationId,
        user_id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        created_at: new Date(),
        updated_at: new Date(),
        message_count: 0,
        last_message_preview: message.substring(0, 100)
      });
      
      console.log(`✅ Created new conversation: ${currentConversationId}`);
    }

    // Step 2: Save user message immediately to MongoDB
    const userMessageId = uuidv4();
    const userTimestamp = new Date();
    
    await database.collection('messages').insertOne({
      conversation_id: currentConversationId,
      message_id: userMessageId,
      type: 'user',
      content: message,
      timestamp: userTimestamp,
      metadata: { user_id }
    });

    console.log(`💾 Saved user message: ${userMessageId}`);

    // Step 3: Forward to FastAPI for AI processing
    console.log(`🚀 Forwarding to FastAPI: ${FASTAPI_URL}/chat`);
    
    const fastApiResponse = await axios.post(`${FASTAPI_URL}/chat`, {
      message,
      thread_id: currentConversationId, // Use conversation_id as thread_id for FastAPI
      user_id
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = fastApiResponse.data.response;
    
    // Step 4: Save AI response immediately to MongoDB
    const aiMessageId = uuidv4();
    const aiTimestamp = new Date();
    
    await database.collection('messages').insertOne({
      conversation_id: currentConversationId,
      message_id: aiMessageId,
      type: 'ai',
      content: aiResponse,
      timestamp: aiTimestamp,
      metadata: { 
        fastapi_thread_id: fastApiResponse.data.thread_id,
        model_used: 'gpt-4o-mini' // Could get this from FastAPI response
      }
    });

    console.log(`💾 Saved AI response: ${aiMessageId}`);

    // Step 5: Update conversation metadata
    await database.collection('conversations').updateOne(
      { conversation_id: currentConversationId },
      { 
        $set: { 
          updated_at: aiTimestamp,
          last_message_preview: aiResponse.substring(0, 100),
        },
        $inc: { message_count: 2 } // User + AI message
      }
    );

    // Step 6: Return response to frontend
    res.json({
      response: aiResponse,
      conversation_id: currentConversationId,
      message_id: aiMessageId,
      timestamp: aiTimestamp
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    
    // Check if it's a FastAPI connection error
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable',
        message: 'Please try again in a moment'
      });
    }
    
    if (error.response?.status === 422) {
      return res.status(400).json({ 
        error: 'Invalid request format',
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// 2. GET /api/conversations/:user_id - Get user's conversation history
router.get('/conversations/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const database = await connectDB();
    
    const conversations = await database.collection('conversations')
      .find({ user_id })
      .sort({ updated_at: -1 })
      .limit(50) // Limit for performance
      .toArray();
    
    res.json({ conversations });
  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// 3. GET /api/conversations/:conversation_id/messages - Get conversation messages
router.get('/conversations/:conversation_id/messages', async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const database = await connectDB();
    
    // Verify conversation exists and get user_id for security
    const conversation = await database.collection('conversations')
      .findOne({ conversation_id });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const messages = await database.collection('messages')
      .find({ conversation_id })
      .sort({ timestamp: 1 })
      .toArray();
    
    res.json({ 
      conversation,
      messages,
      total_messages: messages.length
    });
  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// 4. POST /api/conversations/new - Create new conversation (optional, can be done in chat)
router.post('/conversations/new', async (req, res) => {
  try {
    const { user_id, title } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    
    const conversation_id = uuidv4();
    const now = new Date();
    
    const database = await connectDB();
    
    await database.collection('conversations').insertOne({
      conversation_id,
      user_id,
      title: title || 'New Conversation',
      created_at: now,
      updated_at: now,
      message_count: 0,
      last_message_preview: ''
    });
    
    res.json({ 
      conversation_id,
      message: 'New conversation created'
    });
    
  } catch (error) {
    console.error('❌ Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// 5. DELETE /api/conversations/:conversation_id - Delete conversation
router.delete('/conversations/:conversation_id', async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const { user_id } = req.body; // For security
    
    const database = await connectDB();
    
    // Verify ownership
    const conversation = await database.collection('conversations')
      .findOne({ conversation_id, user_id });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found or unauthorized' });
    }
    
    // Delete messages first
    await database.collection('messages').deleteMany({ conversation_id });
    
    // Delete conversation
    await database.collection('conversations').deleteOne({ conversation_id });
    
    res.json({ message: 'Conversation deleted successfully' });
    
  } catch (error) {
    console.error('❌ Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// 6. POST /api/favorites - Add message to favorites
router.post('/favorites', async (req, res) => {
  try {
    const { user_id, message_id, conversation_id } = req.body;
    
    if (!user_id || !message_id || !conversation_id) {
      return res.status(400).json({ 
        error: 'user_id, message_id, and conversation_id are required' 
      });
    }
    
    const database = await connectDB();
    
    // Check if message exists and get its content
    const message = await database.collection('messages')
      .findOne({ message_id, conversation_id });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Check if already favorited
    const existingFavorite = await database.collection('favorites')
      .findOne({ user_id, message_id });
    
    if (existingFavorite) {
      return res.status(409).json({ error: 'Message already favorited' });
    }
    
    const favorite_id = uuidv4();
    const favorited_at = new Date();
    
    await database.collection('favorites').insertOne({
      favorite_id,
      user_id,
      message_id,
      conversation_id,
      message_content: message.content,
      message_timestamp: message.timestamp,
      favorited_at,
      metadata: {
        message_type: message.type,
        original_metadata: message.metadata
      }
    });
    
    console.log(`💖 Message favorited: ${message_id} by user: ${user_id}`);
    
    res.json({ 
      favorite_id,
      message: 'Message added to favorites',
      favorited_at
    });
    
  } catch (error) {
    console.error('❌ Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// 7. DELETE /api/favorites/:message_id - Remove message from favorites
router.delete('/favorites/:message_id', async (req, res) => {
  try {
    const { message_id } = req.params;
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    
    const database = await connectDB();
    
    const result = await database.collection('favorites')
      .deleteOne({ user_id, message_id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    console.log(`💔 Message unfavorited: ${message_id} by user: ${user_id}`);
    
    res.json({ message: 'Message removed from favorites' });
    
  } catch (error) {
    console.error('❌ Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// 8. GET /api/favorites/:user_id - Get user's favorite messages with pagination
router.get('/favorites/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const database = await connectDB();
    
    // Get favorites with pagination
    const favorites = await database.collection('favorites')
      .find({ user_id })
      .sort({ favorited_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();
    
    // Get total count for pagination
    const totalCount = await database.collection('favorites')
      .countDocuments({ user_id });
    
    // Get conversation titles for each favorite
    const conversationIds = [...new Set(favorites.map(f => f.conversation_id))];
    const conversations = await database.collection('conversations')
      .find({ conversation_id: { $in: conversationIds } })
      .toArray();
    
    const conversationMap = conversations.reduce((acc, conv) => {
      acc[conv.conversation_id] = conv.title;
      return acc;
    }, {});
    
    // Enrich favorites with conversation titles
    const enrichedFavorites = favorites.map(favorite => ({
      ...favorite,
      conversation_title: conversationMap[favorite.conversation_id] || 'Untitled Conversation'
    }));
    
    res.json({
      favorites: enrichedFavorites,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        hasNext: pageNum < Math.ceil(totalCount / limitNum),
        hasPrev: pageNum > 1
      }
    });
    
  } catch (error) {
    console.error('❌ Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// 9. GET /api/favorites/:user_id/check/:message_id - Check if message is favorited
router.get('/favorites/:user_id/check/:message_id', async (req, res) => {
  try {
    const { user_id, message_id } = req.params;
    
    const database = await connectDB();
    
    const favorite = await database.collection('favorites')
      .findOne({ user_id, message_id });
    
    res.json({ 
      is_favorited: !!favorite,
      favorite_id: favorite?.favorite_id || null
    });
    
  } catch (error) {
    console.error('❌ Check favorite error:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const database = await connectDB();
    
    // Test database connection
    await database.admin().ping();
    
    // Test FastAPI connection
    const fastApiHealth = await axios.get(`${FASTAPI_URL}/`, { timeout: 5000 });
    
    res.json({
      status: 'healthy',
      database: 'connected',
      fastapi: fastApiHealth.status === 200 ? 'connected' : 'error',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Initialize database when module loads
initializeDB().catch(console.error);

module.exports = router;