import Student from '../models/Student.js';
import HostelApplication from '../models/HostelApplication.js';
import Complaint from '../models/Complaint.js';
import Room from '../models/Room.js';
import Hostel from '../models/Hostel.js';
import MessLeave from '../models/MessLeave.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // 1. Counts
        const totalStudents = await Student.countDocuments();
        const pendingApps = await HostelApplication.countDocuments({ status: 'Pending' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

        // 2. Occupancy Logic
        const rooms = await Room.find({});
        let totalCapacity = 0;
        let totalOccupants = 0;
        rooms.forEach(room => {
            totalCapacity += room.capacity;
            totalOccupants += room.occupants.length;
        });
        const occupancyRate = totalCapacity > 0 ? ((totalOccupants / totalCapacity) * 100).toFixed(1) : 0;

        // Mess Leave logic
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));

        const leavesToday = await MessLeave.find({
            status: 'Approved',
            startDate: { $lte: endOfToday },
            endDate: { $gte: startOfToday }
        }).populate({ path: 'student', populate: { path: 'user' } });

        const onLeaveCount = leavesToday.length;

        // 3. Recent Data
        const recentApplications = await HostelApplication.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name status createdAt hostelType');

        const recentComplaints = await Complaint.find({ status: 'Open' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('subject category roomNo createdAt')
            .populate('student', 'user');

        res.json({
            counts: {
                students: totalStudents,
                pendingApps,
                resolvedComplaints,
                occupancyRate,
                eatingToday: totalOccupants - onLeaveCount,
                onLeave: onLeaveCount
            },
            recentApplications,
            recentComplaints,
            leavesToday
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Available Rooms for Allocation
// @route   GET /api/admin/rooms/available
// @access  Private (Admin)
const getAvailableRooms = async (req, res) => {
    // Find rooms where occupants length is less than capacity
    // This is a bit complex in standard mongo query without aggregation if capacity is dynamic fields, 
    // but since we pull all rooms usually for admin, we can filter js side or use $where
    // Better: Aggregation
    const rooms = await Room.aggregate([
        {
            $project: {
                hostel: 1,
                roomNumber: 1,
                capacity: 1,
                occupancyCount: { $size: "$occupants" },
                _id: 1
            }
        },
        {
            $match: {
                $expr: { $lt: ["$occupancyCount", "$capacity"] }
            }
        },
        {
            $lookup: {
                from: 'hostels',
                localField: 'hostel',
                foreignField: '_id',
                as: 'hostelDetails'
            }
        },
        { $unwind: '$hostelDetails' }
    ]);

    res.json(rooms);
};

export { getDashboardStats, getAvailableRooms };
