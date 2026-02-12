import { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, MapPin, Phone, User, Filter, Eye, ChevronDown } from 'lucide-react';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [viewApp, setViewApp] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Room Allocation State
    const [allocating, setAllocating] = useState(false);
    const [allocData, setAllocData] = useState({ type: '', name: '', room: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await API.get('/students/applications');
            setApplications(data);
        } catch (e) { console.error(e); }
    };

    const handleOpenAllocate = () => {
        setAllocating(true);
        // Pre-fill with user preference if available
        if (viewApp) {
            setAllocData({
                type: viewApp.hostelType || '',
                name: viewApp.hostelTypeOther || '',
                room: viewApp.roomNo || ''
            });
        }
    };

    const handleApprove = async () => {
        let hostelName = allocData.type;
        if (hostelName === 'Other') hostelName = allocData.name;

        if (!hostelName || !allocData.room) {
            alert("Please provide Hostel Name and Room Number");
            return;
        }

        try {
            await API.put(`/students/applications/${viewApp._id}`, {
                status: 'Approved',
                hostelName,
                roomNumber: allocData.room
            });
            alert("Application Approved & Room Allocated!");
            setViewApp(null);
            setAllocating(false);
            setAllocData({ type: '', name: '', room: '' });
            fetchData();
        } catch (e) {
            alert("Error: " + (e.response?.data?.message || 'Failed'));
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Are you sure you want to reject this application?")) return;
        try {
            await API.put(`/students/applications/${viewApp._id}`, { status: 'Rejected' });
            setViewApp(null);
            fetchData();
        } catch (e) { alert("Failed"); }
    };

    const filteredApps = applications.filter(app =>
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student?.rollNo?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hostel Applications</h1>
                    <p className="text-gray-500 text-sm">Manage incoming student requests.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Details</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Academic</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hostel Pref</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 md:px-6 md:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApps.map(app => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                {app.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm">{app.name}</div>
                                                <div className="text-xs text-gray-500">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{app.branch}</div>
                                        <div className="text-xs text-gray-500 font-mono">{app.rollNo}</div>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-600 whitespace-nowrap">
                                        <span className="font-medium text-gray-900">{app.hostelType}</span>
                                        {app.hostelType === 'Other' && <span className="text-xs ml-1">({app.hostelTypeOther})</span>}
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${app.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            app.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 md:px-6 md:py-4 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => { setViewApp(app); setAllocating(false); setAllocData({ type: '', name: '', room: '' }); }}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {viewApp && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                            <button onClick={() => setViewApp(null)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-500">
                                <span className="sr-only">Close</span>✕
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Student & Address Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Section title="Student Info" icon={User}>
                                    <div className="space-y-3 text-sm">
                                        <Field label="Full Name" value={viewApp.name} />
                                        <Field label="Father's Name" value={viewApp.fatherName} />
                                        <Field label="Roll No" value={viewApp.rollNo} />
                                        <Field label="Branch" value={viewApp.branch} />
                                        <Field label="Year" value={viewApp.academicYear} />
                                        <Field label="Session" value={viewApp.session} />
                                        <Field label="CGPA" value={viewApp.cgpa} />
                                    </div>
                                </Section>

                                <Section title="Contact & Address" icon={MapPin}>
                                    <div className="space-y-3 text-sm">
                                        <Field label="Student Mobile" value={viewApp.mobNo} />
                                        <Field label="Parent Mobile" value={viewApp.parentMobNo} />
                                        <Field label="District" value={viewApp.address?.district} />
                                        <Field label="State" value={viewApp.address?.state} />
                                        <Field label="Pin Code" value={viewApp.address?.pinCode} />
                                        <Field label="Full Address" value={`${viewApp.address?.block}, ${viewApp.address?.district}, ${viewApp.address?.state}`} />
                                    </div>
                                </Section>
                            </div>

                            {/* Payment Section */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-3 text-sm">
                                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">Payment Info</h4>
                                    <Field label="Txn ID" value={viewApp.payment?.txnId} />
                                    <Field label="Amount" value={`₹${viewApp.payment?.amount}`} />
                                    <Field label="Date" value={new Date(viewApp.payment?.txnDate).toLocaleDateString()} />
                                    <Field label="Bank" value={viewApp.payment?.bank} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-2">Screenshot Proof</h4>
                                    <a
                                        href={`http://localhost:5000/${viewApp.payment?.screenshotUrl}`}
                                        target="_blank"
                                        className="block w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative group"
                                    >
                                        <img
                                            src={`http://localhost:5000/${viewApp.payment?.screenshotUrl}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            alt="Proof"
                                        />
                                    </a>
                                </div>
                            </div>

                            {/* Allocation UI */}
                            {viewApp.status === 'Pending' && allocating && (
                                <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 animate-in slide-in-from-top-2">
                                    <h3 className="font-bold text-indigo-900 mb-4">Allocate Room Manualy</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Hostel</label>
                                            <select
                                                value={allocData.type}
                                                onChange={(e) => setAllocData({ ...allocData, type: e.target.value })}
                                                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            >
                                                <option value="">-- Select Hostel --</option>
                                                <option value="H1">H1</option>
                                                <option value="H2">H2</option>
                                                <option value="H3">H3</option>
                                                <option value="GH">GH</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {allocData.type === 'Other' && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Hostel Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Hostel Name"
                                                    value={allocData.name}
                                                    onChange={(e) => setAllocData({ ...allocData, name: e.target.value })}
                                                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Room Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Room No"
                                                value={allocData.room}
                                                onChange={(e) => setAllocData({ ...allocData, room: e.target.value })}
                                                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>

                                        <div className="flex gap-3 justify-end mt-4">
                                            <button onClick={() => setAllocating(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">Cancel</button>
                                            <button onClick={handleApprove} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md">
                                                Confirm Allocation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {viewApp.status === 'Pending' && !allocating && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    onClick={handleReject}
                                    className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition shadow-sm"
                                >
                                    Reject Application
                                </button>
                                <button
                                    onClick={handleOpenAllocate}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
                                >
                                    Approve & Allocate Room
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const Section = ({ title, icon: Icon, children }) => (
    <div>
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
            <Icon size={16} className="text-indigo-500" /> {title}
        </h3>
        {children}
    </div>
);

const Field = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-100 py-1 last:border-0">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-900 font-medium text-right">{value || '-'}</span>
    </div>
);

export default Applications;
