import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rollNo: '',
        branch: '',
        year: '',
        gender: 'Male'
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(formData);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-10 md:p-14 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-3 text-gray-500 font-medium">Join MIT HMS to manage your hostel life.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-[20px] text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="Full Name" name="name" type="text" placeholder="Zahid Alam" onChange={handleChange} required />
                            <Input label="Email Address" name="email" type="email" placeholder="zahid@mit.edu" onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="Password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                            <div>
                                <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1 text-left uppercase tracking-wider">Gender</label>
                                <select name="gender" onChange={handleChange} className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb]">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Input label="Roll Number" name="rollNo" type="text" placeholder="21/101" onChange={handleChange} required />
                            <Input label="Branch" name="branch" type="text" placeholder="CSE" onChange={handleChange} required />
                            <Input label="Year" name="year" type="text" placeholder="3rd" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-5 bg-[#5145ff] text-white rounded-[22px] font-black text-lg shadow-[0_10px_30px_-5px_rgba(81,69,255,0.4)] hover:bg-[#4338e5] hover:shadow-[0_15px_40px_-5px_rgba(81,69,255,0.5)] transition-all transform hover:-translate-y-1 active:scale-[0.98]">
                            Complete Sign Up
                        </button>
                    </div>
                </form>

                <div className="text-center pt-2">
                    <p className="text-gray-500 font-bold">Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 underline decoration-2 underline-offset-4">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div>
        <label className="block font-bold text-[13px] text-gray-700 mb-2 px-1 text-left uppercase tracking-wider">{label}</label>
        <input
            {...props}
            className="w-full px-5 py-4 bg-[#ecedf1] border-2 border-transparent rounded-[20px] outline-none focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 text-[15px] font-semibold text-gray-800 shadow-sm hover:bg-[#e4e6eb] placeholder-gray-400"
        />
    </div>
);

export default Register;
