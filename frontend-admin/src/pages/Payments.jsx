import { useState, useEffect } from 'react';
import API from '../services/api';

const Payments = () => {
    const [payments, setPayments] = useState([]);

    const fetchPayments = async () => {
        const { data } = await API.get('/payments');
        setPayments(data);
    };

    useEffect(() => {
        fetchPayments();
    }, []);

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
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount/Mode</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Proof</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{p.student?.user?.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{p.student?.rollNo}</div>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">₹{p.amount}</div>
                                        <div className="text-xs text-gray-500">{p.paymentMode} • {p.txnId}</div>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <a
                                            href={`http://localhost:5000/${p.screenshotUrl}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline block"
                                        >
                                            View Image
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${p.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : p.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 text-right whitespace-nowrap space-x-2">
                                        {p.status === 'Pending' ? (
                                            <>
                                                <button onClick={() => handleUpdate(p._id, 'Approved')} className="text-green-600 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium transition border border-transparent hover:border-green-200">Approve</button>
                                                <button onClick={() => handleUpdate(p._id, 'Rejected')} className="text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition border border-transparent hover:border-red-200">Reject</button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No actions</span>
                                        )}
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

export default Payments;
