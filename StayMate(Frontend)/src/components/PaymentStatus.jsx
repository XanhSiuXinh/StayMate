import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, Home } from 'lucide-react';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const status = searchParams.get('status');
    const amount = searchParams.get('amount');
    const roomId = searchParams.get('roomId');

    const isSuccess = status === 'Held';

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`h-2 ${isSuccess ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`} />
                
                <div className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                        {isSuccess ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-100 dark:bg-green-500/20 rounded-full animate-ping opacity-75" />
                                <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
                            </div>
                        ) : (
                            <XCircle className="w-20 h-20 text-red-500" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {isSuccess ? 'Thanh toán đặt cọc thành công!' : 'Thanh toán thất bại'}
                    </h2>
                    
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                        {isSuccess 
                            ? 'Số tiền của bạn hiện đang được hệ thống giữ an toàn. Vui lòng kiểm tra phòng và xác nhận nhận phòng để giải ngân cho chủ nhà.'
                            : 'Có lỗi xảy ra trong quá trình thanh toán hoặc bạn đã hủy giao dịch. Vui lòng thử lại.'}
                    </p>

                    {isSuccess && amount && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-8 border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Số tiền đặt cọc</span>
                                <span className="font-bold text-gray-900 dark:text-white text-lg">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</span>
                                <span className="text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">
                                    Đang giữ tiền (Escrow)
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {isSuccess ? (
                            <Link 
                                to="/my-deposits"
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                            >
                                Quản lý tiền cọc của tôi
                            </Link>
                        ) : (
                            <button
                                onClick={() => roomId ? navigate(`/rooms/${roomId}`) : navigate(-1)}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                            >
                                <ArrowLeft size={18} />
                                Quay lại thử lại
                            </button>
                        )}
                        
                        <Link 
                            to="/"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                        >
                            <Home size={18} />
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
