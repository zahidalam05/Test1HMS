import { useState, useEffect } from 'react';
import API from '../services/api';
import { CheckCircle, ArrowRight, ArrowLeft, UploadCloud } from 'lucide-react';

const Hostel = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobNo: '',
        fatherName: '',
        parentMobNo: '',
        rollNo: '',
        branch: '',
        academicYear: '',
        session: '',
        hostelType: '',
        hostelTypeOther: '',
        roomNo: '',
        cgpa: '',
        state: '',
        district: '',
        block: '',
        pinCode: '',
        amount: '',
        txnId: '',
        txnDate: '',
        bank: '',
        screenshot: null
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setProfile(data.profile);
                if (data.profile?.room) setSubmitted(true);

                setForm(prev => ({
                    ...prev,
                    name: data.name,
                    email: data.email,
                    rollNo: data.profile?.rollNo || '',
                    branch: data.profile?.branch || '',
                    academicYear: data.profile?.year || ''
                }));
            } catch (e) { console.error(e); }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleFile = (e) => setForm({ ...form, screenshot: e.target.files[0] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));

        try {
            await API.post('/students/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (error) {
            alert("Submission Failed: " + (error.response?.data?.message || 'Error'));
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-white/20">
                    <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">
                        {profile?.room
                            ? `You have been allocated Room ${profile.room.roomNumber} in ${profile.hostel.name}.`
                            : "Your application is under review. Please check back later for allocation status."}
                    </p>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition shadow-lg">
                        Refresh Status
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                        Hostel Application
                    </h1>
                    <p className="text-gray-500">Complete the 3-step process to book your room.</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white/50">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                                    ${step >= i ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' : 'bg-gray-200 text-gray-500'}
                                `}>
                                    {i}
                                </div>
                                {i < 3 && <div className={`w-12 h-1 mx-2 rounded-full ${step > i ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 md:p-12">

                        {/* STEP 1: Personal & Academic */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                        Student Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} readOnly />
                                        <Input label="Roll / Reg No" name="rollNo" value={form.rollNo} onChange={handleChange} required />
                                        <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} required />
                                        <Input label="Academic Year" name="academicYear" value={form.academicYear} onChange={handleChange} placeholder="e.g. 1st Year" required />
                                        <Input label="Session" name="session" value={form.session} onChange={handleChange} placeholder="2024-2025" required />
                                        <Input label="Mobile Number" name="mobNo" value={form.mobNo} onChange={handleChange} required />
                                        <Input label="Email Address" name="email" value={form.email} onChange={handleChange} readOnly />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                                        Parent & Hostel Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Father's Name" name="fatherName" value={form.fatherName} onChange={handleChange} required />
                                        <Input label="Parent's Mobile" name="parentMobNo" value={form.parentMobNo} onChange={handleChange} required />

                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Hostel Type</label>
                                                <select name="hostelType" value={form.hostelType} onChange={handleChange} required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all">
                                                    <option value="">Select Hostel</option>
                                                    <option value="H1">H1 (1st Year)</option>
                                                    <option value="H2">H2</option>
                                                    <option value="H3">H3</option>
                                                    <option value="H4">H4</option>
                                                    <option value="GH">GH (Girls Hostel)</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            {form.hostelType === 'Other' && (
                                                <Input label="Specify Type" name="hostelTypeOther" value={form.hostelTypeOther} onChange={handleChange} placeholder="Enter hostel type" required />
                                            )}

                                            {/* Logic: Hide CGPA if Hostel Type is H1 */}
                                            {form.hostelType !== 'H1' && (
                                                <Input label="CGPA (Last Semester)" name="cgpa" type="number" step="0.01" value={form.cgpa} onChange={handleChange} required />
                                            )}

                                            <Input label="Preferred Room No" name="roomNo" value={form.roomNo} onChange={handleChange} placeholder="Optional preference" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Address */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                                    Permanent Address
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="State" name="state" value={form.state} onChange={handleChange} required />
                                    <Input label="District" name="district" value={form.district} onChange={handleChange} required />
                                    <Input label="Block / Tehsil" name="block" value={form.block} onChange={handleChange} required />
                                    <Input label="Pin Code" name="pinCode" value={form.pinCode} onChange={handleChange} required />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Payment */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
                                    Payment Details
                                </h3>

                                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-orange-800 text-sm mb-8 flex items-start gap-3">
                                    <div className="mt-0.5">⚠️</div>
                                    <p>Please ensure you have paid the hostel fee to the official account before proceeding. Upload the transaction receipt screenshot clearly showing the Transaction ID.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Amount Paid (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
                                    <Input label="Transaction ID (UTR)" name="txnId" value={form.txnId} onChange={handleChange} required />
                                    <Input label="Transaction Date" name="txnDate" type="date" value={form.txnDate} onChange={handleChange} required />
                                    <Input label="Bank Name" name="bank" value={form.bank} onChange={handleChange} placeholder="e.g. SBI, HDFC" required />

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Screenshot</label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                                            <input type="file" onChange={handleFile} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <UploadCloud className="text-blue-500" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                                                    {form.screenshot ? form.screenshot.name : "Click or Drag to upload screenshot"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="mt-12 flex justify-between pt-6 border-t border-gray-100">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition">
                                    <ArrowLeft size={18} /> Back
                                </button>
                            ) : <div></div>}

                            {step < 3 ? (
                                <button type="button" onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                                    Next Step <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? 'Submitting Application...' : 'Submit Final Application'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, required, ...props }) => (
    <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            required={required}
            {...props}
            className={`
                w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
                outline-none transition-all duration-200 font-medium text-gray-800
                placeholder-gray-400
                ${props.readOnly ? 'opacity-70 cursor-not-allowed' : ''}
            `}
        />
    </div>
);

export default Hostel;
