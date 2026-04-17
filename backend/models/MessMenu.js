import mongoose from 'mongoose';

const messMenuSchema = mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            unique: true
        },
        breakfast: { type: String, default: 'Not specified' },
        lunch: { type: String, default: 'Not specified' },
        snacks: { type: String, default: 'Not specified' },
        dinner: { type: String, default: 'Not specified' },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student', // Only Mess Sec edits
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const MessMenu = mongoose.model('MessMenu', messMenuSchema);
export default MessMenu;
