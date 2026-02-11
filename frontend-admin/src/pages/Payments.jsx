import { useState, useEffect } from 'react';
import API from '../services/api';

const Payments = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const { data } = await API.get('/payments');
        setPayments(data);
    };

    const handleUpdate = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this payment?`)) {
            await API.put(`/payments/${id}`, { status });
            fetchPayments();
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment Verification</h1>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Student</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Amount/Mode</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Proof</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map(p => (
                            <tr key={p._id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{p.student?.user?.name}</div>
                                    <div className="text-xs text-gray-500">{p.student?.rollNo}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">₹{p.amount}</div>
                                    <div className="text-xs text-gray-500">{p.paymentMode} • {p.txnId}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <a
                                        href={`http://localhost:5000/${p.screenshotUrl}`}
                                        target="_blank"
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
                                    >
                                        View Image
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : p.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {p.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleUpdate(p._id, 'Approved')} className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm font-medium transition">Approve</button>
                                            <button onClick={() => handleUpdate(p._id, 'Rejected')} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition">Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;
