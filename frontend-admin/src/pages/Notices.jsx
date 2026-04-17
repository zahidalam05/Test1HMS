import { useState, useEffect } from 'react';
import API from '../services/api';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [form, setForm] = useState({ title: '', message: '', visibleTo: 'All' });

    const fetchNotices = async () => {
        const { data } = await API.get('/notices');
        setNotices(data);
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            await API.post('/notices', form);
            setForm({ title: '', message: '', visibleTo: 'All' });
            fetchNotices();
        } catch (e) {
            console.error(e);
            alert("Failed to post");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div className="mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Notice Management</h1>
                <p className="text-gray-500 mt-1 font-medium">Create and manage alerts for students.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Post Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100 h-fit sticky top-8">
                        <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                            Post New Notice
                        </h2>
                        <form onSubmit={handlePost} className="space-y-6">
                            <Input label="Notice Title" placeholder="Maintenance Alert..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

                            <div>
                                <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1 text-left uppercase tracking-wider">Visibility</label>
                                <select className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm" value={form.visibleTo} onChange={e => setForm({ ...form, visibleTo: e.target.value })}>
                                    <option value="All">Everyone</option>
                                    <option value="Students">Students Only</option>
                                    <option value="Admins">Admins Only</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1 text-left uppercase tracking-wider">Message</label>
                                <textarea className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm placeholder-gray-400" rows="5" placeholder="Detailed announcement..." required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                            </div>

                            <button className="w-full py-5 bg-gray-900 text-white rounded-[22px] font-black text-lg shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 active:scale-[0.98]">
                                Publish Notice
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-black text-gray-900 mb-4 px-2">Published History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {notices.map(n => (
                            <div key={n._id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-bl-[40px] -mr-4 -mt-4 group-hover:bg-indigo-50 transition-colors"></div>
                                <div className="relative z-10">
                                    <h3 className="font-extrabold text-gray-900 line-clamp-1 pr-4">{n.title}</h3>
                                    <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-3 font-medium">{n.message}</p>
                                    <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${n.visibleTo === 'All' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                            TO: {n.visibleTo}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {notices.length === 0 && <div className="p-20 text-center font-bold text-gray-400 border-2 border-dashed border-gray-200 rounded-[32px]">No notices found.</div>}
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1 text-left uppercase tracking-wider">{label}</label>
        <input
            {...props}
            className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm placeholder-gray-400"
        />
    </div>
);

export default Notices;
