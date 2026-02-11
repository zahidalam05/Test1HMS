import { useContext, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Hotel,
    CreditCard,
    FileText,
    MessageSquare,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Search
} from 'lucide-react';

const AdminLayout = () => {
    const { admin, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/applications', label: 'Applications', icon: <FileText size={20} /> },
        { path: '/students', label: 'Students', icon: <Users size={20} /> },
        { path: '/hostels', label: 'Hostels & Rooms', icon: <Hotel size={20} /> },
        { path: '/payments', label: 'Payments', icon: <CreditCard size={20} /> },
        { path: '/complaints', label: 'Complaints', icon: <MessageSquare size={20} /> },
        { path: '/notices', label: 'Notices', icon: <Bell size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 h-20 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">M</div>
                        <span className="text-xl font-bold tracking-wide">MIT Admin</span>
                    </div>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</div>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === item.path
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <span className={`${location.pathname === item.path ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 bg-gray-900">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-72 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8 z-40">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 -ml-2 text-gray-600 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-gray-800 hidden sm:block">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar Mockup */}
                        <div className="hidden md:flex items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all w-64">
                            <Search size={18} className="text-gray-400" />
                            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400" />
                        </div>

                        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 focus:outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900">{admin?.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">Administrator</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white">
                                    {admin?.name?.charAt(0)}
                                </div>
                                <ChevronDown size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 scroll-smooth">
                    <Outlet />
                </main>
            </div>

            {sidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
};

export default AdminLayout;
