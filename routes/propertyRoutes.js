import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

router.post('/', requireAdminAuth, createProperty);
router.put('/:id', requireAdminAuth, updateProperty);
router.delete('/:id', requireAdminAuth, deleteProperty);

export default router;