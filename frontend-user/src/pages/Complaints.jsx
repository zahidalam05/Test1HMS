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
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Raise Complaint</h1>

            {/* Toggle */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setType('Global')}
                    className={`flex-1 py-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${type === 'Global' ? 'bg-indigo-600 text-white shadow-lg border-transparent' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    <Globe />
                    <span className="font-bold">Global Complaint</span>
                    <span className="text-xs opacity-75 hidden sm:block">(Common areas, mess, wifi)</span>
                </button>
                <button
                    onClick={() => setType('Personal')}
                    className={`flex-1 py-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${type === 'Personal' ? 'bg-indigo-600 text-white shadow-lg border-transparent' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    <Home />
                    <span className="font-bold">Personal Complaint</span>
                    <span className="text-xs opacity-75 hidden sm:block">(Room specific issues)</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
                    {type} Complaint Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
                    <Input label="Roll No / Registration No" name="rollNo" value={form.rollNo} onChange={handleChange} required />
                    <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} required />
                    <Input label="Mobile No" name="mobNo" value={form.mobNo} onChange={handleChange} required />
                    <Input label="Batch (Year)" name="batch" value={form.batch} onChange={handleChange} />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Type</label>
                        <select name="hostelType" value={form.hostelType} onChange={handleChange} required className="w-full border p-2 rounded">
                            <option value="">Select</option>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea name="description" rows="4" value={form.description} onChange={handleChange} required className="w-full border p-2 rounded text-sm"></textarea>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <button className="bg-indigo-600 text-white px-8 py-2 rounded hover:bg-indigo-700">Submit Complaint</button>
                </div>
            </form>
        </div>
    );
};

const Input = ({ label, required, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input required={required} {...props} className="w-full border border-gray-300 p-2 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
    </div>
);

export default Complaints;
