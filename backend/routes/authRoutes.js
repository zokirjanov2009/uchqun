import express from 'express';
import { login, refreshToken, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { loginValidator, refreshTokenValidator } from '../validators/authValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.post('/login', authLimiter, loginValidator, handleValidationErrors, login);
router.post('/refresh', refreshTokenValidator, handleValidationErrors, refreshToken);
router.get('/me', authenticate, getMe);

export default router;

