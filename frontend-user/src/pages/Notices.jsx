import { useState, useEffect } from 'react';
import API from '../services/api';
import { Bell, Calendar, ChevronRight, Info, Search } from 'lucide-react';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const { data } = await API.get('/notices');
                setNotices(data);
            } catch (error) {
                console.error("Error fetching notices", error);
            }
        };
        fetchNotices();
    }, []);

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-200">
                            <Bell className="text-white" size={32} />
                        </div>
                        Notice Board
                    </h1>
                    <p className="text-gray-500 mt-2 font-bold text-sm uppercase tracking-widest pl-2">
                        Official Updates & Announcements
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm font-semibold text-gray-800"
                    />
                </div>
            </div>

            {/* Notices List */}
            <div className="grid gap-8">
                {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice, idx) => (
                        <div
                            key={notice._id}
                            className="bg-white rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden group hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] transition-all duration-500 animate-in slide-in-from-bottom-8"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-black rounded-full uppercase tracking-wider">
                                                Important
                                            </span>
                                            <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                                                <Calendar size={14} />
                                                {new Date(notice.createdAt).toLocaleDateString(undefined, {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                                            {notice.title}
                                        </h2>

                                        <div className="prose prose-indigo max-w-none">
                                            <p className="text-gray-600 font-medium text-lg whitespace-pre-wrap leading-relaxed">
                                                {notice.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="hidden md:block">
                                        <div className="w-12 h-12 rounded-full border-2 border-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        A
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-400">Admin Office posted this update</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Info size={48} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No notices found</h3>
                        <p className="text-gray-500 font-medium">Try searching for something else or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notices;
