import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createAdmin, getAdmins, updateAdminBySuper, deleteAdminBySuper } from '../controllers/adminController.js';

const router = express.Router();

/**
 * Super Admin Routes
 * 
 * Business Logic:
 * - Super Admin can create Admin accounts
 * - Requires authentication (admin role)
 * - Only accessible from Super Admin panel
 */

// All routes require Admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Create admin account (protected by authentication)
router.post('/admins', createAdmin);
// List admin accounts (super admin view)
router.get('/admins', getAdmins);
// Update admin account
router.put('/admins/:id', updateAdminBySuper);
// Delete admin account
router.delete('/admins/:id', deleteAdminBySuper);

export default router;

