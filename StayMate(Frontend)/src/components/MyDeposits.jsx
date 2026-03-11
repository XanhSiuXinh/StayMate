import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, DollarSign, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyDeposits = () => {
    const { token, user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch('http://localhost:5015/api/payments/my-transactions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setTransactions(await res.json());
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReleasePayment = async (id) => {
        if (!window.confirm("Bạn có chắc chắn đã nhận phòng và muốn giải ngân số tiền này cho chủ nhà không?")) return;
        
        setActionLoading(id);
        try {
            const res = await fetch(`http://localhost:5015/api/payments/${id}/release`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                alert("Giải ngân thành công! Tiền đã được chuyển cho chủ phòng.");
                fetchTransactions(); // Refresh
            } else {
                const data = await res.json();
                alert(`Lỗi: ${data.message || 'Không thể giải ngân'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối.");
        } finally {
            setActionLoading(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Processing':
                return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-semibold uppercase tracking-wider"><Clock size={12}/> Đang xử lý</span>;
            case 'Held':
                return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider"><ShieldCheck size={12}/> Đang Giữ (Escrow)</span>;
            case 'Released':
                return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold uppercase tracking-wider"><CheckCircle size={12}/> Đã Giải Ngân</span>;
            case 'Failed':
                return <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider">Thất bại</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold uppercase">Unknown</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quản lý giao dịch</h1>
                        <p className="text-gray-500 dark:text-gray-400">Xem và quản lý các giao dịch đặt cọc giữ chỗ của bạn</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="grid gap-0 divide-y divide-gray-100 dark:divide-gray-700">
                        {transactions.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg mb-2">Bạn chưa có giao dịch nào</p>
                                <Link to="/" className="text-primary hover:underline">Về trang chủ khám phá phòng</Link>
                            </div>
                        ) : (
                            transactions.map((t) => (
                                <div key={t.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(t.status)}
                                            <span className="text-sm text-gray-400">{new Date(t.createdAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {t.roomTitle}
                                        </h3>
                                        
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                                            {user.role === 'Student' ? (
                                                <span>Chủ phòng: <strong className="text-gray-900 dark:text-white">{t.landlordName}</strong></span>
                                            ) : (
                                                <span>Người đặt cọc: <strong className="text-gray-900 dark:text-white">{t.tenantName}</strong></span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-4 min-w-[200px]">
                                        <div className="text-2xl font-black text-primary dark:text-blue-400">
                                            {formatCurrency(t.amount)}
                                        </div>

                                        {user.role === 'Student' && t.status === 'Held' && (
                                            <button 
                                                onClick={() => handleReleasePayment(t.id)}
                                                disabled={actionLoading === t.id}
                                                className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all disabled:opacity-50"
                                            >
                                                {actionLoading === t.id ? <Loader2 size={18} className="animate-spin"/> : <ShieldCheck size={18}/>}
                                                Xác nhận nhận phòng
                                            </button>
                                        )}
                                        {user.role === 'Student' && t.status === 'Held' &&(
                                            <p className="text-xs text-gray-400 text-right">
                                                *Chỉ bấm khi bạn đã dọn vào ở và hài lòng với phòng.
                                            </p>
                                        )}
                                        
                                        {t.roomId && (
                                            <Link 
                                                to={`/rooms/${t.roomId}`}
                                                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                            >
                                                Xem lại phòng <ArrowRight size={14} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyDeposits;
