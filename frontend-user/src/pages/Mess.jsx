import { useState, useEffect } from 'react';
import API from '../services/api';
import { CalendarDays, Utensils, Send, History } from 'lucide-react';

const Mess = () => {
    const [menu, setMenu] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const [pollData, setPollData] = useState(null);
    const [isMessSec, setIsMessSec] = useState(false);

    // Menu editing states
    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };
    const [editingDay, setEditingDay] = useState(null);
    const [editForm, setEditForm] = useState({ breakfast: '', lunch: '', dinner: '' });
    const [selectedDay, setSelectedDay] = useState(getCurrentDay());

    useEffect(() => {
        loadPageData();
    }, []);

    const loadPageData = async () => {
        try {
            const [menuRes, leaveRes, profileRes, pollRes] = await Promise.all([
                API.get('/mess/menu'),
                API.get('/mess/leave/my'),
                API.get('/auth/profile'),
                API.get('/mess/poll')
            ]);
            setMenu(menuRes.data);
            setLeaves(leaveRes.data);
            setIsMessSec(profileRes.data.profile?.isMessSec || false);
            setPollData(pollRes.data);
        } catch (e) {
            console.error("Error loading mess data", e);
        }
    };

    const fetchMenu = async () => {
        const { data } = await API.get('/mess/menu');
        setMenu(data);
    };

    const fetchLeaves = async () => {
        const { data } = await API.get('/mess/leave/my');
        setLeaves(data);
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/mess/leave', { startDate, endDate, reason });
            alert('Mess leave applied successfully!');
            setStartDate('');
            setEndDate('');
            setReason('');
            fetchLeaves();
        } catch (error) {
            console.error(error);
            alert('Failed to apply leave');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get formatted date
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    const handleVote = async (candidateId) => {
        try {
            await API.post('/mess/poll/vote', { pollId: pollData.poll._id, candidateId });
            alert("Voted successfully!");
            loadPageData(); // Refresh poll info
        } catch (error) {
            alert(error.response?.data?.message || 'Error voting');
        }
    };

    const handleMenuSave = async (day) => {
        try {
            await API.post('/mess/menu', { day, ...editForm });
            setEditingDay(null);
            fetchMenu();
        } catch (error) {
            alert("Failed to update menu");
        }
    };

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedMenu = [...menu];
    daysOrder.forEach(day => { if (!sortedMenu.find(m => m.day === day)) sortedMenu.push({ day, breakfast: '-', lunch: '-', dinner: '-' }); });
    sortedMenu.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
                    Mess Management
                </h1>
                <p className="text-gray-500">View weekly menu and apply for mess rebate (leave).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Apply Leave & Leave History */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Apply Leave Card */}
                    <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                            <CalendarDays className="text-indigo-600" /> Apply Mess Leave
                        </h2>
                        <form onSubmit={handleApplyLeave} className="space-y-6">
                            <div>
                                <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[18px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb]"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1">End Date</label>
                                <input
                                    type="date"
                                    required
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[18px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb]"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1">Reason (Optional)</label>
                                <textarea
                                    placeholder="e.g. Going home for weekend..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[18px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 placeholder-gray-400 shadow-sm hover:bg-[#e4e6eb] resizable-none"
                                    rows="3"
                                ></textarea>
                            </div>
                            <button disabled={loading} type="submit" className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-[#5145ff] text-white font-bold rounded-[14px] shadow-[0_4px_14px_0_rgba(81,69,255,0.39)] hover:bg-[#4338e5] hover:shadow-[0_6px_20px_rgba(81,69,255,0.23)] transition-all transform hover:-translate-y-0.5 outline-none">
                                <Send size={18} /> {loading ? 'Submitting...' : 'Apply Leave'}
                            </button>
                        </form>
                    </div>

                    {/* Leave History */}
                    <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 animate-in fade-in slide-in-from-bottom-6 mt-8">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                            <History className="text-gray-500" /> My Leaves
                        </h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {leaves.length === 0 ? <p className="text-sm text-gray-400">No leaves applied yet.</p> : leaves.map(leave => (
                                <div key={leave._id} className="p-3 border border-gray-100 rounded-xl bg-gray-50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-800">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                    {leave.status === 'Approved' && <p className="text-xs text-green-600 font-medium">+ {leave.rebateDays} Rebate Days</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Weekly Menu */}
                <div className="lg:col-span-2">
                    {pollData && pollData.active && pollData.poll && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl shadow-xl p-6 mb-8 text-white animate-pulse">
                            <h2 className="text-2xl font-bold mb-2">⭐ Mess Representative Election is LIVE! ⭐</h2>
                            <p className="mb-4">Time is running out. Cast your vote for your favorite candidates!</p>

                            {pollData.hasVoted ? (
                                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm text-center font-bold">
                                    You have already voted. Waiting for results...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-5 rounded-2xl border border-white/20 shadow-inner">
                                        <h3 className="font-bold underline mb-4 text-xl text-yellow-100 font-mono tracking-widest text-center">VEG CANDIDATES</h3>
                                        <div className="space-y-3">
                                            {pollData.poll.candidates.filter(c => c.type === 'Veg').map(c => (
                                                <div key={c._id} className="bg-white text-gray-900 rounded-xl p-4 shadow flex flex-col sm:flex-row items-center gap-4 justify-between transform transition duration-300 hover:scale-[1.02]">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-orange-600">{c.name || c.student?.user?.name}</h4>
                                                        <p className="text-xs text-gray-500 font-bold mb-1">Roll No: {c.rollNo || c.student?.rollNo}</p>
                                                        <div className="flex gap-2 text-xs">
                                                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">{c.branch || c.student?.branch}</span>
                                                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">Year: {c.year || c.student?.year}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleVote(c._id)} className="w-full sm:w-auto bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition">
                                                        VOTE
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-5 rounded-2xl border border-white/10 shadow-inner">
                                        <h3 className="font-bold underline mb-4 text-xl text-yellow-100 font-mono tracking-widest text-center">NON-VEG CANDIDATES</h3>
                                        <div className="space-y-3">
                                            {pollData.poll.candidates.filter(c => c.type === 'Non-Veg').map(c => (
                                                <div key={c._id} className="bg-gray-900 text-white rounded-xl p-4 shadow flex flex-col sm:flex-row items-center gap-4 justify-between transform transition duration-300 hover:scale-[1.02]">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-red-400">{c.name || c.student?.user?.name}</h4>
                                                        <p className="text-xs text-gray-400 font-bold mb-1">Roll No: {c.rollNo || c.student?.rollNo}</p>
                                                        <div className="flex gap-2 text-xs">
                                                            <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">{c.branch || c.student?.branch}</span>
                                                            <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">Year: {c.year || c.student?.year}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleVote(c._id)} className="w-full sm:w-auto bg-gradient-to-r from-gray-700 to-black border border-gray-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:border-gray-400 transition">
                                                        VOTE
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-8">
                        <div className="bg-gradient-to-r from-[#2c263d] to-[#453664] p-8 flex items-center gap-4 text-white">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm"><Utensils size={32} /></div>
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight">Weekly Mess Menu</h2>
                                <p className="text-indigo-200 text-sm font-medium">{isMessSec ? "You are a Mess Rep. You can edit this menu." : "Updated by Mess Representatives"}</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-10">
                            {/* Day Selector Tabs */}
                            <div className="flex overflow-x-auto gap-3 pt-2 pb-4 px-1 mb-8 max-w-full no-scrollbar">
                                {daysOrder.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => { setSelectedDay(day); setEditingDay(null); }}
                                        className={`px-6 py-3 rounded-[16px] whitespace-nowrap font-bold text-[13px] uppercase tracking-wider transition-all duration-300 ${selectedDay === day ? 'bg-[#5145ff] text-white shadow-[0_6px_20px_rgba(81,69,255,0.4)] transform -translate-y-1' : 'bg-[#ecedf1] text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            {/* Active Day Card */}
                            {sortedMenu.filter(m => m.day === selectedDay).map((dayMenu) => (
                                <div key={dayMenu.day} className="bg-white p-8 md:p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-60"></div>

                                    <div className="relative z-10 flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                        <h3 className="font-extrabold text-3xl text-gray-900 tracking-tight">{dayMenu.day} Menu</h3>
                                        {isMessSec && editingDay !== dayMenu.day && (
                                            <button onClick={() => { setEditingDay(dayMenu.day); setEditForm({ breakfast: dayMenu.breakfast, lunch: dayMenu.lunch, dinner: dayMenu.dinner }); }} className="text-[#5145ff] text-sm font-bold bg-indigo-50 hover:bg-indigo-100 transition px-6 py-2 rounded-[12px] shadow-sm">
                                                Edit Menu
                                            </button>
                                        )}
                                    </div>

                                    {editingDay === dayMenu.day ? (
                                        <div className="space-y-6 relative z-10">
                                            <div>
                                                <label className="block font-bold text-[13px] text-gray-700 mb-2">Breakfast</label>
                                                <input className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800" placeholder="E.g. Poha, Tea" value={editForm.breakfast} onChange={e => setEditForm({ ...editForm, breakfast: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-[13px] text-gray-700 mb-2">Lunch</label>
                                                <input className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800" placeholder="E.g. Roti, Dal, Rice" value={editForm.lunch} onChange={e => setEditForm({ ...editForm, lunch: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block font-bold text-[13px] text-gray-700 mb-2">Dinner</label>
                                                <input className="w-full px-4 py-3 bg-[#ecedf1] border border-transparent rounded-[14px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800" placeholder="E.g. Paneer Butter Masala, Naan" value={editForm.dinner} onChange={e => setEditForm({ ...editForm, dinner: e.target.value })} />
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <button onClick={() => handleMenuSave(dayMenu.day)} className="flex-1 bg-[#059669] text-white px-6 py-3.5 rounded-[14px] font-bold shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] hover:bg-[#047857] transition-all hover:-translate-y-0.5">Save Changes</button>
                                                <button onClick={() => setEditingDay(null)} className="flex-1 bg-gray-200 text-gray-800 px-6 py-3.5 rounded-[14px] font-bold hover:bg-gray-300 transition-all">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 p-6 rounded-[20px] bg-gray-50 border border-gray-100 hover:shadow-md transition-all">
                                                <span className="font-extrabold text-[13px] uppercase tracking-widest text-[#5145ff] md:w-32">Breakfast</span>
                                                <span className="text-gray-900 font-bold text-lg">{dayMenu.breakfast || '-'}</span>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 p-6 rounded-[20px] bg-gray-50 border border-gray-100 hover:shadow-md transition-all">
                                                <span className="font-extrabold text-[13px] uppercase tracking-widest text-orange-500 md:w-32">Lunch</span>
                                                <span className="text-gray-900 font-bold text-lg">{dayMenu.lunch || '-'}</span>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 p-6 rounded-[20px] bg-gray-50 border border-gray-100 hover:shadow-md transition-all">
                                                <span className="font-extrabold text-[13px] uppercase tracking-widest text-emerald-500 md:w-32">Dinner</span>
                                                <span className="text-gray-900 font-bold text-lg">{dayMenu.dinner || '-'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mess;
