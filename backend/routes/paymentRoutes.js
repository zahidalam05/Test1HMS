import express from 'express';
const router = express.Router();
import {
    submitPayment,
    getMyPayments,
    getAllPayments,
    updatePaymentStatus,
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/')
    .post(protect, upload.single('screenshot'), submitPayment)
    .get(protect, admin, getAllPayments);

router.route('/my').get(protect, getMyPayments);

router.route('/:id').put(protect, admin, updatePaymentStatus);

export default router;
