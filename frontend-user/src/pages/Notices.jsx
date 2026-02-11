import { useState, useEffect } from 'react';
import API from '../services/api';

const Notices = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            const { data } = await API.get('/notices');
            setNotices(data);
        };
        fetchNotices();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Notice Board</h1>
            <div className="grid gap-4">
                {notices.map(notice => (
                    <div key={notice._id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-800">{notice.title}</h3>
                            <span className="text-xs text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 text-gray-700 whitespace-pre-wrap">
                            {notice.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notices;
