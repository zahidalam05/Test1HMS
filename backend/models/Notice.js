import mongoose from 'mongoose';

const noticeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        visibleTo: {
            type: String,
            enum: ['All', 'Students', 'Admins'],
            default: 'All',
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
