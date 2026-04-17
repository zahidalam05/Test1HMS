import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js';
import Student from './models/Student.js';

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ email: 'sadiq@gmail.com' });
        console.log("Users found with sadiq@gmail.com:", users.length);

        for (let u of users) {
            console.log(`User ID: ${u._id}`);
            const s = await Student.find({ user: u._id });
            console.log(`- Student profiles linked to this ID: ${s.length}`);
            s.forEach(profile => console.log(`  - Student ID: ${profile._id}`));
        }

        const allStudents = await Student.find().populate('user');
        console.log("\nRecent Students in DB:");
        allStudents.slice(-3).forEach(s => {
            console.log(`Student: ${s._id}, User Link: ${s.user?._id} (${s.user?.email || 'DEAD LINK'})`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
check();
