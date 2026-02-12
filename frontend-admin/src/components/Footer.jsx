import { Github, Linkedin, Shield, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Left: Brand & Copyright */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Shield size={20} />
                        </div>
                        <div>
                            <span className="font-bold text-gray-900">HostelOne Admin</span>
                            <p className="text-xs text-gray-500">© 2026 Management Console</p>
                        </div>
                    </div>

                    {/* Middle: Status */}
                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        System Operational
                    </div>

                    {/* Right: Links */}
                    <div className="flex gap-4 text-gray-400">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors"><Github size={18} /></a>
                        <a href="https://www.linkedin.com/in/zahidalam027/" target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors"><Linkedin size={18} /></a>
                        <a href="https://instagram.com/zahidalam862" target="_blank" rel="noreferrer" className="hover:text-pink-600 transition-colors"><Instagram size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
