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
                    <div key={c._id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                                <span className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${c.category === 'Electricity' ? 'bg-yellow-500' :
                                        c.category === 'Plumbing' ? 'bg-blue-500' :
                                            c.category === 'Cleaning' ? 'bg-green-500' : 'bg-gray-500'
                                    }`}>
                                    {c.category}
                                </span>
                                <h3 className="font-bold text-gray-800 text-sm md:text-base">{c.subject}</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">{c.description}</p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                <span className="font-medium text-gray-700">{c.student?.user?.name || 'Unknown'}</span>
                                <span>Roll: {c.student?.rollNo || 'N/A'}</span>
                                <span>Room: <span className="font-semibold text-indigo-600">{c.room ? c.room.roomNumber : 'N/A'}</span></span>
                            </div>

                            {c.adminRemark && (
                                <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded-lg">
                                    <p className="text-xs text-green-700 font-medium">Resolution: {c.adminRemark}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {c.status}
                            </span>

                            {c.status !== 'Resolved' && (
                                <button
                                    onClick={() => handleResolve(c._id)}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition shadow-sm border border-indigo-100"
                                >
                                    Mark Resolved
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Complaints;
