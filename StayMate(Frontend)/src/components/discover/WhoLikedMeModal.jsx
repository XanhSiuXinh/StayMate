import { X, Crown, Heart, Sparkles, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const WhoLikedMeModal = ({ show, onClose, data, loading }) => {
    const navigate = useNavigate();

    if (!show) return null;

    const { isPremium, count, users } = data || { isPremium: false, count: 0, users: [] };

    return (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-pink-100 dark:bg-pink-500/20 p-2.5 rounded-2xl">
                            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ai Đã Thích Tôi</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {count} người đang chờ bạn phản hồi
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 relative">
                    {loading ? (
                        <div className="min-h-[300px] flex items-center justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : users?.length === 0 ? (
                        <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chưa có lượt thích nào</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Hãy tiếp tục quẹt và hoàn thiện hồ sơ của bạn để nhận được nhiều sự chú ý hơn nhé!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {users.map((user, idx) => (
                                <div key={idx} className="relative group overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-[3/4]">
                                    <img 
                                        src={user.image} 
                                        alt={user.name} 
                                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!isPremium ? 'blur-md opacity-80' : ''}`}
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                                        <h3 className={`font-bold text-white text-lg drop-shadow-md ${!isPremium ? 'blur-[4px]' : ''}`}>
                                            {user.name}, {user.age}
                                        </h3>
                                        <p className={`text-white/80 text-sm line-clamp-1 ${!isPremium ? 'blur-[4px]' : ''}`}>
                                            {user.university}
                                        </p>
                                    </div>

                                    {!isPremium && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
                                            <div className="bg-yellow-500/90 p-3 rounded-full mb-3 backdrop-blur-md">
                                                <Crown className="text-white w-6 h-6" />
                                            </div>
                                            <p className="text-white font-bold text-sm mb-1 drop-shadow-md">Nâng cấp để xem</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Paywall */}
                {!isPremium && !loading && (
                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-t border-yellow-200 dark:border-yellow-900/50">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                            <div>
                                <h3 className="font-bold text-yellow-800 dark:text-yellow-500 flex items-center justify-center md:justify-start gap-2">
                                    <Crown className="w-5 h-5" /> Gói Premium
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-600/80 mt-1 max-w-sm">
                                    Mở khóa danh sách những người đã thích bạn và kết nối ngay lập tức không cần chờ đợi.
                                </p>
                            </div>
                            <Button 
                                onClick={() => navigate('/premium')}
                                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none shadow-lg shadow-yellow-500/30 whitespace-nowrap"
                            >
                                <Sparkles className="w-4 h-4 mr-2" /> Nâng Cấp Ngay
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhoLikedMeModal;
