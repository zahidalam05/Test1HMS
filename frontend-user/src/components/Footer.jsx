import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            HostelOne
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Making hostel life simpler, smarter, and more comfortable for every student.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="/" className="hover:text-blue-600 transition-colors">Dashboard</a></li>
                            <li><a href="/hostel" className="hover:text-blue-600 transition-colors">Apply for Room</a></li>
                            <li><a href="/complaints" className="hover:text-blue-600 transition-colors">Complaints</a></li>
                            <li><a href="/notices" className="hover:text-blue-600 transition-colors">Notices</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-blue-500" />
                                <span>support@hostelone.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-blue-500" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-500" />
                                <span>Campus Block A, Tech City</span>
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/zahidalam027/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                <Linkedin size={18} />
                            </a>
                            <a href="https://instagram.com/zahidalam862" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                                <Facebook size={18} />
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
