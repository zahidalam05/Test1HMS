import Notice from '../models/Notice.js';

// @desc    Get notices
// @route   GET /api/notices
// @access  Public/Protected
const getNotices = async (req, res) => {
    // If need filtering by role, can access req.user
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.json(notices);
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private (Admin)
const createNotice = async (req, res) => {
    const { title, message, visibleTo } = req.body;

    const notice = await Notice.create({
        title,
        message,
        visibleTo,
        postedBy: req.user._id,
    });

    if (notice) {
        res.status(201).json(notice);
    } else {
        res.status(400);
        throw new Error('Invalid notice data');
    }
};

export { getNotices, createNotice };
