import express from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead } from '../controllers/leadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

export default router;
