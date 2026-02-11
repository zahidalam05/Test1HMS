import express from 'express';
const router = express.Router();
import { getNotices, createNotice } from '../controllers/noticeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getNotices).post(protect, admin, createNotice);

export default router;
