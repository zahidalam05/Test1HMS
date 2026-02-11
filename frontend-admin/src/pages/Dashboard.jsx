import { useState, useEffect } from 'react';
import API from '../services/api';
import {
    Users,
    Hotel,
    FileText,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    ArrowUpRight,
    Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/admin/dashboard');
                setData(data);
            } catch (error) {
                console.error("Dashboard Load Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader className="animate-spin text-indigo-600" size={40} /></div>;
    if (!data) return <div className="p-8 text-center">Failed to load dashboard data.</div>;

    const stats = [
        { label: 'Total Students', value: data.counts.students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Occupancy Rate', value: `${data.counts.occupancyRate}%`, icon: Hotel, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Pending Apps', value: data.counts.pendingApps, icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Resolved Issues', value: data.counts.resolvedComplaints, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Real-time updates from the system.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            {/* Placeholder trend for now, real trend needs historical data db */}
                            <span className="flex items-center text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                Live
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Apps */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Recent Applications</h3>
                        <Link to="/applications" className="text-sm text-indigo-600 font-medium hover:underline flex items-center">View All <ArrowUpRight size={16} /></Link>
                    </div>
                    <div className="space-y-4">
                        {data.recentApplications && data.recentApplications.length > 0 ? (
                            data.recentApplications.map(app => (
                                <div key={app._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{app.name}</p>
                                            <p className="text-xs text-gray-500">Hostel: {app.hostelType}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))
                        ) : <p className="text-gray-400 text-sm">No recent applications.</p>}
                    </div>
                </div>

                {/* Recent Complaints */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Open Complaints</h3>
                        <Link to="/complaints" className="text-sm text-red-600 font-medium hover:underline flex items-center">View All <ArrowUpRight size={16} /></Link>
                    </div>
                    <div className="space-y-4">
                        {data.recentComplaints && data.recentComplaints.length > 0 ? (
                            data.recentComplaints.map(comp => (
                                <div key={comp._id} className="flex items-start gap-3 p-4 border-b border-gray-50 last:border-0 hover:bg-red-50/30 transition rounded-lg">
                                    <AlertCircle className="text-red-500 mt-1 shrink-0" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{comp.subject}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {comp.category} • {new Date(comp.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-gray-400 text-sm">No open complaints.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
