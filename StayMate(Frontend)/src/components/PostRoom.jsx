import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, MapPin, DollarSign, Home, FileText, Loader2, Image as ImageIcon, X } from 'lucide-react';

const PostRoom = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        address: '',
        district: '',
        city: '',
        areaSqm: '',
        photoUrls: [''] // Start with one empty string for input
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (index, value) => {
        const newPhotos = [...formData.photoUrls];
        newPhotos[index] = value;
        setFormData(prev => ({ ...prev, photoUrls: newPhotos }));
    };

    const addPhotoField = () => {
        setFormData(prev => ({ ...prev, photoUrls: [...prev.photoUrls, ''] }));
    };

    const removePhotoField = (index) => {
        const newPhotos = formData.photoUrls.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, photoUrls: newPhotos }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        const payload = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            address: formData.address,
            district: formData.district,
            city: formData.city,
            areaSqm: parseFloat(formData.areaSqm),
            photoUrls: formData.photoUrls.filter(url => url.trim() !== '')
        };

        try {
            const response = await fetch('http://localhost:5015/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/'); // Redirect to Home/RoomList
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to post room');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Post a Room</h1>
                    <p className="text-gray-500">Share your available space with the community.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-100">
                        <X size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Title</label>
                            <div className="relative">
                                <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Spacious Master Bedroom in District 1"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the room, amenities, and house rules..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (VND)</label>
                                <div className="relative">
                                    <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="e.g. 5000000"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Area (m²)</label>
                                <div className="relative">
                                    <Home size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="number"
                                        name="areaSqm"
                                        min="0"
                                        step="0.1"
                                        value={formData.areaSqm}
                                        onChange={handleChange}
                                        placeholder="e.g. 25.5"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Location</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Ho Chi Minh City"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                <input
                                    type="text"
                                    name="district"
                                    required
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder="e.g. District 7"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="e.g. 123 Nguyen Van Linh St."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Photos */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Photos</h2>

                        <div className="space-y-3">
                            {formData.photoUrls.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => handlePhotoChange(index, e.target.value)}
                                            placeholder="Paste image URL here..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    {formData.photoUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePhotoField(index)}
                                            className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPhotoField}
                                className="flex items-center gap-2 text-primary font-medium text-sm hover:underline"
                            >
                                <Upload size={16} /> Add Another Photo URL
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Post Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostRoom;
