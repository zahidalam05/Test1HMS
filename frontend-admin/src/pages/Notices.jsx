import { useState, useEffect } from 'react';
import API from '../services/api';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [form, setForm] = useState({ title: '', message: '', visibleTo: 'All' });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        const { data } = await API.get('/notices');
        setNotices(data);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            await API.post('/notices', form);
            setForm({ title: '', message: '', visibleTo: 'All' });
            fetchNotices();
        } catch (e) {
            alert("Failed to post");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Post Notice</h1>
                <div className="bg-white p-6 rounded shadow">
                    <form onSubmit={handlePost} className="space-y-4">
                        <input className="w-full border p-2 rounded" placeholder="Notice Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <textarea className="w-full border p-2 rounded" rows="4" placeholder="Message content..." required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                        <select className="w-full border p-2 rounded" value={form.visibleTo} onChange={e => setForm({ ...form, visibleTo: e.target.value })}>
                            <option value="All">All</option>
                            <option value="Students">Students Only</option>
                            <option value="Admins">Admins Only</option>
                        </select>
                        <button className="w-full bg-gray-900 text-white py-2 rounded">Post Notice</button>
                    </form>
                </div>
            </div>

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Previous Notices</h1>
                <div className="space-y-4">
                    {notices.map(n => (
                        <div key={n._id} className="bg-white p-4 rounded shadow border-l-4 border-gray-900">
                            <h3 className="font-bold">{n.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                            <div className="mt-2 text-xs text-gray-400">Visible to: {n.visibleTo}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notices;
