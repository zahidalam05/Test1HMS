import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import API from '../services/api';
import { Home, IndianRupee, MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ complaints: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setProfile(data.profile);
                const { data: comp } = await API.get('/complaints/my');
                setStats({ complaints: comp.filter(c => c.status === 'Open').length });
            } catch (error) {
                console.error("Error", error);
            }
        };
        fetchData();
    }, []);

    const StatusCard = ({ title, value, subtext, icon: Icon, color, link, buttonText }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
                    <p className={`text-xs mt-1 font-medium ${color}`}>{subtext}</p>
                </div>
                <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '50').replace('700', '50')}`}>
                    <Icon className={color} size={24} />
                </div>
            </div>
            <Link to={link} className="mt-4 block w-full py-2 text-center text-sm font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition">
                {buttonText}
            </Link>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard
                    title="My Room"
                    value={profile?.room ? `${profile.hostel.name} - ${profile.room.roomNumber}` : 'Not Allocated'}
                    subtext={profile?.room ? 'Occupied' : 'Application Pending'}
                    icon={Home}
                    color="text-blue-600"
                    link="/hostel"
                    buttonText={profile?.room ? 'View Details' : 'Apply Now'}
                />

                <StatusCard
                    title="Fee Status"
                    value="Active" // Placeholder logic
                    subtext="Last payment approved"
                    icon={IndianRupee}
                    color="text-green-600"
                    link="/fees"
                    buttonText="View History"
                />

                <StatusCard
                    title="Complaints"
                    value={stats.complaints}
                    subtext="Open tickets"
                    icon={MessageSquare}
                    color="text-orange-600"
                    link="/complaints"
                    buttonText="Raise Complaint"
                />
            </div>

            {/* Recent Activity / Notices Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-800">Latest Updates</h3>
                    <Link to="/notices" className="text-sm text-indigo-600 hover:underline">View All</Link>
                </div>
                <div className="p-6 text-center text-gray-500">
                    <div className="flex justify-center mb-3">
                        <AlertCircle size={40} className="text-gray-300" />
                    </div>
                    <p>No urgent notices at the moment.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
