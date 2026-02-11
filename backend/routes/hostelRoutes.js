import express from 'express';
const router = express.Router();
import {
    getHostels,
    getHostelById,
    createHostel,
    createRoom,
    getHostelRooms
} from '../controllers/hostelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getHostels).post(protect, admin, createHostel);
router.route('/:id').get(getHostelById);
router.route('/:id/rooms').get(protect, getHostelRooms);
router.route('/room').post(protect, admin, createRoom);

export default router;
