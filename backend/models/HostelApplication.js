import mongoose from 'mongoose';

const hostelApplicationSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        // Step 1 & 2 Data
        name: { type: String, required: true },
        rollNo: { type: String }, // Optional/Reg No
        branch: { type: String, required: true },
        fatherName: { type: String, required: true },
        mobNo: { type: String, required: true },
        email: { type: String, required: true },
        academicYear: { type: String, required: true },
        session: { type: String, required: true },
        parentMobNo: { type: String, required: true },
        hostelType: { type: String, required: true }, // H1, H2, GH, Other...
        hostelTypeOther: { type: String },
        roomNo: { type: String }, // Preferred Room
        cgpa: { type: Number }, // Hidden if H1

        // Address
        address: {
            state: { type: String, required: true },
            district: { type: String, required: true },
            block: { type: String, required: true },
            pinCode: { type: String, required: true },
        },

        // Step 3 Payment Details linking (Split Mess & Hostel Fee)
        payment: {
            hostelFeeAmount: { type: Number, required: true },
            messFeeAmount: { type: Number, required: true },
            totalAmount: { type: Number, required: true },
            txnId: { type: String, required: true },
            txnDate: { type: Date, required: true },
            bank: { type: String, required: true },
            hostelFeeUrl: { type: String, required: true },
            messFeeUrl: { type: String, required: true }
        },

        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        adminRemark: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const HostelApplication = mongoose.model('HostelApplication', hostelApplicationSchema);
export default HostelApplication;
