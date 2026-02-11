import express from 'express';
const router = express.Router();
import { getDashboardStats, getAvailableRooms } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/rooms/available', protect, admin, getAvailableRooms);

export default router;
