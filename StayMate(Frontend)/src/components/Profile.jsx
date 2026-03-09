import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Briefcase, GraduationCap, Phone, Edit2, Save, X, Loader2, Award, Home, Activity } from 'lucide-react';
import Preferences from './Preferences';
import Button from './ui/Button';
import Input from './ui/Input';

const Profile = () => {
    const { token, logout, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('about');
    const fileInputRef = useRef(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:5015/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
                setFormData(data);
            } else {
                setError(data.message || 'Failed to load profile');
            }
        } catch (err) {
            setError('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5015/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.user || formData);
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                updateUser({ fullName: formData.fullName, avatarUrl: formData.avatarUrl });
            } else {
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            setError('Error updating profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatarClick = () => {
        if (!isEditing) return;
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            setUploadingAvatar(true);
            const res = await fetch('http://localhost:5015/api/users/profile/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadFormData
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
                setProfile(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
                setSuccess('Avatar updated successfully!');
                setTimeout(() => setSuccess(''), 3000);

                updateUser({ fullName: formData.fullName, avatarUrl: data.avatarUrl });
            } else {
                setError(data.message || 'Error updating avatar.');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('Connection error.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                <Loader2 className="w-12 h-12 text-primary dark:text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12 transition-colors">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: User Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-colors">
                        <div className="relative w-40 h-40 mb-6 group">
                            <img
                                src={profile?.avatarUrl || `https://ui-avatars.com/api/?name=${profile?.fullName}&background=random&size=200`}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md transition-transform group-hover:scale-105"
                            />
                            {isEditing && (
                                <div
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    {uploadingAvatar ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <span className="text-white text-sm font-medium">Change Photo</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 text-center">{profile?.fullName}</h2>

                        {profile?.isVerified && (
                            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-emerald-100 dark:border-emerald-500/20">
                                <Award size={14} /> Verified Student
                            </div>
                        )}

                        <div className="w-full space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm truncate">{profile?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm">{profile?.phoneNumber || "Add phone number"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <User size={16} />
                                </div>
                                <span className="text-sm">{profile?.gender || "Add gender"}</span>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            className="mt-8 w-full border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                            onClick={logout}
                        >
                            Log Out
                        </Button>
                    </div>

                    {/* Quick Stats (Placeholder for future features) */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Trust Score</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="block text-xl font-bold text-gray-900 dark:text-white">12</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Connections</span>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="block text-xl font-bold text-gray-900 dark:text-white">4.8</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile Content */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col transition-colors">

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'about' ? 'text-primary dark:text-blue-400 border-b-2 border-primary dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                <User size={18} /> About Me
                            </button>
                            <button
                                onClick={() => setActiveTab('lifestyle')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'lifestyle' ? 'text-primary dark:text-blue-400 border-b-2 border-primary dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                <Activity size={18} /> Matching Profile
                            </button>
                        </div>

                        <div className="p-8 flex-1">
                            {activeTab === 'about' && (
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            My Profile
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Manage your personal information space.
                                        </p>
                                    </div>
                                    {!isEditing ? (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            icon={Edit2}
                                            size="sm"
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setIsEditing(false); setFormData(profile); setError(''); }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleUpdate}
                                                isLoading={updating}
                                                icon={Save}
                                                size="sm"
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-500/20 flex items-center gap-2"><X size={16} />{error}</div>}
                            {success && <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg text-sm border border-green-100 dark:border-green-500/20 flex items-center gap-2"><Award size={16} />{success}</div>}

                            {/* ABOUT TAB CONTENT */}
                            {activeTab === 'about' && (
                                <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Input
                                                label="Full Name"
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                label="Date of Birth"
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-400 outline-none transition-all disabled:text-gray-500 dark:disabled:text-gray-400 disabled:bg-gray-100/50 dark:disabled:bg-gray-800"
                                            >
                                                <option value="">Select gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                label="Phone Number"
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Input
                                                label="Occupation / Major"
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="e.g. IT Student, Humanities, Accounting..."
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Input
                                                label="School / Workplace"
                                                type="text"
                                                name="school"
                                                value={formData.school || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="e.g. FPT University, National University..."
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">About Me</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                rows="5"
                                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-400 outline-none transition-all disabled:text-gray-500 dark:disabled:text-gray-400 disabled:bg-gray-100/50 dark:disabled:bg-gray-800 resize-none"
                                                placeholder="Tell us a bit about yourself. What are your hobbies? What are you like as a roommate?"
                                            />
                                            <p className="text-xs text-gray-400 dark:text-gray-500 text-right">Tip: Writing detailed info increases your chances of finding matching roommates.</p>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* LIFESTYLE TAB CONTENT */}
                            {activeTab === 'lifestyle' && (
                                <div className="animate-in fade-in">
                                    <Preferences />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
