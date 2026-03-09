import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, User, Home, Maximize, ArrowLeft, Loader2, Phone, Mail, Share2, Heart, Star, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RoomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchRoomDetail();
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:5015/api/reviews/room/${id}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setSubmittingReview(true);
        try {
            const response = await fetch('http://localhost:5015/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    targetRoomId: parseInt(id),
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            if (response.ok) {
                setNewReview({ rating: 5, comment: '' });
                fetchReviews();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmittingReview(false);
        }
    };

    const fetchRoomDetail = async () => {
        try {
            const response = await fetch(`http://localhost:5015/api/rooms/${id}`);
            if (!response.ok) throw new Error('Room not found');
            const data = await response.json();
            setRoom(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
                <Loader2 className="w-12 h-12 text-primary dark:text-blue-400 animate-spin" />
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Room Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">The room you are looking for might have been removed or is unavailable.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors font-medium flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back to Rooms
                </button>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors">
            {/* Header / Nav */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                            <Share2 size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Images & Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm relative group">
                            <img
                                src={room.photoUrls?.[activeImage] || "https://images.unsplash.com/photo-1522771753062-5883628f4275?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                                alt={room.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-gray-900 dark:text-white shadow-sm">
                                {formatPrice(room.price)}/mo
                            </div>
                        </div>

                        {room.photoUrls && room.photoUrls.length > 1 && (
                            <div className="grid grid-cols-5 gap-2 md:gap-4 overflow-x-auto pb-2">
                                {room.photoUrls.map((url, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20 dark:border-blue-400 dark:ring-blue-400/20' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                                    >
                                        <img src={url} alt={`Room view ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Room Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.title}</h1>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm md:text-base">
                                    <MapPin size={18} className="text-primary dark:text-blue-400" />
                                    <span>{room.address}, {room.district}, {room.city}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-medium self-start border border-transparent dark:border-green-500/20">
                                <Home size={18} />
                                <span>Available Now</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Room Area</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{room.areaSqm || '--'}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">m²</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Price</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{room.price ? (room.price / 1000000).toFixed(1) : '--'}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">M/mo</span>
                                </div>
                            </div>
                            {/* Add more stats if available */}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Room</h2>
                            <div className="prose text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                {room.description || "No description provided."}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('reviews.title')}</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} size={18} fill={star <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                                            ({t('reviews.basedOn', { count: reviews.length })})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Form */}
                            {user && (
                                <form onSubmit={handleReviewSubmit} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-12 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('reviews.writeReview')}</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('reviews.ratingLabel')}:</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    className={`transition-colors ${star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                                                >
                                                    <Star size={24} fill={star <= newReview.rating ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        placeholder={t('reviews.commentPlaceholder')}
                                        className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all mb-4 text-gray-700 dark:text-gray-200"
                                        rows="3"
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all disabled:opacity-50"
                                    >
                                        {submittingReview ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        {t('reviews.submit')}
                                    </button>
                                </form>
                            )}

                            {/* Review List */}
                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8 italic">{t('reviews.noReviews')}</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.reviewId} className="flex gap-4 group">
                                            <img
                                                src={review.reviewerAvatar || `https://ui-avatars.com/api/?name=${review.reviewerName}&background=random`}
                                                alt={review.reviewerName}
                                                className="w-12 h-12 rounded-full object-cover shrink-0"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                                                        {review.reviewerName}
                                                        {review.reviewerId === room.hostUserId && (
                                                            <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-black">Host</span>
                                                        )}
                                                    </h4>
                                                    <span className="text-xs text-gray-400 capitalize">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex text-yellow-500 mb-2 scale-75 origin-left">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} size={16} fill={star <= review.rating ? "currentColor" : "none"} />
                                                    ))}
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Host & Actions */}
                <div className="space-y-6">
                    {/* Host Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 transition-colors">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Meet the Host</h3>

                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={room.hostAvatar || `https://ui-avatars.com/api/?name=${room.hostName || 'Host'}&background=random`}
                                alt={room.hostName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
                            />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{room.hostName || 'Unknown Host'}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Joined recently</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full py-3 px-4 bg-primary dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-100 dark:shadow-none flex items-center justify-center gap-2">
                                <Phone size={18} /> Call Host
                            </button>
                            <button className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                                <Mail size={18} /> Message Host
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                Safety Tip: Always meet in person before transferring money.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default RoomDetail;
