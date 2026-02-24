import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Save, Moon, Sun, Wind, VolumeX, Coffee, Home, Clock, Cat } from 'lucide-react';

const Preferences = () => {
    const { token } = useAuth();

    // States for Lifestyle
    const [lifestyle, setLifestyle] = useState({
        wakeUpTime: '',
        sleepTime: '',
        cleanlinessLevel: 3,
        noiseLevel: 3,
        smokingStatus: 'Không hút thuốc',
        drinkingStatus: 'Thỉnh thoảng',
        hasPets: false,
        petType: '',
        workFromHome: false,
        guestFrequency: 'Thỉnh thoảng',
        cookingFrequency: 'Thường xuyên'
    });
    // States for Interests
    const [allInterests, setAllInterests] = useState([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState([]);

    // Global states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch All Interests (Metadata)
            const interestsRes = await fetch('http://localhost:5015/api/preferences/interests');
            if (!interestsRes.ok) throw new Error('Không thể tải danh sách sở thích');
            const interestsData = await interestsRes.json();
            setAllInterests(interestsData);

            // Fetch User Interests
            const userInterestsRes = await fetch('http://localhost:5015/api/preferences/user-interests', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (userInterestsRes.ok) {
                const userInterestsData = await userInterestsRes.json();
                setSelectedInterestIds(userInterestsData.map(i => i.interestId));
            }

            // Fetch Lifestyle Preferences
            const lifestyleRes = await fetch('http://localhost:5015/api/preferences/lifestyle', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (lifestyleRes.ok) {
                const lifestyleData = await lifestyleRes.json();
                setLifestyle({
                    wakeUpTime: lifestyleData.wakeUpTime || '',
                    sleepTime: lifestyleData.sleepTime || '',
                    cleanlinessLevel: lifestyleData.cleanlinessLevel || 3,
                    noiseLevel: lifestyleData.noiseLevel || 3,
                    smokingStatus: lifestyleData.smokingStatus || 'Không hút thuốc',
                    drinkingStatus: lifestyleData.drinkingStatus || 'Thỉnh thoảng',
                    hasPets: lifestyleData.hasPets || false,
                    petType: lifestyleData.petType || '',
                    workFromHome: lifestyleData.workFromHome || false,
                    guestFrequency: lifestyleData.guestFrequency || 'Thỉnh thoảng',
                    cookingFrequency: lifestyleData.cookingFrequency || 'Thường xuyên'
                });
            } else if (lifestyleRes.status !== 404) {
                throw new Error('Không thể tải thông tin lối sống');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLifestyleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLifestyle(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleInterest = (interestId) => {
        setSelectedInterestIds(prev =>
            prev.includes(interestId)
                ? prev.filter(id => id !== interestId)
                : [...prev, interestId]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccessMessage('');
        try {
            const p1 = fetch('http://localhost:5015/api/preferences/lifestyle', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(lifestyle)
            });

            const p2 = fetch('http://localhost:5015/api/preferences/user-interests', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ interestIds: selectedInterestIds })
            });

            const [res1, res2] = await Promise.all([p1, p2]);

            if (!res1.ok || !res2.ok) throw new Error('Lỗi khi lưu thông tin');

            setSuccessMessage('Đã lưu thành công!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 font-medium">
                    {successMessage}
                </div>
            )}

            {/* Lifestyle Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Home className="text-primary" /> Thói Quen & Lối Sống
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Sun size={14} /> Giờ thức dậy (Khoảng)</label>
                        <select name="wakeUpTime" value={lifestyle.wakeUpTime} onChange={handleLifestyleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none">
                            <option value="">Chọn giờ...</option>
                            <option value="Sớm (Trước 7h sáng)">Sớm (Trước 7h sáng)</option>
                            <option value="Bình thường (7h - 9h sáng)">Bình thường (7h - 9h sáng)</option>
                            <option value="Muộn (Sau 9h sáng)">Muộn (Sau 9h sáng)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Moon size={14} /> Giờ đi ngủ (Khoảng)</label>
                        <select name="sleepTime" value={lifestyle.sleepTime} onChange={handleLifestyleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none">
                            <option value="">Chọn giờ...</option>
                            <option value="Sớm (Trước 11h đêm)">Sớm (Trước 11h đêm)</option>
                            <option value="Bình thường (11h - 1h đêm)">Bình thường (11h - 1h đêm)</option>
                            <option value="Cú đêm (Sau 1h sáng)">Cú đêm (Sau 1h sáng)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Wind size={14} /> Mức độ sạch sẽ (1-5)</label>
                        <input type="range" min="1" max="5" name="cleanlinessLevel" value={lifestyle.cleanlinessLevel} onChange={handleLifestyleChange} className="w-full mt-2" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Bừa bộn</span><span>Cực kỳ sạch sẽ</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><VolumeX size={14} /> Độ ồn ào (1-5)</label>
                        <input type="range" min="1" max="5" name="noiseLevel" value={lifestyle.noiseLevel} onChange={handleLifestyleChange} className="w-full mt-2" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Yên tĩnht</span><span>Sôi động/Ồn ào</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ nấu ăn</label>
                        <select name="cookingFrequency" value={lifestyle.cookingFrequency} onChange={handleLifestyleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none">
                            <option value="Không bao giờ">Không bao giờ</option>
                            <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                            <option value="Thường xuyên">Thường xuyên (Mỗi ngày)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dẫn bạn bè về</label>
                        <select name="guestFrequency" value={lifestyle.guestFrequency} onChange={handleLifestyleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none">
                            <option value="Không bao giờ">Không bao giờ</option>
                            <option value="Hạn chế">Hạn chế</option>
                            <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                            <option value="Thường xuyên">Thường xuyên</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hút thuốc</label>
                        <select name="smokingStatus" value={lifestyle.smokingStatus} onChange={handleLifestyleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none">
                            <option value="Không hút thuốc">Không hút thuốc</option>
                            <option value="Có hút thuốc ngoài ban công">Có hút thuốc ngoài ban công</option>
                            <option value="Hút thuốc trong phòng">Hút thuốc trong phòng</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Uống rượu/bia</label>
                        <select name="drinkingStatus" value={lifestyle.drinkingStatus} onChange={handleLifestyleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none">
                            <option value="Không bao giờ">Không bao giờ</option>
                            <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                            <option value="Thường xuyên">Thường xuyên</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="workFromHome" name="workFromHome" checked={lifestyle.workFromHome} onChange={handleLifestyleChange} className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary" />
                        <label htmlFor="workFromHome" className="text-sm font-medium text-gray-700">Làm việc / Học ở nhà thường xuyên (WFH)</label>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="hasPets" name="hasPets" checked={lifestyle.hasPets} onChange={handleLifestyleChange} className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary" />
                            <label htmlFor="hasPets" className="text-sm font-medium text-gray-700 flex items-center gap-1"><Cat size={16} /> Có nuôi thú cưng</label>
                        </div>
                        {lifestyle.hasPets && (
                            <input
                                type="text"
                                name="petType"
                                placeholder="Loại thú cưng (Chó, Mèo...)"
                                value={lifestyle.petType}
                                onChange={handleLifestyleChange}
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Interests Section */}
            <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Coffee className="text-primary" /> Sở Thích Cá Nhân
                    </h2>
                </div>

                {allInterests.length === 0 ? (
                    <p className="text-gray-500 text-sm">Chưa có dữ liệu sở thích từ hệ thống.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {allInterests.map(interest => {
                            const isSelected = selectedInterestIds.includes(interest.interestId);
                            return (
                                <button
                                    key={interest.interestId}
                                    onClick={() => toggleInterest(interest.interestId)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                        ? 'bg-blue-100 border-2 border-primary text-primary shadow-sm'
                                        : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {interest.iconUrl} {interest.interestName}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Lưu Thay Đổi
                </button>
            </div>

        </div>
    );
};

export default Preferences;
