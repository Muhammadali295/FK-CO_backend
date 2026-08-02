import express from 'express';
import {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead
} from '../controllers/leadController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createLead);

router.get('/', requireAdminAuth, getAllLeads);
router.patch('/:id/status', requireAdminAuth, updateLeadStatus);
router.delete('/:id', requireAdminAuth, deleteLead);

export default router;
