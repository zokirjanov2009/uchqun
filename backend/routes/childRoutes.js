import express from 'express';
import { getChildren, getChild, updateChild } from '../controllers/childController.js';
import { authenticate } from '../middleware/auth.js';
import { updateChildValidator, childIdValidator } from '../validators/childValidator.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

// Get all children for the logged-in parent
router.get('/', getChildren);
// Get a specific child by ID
router.get('/:id', childIdValidator, handleValidationErrors, getChild);
// Update a specific child by ID
router.put('/:id', childIdValidator, updateChildValidator, handleValidationErrors, updateChild);

export default router;

