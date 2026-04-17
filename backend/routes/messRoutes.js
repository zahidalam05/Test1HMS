import express from 'express';
import { getMenu, updateMenu, applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, getActivePoll, createPoll, voteCandidate } from '../controllers/messController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/menu', protect, getMenu);
router.post('/menu', protect, updateMenu); // Student (MessSec) or Admin

router.post('/leave', protect, applyLeave);
router.get('/leave/my', protect, getMyLeaves);
router.get('/leave/all', protect, admin, getAllLeaves);
router.put('/leave/:id', protect, admin, updateLeaveStatus);

router.get('/poll', protect, getActivePoll);
router.post('/poll', protect, admin, createPoll);
router.post('/poll/vote', protect, voteCandidate);

export default router;
