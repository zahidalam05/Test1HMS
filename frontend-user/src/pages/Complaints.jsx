import { useState, useEffect } from 'react';
import API from '../services/api';
import { Home, Globe } from 'lucide-react';

const Complaints = () => {
    const [type, setType] = useState('Global'); // Global | Personal
    const [form, setForm] = useState({
        name: '',
        rollNo: '', // Added Roll No
        branch: '',
        mobNo: '',
        batch: '',
        hostelType: '',
        hostelTypeOther: '',
        category: 'Electricity',
        categoryOther: '',
        subject: '',
        description: '',
        roomNo: '',
        email: ''
    });

    // Auto-fill details if available
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setForm(prev => ({
                    ...prev,
                    name: data.name,
                    email: data.email,
                    rollNo: data.profile?.rollNo || '',
                    branch: data.profile?.branch || '',
                    batch: data.profile?.year || '', // Assuming batch maps to year or similar
                    mobNo: data.profile?.mobNo || '', // If stored
                    hostelType: data.profile?.hostel?.name || '' // Try to prefill
                }));
            } catch (e) { console.error(e); }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/complaints', { ...form, type });
            alert('Complaint Raised!');
            // Reset but keep some fields? Or full reset. Let's full reset for now but maybe keep name/roll.
            // setForm({ ... }); 
            window.location.reload();
        } catch (e) {
            alert('Failed: ' + (e.response?.data?.message || 'Error'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Raise Complaint</h1>

            {/* Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <button
                    onClick={() => setType('Global')}
                    className={`flex-1 py-5 rounded-[20px] flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 ${type === 'Global' ? 'bg-[#5145ff] text-white shadow-[0_8px_20px_0_rgba(81,69,255,0.39)] border-transparent' : 'bg-white text-gray-600 shadow-sm border border-gray-100 hover:shadow-md'}`}
                >
                    <Globe size={24} />
                    <div className="text-left">
                        <span className="block font-extrabold text-[15px]">Global Complaint</span>
                        <span className={`text-[11px] font-bold ${type === 'Global' ? 'text-indigo-200' : 'text-gray-400'}`}>(Common areas, mess, wifi)</span>
                    </div>
                </button>
                <button
                    onClick={() => setType('Personal')}
                    className={`flex-1 py-5 rounded-[20px] flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 ${type === 'Personal' ? 'bg-[#5145ff] text-white shadow-[0_8px_20px_0_rgba(81,69,255,0.39)] border-transparent' : 'bg-white text-gray-600 shadow-sm border border-gray-100 hover:shadow-md'}`}
                >
                    <Home size={24} />
                    <div className="text-left">
                        <span className="block font-extrabold text-[15px]">Personal Complaint</span>
                        <span className={`text-[11px] font-bold ${type === 'Personal' ? 'text-indigo-200' : 'text-gray-400'}`}>(Room specific issues)</span>
                    </div>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#f8f9fa] p-8 md:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                <h3 className="text-2xl font-extrabold text-gray-900 border-b border-gray-200 pb-5 mb-8">
                    {type} Complaint Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
                    <Input label="Roll No / Registration No" name="rollNo" value={form.rollNo} onChange={handleChange} required />
                    <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} required />
                    <Input label="Mobile No" name="mobNo" value={form.mobNo} onChange={handleChange} required />
                    <Input label="Batch (Year)" name="batch" value={form.batch} onChange={handleChange} />

                    <div>
                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5 mt-2">Hostel Type</label>
                        <select name="hostelType" value={form.hostelType} onChange={handleChange} required className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb]">
                            <option value="">Select Hostel</option>
                            <option>H1</option><option>H2</option><option>H3</option><option>H4</option><option>GH</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {form.hostelType === 'Other' && (
                        <Input label="Specify Hostel" name="hostelTypeOther" value={form.hostelTypeOther} onChange={handleChange} required />
                    )}

                    {type === 'Personal' && (
                        <>
                            <Input label="Room No" name="roomNo" value={form.roomNo} onChange={handleChange} required />
                            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
                        </>
                    )}

                    <div>
                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5 mt-2">Category</label>
                        <select name="category" value={form.category} onChange={handleChange} className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb]">
                            <option>Electricity</option>
                            <option>Plumbing</option>
                            <option>Furniture</option>
                            <option>Cleaning</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {form.category === 'Other' && (
                        <Input label="Specify Category" name="categoryOther" value={form.categoryOther} onChange={handleChange} required />
                    )}

                    <div className="md:col-span-2">
                        <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5 mt-2">Description <span className="text-red-500">*</span></label>
                        <textarea name="description" rows="4" value={form.description} onChange={handleChange} required className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb] placeholder-gray-400"></textarea>
                    </div>
                </div>

                <div className="mt-10 md:text-right">
                    <button className="w-full md:w-auto px-10 py-4 bg-[#5145ff] text-white rounded-[14px] font-bold shadow-[0_4px_14px_0_rgba(81,69,255,0.39)] hover:bg-[#4338e5] hover:shadow-[0_6px_20px_rgba(81,69,255,0.23)] transition-all transform hover:-translate-y-0.5 outline-none">
                        Submit Complaint
                    </button>
                </div>
            </form>
        </div>
    );
};

const Input = ({ label, required, ...props }) => (
    <div>
        <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1 text-left uppercase tracking-wider">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            required={required}
            {...props}
            className={`
                w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] 
                outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 
                transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb] placeholder-gray-400
                ${props.readOnly ? 'opacity-70 cursor-not-allowed' : ''}
            `}
        />
    </div>
);

export default Complaints;
