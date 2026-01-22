import express from 'express';
import cors from 'cors';
import { authController } from './controllers/authController.js';
import { postsController } from './controllers/postsController.js';
import { userService } from './services/userService.js';
import { postService } from './services/postService.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize data files on startup
const initializeDataFiles = async () => {
  try {
    await userService.ensureUsersFile();
    await postService.ensurePostsFile();
    console.log('✅ Data files initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing data files:', error);
  }
};

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authController.getCurrentUser);

// Posts routes
app.get('/api/posts', postsController.getPosts);
app.post('/api/posts', postsController.createPost);
app.get('/api/posts/:id', postsController.getPostById);
app.delete('/api/posts/:id', postsController.deletePost);

// Health check endpoint
app.get('/api/auth/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Initialize data files and start server
initializeDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});