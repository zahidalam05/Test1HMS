import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setProfile(data.profile);
            } catch (error) {
                console.error("Failed to fetch profile");
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div>Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Student Details</h3>
                </div>
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Roll Number</label>
                        <p className="mt-1 text-lg text-gray-900">{profile.rollNo}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Branch</label>
                        <p className="mt-1 text-lg text-gray-900">{profile.branch}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Year</label>
                        <p className="mt-1 text-lg text-gray-900">{profile.year}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Gender</label>
                        <p className="mt-1 text-lg text-gray-900">{profile.gender}</p>
                    </div>
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
        </div>
    );
};

export default Profile;
