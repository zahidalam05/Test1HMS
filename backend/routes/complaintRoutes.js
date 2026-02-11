import express from 'express';
const router = express.Router();
import {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    resolveComplaint,
} from '../controllers/complaintController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createComplaint).get(protect, admin, getAllComplaints);
router.route('/my').get(protect, getMyComplaints);
router.route('/:id').put(protect, admin, resolveComplaint);

export default router;
