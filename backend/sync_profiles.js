import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js';
import Student from './models/Student.js';

const sync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await User.find({ role: 'student' });
        console.log(`Checking ${students.length} students...`);

        for (let u of students) {
            const s = await Student.findOne({ user: u._id });
            if (!s) {
                console.log(`Creating missing profile for: ${u.email}`);
                await Student.create({
                    user: u._id,
                    rollNo: 'TEMP' + Math.floor(Math.random() * 1000),
                    branch: 'General',
                    year: '1',
                    gender: 'Male'
                });
            }
        }
        console.log("Sync complete!");
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
sync();
