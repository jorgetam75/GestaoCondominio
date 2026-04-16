import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { config, validateConfig } from './config/index.js';
import { initializeDatabase } from './database/connection.js';
import authRoutes from './routes/auth.js';
import buildingsRoutes from './routes/buildings.js';
import unitsRoutes from './routes/units.js';
import residentsRoutes from './routes/residents.js';
import financialRoutes from './routes/financial.js';
import maintenanceRoutes from './routes/maintenance.js';
import announcementsRoutes from './routes/announcements.js';
import complaintsRoutes from './routes/complaints.js';
import accessCodesRoutes from './routes/access-codes.js';

const app: Express = express();

if (config.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingsRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/residents', residentsRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/access-codes', accessCodesRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status =
    err && typeof err === 'object' && 'status' in err && typeof (err as { status: unknown }).status === 'number'
      ? (err as { status: number }).status
      : 500;
  const message =
    err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string'
      ? (err as { message: string }).message
      : 'Internal server error';

  if (config.isProduction && status >= 500) {
    res.status(status).json({ error: 'Internal server error' });
    return;
  }

  res.status(status).json({
    error: message || 'Internal server error',
  });
});

// Start server
async function start() {
  try {
    // Validate configuration before starting
    validateConfig();

    // Initialize database connection
    await initializeDatabase();
    console.log('✓ Database connected');

    const PORT = config.PORT;
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
