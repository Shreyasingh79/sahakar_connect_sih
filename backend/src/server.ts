import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import routes from './routes';
import { db } from './db';
import { setSocketIO } from './controllers/bookingController';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

setSocketIO(io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join:room', (room: string) => {
    socket.join(room);
    console.log(`[Socket.io] Client ${socket.id} joined room: ${room}`);
  });

  socket.on('leave:room', (room: string) => {
    socket.leave(room);
    console.log(`[Socket.io] Client ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'SahakarConnect API',
    edition: 'SIH 2026 - Problem Statement 26089',
    sponsor: 'Ministry of Cooperation, Government of India',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routes);

// In production or monorepo deployment, serve frontend static build if present
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log(`[Frontend] Serving static production build from: ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  await db.init();

  server.listen(PORT, '0.0.0.0', () => {
    console.log('================================================================');
    console.log(`🚀 SahakarConnect API Server running on port ${PORT}`);
    console.log(`📍 Endpoint: http://localhost:${PORT}/api`);
    console.log(`🤝 Ministry of Cooperation | SIH 2026 PS 26089`);
    console.log('================================================================');
  });
}

startServer();

export { app, server, io };
