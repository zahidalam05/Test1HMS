import { useState, useEffect } from 'react';
import API from '../services/api';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        const { data } = await API.get('/complaints');
        setComplaints(data);
    };

    const handleResolve = async (id) => {
        const remark = prompt("Enter resolution remark:");
        if (!remark) return;

        try {
            await API.put(`/complaints/${id}`, { status: 'Resolved', adminRemark: remark });
            fetchComplaints();
        } catch (e) {
            alert('Failed to resolve');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>

            <div className="space-y-4">
                {complaints.map(c => (
                    <div key={c._id} className="bg-white p-6 rounded shadow flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 text-xs text-white rounded ${c.category === 'Electricity' ? 'bg-yellow-500' : 'bg-blue-500'}`}>{c.category}</span>
                                <h3 className="font-bold text-gray-800">{c.subject}</h3>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm">{c.description}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                By: {c.student.user.name} ({c.student.rollNo}) | Room: {c.room ? c.room.roomNumber : 'N/A'}
                            </p>
                            {c.adminRemark && (
                                <p className="text-xs text-green-600 mt-2 font-semibold">Resolution: {c.adminRemark}</p>
                            )}
                        </div>
                        <div>
                            <span className={`px-3 py-1 text-xs rounded-full ${c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {c.status}
                            </span>
                            {c.status !== 'Resolved' && (
                                <button onClick={() => handleResolve(c._id)} className="block mt-2 text-blue-600 text-xs hover:underline">Mark Resolved</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Complaints;
