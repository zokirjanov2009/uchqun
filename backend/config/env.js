import Joi from 'joi';

// Define environment variable schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),

  // Database Configuration
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
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
    if (!value.FRONTEND_URL.startsWith('https://')) {
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



