import mongoose from 'mongoose';

const complaintSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        type: {
            type: String,
            enum: ['Global', 'Personal'],
            required: true
        },
        // Common Fields
        name: { type: String, required: true },
        rollNo: { type: String, required: true }, // Added Roll No
        branch: { type: String, required: true },
        mobNo: { type: String, required: true },
        batch: { type: String },
        hostelType: { type: String, required: true },

        // Specifics
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
        },
        roomNo: { type: String }, // For personal complaint input
        email: { type: String },

        category: {
            type: String,
            required: true,
        },
        categoryOther: { type: String },

        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved'],
            default: 'Open',
        },
        adminRemark: {
            type: String,
            default: '',
        },
        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
