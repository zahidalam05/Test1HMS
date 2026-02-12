import { useState, useEffect } from 'react';
import API from '../services/api';
import { CheckCircle, ArrowRight, ArrowLeft, UploadCloud, Home, User, Users, Clock, History } from 'lucide-react';

const Hostel = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [myApplications, setMyApplications] = useState([]);
    const [showForm, setShowForm] = useState(false); // To toggle between status and new form

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
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data } = await API.get('/auth/profile');
            setProfile(data.profile);
            if (data.profile?.room) setSubmitted(true);

            // Fetch History
            const { data: apps } = await API.get('/students/my-applications');
            setMyApplications(apps);

            // Pre-fill form details
            setForm(prev => ({
                ...prev,
                name: data.name,
                email: data.email,
                rollNo: data.profile?.rollNo || '',
                branch: data.profile?.branch || '',
                academicYear: data.profile?.year || ''
            }));
        } catch (e) {
            console.error(e);
        }
    };

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
            setShowForm(false);
            setSubmitted(true); // Technically submitted, but might trigger "Pending" view
            loadData(); // Refresh apps
            window.scrollTo(0, 0);
        } catch (error) {
            alert("Submission Failed: " + (error.response?.data?.message || 'Error'));
        } finally {
            setLoading(false);
        }
    };

    // Determine what to show
    // 1. If showForm is true -> Show Form
    // 2. If profile.room exists AND showForm false -> Show "My Room"
    // 3. If no room allocated but pending apps -> Show "Pending Status"
    // 4. Else -> Show Form

    const hasPendingApp = myApplications.some(app => app.status === 'Pending');

    // Start New Application View
    const renderForm = () => (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-bottom-8">
            <div className="p-8 md:p-12 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">New Application</h2>
                {profile?.room && (
                    <button onClick={() => setShowForm(false)} className="text-sm text-red-500 hover:text-red-700 font-medium">
                        Cancel Application
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
                {/* STEP 1: Personal & Academic */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                                <Input label="Roll / Reg No" name="rollNo" value={form.rollNo} onChange={handleChange} required />
                                <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} required />
                                <Input label="Academic Year" name="academicYear" value={form.academicYear} onChange={handleChange} placeholder="e.g. 1st Year" required />
                                <Input label="Session" name="session" value={form.session} onChange={handleChange} placeholder="e.g. 2025-2026" required />
                                <Input label="Mobile Number" name="mobNo" value={form.mobNo} onChange={handleChange} required />
                                <Input label="Email Address" name="email" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div>
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
                        <button type="button" onClick={() => {
                            if (step === 1) {
                                if (!form.name || !form.rollNo || !form.branch || !form.year || !form.session || !form.mobNo || !form.email || !form.fatherName || !form.parentMobNo || !form.hostelType) {
                                    alert("Please fill all fields in this step."); return;
                                }
                                if (form.hostelType === 'Other' && !form.hostelTypeOther) { alert("Specify Hostel Type"); return; }
                            }
                            if (step === 2) {
                                if (!form.state || !form.district || !form.block || !form.pinCode) {
                                    alert("Please fill address details."); return;
                                }
                            }
                            setStep(s => s + 1)
                        }} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
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
    );

    return (
        <div className="min-h-screen py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                        Hostel Application
                    </h1>
                    <p className="text-gray-500">Manage your hostel residency and applications.</p>
                </div>

                {/* 1. If currently allocated room -> Show Detailed Card */}
                {!showForm && profile?.room && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden w-full relative group">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold">My Room Details</h1>
                                    <p className="text-blue-100 mt-1">Allocation Confirmed</p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                                    <Home size={32} />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl shadow-sm">
                                        {profile.room.roomNumber}
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Room Number</h3>
                                        <p className="text-2xl font-bold text-gray-800">{profile.room.roomNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                                        <Home size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Hostel Name</h3>
                                        <p className="text-2xl font-bold text-gray-800">{profile.hostel.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center items-center text-center space-y-4">
                                <p className="text-gray-500">Looking to apply for the next academic session?</p>
                                <button
                                    onClick={() => { setStep(1); setShowForm(true); }}
                                    className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm w-full"
                                >
                                    Apply for New Session
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. If NO room allocated but pending app -> Show Status */}
                {!showForm && !profile?.room && hasPendingApp && (
                    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-white/20 mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30">
                            <Clock size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Application Under Review</h2>
                        <p className="text-gray-600 mb-6">
                            Your application is currently pending approval. Please check back later.
                        </p>
                        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition shadow-lg">
                            Refresh Status
                        </button>
                    </div>
                )}

                {/* 3. If User wants to Apply (Form View) */}
                {(showForm || (!profile?.room && !hasPendingApp)) && renderForm()}

                {/* 4. Application History Section */}
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <History size={24} className="text-gray-600" /> Application History
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {myApplications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No application history found.</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Session</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Hostel</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {myApplications.map(app => (
                                        <tr key={app._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.session || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{app.hostelType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
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
