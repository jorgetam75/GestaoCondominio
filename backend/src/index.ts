import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { config } from './config/index.js';
import { initializeDatabase } from './database/connection.js';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes placeholder
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend is running', environment: config.NODE_ENV });
});

// TODO: Add routes for:
// - /api/auth (login, logout, refresh)
// - /api/buildings
// - /api/units
// - /api/residents
// - /api/managers
// - /api/financial
// - /api/maintenance
// - /api/announcements
// - /api/complaints
// - /api/access-codes

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
async function start() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✓ Database connected');

    const PORT = config.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server started on http://localhost:${PORT}`);
      console.log(`📚 API documentation: http://localhost:${PORT}/api/docs (TODO)`);
      console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
