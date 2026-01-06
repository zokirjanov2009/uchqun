import Joi from 'joi';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Helper function to check if DATABASE_URL is provided
const hasDatabaseUrl = () => {
  return !!(process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL);
};

// Define environment variable schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),

  // Database Configuration
  // Support both DATABASE_URL (Railway/Heroku) and individual variables
  DATABASE_URL: Joi.string().uri().optional(),
  DATABASE_PUBLIC_URL: Joi.string().uri().optional(),
  // Individual DB variables (optional if DATABASE_URL is provided)
  DB_NAME: Joi.string().optional(),
  DB_USER: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),

  // JWT Configuration
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .messages({
      'string.min': 'JWT_SECRET must be at least 32 characters long for security',
      'any.required': 'JWT_SECRET is required',
    }),
  JWT_REFRESH_SECRET: Joi.string()
    .min(32)
    .required()
    .messages({
      'string.min': 'JWT_REFRESH_SECRET must be at least 32 characters long for security',
      'any.required': 'JWT_REFRESH_SECRET is required',
    }),
  JWT_EXPIRE: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRE: Joi.string().default('7d'),

  // CORS Configuration
  FRONTEND_URL: Joi.string().uri().required(),

  // Database Sync (development only)
  FORCE_SYNC: Joi.string().valid('true', 'false').default('false'),

  // Optional: Redis Configuration (for caching/rate limiting in production)
  REDIS_URL: Joi.string().uri().optional(),
  
  // Optional: Google Cloud Configuration
  GCP_PROJECT_ID: Joi.string().optional(),
  GCS_BUCKET_NAME: Joi.string().optional(),

  // Optional: Sentry Configuration
  SENTRY_DSN: Joi.string().uri().optional(),
})
  .unknown() // Allow other environment variables
  .required();

/**
 * Validate environment variables
 * @throws {Error} If validation fails
 */
export function validateEnv() {
  // Custom validation: Check if DATABASE_URL is provided, if not, require individual DB vars
  const dbUrlProvided = hasDatabaseUrl();
  
  // If DATABASE_URL is not provided, ensure individual DB variables are present
  if (!dbUrlProvided) {
    if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
      throw new Error(
        'Environment variable validation failed:\n' +
        'Either DATABASE_URL/DATABASE_PUBLIC_URL must be provided, or all of DB_NAME, DB_USER, and DB_PASSWORD are required'
      );
    }
  }

  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false, // Collect all errors
    stripUnknown: true, // Remove unknown keys
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message).join('\n');
    throw new Error(`Environment variable validation failed:\n${errorMessages}`);
  }

  // Additional validation: Check that JWT secrets are different
  if (value.JWT_SECRET === value.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different');
  }

  // Additional validation: Check that production has HTTPS
  if (value.NODE_ENV === 'production') {
    if (value.FRONTEND_URL && !value.FRONTEND_URL.startsWith('https://')) {
      console.warn('Warning: FRONTEND_URL should use HTTPS in production');
    }
  }

  return value;
}

// Validate on import
try {
  validateEnv();
  console.log('✓ Environment variables validated successfully');
} catch (error) {
  console.error('✗ Environment variable validation failed:');
  console.error(error.message);
  process.exit(1);
}



