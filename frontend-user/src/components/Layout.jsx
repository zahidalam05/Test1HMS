import { useContext, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
    LayoutDashboard,
    User,
    Home,
    CreditCard,
    MessageSquare,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/hostel', label: 'Apply Room', icon: <Home size={20} /> },
        { path: '/fees', label: 'See Payments', icon: <CreditCard size={20} /> },
        { path: '/complaints', label: 'Complaints', icon: <MessageSquare size={20} /> },
        { path: '/notices', label: 'Notices', icon: <Bell size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MIT HMS</span>
                    <button className="md:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white shadow-sm z-40">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
                                <Menu size={24} />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                                {navItems.find(i => i.path === location.pathname)?.label || 'Portal'}
                            </h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <button className="relative text-gray-500 hover:text-indigo-600 transition">
                                <Bell size={22} />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-3 focus:outline-none"
                                >
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">Student</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-200">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 animate-in fade-in zoom-in duration-200">
                                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                                            <User size={16} /> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 scroll-smooth">
                    <Outlet />
                </main>
            </div>

            {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
};

export default Layout;
