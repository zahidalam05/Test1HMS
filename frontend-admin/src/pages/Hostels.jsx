import { useState, useEffect } from 'react';
import API from '../services/api';

const Hostels = () => {
    const [hostels, setHostels] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newHostel, setNewHostel] = useState({ name: '', gender: 'Male', allowedYears: [''] });

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        const { data } = await API.get('/hostels');
        setHostels(data);
    };

    const handleCreateHostel = async (e) => {
        e.preventDefault();
        try {
            await API.post('/hostels', newHostel);
            fetchHostels();
            setShowForm(false);
        } catch (e) {
            alert('Failed to create hostel');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    {showForm ? 'Cancel' : 'Create Hostel'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h3 className="font-bold mb-4">Add New Hostel</h3>
                    <form onSubmit={handleCreateHostel} className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm">Name</label>
                            <input className="border p-2 rounded" value={newHostel.name} onChange={e => setNewHostel({ ...newHostel, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm">Gender</label>
                            <select className="border p-2 rounded" value={newHostel.gender} onChange={e => setNewHostel({ ...newHostel, gender: e.target.value })}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Co-ed</option>
                            </select>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hostels.map(h => (
                    <div key={h._id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">{h.name}</h3>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{h.gender} Hostel</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="text-blue-600 text-sm">View Rooms</button>
                            <button className="text-green-600 text-sm">Add Room</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hostels;
