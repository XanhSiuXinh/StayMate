import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Crown, Sparkles, Eye, Infinity, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';

const PremiumSubscription = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await api.post('/payments/buy-premium', {
                amount: 50000 // 50,000 VND per month
            });

            if (response.data && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl; // Redirect to VNPay
            } else {
                setError('Không thể tạo giao dịch. Vui lòng thử lại sau.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra khi xử lý thanh toán.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6 shadow-xl shadow-yellow-500/30">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 sm:text-5xl">
                        StayMate Premium
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                        Nâng tầm trải nghiệm tìm kiếm bạn cùng phòng của bạn. Nhanh hơn, hiệu quả hơn.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="relative max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                    
                    {/* Glowing Accent */}
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>

                    <div className="p-8 sm:p-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white" id="tier-premium">
                                Gói Sinh Viên
                            </h3>
                            <span className="inline-flex flex-shrink-0 items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400">
                                Phổ biến nhất
                            </span>
                        </div>
                        
                        <div className="mt-4 flex items-baseline text-5xl font-extrabold text-gray-900 dark:text-white">
                            50.000đ
                            <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">/tháng</span>
                        </div>
                        
                        <p className="mt-6 text-base text-gray-500 dark:text-gray-400">
                            Mở khóa tất cả các tính năng giới hạn để tìm được người bạn cùng phòng lý tưởng nhanh nhất.
                        </p>

                        <ul role="list" className="mt-8 space-y-4">
                            <li className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Eye className="h-6 w-6 text-yellow-500" />
                                </div>
                                <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                                    <strong className="font-semibold text-gray-900 dark:text-white">Xem ai đã thích bạn.</strong> Biết ngay ai đang quan tâm đến hồ sơ của bạn và chủ động kết nối.
                                </p>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Infinity className="h-6 w-6 text-blue-500" />
                                </div>
                                <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                                    <strong className="font-semibold text-gray-900 dark:text-white">Lượt quẹt vô hạn.</strong> Tìm kiếm không giới hạn số lượt mỗi ngày.
                                </p>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Zap className="h-6 w-6 text-orange-500" />
                                </div>
                                <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                                    <strong className="font-semibold text-gray-900 dark:text-white">Huy hiệu VIP.</strong> Nổi bật hơn trong danh sách tìm kiếm, tăng 300% tỷ lệ ghép đôi.
                                </p>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0">
                                    <ShieldCheck className="h-6 w-6 text-green-500" />
                                </div>
                                <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                                    <strong className="font-semibold text-gray-900 dark:text-white">Hỗ trợ ưu tiên.</strong> Giải quyết khiếu nại và các vấn đề nhanh chóng.
                                </p>
                            </li>
                        </ul>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800/50">
                                {error}
                            </div>
                        )}

                        <div className="mt-10">
                            <button
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Đang tạo thanh toán...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        Nâng Cấp Ngay
                                    </>
                                )}
                            </button>
                            <p className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                                Thanh toán an toàn qua <strong>VNPay</strong>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PremiumSubscription;
