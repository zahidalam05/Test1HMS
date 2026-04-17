import HostelApplication from '../models/HostelApplication.js';
import Student from '../models/Student.js';
import Room from '../models/Room.js';
import Payment from '../models/Payment.js';
import Hostel from '../models/Hostel.js';

// @desc    Apply for hostel (Multi-step + Payment)
// @route   POST /api/students/apply
// @access  Private (Student)
const applyHostel = async (req, res) => {
    try {
        console.log("Checking Student Profile for User ID:", req.user?._id);
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
            state, district, block, pinCode,
            hostelFeeAmount, messFeeAmount, txnId, txnDate, bank
        } = req.body;

        // When using upload.any(), req.files is an array of objects
        const findFile = (fieldname) => {
            if (!Array.isArray(req.files)) return 'placeholder.jpg';
            const file = req.files.find(f => f.fieldname === fieldname);
            return file ? file.path.replace(/\\/g, '/') : 'placeholder.jpg';
        };

        const hostelFeeUrl = findFile('hostelFeeScreenshot');
        const messFeeUrl = findFile('messFeeScreenshot');

        const hFee = parseFloat(hostelFeeAmount || 0);
        const mFee = parseFloat(messFeeAmount || 0);
        const totalAmount = hFee + mFee;

        // 1. Create Application
        const application = await HostelApplication.create({
            student: student._id,
            name, rollNo, branch, fatherName, mobNo, email, academicYear, session, parentMobNo,
            hostelType, hostelTypeOther, roomNo,
            cgpa: cgpa ? parseFloat(cgpa) : undefined,
            address: { state, district, block, pinCode },
            payment: {
                hostelFeeAmount: hFee,
                messFeeAmount: mFee,
                totalAmount,
                txnId,
                txnDate: txnDate || new Date(),
                bank,
                hostelFeeUrl,
                messFeeUrl
            }
        });

        // 2. Create Payment Record (Combined for History)
        await Payment.create({
            student: student._id,
            amount: totalAmount,
            txnId,
            paymentDate: txnDate || new Date(),
            paymentMode: 'Bank Transfer',
            screenshotUrl: hostelFeeUrl,
            remark: 'Hostel + Mess Application Fee',
            status: 'Pending'
        });

        res.status(201).json(application);
    } catch (error) {
        console.error("Apply Controller Error Detail:", error);

        // Handle Mongoose Validation Errors Specifically
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: "Validation Failed: " + messages.join(', ') });
        }

        res.status(400).json({ message: "Submission Failed: " + error.message });
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
    const { status, adminRemark, allocatedRoomId, hostelName, roomNumber } = req.body;

    const application = await HostelApplication.findById(req.params.id);
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    application.status = status;
    application.adminRemark = adminRemark;

    if (status === 'Approved') {
        let room;

        if (allocatedRoomId) {
            room = await Room.findById(allocatedRoomId);
        } else if (hostelName && roomNumber) {
            // Automatic Create/Find Logic
            let hostel = await Hostel.findOne({ name: hostelName });
            if (!hostel) {
                // Infer gender from hostel name if possible, default to Co-ed
                let gender = 'Co-ed';
                if (hostelName.toUpperCase().includes('GH')) gender = 'Female';
                else if (hostelName.toUpperCase().includes('BH') || hostelName.toUpperCase().match(/^H\d+$/)) gender = 'Male';

                hostel = await Hostel.create({
                    name: hostelName,
                    gender,
                    allowedYears: ['All']
                });
            }

            room = await Room.findOne({ hostel: hostel._id, roomNumber });
            if (!room) {
                room = await Room.create({
                    hostel: hostel._id,
                    roomNumber,
                    roomType: 'Standard',
                    capacity: 3 // Default capacity
                });
            }
        }

        if (room) {
            const student = await Student.findById(application.student);
            if (student) {
                // Check capacity
                if (room.occupants.length < room.capacity) {
                    // Avoid duplicate
                    if (!room.occupants.includes(student._id)) {
                        room.occupants.push(student._id);
                        await room.save();
                    }

                    student.room = room._id;
                    student.hostel = room.hostel;
                    await student.save();

                    // Also update application with allocated details for reference
                    application.allocatedRoomId = room._id;
                } else {
                    res.status(400);
                    throw new Error(`Room ${room.roomNumber} is full (Capacity: ${room.capacity})`);
                }
            }
        }
    }

    const updatedApplication = await application.save();
    res.json(updatedApplication);
};

// @desc    Get my applications
// @route   GET /api/students/my-applications
// @access  Private (Student)
const getMyApplications = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }
    const applications = await HostelApplication.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(applications);
};

export { applyHostel, getAllStudents, getAllApplications, updateApplicationStatus, getMyApplications };
