import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import API from '../services/api';
import { Home, IndianRupee, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatusCard = (props) => {
    const IconComponent = props.icon;
    return (
        <div className="bg-white rounded-[24px] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.08)] border border-gray-100 p-8 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">{props.title}</h3>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">{props.value}</p>
                    <p className={`text-[13px] mt-1.5 font-bold ${props.color}`}>{props.subtext}</p>
                </div>
                <div className={`p-4 rounded-[16px] ${props.color.replace('text', 'bg').replace('600', '50').replace('700', '50')}`}>
                    <IconComponent className={props.color} size={28} />
                </div>
            </div>
            <Link to={props.link} className="mt-8 block w-full py-3 text-center text-[13px] font-bold text-white bg-gray-900 rounded-[14px] shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:bg-black hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] transition-all">
                {props.buttonText}
            </Link>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ complaints: 0, totalPaid: 0 });
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setProfile(data.profile);

                // Fetch Total Fees
                const { data: payments } = await API.get('/payments/my');
                const total = payments
                    .filter(p => p.status === 'Approved')
                    .reduce((sum, p) => sum + (p.amount || 0), 0);

                // Fetch Total Complaints
                const { data: comp } = await API.get('/complaints/my');

                // Fetch Latest Notices
                const { data: nots } = await API.get('/notices');
                if (Array.isArray(nots)) {
                    setNotices(nots.slice(0, 3));
                }

                setStats({
                    complaints: comp.length,
                    totalPaid: total
                });
            } catch (error) {
                console.error("Error", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-gray-500 mt-1 font-medium">Welcome back, {user?.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatusCard
                    title="My Room"
                    value={profile?.room ? `${profile.hostel.name} - ${profile.room.roomNumber}` : 'Not Allocated'}
                    subtext={profile?.room ? 'Stay Active' : 'Apply Now'}
                    icon={Home}
                    color="text-indigo-600"
                    link="/hostel"
                    buttonText="View Details"
                />

                <StatusCard
                    title="Total Fees Paid"
                    value={`₹${stats.totalPaid}`}
                    subtext="Approved payments"
                    icon={IndianRupee}
                    color="text-emerald-600"
                    link="/payments"
                    buttonText="View History"
                />

                <StatusCard
                    title="My Complaints"
                    value={stats.complaints}
                    subtext="Total tickets raised"
                    icon={MessageSquare}
                    color="text-orange-600"
                    link="/complaints"
                    buttonText="Support Desk"
                />
            </div>

            {/* Recent Activity / Notices Placeholder */}
            <div className="bg-white rounded-[24px] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden mt-8">
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-extrabold text-gray-900">Latest Updates</h3>
                    <Link to="/notices" className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 transition">View All</Link>
                </div>
                <div className="divide-y divide-gray-50 bg-white">
                    {notices.length > 0 ? (
                        notices.map((notice) => (
                            <div key={notice._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        {notice.category || 'General'}
                                    </span>
                                    <span className="text-gray-400 text-xs font-medium">
                                        {new Date(notice.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">{notice.title}</h4>
                                <p className="text-sm text-gray-500 line-clamp-1">{notice.message}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-medium italic">No new notices at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
