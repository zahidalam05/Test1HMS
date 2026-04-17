import { useState, useEffect } from 'react';
import API from '../services/api';
import { Printer } from 'lucide-react';

const FeePayment = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get('/payments/my');
                setPayments(data);
            } catch (e) { console.error(e); }
        };
        fetch();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
                    <Printer size={18} /> Print History
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Txn ID</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Bank/Mode</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase print:hidden">Proof</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map(p => (
                            <tr key={p._id}>
                                <td className="px-6 py-4 text-sm text-gray-900 font-mono">{p.txnId}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{p.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{p.paymentMode}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'Approved' ? 'bg-green-100 text-green-800' : p.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 print:hidden">
                                    <a href={`https://mithms-backend.onrender.com/${p.screenshotUrl}`} target="_blank" className="text-blue-600 hover:underline text-sm">View</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payments.length === 0 && <div className="p-8 text-center text-gray-500">No payment history found.</div>}
            </div>

            <style>{`
                @media print {
                    .print\\:hidden { display: none; }
                    body { background: white; }
                    .shadow-lg { box-shadow: none; border: 1px solid #ddd; }
                }
            `}</style>
        </div>
    );
};

export default FeePayment;
