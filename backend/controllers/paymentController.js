import Payment from '../models/Payment.js';
import Student from '../models/Student.js';

// @desc    Submit payment
// @route   POST /api/payments
// @access  Private (Student)
const submitPayment = async (req, res) => {
    const { amount, txnId, paymentDate, paymentMode, remark } = req.body;
    const screenshotUrl = req.file ? req.file.path : null;

    if (!screenshotUrl) {
        res.status(400);
        throw new Error('Screenshot is required');
    }

    // Find student profile of logged in user
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
        res.status(404);
        throw new Error('Student profile not found');
    }

    const payment = await Payment.create({
        student: student._id,
        amount,
        txnId,
        paymentDate,
        paymentMode,
        screenshotUrl,
        remark,
    });

    if (payment) {
        res.status(201).json(payment);
    } else {
        res.status(400);
        throw new Error('Invalid payment data');
    }
};

// @desc    Get logged in user payments
// @route   GET /api/payments/my
// @access  Private (Student)
const getMyPayments = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
        res.status(404);
        throw new Error('Student profile not found');
    }

    const payments = await Payment.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(payments);
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
const getAllPayments = async (req, res) => {
    const payments = await Payment.find({})
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'name email' }
        })
        .sort({ createdAt: -1 });
    res.json(payments);
};

// @desc    Update payment status
// @route   PUT /api/payments/:id
// @access  Private (Admin)
const updatePaymentStatus = async (req, res) => {
    const { status, remark } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (payment) {
        payment.status = status || payment.status;
        payment.remark = remark || payment.remark;

        const updatedPayment = await payment.save();
        res.json(updatedPayment);
    } else {
        res.status(404);
        throw new Error('Payment not found');
    }
};

export { submitPayment, getMyPayments, getAllPayments, updatePaymentStatus };
