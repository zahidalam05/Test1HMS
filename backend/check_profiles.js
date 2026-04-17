import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js';
import Student from './models/Student.js';

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find().sort({ createdAt: -1 }).limit(5);
        console.log("Recent Users:", users.map(u => ({ email: u.email, role: u.role, id: u._id })));

        for (let u of users) {
            const s = await Student.findOne({ user: u._id });
            console.log(`User ${u.email} Student Profile:`, s ? "EXISTS" : "MISSING");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
check();
