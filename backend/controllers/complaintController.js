import Complaint from '../models/Complaint.js';
import Student from '../models/Student.js';

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    const {
        type, // Global or Personal
        name, rollNo, branch, mobNo, batch, hostelType, hostelTypeOther, // Common
        category, categoryOther, subject, description, // Common
        roomNo, email // Personal specifics
    } = req.body;

    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
        res.status(404);
        throw new Error('Student profile not found');
    }

    const complaint = await Complaint.create({
        student: student._id,
        type,
        name,
        rollNo, // Added rollNo
        branch,
        mobNo,
        batch,
        hostelType,
        category: category === 'Other' ? categoryOther : category,
        categoryOther,
        subject,
        description,
        room: student.room, // Auto-link if exists
        roomNo,
        email
    });

    res.status(201).json(complaint);
};

// @desc    Get my complaints
// @route   GET /api/complaints/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    const complaints = await Complaint.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(complaints);
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
    const complaints = await Complaint.find({})
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'name' }
        })
        .populate('room', 'roomNumber hostel')
        .sort({ createdAt: -1 });
    res.json(complaints);
};

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id
// @access  Private (Admin)
const resolveComplaint = async (req, res) => {
    const { status, adminRemark } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        complaint.status = status || complaint.status;
        complaint.adminRemark = adminRemark || complaint.adminRemark;

        if (status === 'Resolved') {
            complaint.resolvedAt = Date.now();
        }

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404);
        throw new Error('Complaint not found');
    }
};

export { createComplaint, getMyComplaints, getAllComplaints, resolveComplaint };
