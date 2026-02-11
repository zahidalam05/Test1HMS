import mongoose from 'mongoose';

const hostelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        allowedYears: [
            {
                type: String,
            },
        ],
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Co-ed'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;
