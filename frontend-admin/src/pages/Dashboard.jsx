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
    Loader,
    Utensils,
    CalendarOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red' }}>
                    <h2>UI Crashed!</h2>
                    <p>{this.state.error?.toString()}</p>
                    <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLeaveList, setShowLeaveList] = useState(false);

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
        { label: 'Eating Today', value: data.counts.eatingToday !== undefined ? data.counts.eatingToday : '-', icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ];

    return (
        <ErrorBoundary>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1 font-medium">Real-time updates from the system.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[24px] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-40 ${stat.bg}`}></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="text-gray-500 text-[11px] font-extrabold uppercase tracking-widest">{stat.label}</h3>
                                    <h3 className="text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">{stat.value}</h3>
                                    <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100">
                                        <span className={`w-2 h-2 rounded-full animate-pulse ${stat.color.replace('text', 'bg')}`}></span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Updates</span>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-[16px] shadow-sm border border-gray-50 ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={stat.color} size={28} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mess Daily Operations */}
                <div className="bg-gradient-to-r from-[#2c263d] to-[#453664] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 text-white flex flex-col md:flex-row items-center justify-between mt-8">
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <Utensils size={36} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight">Today's Mess Count: {data.counts.eatingToday !== undefined ? data.counts.eatingToday : '-'} Students</h2>
                            <p className="text-indigo-200 mt-1 font-medium">{data.counts.onLeave || 0} students are currently on leave.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowLeaveList(true)}
                        className="px-8 py-3.5 bg-white text-indigo-900 font-bold rounded-[14px] shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] hover:bg-gray-50 hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] transition-all transform hover:-translate-y-0.5 outline-none"
                    >
                        View Leave List
                    </button>
                </div>

                {/* Leave List Modal */}
                {showLeaveList && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white rounded-[24px] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-white/20">
                            <div className="p-6 md:p-8 flex justify-between items-center bg-[#f8f9fa] border-b border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3 relative z-10"><CalendarOff className="text-[#5145ff]" /> Students on Leave</h2>
                                <button onClick={() => setShowLeaveList(false)} className="w-10 h-10 flex items-center justify-center bg-white shadow-sm hover:shadow-md hover:bg-gray-50 border border-gray-100 rounded-full text-gray-500 transition-all relative z-10">✕</button>
                            </div>
                            <div className="p-6 md:p-8 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                                {data.leavesToday && data.leavesToday.length > 0 ? (
                                    data.leavesToday.map(leave => (
                                        <div key={leave._id} className="flex justify-between items-center bg-white border border-gray-100 p-5 rounded-[20px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden group">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5145ff]"></div>
                                            <div className="flex items-center gap-4 pl-2">
                                                <div className="w-12 h-12 bg-[#f8f9fa] border border-gray-100 text-[#5145ff] rounded-[14px] flex items-center justify-center font-extrabold shadow-sm">
                                                    {leave.student?.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-gray-900 text-lg">{leave.student?.user?.name}</p>
                                                    <p className="text-[13px] font-bold text-gray-500">{leave.student?.rollNo} • {leave.student?.branch}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-4 py-1.5 bg-green-50 text-green-700 font-extrabold text-[11px] uppercase tracking-wider rounded-full border border-green-100">Active</span>
                                                <p className="text-[11px] font-bold text-gray-400 mt-2">Till {new Date(leave.endDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-6">No students on leave today.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Recent Apps */}
                    <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-extrabold text-gray-900">Recent Applications</h3>
                            <Link to="/applications" className="text-[13px] text-indigo-600 font-bold hover:text-indigo-800 flex items-center transition">View All <ArrowUpRight size={16} /></Link>
                        </div>
                        <div className="space-y-4">
                            {data.recentApplications && data.recentApplications.length > 0 ? (
                                data.recentApplications.map(app => (
                                    <div key={app._id} className="flex items-center justify-between p-4 rounded-[16px] bg-[#f8f9fa] border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[14px] bg-white border border-gray-100 shadow-sm text-[#5145ff] flex items-center justify-center font-extrabold text-lg">
                                                {app.name ? app.name.charAt(0) : 'A'}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-gray-900">{app.name || 'Unknown'}</p>
                                                <p className="text-[12px] font-bold text-gray-500 mt-0.5">Hostel: {app.hostelType || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider rounded-full border ${app.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                            {app.status || 'Pending'}
                                        </span>
                                    </div>
                                ))
                            ) : <p className="text-gray-400 text-sm">No recent applications.</p>}
                        </div>
                    </div>

                    {/* Recent Complaints */}
                    <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-extrabold text-gray-900">Open Complaints</h3>
                            <Link to="/complaints" className="text-[13px] text-red-600 font-bold hover:text-red-800 flex items-center transition">View All <ArrowUpRight size={16} /></Link>
                        </div>
                        <div className="space-y-4">
                            {data.recentComplaints && data.recentComplaints.length > 0 ? (
                                data.recentComplaints.map(comp => (
                                    <div key={comp._id} className="flex items-start gap-4 p-5 rounded-[16px] bg-red-50/30 border border-transparent hover:border-red-100 hover:bg-red-50 transition-all">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-[12px]">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-extrabold text-gray-900 leading-tight">{comp.subject || 'No Subject'}</p>
                                            <p className="text-[12px] font-bold text-gray-500 mt-1.5">
                                                {comp.category || 'Other'} <span className="opacity-50 mx-1">•</span> {new Date(comp.createdAt || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : <p className="text-gray-400 text-sm">No open complaints.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default AdminDashboard;
