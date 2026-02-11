import Hostel from '../models/Hostel.js';
import Room from '../models/Room.js';

// @desc    Get all hostels
// @route   GET /api/hostels
// @access  Public
const getHostels = async (req, res) => {
    const hostels = await Hostel.find({});
    res.json(hostels);
};

// @desc    Get hostel by ID
// @route   GET /api/hostels/:id
// @access  Public
const getHostelById = async (req, res) => {
    const hostel = await Hostel.findById(req.params.id);
    if (hostel) {
        res.json(hostel);
    } else {
        res.status(404);
        throw new Error('Hostel not found');
    }
};

// @desc    Create a hostel
// @route   POST /api/hostels
// @access  Private/Admin
const createHostel = async (req, res) => {
    const { name, allowedYears, gender } = req.body;

    const hostelExists = await Hostel.findOne({ name });

    if (hostelExists) {
        res.status(400);
        throw new Error('Hostel already exists');
    }

    const hostel = await Hostel.create({
        name,
        allowedYears,
        gender,
    });

    if (hostel) {
        res.status(201).json(hostel);
    } else {
        res.status(400);
        throw new Error('Invalid hostel data');
    }
};

// @desc    Create a room
// @route   POST /api/hostels/room
// @access  Private/Admin
const createRoom = async (req, res) => {
    const { hostelId, roomNumber, roomType, capacity } = req.body;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
        res.status(404);
        throw new Error('Hostel not found');
    }

    const roomExists = await Room.findOne({ hostel: hostelId, roomNumber });
    if (roomExists) {
        res.status(400);
        throw new Error('Room already exists in this hostel');
    }

    const room = await Room.create({
        hostel: hostelId,
        roomNumber,
        roomType,
        capacity,
        occupants: []
    });

    if (room) {
        res.status(201).json(room);
    } else {
        res.status(400);
        throw new Error('Invalid room data');
    }
};

// @desc    Get rooms by hostel
// @route   GET /api/hostels/:id/rooms
// @access  Protected
const getHostelRooms = async (req, res) => {
    const rooms = await Room.find({ hostel: req.params.id }).populate('occupants', 'name rollNo');

    if (rooms) {
        res.json(rooms);
    } else {
        res.status(404);
        throw new Error('Rooms not found');
    }
}

export { getHostels, getHostelById, createHostel, createRoom, getHostelRooms };
