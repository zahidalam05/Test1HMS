import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">
                    {/* Brand */}
                    <div className="space-y-4 flex flex-col items-center md:items-start">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                            MIT HMS
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
                            Making hostel life simpler, smarter, and more comfortable for every student.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-gray-500 font-bold">
                            <li><Link to="/" className="hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                            <li><Link to="/hostel" className="hover:text-indigo-600 transition-colors">Apply for Room</Link></li>
                            <li><Link to="/complaints" className="hover:text-indigo-600 transition-colors">Complaints</Link></li>
                            <li><Link to="/notices" className="hover:text-indigo-600 transition-colors">Notices</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-500 font-bold">
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Mail size={16} /></div>
                                <span>support@mit.edu</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Phone size={16} /></div>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><MapPin size={16} /></div>
                                <span>Campus Block A, Tech City</span>
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/zahidalam027/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://instagram.com/zahidalam862" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm border border-pink-100">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© 2026 HostelOne Management System. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
