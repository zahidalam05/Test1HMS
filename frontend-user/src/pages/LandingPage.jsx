import { Link } from 'react-router-dom';
import { ArrowRight, Home, Shield, CreditCard, MessageSquare } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import heroImage from '../assets/ii.jpeg';
import aiImage from '../assets/hostel_ai_hero.png';

const LandingPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 fixed w-full z-50 top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
                                <Home size={18} />
                            </div>
                            <span className="text-xl font-bold text-gray-900">MIT HMS</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <Link to="/dashboard" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                        Sign in
                                    </Link>
                                    <Link to="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors">
                                        Create Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                        {/* Text Content */}
                        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:leading-tight">
                                <span className="block">Hostel Management</span>
                                <span className="block text-indigo-600">Made Simple</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                A complete solution for students to manage their hostel life. Apply for rooms, pay fees, check mess menus, and raise complaints all in one place.
                            </p>
                            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to={user ? "/dashboard" : "/register"}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {user ? "Go to Dashboard" : "Get Started"}
                                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                                </Link>
                                {!user && (
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Log in
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                                <img
                                    className="w-full rounded-lg object-cover"
                                    src={heroImage}
                                    alt="Hostel Management"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section (Clickable Cards) */}
                <div className="bg-white py-16 sm:py-24 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Everything you need
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                                Manage your entire campus accommodation experience through our intuitive student portal.
                            </p>
                        </div>

                        <div className="mt-16">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { icon: <Home className="h-6 w-6 text-white" />, title: "Room Allocation", desc: "Apply for your preferred hostel and room easily. Track your application status in real-time." },
                                    { icon: <CreditCard className="h-6 w-6 text-white" />, title: "Fee Payments", desc: "Securely pay your hostel and mess fees online. View past transactions and download receipts." },
                                    { icon: <MessageSquare className="h-6 w-6 text-white" />, title: "Complaints System", desc: "Raise maintenance or administrative complaints directly to the warden and track resolution." }
                                ].map((feature, i) => (
                                    <Link key={i} to={user ? "/dashboard" : "/login"} className="pt-6 block group">
                                        <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full border border-gray-100 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-indigo-200 group-hover:-translate-y-1">
                                            <div className="-mt-6">
                                                <div>
                                                    <span className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-md shadow-lg group-hover:bg-indigo-700 transition-colors">
                                                        {feature.icon}
                                                    </span>
                                                </div>
                                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                                                <p className="mt-5 text-base text-gray-500">
                                                    {feature.desc}
                                                </p>
                                                <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Explore <ArrowRight size={16} className="ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Feature Section */}
                <div className="bg-indigo-50 py-16 border-t border-indigo-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                                    Smart AI Assistance
                                </h2>
                                <p className="mt-4 text-lg text-gray-500">
                                    Experience the future of campus living. Our platform integrates smart AI to help you navigate through your hostel life effortlessly, answering your queries in real-time.
                                </p>
                                <div className="mt-6">
                                    <Link to={user ? "/dashboard" : "/register"} className="text-base font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                                        Discover more features <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-10 lg:mt-0">
                                <img className="rounded-xl shadow-xl w-full object-cover border border-indigo-100" src={aiImage} alt="AI Assistant" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-white">
                                    <Home size={14} />
                                </div>
                                <span className="text-lg font-bold text-white">MIT HMS</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-400 max-w-xs">
                                A comprehensive portal for MIT students to manage their hostel and mess activities efficiently.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Quick Links</h3>
                            <ul className="mt-4 space-y-3">
                                <li><Link to="/login" className="text-base text-gray-400 hover:text-white">Student Login</Link></li>
                                <li><Link to="/register" className="text-base text-gray-400 hover:text-white">New Registration</Link></li>
                                <li><Link to="/notices" className="text-base text-gray-400 hover:text-white">Campus Notices</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                            <ul className="mt-4 space-y-3">
                                <li><Link to="#" className="text-base text-gray-400 hover:text-white">Contact Warden</Link></li>
                                <li><Link to="#" className="text-base text-gray-400 hover:text-white">Rules & Regulations</Link></li>
                                <li><Link to="#" className="text-base text-gray-400 hover:text-white">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-8 flex items-center justify-between">
                        <p className="text-base text-gray-400">
                            &copy; {new Date().getFullYear()} MIT Hostel Management. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
