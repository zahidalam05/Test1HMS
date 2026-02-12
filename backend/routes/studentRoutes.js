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
// Update Apply route to handle file upload
router.route('/apply').post(protect, upload.single('screenshot'), applyHostel);
router.route('/my-applications').get(protect, getMyApplications);
router.route('/applications').get(protect, admin, getAllApplications);
router.route('/applications/:id').put(protect, admin, updateApplicationStatus);

export default router;
