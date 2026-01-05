import express from 'express';
import sequelize from '../config/database.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Basic health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'uchqun-backend',
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * Readiness probe - checks if the service is ready to accept traffic
 * Includes database connectivity check
 */
router.get('/readiness', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'healthy',
      },
    });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'unhealthy',
      },
      error: process.env.NODE_ENV === 'production' 
        ? 'Service not ready'
        : error.message,
    });
  }
});

/**
 * Liveness probe - checks if the service is alive
 * Simple check that the process is running
 */
router.get('/liveness', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;



