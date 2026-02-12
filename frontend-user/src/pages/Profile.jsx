import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext); // Assuming setUser is available to update global context if name changes
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await API.get('/auth/profile');
            setProfile(data.profile);
            setFormData({
                name: data.name,
                email: data.email,
                rollNo: data.profile?.rollNo || '',
                branch: data.profile?.branch || '',
                year: data.profile?.year || '',
                gender: data.profile?.gender || ''
            });
        } catch (error) {
            console.error("Failed to fetch profile");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const { data } = await API.put('/auth/profile', formData);
            setProfile(data.profile);
            // specific to your auth context, you might need to update user name/email there too
            alert("Profile Updated Successfully!");
            setIsEditing(false);
        } catch (error) {
            alert("Failed to update profile: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    if (!profile) return <div>Loading Profile...</div>;

    const Field = ({ label, name, value, readOnly = false }) => (
        <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
            {isEditing && !readOnly ? (
                <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            ) : (
                <p className="text-lg text-gray-900">{value}</p>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Student Details</h3>
                </div>
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Full Name" name="name" value={isEditing ? formData.name : user.name} />
                    <Field label="Email Address" name="email" value={isEditing ? formData.email : user.email} />
                    <Field label="Roll Number" name="rollNo" value={profile.rollNo} />
                    <Field label="Branch" name="branch" value={profile.branch} />
                    <Field label="Year" name="year" value={profile.year} />
                    <Field label="Gender" name="gender" value={profile.gender} />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Hostel Allocation</h3>
                </div>
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Hostel</label>
                        <p className="mt-1 text-lg text-gray-900">{profile.hostel ? profile.hostel.name : 'Not Allocated'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Room Number</label>
                        <p className="mt-1 text-lg text-gray-900">{profile.room ? profile.room.roomNumber : 'Not Allocated'}</p>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end px-6 pb-4">
                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
