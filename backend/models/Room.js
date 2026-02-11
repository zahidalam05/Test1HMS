import mongoose from 'mongoose';

const roomSchema = mongoose.Schema(
    {
        hostel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hostel',
            required: true,
        },
        roomNumber: {
            type: String,
            required: true,
        },
        roomType: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        occupants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Student',
            },
        ],
        status: {
            type: String,
            enum: ['Available', 'Full', 'Maintenance'],
            default: 'Available',
        },
    },
    {
        timestamps: true,
    }
);

roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;
