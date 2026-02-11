import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        txnId: {
            type: String,
            required: true,
            unique: true,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
        paymentMode: {
            type: String,
            required: true,
        },
        screenshotUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        remark: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
