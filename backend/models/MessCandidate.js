import mongoose from 'mongoose';

const messCandidateSchema = mongoose.Schema(
    {
        name: String,
        rollNo: String,
        branch: String,
        year: String,
        student: { // optional link
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: false,
        },
        type: {
            type: String,
            enum: ['Veg', 'Non-Veg'],
            required: true,
        },
        votes: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['Nominated', 'Winner', 'Lost'],
            default: 'Nominated'
        }
    },
    {
        timestamps: true,
    }
);

const MessCandidate = mongoose.model('MessCandidate', messCandidateSchema);
export default MessCandidate;
