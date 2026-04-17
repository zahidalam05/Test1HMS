import mongoose from 'mongoose';

const studentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        rollNo: {
            type: String,
        },
        branch: {
            type: String,
        },
        year: {
            type: String,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        cgpa: {
            type: Number,
            default: 0.0,
        },
        hostel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hostel',
            default: null,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            default: null,
        },
        foodPreference: {
            type: String,
            enum: ['Veg', 'Non-Veg'],
            default: 'Veg'
        },
        isMessSec: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
