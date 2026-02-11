import HostelApplication from '../models/HostelApplication.js';
import Student from '../models/Student.js';
import Room from '../models/Room.js';
import Payment from '../models/Payment.js';

// @desc    Apply for hostel (Multi-step + Payment)
// @route   POST /api/students/apply
// @access  Private (Student)
const applyHostel = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            res.status(404);
            throw new Error('Student profile not found');
        }

        // Check if already applied
        const existingApp = await HostelApplication.findOne({
            student: student._id,
            status: 'Pending'
        });
        if (existingApp) {
            res.status(400);
            throw new Error('You already have a pending application');
        }

        // Parse body (Multipart form data can result in text fields needing JSON.parse if nested)
        // We assume the frontend sends flattened fields or we parse appropriately.
        // For simplicity with FormData, we might receive `address[state]`, etc.

        const {
            name, rollNo, branch, fatherName, mobNo, email, academicYear, session, parentMobNo,
            hostelType, hostelTypeOther, roomNo, cgpa,
            state, district, block, pinCode, // Address unpacked
            amount, txnId, txnDate, bank // Payment unpacked
        } = req.body;

        const screenshotUrl = req.file ? req.file.path : 'placeholder.jpg'; // In production, require file

        // 1. Create Application
        const application = await HostelApplication.create({
            student: student._id,
            name, rollNo, branch, fatherName, mobNo, email, academicYear, session, parentMobNo,
            hostelType, hostelTypeOther, roomNo, cgpa,
            address: { state, district, block, pinCode },
            payment: { amount, txnId, txnDate, bank, screenshotUrl }
        });

        // 2. Create Payment Record (For History)
        await Payment.create({
            student: student._id,
            amount,
            txnId,
            paymentDate: txnDate,
            paymentMode: 'Bank Transfer', // inferred
            screenshotUrl,
            remark: 'Application Fee',
            status: 'Pending'
        });

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
    const students = await Student.find({})
        .populate('user', 'name email')
        .populate('hostel', 'name')
        .populate('room', 'roomNumber');
    res.json(students);
};

// @desc    Get all applications
// @route   GET /api/students/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
    const applications = await HostelApplication.find({})
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'name' }
        });
    res.json(applications);
};

// @desc    Update application status (Allocate room if approved)
// @route   PUT /api/students/applications/:id
// @access  Private (Admin)
const updateApplicationStatus = async (req, res) => {
    const { status, adminRemark, allocatedRoomId } = req.body;

    const application = await HostelApplication.findById(req.params.id);
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    application.status = status;
    application.adminRemark = adminRemark;

    if (status === 'Approved' && allocatedRoomId) {
        const room = await Room.findById(allocatedRoomId);
        const student = await Student.findById(application.student);

        if (room && student) {
            if (room.occupants.length < room.capacity) {
                room.occupants.push(student._id);
                await room.save();

                student.room = room._id;
                student.hostel = room.hostel;
                await student.save();
            } else {
                res.status(400);
                throw new Error('Room is full');
            }
        }
    }

    const updatedApplication = await application.save();
    res.json(updatedApplication);
};

export { applyHostel, getAllStudents, getAllApplications, updateApplicationStatus };
