import User from '../models/User.js';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';
import generateToken from '../config/genToken.js';
import { matchPassword, hashPassword } from '../utils/passwordUtils.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for Global Admin
    console.log('Login Attempt:', email);
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        console.log('Admin Login Success');
        res.json({
            _id: '000000000000000000000000',
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
            token: generateToken('000000000000000000000000'),
        });
        return;
    }

    const user = await User.findOne({ email });

    if (user && (await matchPassword(password, user.password))) {
        console.log('User Login Success:', user.email);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        console.log('Login Failed. User found:', !!user);
        res.status(401);
        throw new Error('Invalid email or password');
    }
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, rollNo, branch, year, gender } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'student',
    });

    if (user) {
        // Create Student Profile associated with User
        const student = await Student.create({
            user: user._id,
            rollNo,
            branch,
            year,
            gender
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentProfile: student,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // Handle Global Admin Profile
    if (req.user.role === 'admin' && req.user._id === '000000000000000000000000') {
        res.json({
            _id: '000000000000000000000000',
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            role: 'admin',
            profile: { name: 'Admin', email: process.env.ADMIN_EMAIL }
        });
        return;
    }

    const user = await User.findById(req.user._id);

    if (user) {
        let profile = null;
        if (user.role === 'student') {
            profile = await Student.findOne({ user: user._id }).populate('hostel').populate('room');
        } else if (user.role === 'admin') {
            profile = await Admin.findOne({ user: user._id });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: profile
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

export { authUser, registerUser, getUserProfile };
