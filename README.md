# Prenatal AI Clinic 🤱

A modern, AI-powered chatbot application designed specifically for prenatal care and pregnancy support. Built with React (Vite), Express.js, and FastAPI for comprehensive pregnancy guidance and information.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Express API    │    │   FastAPI       │
│   (Frontend)    │───▶│   (Backend)     │───▶│   (AI Engine)   │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │  Chat History   │    │  RAG Documents  │
│   Chat Messages │    │  User Sessions  │    │  Vector Store   │
│   Navigation    │    │  API Gateway    │    │  LLM Processing │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Python 3.10+ (for FastAPI backend)

### Installation

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd prenatal-ai-clinic
```

2. **Install all dependencies:**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Go back to root
cd ..
```

3. **Environment Setup:**

Create `.env` files in both frontend and backend directories:

**frontend/.env:**
```env
VITE_API_URL=http://localhost:3001
VITE_FASTAPI_URL=http://localhost:8001
```

**backend/.env:**
```env
PORT=3001
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/
DB_NAME=prenatal_chatbot
FASTAPI_URL=http://localhost:8001
NODE_ENV=development
```

4. **Start the development servers:**

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run frontend    # React app on http://localhost:5173
npm run backend     # Express API on http://localhost:3001
```

5. **Start your existing FastAPI server:**
```bash
# In your existing FastAPI directory
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## 📁 Project Structure

```
prenatal-ai-clinic/
├── frontend/                 # React + Vite frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Chat/        # Chat-related components
│   │   │   ├── Layout/      # Layout components
│   │   │   └── UI/          # Generic UI components
│   │   ├── pages/           # Main page components
│   │   ├── services/        # API service functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # Global styles
│   ├── .env                 # Frontend environment variables
│   └── package.json
├── backend/                  # Express.js backend
│   ├── routes/              # API route handlers
│   │   ├── chat.js          # Chat-related endpoints
│   │   ├── auth.js          # Authentication (future)
│   │   └── health.js        # Health check endpoints
│   ├── middleware/          # Express middleware
│   ├── services/            # Business logic
│   ├── config/              # Configuration files
│   ├── .env                 # Backend environment variables
│   └── package.json
├── .gitignore               # Git ignore rules
├── package.json             # Root package.json with scripts
└── README.md               # This file
```

## 🛠️ Available Scripts

### Root Level Scripts
```bash
npm run dev         # Start both frontend and backend
npm run frontend    # Start only React frontend
npm run backend     # Start only Express backend
npm run install-all # Install dependencies for both projects
```

### Frontend Scripts
```bash
cd frontend
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Backend Scripts
```bash
cd backend
npm run dev         # Start with nodemon (auto-reload)
npm run start       # Start production server
```

## 🌐 API Endpoints

### Express Backend (Port 3001)
- `GET /api/health` - Health check
- `GET /api/test` - Test connection
- `POST /api/chat` - Send chat message (proxies to FastAPI)
- `GET /api/conversations/:userId` - Get user chat history
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/:id` - Delete conversation

### FastAPI (Port 8001) - Your Existing Endpoints
- `POST /chat` - Process AI chat messages
- `POST /upload-url` - Upload documents from URL
- `POST /upload-file` - Upload document files
- `GET /conversations` - List conversations

## 🎨 Features

### Current Features
- ✅ Modern React interface with Vite
- ✅ Express.js API backend
- ✅ Integration with existing FastAPI
- ✅ Real-time chat interface
- ✅ Chat history management
- ✅ Responsive design
- ✅ MongoDB integration

### Planned Features
- 🔄 User authentication
- 🔄 Pregnancy week tracker
- 🔄 Appointment reminders
- 🔄 Document management
- 🔄 Chat export functionality
- 🔄 Push notifications
- 🔄 Offline support (PWA)

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

### API Testing
```bash
# Test Express backend
curl http://localhost:3001/api/health

# Test FastAPI
curl http://localhost:8001/
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd backend
# Set environment variables
# Deploy with your preferred service
```

### Environment Variables for Production
- Update API URLs to production endpoints
- Use secure MongoDB connection strings
- Set NODE_ENV=production
- Configure CORS for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Consistent naming conventions
- Component-based architecture

### State Management
- React Context for global state
- Custom hooks for data fetching
- Local state for component-specific data

### Error Handling
- Comprehensive error boundaries
- API error handling
- User-friendly error messages
- Logging for debugging

## 🐛 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check if ports are in use
lsof -i :3001
lsof -i :5173
lsof -i :8001
```

**MongoDB connection issues:**
- Ensure MongoDB is running locally
- Check connection string in .env
- Verify database permissions

**API connection issues:**
- Verify all servers are running
- Check CORS configuration
- Ensure environment variables are set

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the GitHub issues
3. Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for expectant mothers and families**