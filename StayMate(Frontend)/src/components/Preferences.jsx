import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Save, Moon, Sun, Wind, VolumeX, Coffee, Home, Clock, Cat, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

const Preferences = () => {
    const { token } = useAuth();

    const [lifestyle, setLifestyle] = useState({
        wakeUpTime: '',
        sleepTime: '',
        cleanlinessLevel: 3,
        noiseLevel: 3,
        smokingStatus: 'Non-smoking',
        drinkingStatus: 'Occasionally',
        hasPets: false,
        petType: '',
        workFromHome: false,
        guestFrequency: 'Occasionally',
        cookingFrequency: 'Regularly'
    });
    // States for Interests
    const [allInterests, setAllInterests] = useState([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState([]);

    // States for Photos
    const [userPhotos, setUserPhotos] = useState([]);
    const fileInputRef = useRef(null);

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
            if (!interestsRes.ok) throw new Error('Failed to load interests list');
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

            // Fetch User Photos
            const photosRes = await fetch('http://localhost:5015/api/users/photos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (photosRes.ok) {
                const photosData = await photosRes.json();
                setUserPhotos(photosData);
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
                    smokingStatus: lifestyleData.smokingStatus || 'Non-smoking',
                    drinkingStatus: lifestyleData.drinkingStatus || 'Occasionally',
                    hasPets: lifestyleData.hasPets || false,
                    petType: lifestyleData.petType || '',
                    workFromHome: lifestyleData.workFromHome || false,
                    guestFrequency: lifestyleData.guestFrequency || 'Occasionally',
                    cookingFrequency: lifestyleData.cookingFrequency || 'Regularly'
                });
            } else if (lifestyleRes.status !== 404) {
                throw new Error('Failed to load lifestyle information');
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

            if (!res1.ok || !res2.ok) throw new Error('Error saving information');

            setSuccessMessage('Saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddPhotoClick = () => {
        if (userPhotos.length >= 6) {
            setError('You can only add up to 6 photos.');
            setTimeout(() => setError(null), 3000);
            return;
        }
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optionally, check file type/size here

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:5015/api/users/photos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setUserPhotos([...userPhotos, data.photo]);
                setSuccessMessage('Photo added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(data.message || 'Error adding photo.');
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            setError('Connection error.');
            setTimeout(() => setError(null), 3000);
        } finally {
            // Reset input so the same file could be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (!window.confirm("Are you sure you want to delete this photo?")) return;

        try {
            const res = await fetch(`http://localhost:5015/api/users/photos/${photoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setUserPhotos(userPhotos.filter(p => p.photoId !== photoId));
                setSuccessMessage('Photo deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const data = await res.json();
                setError(data.message || 'Error deleting photo.');
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            setError('Connection error.');
            setTimeout(() => setError(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12 transition-colors">
                <Loader2 className="w-8 h-8 animate-spin text-primary dark:text-blue-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {error && (
                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 font-medium border border-transparent dark:border-red-500/20">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 font-medium border border-transparent dark:border-green-500/20">
                    {successMessage}
                </div>
            )}

            {/* Lifestyle Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Home className="text-primary dark:text-blue-400" /> Habits & Lifestyle
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Sun size={14} /> Wake up time (Approximate)</label>
                        <select name="wakeUpTime" value={lifestyle.wakeUpTime} onChange={handleLifestyleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 outline-none transition-colors">
                            <option value="">Select time...</option>
                            <option value="Early (Before 7 AM)">Early (Before 7 AM)</option>
                            <option value="Normal (7 AM - 9 AM)">Normal (7 AM - 9 AM)</option>
                            <option value="Late (After 9 AM)">Late (After 9 AM)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Moon size={14} /> Sleep time (Approximate)</label>
                        <select name="sleepTime" value={lifestyle.sleepTime} onChange={handleLifestyleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 outline-none transition-colors">
                            <option value="">Select time...</option>
                            <option value="Early (Before 11 PM)">Early (Before 11 PM)</option>
                            <option value="Normal (11 PM - 1 AM)">Normal (11 PM - 1 AM)</option>
                            <option value="Night owl (After 1 AM)">Night owl (After 1 AM)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Wind size={14} /> Cleanliness level (1-5)</label>
                        <input type="range" min="1" max="5" name="cleanlinessLevel" value={lifestyle.cleanlinessLevel} onChange={handleLifestyleChange} className="w-full mt-2" />
                        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                            <span>Messy</span><span>Extremely clean</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><VolumeX size={14} /> Noise level (1-5)</label>
                        <input type="range" min="1" max="5" name="noiseLevel" value={lifestyle.noiseLevel} onChange={handleLifestyleChange} className="w-full mt-2" />
                        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                            <span>Quiet</span><span>Lively/Noisy</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cooking frequency</label>
                        <select name="cookingFrequency" value={lifestyle.cookingFrequency} onChange={handleLifestyleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 outline-none transition-colors">
                            <option value="Never">Never</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Regularly">Regularly (Every day)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bringing guests</label>
                        <select name="guestFrequency" value={lifestyle.guestFrequency} onChange={handleLifestyleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 outline-none transition-colors">
                            <option value="Never">Never</option>
                            <option value="Rarely">Rarely</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Regularly">Regularly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Smoking</label>
                        <select name="smokingStatus" value={lifestyle.smokingStatus} onChange={handleLifestyleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 outline-none transition-colors">
                            <option value="Non-smoking">Non-smoking</option>
                            <option value="Smoke outside/balcony">Smoke outside/balcony</option>
                            <option value="Smoke in room">Smoke in room</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Drinking</label>
                        <select name="drinkingStatus" value={lifestyle.drinkingStatus} onChange={handleLifestyleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 outline-none transition-colors">
                            <option value="Never">Never</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Regularly">Regularly</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="workFromHome" name="workFromHome" checked={lifestyle.workFromHome} onChange={handleLifestyleChange} className="w-5 h-5 rounded text-primary border-gray-300 dark:border-gray-600 focus:ring-primary dark:bg-gray-800" />
                        <label htmlFor="workFromHome" className="text-sm font-medium text-gray-700 dark:text-gray-300">Work/Study from home frequently (WFH)</label>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 items-center bg-gray-50 dark:bg-gray-700/20 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="hasPets" name="hasPets" checked={lifestyle.hasPets} onChange={handleLifestyleChange} className="w-5 h-5 rounded text-primary border-gray-300 dark:border-gray-600 focus:ring-primary dark:bg-gray-800" />
                            <label htmlFor="hasPets" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><Cat size={16} /> Have pets</label>
                        </div>
                        {lifestyle.hasPets && (
                            <input
                                type="text"
                                name="petType"
                                placeholder="Pet type (Dog, Cat...)"
                                value={lifestyle.petType}
                                onChange={handleLifestyleChange}
                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 outline-none transition-colors"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Interests Section */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Coffee className="text-primary dark:text-blue-400" /> Personal Interests
                    </h2>
                </div>

                {allInterests.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No interests found from system.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        <div className="hidden">
                            {allInterests.map(interest => (
                                <span key={interest.interestId}>{interest.interestName}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Photos Section */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="text-primary dark:text-blue-400" /> Photos
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add photos to help others envision you (up to 6 photos).</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {userPhotos.map((photo) => (
                        <div key={photo.photoId} className="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img src={photo.photoUrl} alt="User" className="w-full h-full object-cover" />
                            <button
                                onClick={() => handleDeletePhoto(photo.photoId)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {userPhotos.length < 6 && (
                        <button
                            onClick={handleAddPhotoClick}
                            className="aspect-square bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 hover:border-primary dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all"
                        >
                            <Plus size={24} className="mb-2" />
                            <span className="text-sm font-medium">Add Photo</span>
                        </button>
                    )}
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

        </div>
    );
};

export default Preferences;
