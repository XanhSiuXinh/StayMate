import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, MapPin, DollarSign, Home, FileText, Loader2, Image as ImageIcon, X, Save } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';

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
        latitude: '',
        longitude: '',
        photos: [] // Store actual File objects
    });
    
    // Store preview URLs for UI
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Basic validation: Check file sizes and types
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                setError('Vui lòng chỉ chọn các tệp hình ảnh.');
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError(`File ${file.name} vượt quá dung lượng cho phép (5MB).`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setError(''); // Clear error if files are valid
            
            // Generate preview URLs
            const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
            
            setFormData(prev => ({ ...prev, photos: [...prev.photos, ...validFiles] }));
            setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
    };

    const removePhoto = (index) => {
        const newPhotos = formData.photos.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(previewUrls[index]);
        
        setFormData(prev => ({ ...prev, photos: newPhotos }));
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Frontend Validations
        if (formData.photos.length === 0) {
            setError('Vui lòng tải lên ít nhất 1 hình ảnh của phòng.');
            return;
        }
        if (parseFloat(formData.price) <= 0) {
            setError('Giá thuê phải lớn hơn 0.');
            return;
        }
        if (parseFloat(formData.areaSqm) <= 0) {
            setError('Diện tích phòng phải lớn hơn 0.');
            return;
        }

        setLoading(true);
        setError('');

        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('address', formData.address);
        submitData.append('district', formData.district);
        submitData.append('city', formData.city);
        submitData.append('areaSqm', formData.areaSqm);
        if (formData.latitude) submitData.append('latitude', formData.latitude);
        if (formData.longitude) submitData.append('longitude', formData.longitude);
        
        // Append all selected files
        formData.photos.forEach(file => {
            submitData.append('photos', file);
        });

        try {
            const response = await fetch('http://localhost:5015/api/rooms', {
                method: 'POST',
                headers: {
                    // Do NOT set Content-Type header when using FormData
                    // The browser will automatically set it to multipart/form-data with the correct boundary
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
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
                            <Input
                                label="Room Title"
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Spacious Master Bedroom in District 1"
                                icon={FileText}
                            />
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
                                <Input
                                    label="Monthly Rent (VND)"
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g. 5000000"
                                    icon={DollarSign}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Room Area (m²)"
                                    type="number"
                                    name="areaSqm"
                                    min="0"
                                    step="0.1"
                                    value={formData.areaSqm}
                                    onChange={handleChange}
                                    placeholder="e.g. 25.5"
                                    icon={Home}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Location</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="City"
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Ho Chi Minh City"
                                />
                            </div>
                            <div>
                                <Input
                                    label="District"
                                    type="text"
                                    name="district"
                                    required
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder="e.g. District 7"
                                />
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Full Address"
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="e.g. 123 Nguyen Van Linh St."
                                icon={MapPin}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Latitude"
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    placeholder="e.g. 10.7626"
                                />
                            </div>
                            <div>
                                <Input
                                    label="Longitude"
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    placeholder="e.g. 106.6601"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Tip: You can get coordinates from Google Maps by right-clicking a location.</p>
                    </div>

                    {/* Photos */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 pt-4">Photos</h2>

                        <div className="space-y-4">
                            {/* File Upload Input */}
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                                    </div>
                                    <input 
                                        id="dropzone-file" 
                                        type="file" 
                                        className="hidden" 
                                        multiple 
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleFileChange} 
                                    />
                                </label>
                            </div>

                            {/* Image Previews */}
                            {previewUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                            <img 
                                                src={url} 
                                                alt={`Preview ${index}`} 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                                    title="Remove picture"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                        <Button
                            type="submit"
                            isLoading={loading}
                            icon={Save}
                            fullWidth
                            size="lg"
                        >
                            Post Room
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostRoom;
