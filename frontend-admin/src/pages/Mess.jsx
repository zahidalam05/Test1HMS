import { useState, useEffect } from 'react';
import API from '../services/api';
import { CalendarDays, CheckCircle, XCircle, Utensils, Search } from 'lucide-react';

const AdminMess = () => {
    const [leaves, setLeaves] = useState([]);
    const [menu, setMenu] = useState([]);
    const [students, setStudents] = useState([]);
    const [activePoll, setActivePoll] = useState(null);
    const [loading, setLoading] = useState(true);

    const [pollForm, setPollForm] = useState({
        veg1: { name: '', rollNo: '', branch: '', year: '' },
        veg2: { name: '', rollNo: '', branch: '', year: '' },
        nonVeg1: { name: '', rollNo: '', branch: '', year: '' },
        nonVeg2: { name: '', rollNo: '', branch: '', year: '' },
        duration: 2
    });

    const fetchLeaves = async () => {
        try {
            const { data } = await API.get('/mess/leave/all');
            setLeaves(data);
        } catch (error) {
            console.error('Failed to fetch leaves', error);
        }
    };

    const fetchMenu = async () => {
        try {
            const { data } = await API.get('/mess/menu');
            setMenu(data);
        } catch (error) {
            console.error('Failed to fetch menu', error);
        }
    };

    const fetchPollsAndStudents = async () => {
        try {
            const [pollRes, studentRes] = await Promise.all([
                API.get('/mess/poll'),
                API.get('/students')
            ]);
            setActivePoll(pollRes.data.poll);
            setStudents(studentRes.data);
        } catch (error) {
            console.error('Failed to fetch poll or students', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
        fetchMenu();
        fetchPollsAndStudents();
    }, []);

    const handleAction = async (id, action) => {
        try {
            const status = action === 'approve' ? 'Approved' : 'Rejected';
            await API.put(`/mess/leave/${id}`, { status });
            fetchLeaves(); // refresh
        } catch (error) {
            console.error(error);
            alert(`Failed to ${action} leave`);
        }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        try {
            const candidates = [
                { ...pollForm.veg1, type: 'Veg' },
                { ...pollForm.veg2, type: 'Veg' },
                { ...pollForm.nonVeg1, type: 'Non-Veg' },
                { ...pollForm.nonVeg2, type: 'Non-Veg' }
            ];
            await API.post('/mess/poll', { durationHours: pollForm.duration, candidates });
            alert("Election Poll created successfully!");
            fetchPollsAndStudents();
        } catch (error) {
            alert(error.response?.data?.message || "Error creating poll");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Mess Data...</div>;

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedMenu = [...menu].sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Utensils className="text-indigo-600" /> Mess Management
                    </h1>
                    <p className="text-gray-500 mt-1">Review leave applications, manage elections and monitor mess menu.</p>
                </div>
            </div>

            {/* Mess Election Polls */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-8 sm:p-10 mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Create New Election Poll</h2>
                <p className="text-sm text-gray-500 mb-8">Set up a new voting session for Mess Representatives by manually entering the candidates below.</p>

                {activePoll && activePoll.status === 'Active' ? (
                    <div className="bg-[#ecedf1] p-6 rounded-2xl">
                        <h3 className="font-bold text-indigo-900 mb-2 text-lg">Polling is Currently Active!</h3>
                        <p className="text-sm text-indigo-700">Ends at: <span className="font-bold">{new Date(activePoll.endTime).toLocaleString()}</span></p>
                        <p className="text-xs text-indigo-500 mt-2">No new polls can be created until this one concludes.</p>
                    </div>
                ) : (
                    <form onSubmit={handleCreatePoll} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Veg 1 */}
                            <div className="bg-[#f8f9fa] p-6 rounded-[20px] space-y-4 shadow-sm border border-gray-100">
                                <h3 className="font-extrabold text-indigo-900 text-sm tracking-widest uppercase">Veg Candidate 1</h3>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5 mt-2">Full Name</label>
                                    <input placeholder="e.g. John Doe" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg1.name} onChange={e => setPollForm({ ...pollForm, veg1: { ...pollForm.veg1, name: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Roll No</label>
                                    <input placeholder="e.g. 21CS01" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg1.rollNo} onChange={e => setPollForm({ ...pollForm, veg1: { ...pollForm.veg1, rollNo: e.target.value } })} />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Branch</label>
                                        <input placeholder="e.g. CSE" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg1.branch} onChange={e => setPollForm({ ...pollForm, veg1: { ...pollForm.veg1, branch: e.target.value } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Year</label>
                                        <input placeholder="e.g. 3rd" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg1.year} onChange={e => setPollForm({ ...pollForm, veg1: { ...pollForm.veg1, year: e.target.value } })} />
                                    </div>
                                </div>
                            </div>

                            {/* Veg 2 */}
                            <div className="bg-[#f8f9fa] p-6 rounded-[20px] space-y-4 shadow-sm border border-gray-100">
                                <h3 className="font-extrabold text-indigo-900 text-sm tracking-widest uppercase">Veg Candidate 2</h3>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Full Name</label>
                                    <input placeholder="e.g. Jane Smith" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg2.name} onChange={e => setPollForm({ ...pollForm, veg2: { ...pollForm.veg2, name: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Roll No</label>
                                    <input placeholder="e.g. 21CS02" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg2.rollNo} onChange={e => setPollForm({ ...pollForm, veg2: { ...pollForm.veg2, rollNo: e.target.value } })} />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Branch</label>
                                        <input placeholder="e.g. ECE" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg2.branch} onChange={e => setPollForm({ ...pollForm, veg2: { ...pollForm.veg2, branch: e.target.value } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Year</label>
                                        <input placeholder="e.g. 3rd" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.veg2.year} onChange={e => setPollForm({ ...pollForm, veg2: { ...pollForm.veg2, year: e.target.value } })} />
                                    </div>
                                </div>
                            </div>

                            {/* Non Veg 1 */}
                            <div className="bg-[#f8f9fa] p-6 rounded-[20px] space-y-4 shadow-sm border border-gray-100">
                                <h3 className="font-extrabold text-[#e05a33] text-sm tracking-widest uppercase">Non-Veg Candidate 1</h3>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Full Name</label>
                                    <input placeholder="e.g. Alice Doe" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg1.name} onChange={e => setPollForm({ ...pollForm, nonVeg1: { ...pollForm.nonVeg1, name: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Roll No</label>
                                    <input placeholder="e.g. 21EE01" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg1.rollNo} onChange={e => setPollForm({ ...pollForm, nonVeg1: { ...pollForm.nonVeg1, rollNo: e.target.value } })} />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Branch</label>
                                        <input placeholder="e.g. EE" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg1.branch} onChange={e => setPollForm({ ...pollForm, nonVeg1: { ...pollForm.nonVeg1, branch: e.target.value } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Year</label>
                                        <input placeholder="e.g. 2nd" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg1.year} onChange={e => setPollForm({ ...pollForm, nonVeg1: { ...pollForm.nonVeg1, year: e.target.value } })} />
                                    </div>
                                </div>
                            </div>

                            {/* Non Veg 2 */}
                            <div className="bg-[#f8f9fa] p-6 rounded-[20px] space-y-4 shadow-sm border border-gray-100">
                                <h3 className="font-extrabold text-[#e05a33] text-sm tracking-widest uppercase">Non-Veg Candidate 2</h3>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Full Name</label>
                                    <input placeholder="e.g. Bob Ray" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg2.name} onChange={e => setPollForm({ ...pollForm, nonVeg2: { ...pollForm.nonVeg2, name: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Roll No</label>
                                    <input placeholder="e.g. 21ME05" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg2.rollNo} onChange={e => setPollForm({ ...pollForm, nonVeg2: { ...pollForm.nonVeg2, rollNo: e.target.value } })} />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Branch</label>
                                        <input placeholder="e.g. ME" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg2.branch} onChange={e => setPollForm({ ...pollForm, nonVeg2: { ...pollForm.nonVeg2, branch: e.target.value } })} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Year</label>
                                        <input placeholder="e.g. 2nd" required className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-400" value={pollForm.nonVeg2.year} onChange={e => setPollForm({ ...pollForm, nonVeg2: { ...pollForm.nonVeg2, year: e.target.value } })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-end gap-6 pt-4 border-t border-gray-100">
                            <div className="w-full md:w-1/3">
                                <label className="block font-bold text-[13px] text-gray-700 mb-1.5">Poll Duration (in Hours)</label>
                                <input type="number" required min="1" className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800" value={pollForm.duration} onChange={e => setPollForm({ ...pollForm, duration: e.target.value })} />
                            </div>
                            <div className="w-full md:w-auto ml-auto">
                                <button type="submit" className="w-full md:w-56 bg-[#5145ff] text-white px-8 py-3 rounded-[14px] font-bold shadow-[0_4px_14px_0_rgba(81,69,255,0.39)] hover:bg-[#4338e5] hover:shadow-[0_6px_20px_rgba(81,69,255,0.23)] transition-all transform hover:-translate-y-0.5 outline-none">
                                    Create Session
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Leave Approvals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <CalendarDays className="text-blue-500" /> Pending Leave Requests
                    </h2>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {leaves.filter(l => l.status === 'Pending').length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No pending leave requests.</p>
                        ) : leaves.filter(l => l.status === 'Pending').map(leave => (
                            <div key={leave._id} className="border border-gray-100 p-4 rounded-xl bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">{leave.student?.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500 mb-2">{leave.student?.rollNo} • {leave.student?.branch}</p>
                                    <div className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-md inline-block">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </div>
                                    {leave.reason && <p className="text-xs text-gray-600 mt-2 mt-1">"{leave.reason}"</p>}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <button onClick={() => handleAction(leave._id, 'approve')} className="flex items-center gap-1 px-3 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-bold transition">
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                    <button onClick={() => handleAction(leave._id, 'reject')} className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-bold transition">
                                        <XCircle size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Menu Display */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
                        <h2 className="text-lg font-bold">Current Mess Menu</h2>
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Updated by Mess Sec</span>
                    </div>

                    <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                        {sortedMenu.length === 0 ? <p className="text-gray-500 text-sm">Menu not set yet.</p> : sortedMenu.map(dayMenu => (
                            <div key={dayMenu._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                                <h3 className="font-bold text-gray-800 mb-2">{dayMenu.day}</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500 block text-xs">Breakfast</span> {dayMenu.breakfast}</div>
                                    <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500 block text-xs">Lunch</span> {dayMenu.lunch}</div>
                                    <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500 block text-xs">Dinner</span> {dayMenu.dinner}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Approved Leave History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Recent Leave History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 rounded-tl-xl">Student</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Rebate Days</th>
                                <th className="p-4 rounded-tr-xl">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leaves.filter(l => l.status !== 'Pending').slice(0, 10).map(leave => (
                                <tr key={leave._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900 text-sm">{leave.student?.user?.name}</p>
                                        <p className="text-xs text-gray-500">{leave.student?.rollNo}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-sm font-bold text-gray-700">{leave.rebateDays}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {leave.status}
                                        </span>
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

export default AdminMess;
