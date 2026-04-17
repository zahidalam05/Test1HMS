import mongoose from 'mongoose';

const messLeaveSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        rebateDays: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const MessLeave = mongoose.model('MessLeave', messLeaveSchema);
export default MessLeave;
