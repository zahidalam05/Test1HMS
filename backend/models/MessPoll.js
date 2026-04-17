import mongoose from 'mongoose';

const messPollSchema = mongoose.Schema(
    {
        candidates: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MessCandidate'
        }],
        endTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Completed'],
            default: 'Active'
        },
        voters: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }]
    },
    {
        timestamps: true,
    }
);

const MessPoll = mongoose.model('MessPoll', messPollSchema);
export default MessPoll;
