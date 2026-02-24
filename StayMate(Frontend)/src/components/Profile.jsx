import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Briefcase, GraduationCap, Phone, Edit2, Save, X, Loader2, Award, Home, Activity } from 'lucide-react';
import Preferences from './Preferences';

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
                setError(data.message || 'Tải hồ sơ thất bại');
            }
        } catch (err) {
            setError('Lỗi kết nối đến máy chủ');
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
                setSuccess('Cập nhật hồ sơ thành công!');
                setIsEditing(false);
                updateUser({ fullName: formData.fullName, avatarUrl: formData.avatarUrl });
            } else {
                setError(data.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            setError('Lỗi cập nhật hồ sơ');
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
        const newUrl = window.prompt('Nhập đường dẫn hình ảnh của bạn (URL):', formData.avatarUrl || profile.avatarUrl || '');
        if (newUrl !== null) {
            setFormData(prev => ({ ...prev, avatarUrl: newUrl }));
            // Preview instantly
            setProfile(prev => ({ ...prev, avatarUrl: newUrl }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: User Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="relative w-40 h-40 mb-6 group">
                            <img
                                src={profile?.avatarUrl || `https://ui-avatars.com/api/?name=${profile?.fullName}&background=random&size=200`}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md transition-transform group-hover:scale-105"
                            />
                            {isEditing && (
                                <div
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <span className="text-white text-sm font-medium">Đổi Ảnh</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">{profile?.fullName}</h2>

                        {profile?.isVerified && (
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-emerald-100">
                                <Award size={14} /> Sinh viên đã xác thực
                            </div>
                        )}

                        <div className="w-full space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm truncate">{profile?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm">{profile?.phoneNumber || "Thêm số điện thoại"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <User size={16} />
                                </div>
                                <span className="text-sm">{profile?.gender || "Thêm giới tính"}</span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="mt-8 w-full py-2.5 px-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors text-sm font-medium border border-gray-200"
                        >
                            Đăng Xuất
                        </button>
                    </div>

                    {/* Quick Stats (Placeholder for future features) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Chỉ Số Uy Tín</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <span className="block text-xl font-bold text-gray-900">12</span>
                                <span className="text-xs text-gray-500">Kết nối</span>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <span className="block text-xl font-bold text-gray-900">4.8</span>
                                <span className="text-xs text-gray-500">Đánh giá</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile Content */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'about' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <User size={18} /> Giới Thiệu
                            </button>
                            <button
                                onClick={() => setActiveTab('lifestyle')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'lifestyle' ? 'text-primary border-b-2 border-primary bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Activity size={18} /> Hồ Sơ Ghép Đôi
                            </button>
                        </div>

                        <div className="p-8 flex-1">
                            {activeTab === 'about' && (
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Hồ Sơ Của Tôi
                                        </h1>
                                        <p className="text-gray-500">
                                            Quản lý không gian thông tin cá nhân của bạn.
                                        </p>
                                    </div>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium text-sm"
                                        >
                                            <Edit2 size={16} /> Chỉnh Sửa
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setIsEditing(false); setFormData(profile); setError(''); }}
                                                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handleUpdate}
                                                disabled={updating}
                                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium text-sm disabled:opacity-70"
                                            >
                                                {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                Lưu Thay Đổi
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center gap-2"><X size={16} />{error}</div>}
                            {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100 flex items-center gap-2"><Award size={16} />{success}</div>}

                            {/* ABOUT TAB CONTENT */}
                            {activeTab === 'about' && (
                                <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Họ và Tên</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all disabled:text-gray-500 disabled:bg-gray-100/50"
                                                placeholder="VD: Nguyễn Văn A"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Ngày Sinh</label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all disabled:text-gray-500 disabled:bg-gray-100/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Giới Tính</label>
                                            <select
                                                name="gender"
                                                value={formData.gender || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all disabled:text-gray-500 disabled:bg-gray-100/50"
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Không xác định">Khác</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Số Điện Thoại</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all disabled:text-gray-500 disabled:bg-gray-100/50"
                                                placeholder="+84 123 456 789"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-700">Nghề Nghiệp / Chuyên Ngành</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all disabled:text-gray-500 disabled:bg-gray-100/50"
                                                placeholder="VD: Sinh viên ngành IT, Nhân văn, Kế toán..."
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-700">Trường Học / Nơi Công Tác</label>
                                            <input
                                                type="text"
                                                name="school"
                                                value={formData.school || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all disabled:text-gray-500 disabled:bg-gray-100/50"
                                                placeholder="VD: Đại học FPT, Đại học Quốc Gia..."
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-gray-700">Về Bản Thân</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio || ''}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                rows="5"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-primary outline-none transition-all disabled:text-gray-500 disabled:bg-gray-100/50 resize-none"
                                                placeholder="Giới thiệu đôi nét về bản thân bạn. Sở thích của bạn là gì? Bạn là người như thế nào khi ở chung trọ?"
                                            />
                                            <p className="text-xs text-gray-400 text-right">Mẹo: Viết chi tiết giúp tăng cơ hội tìm được bạn phù hợp.</p>
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
