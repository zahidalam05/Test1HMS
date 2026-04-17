import express from 'express';
const router = express.Router();
import {
    applyHostel,
    getAllStudents,
    getAllApplications,
    updateApplicationStatus,
    getMyApplications
} from '../controllers/studentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/').get(protect, admin, getAllStudents);
// Temporarily use upload.any() to debug "Unexpected field" issue
router.route('/apply').post(protect, upload.any(), applyHostel);
router.route('/my-applications').get(protect, getMyApplications);
router.route('/applications').get(protect, admin, getAllApplications);
router.route('/applications/:id').put(protect, admin, updateApplicationStatus);

export default router;
