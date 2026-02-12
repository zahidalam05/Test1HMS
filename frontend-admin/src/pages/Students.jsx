import { useState, useEffect } from 'react';
import API from '../services/api';

const Students = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const { data } = await API.get('/students');
        setStudents(data);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Student (Manual)</button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Branch/Year</th>
                                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hostel/Room</th>
                                <th className="px-4 py-3 md:px-6 md:py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(s => (
                                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{s.user.name}</div>
                                        <div className="text-xs text-gray-500">{s.user.email}</div>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{s.rollNo}</td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">{s.branch} - {s.year}</td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
                                        {s.room ? (
                                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium border border-green-200">
                                                {s.hostel?.name} / {s.room?.roomNumber}
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">Not Allocated</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Students;
