import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import RoomList from './RoomList';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, openAuthModal } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-white border-b border-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-primary font-semibold text-sm mb-6 border border-blue-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                            Nền tảng Tìm kiếm Chỗ ở Sinh viên Số 1
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                            Tìm Kiếm Hoàn Hảo <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Phòng Trọ & Người Ở Ghép</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                            Kết nối với sinh viên đã được xác thực, xem ngay danh sách phòng tuyển chọn, và tìm thấy một nơi bạn thực sự thuộc về. Đơn giản, An toàn và Gắn kết.
                        </p>

                        {/* Search Bar */}
                        <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
                            <div className="flex-1 relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo thành phố, trường học, quận huyện..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 border border-transparent focus:border-primary/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <Search size={20} />
                                Tìm Kiếm
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                            <div className="text-sm text-gray-500 font-medium">Phòng Trọ Xác Thực</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">1.2k</div>
                            <div className="text-sm text-gray-500 font-medium">Sinh Viên Tin Dùng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
                            <div className="text-sm text-gray-500 font-medium">Tỷ Lệ Ghép Đôi</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
                            <div className="text-sm text-gray-500 font-medium">Hỗ Trợ Nhanh Chóng</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Phòng Trọ Nổi Bật</h2>
                        <p className="text-gray-500 text-lg">Những căn phòng trọ mới nhất vừa được cộng đồng đăng tải.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                        Xem Tất Cả <ArrowRight size={20} />
                    </button>
                </div>

                <RoomList searchTerm={searchTerm} />

                <div className="mt-12 text-center md:hidden">
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition-colors w-full">
                        Xem Tất Cả Phòng
                    </button>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 text-white py-20 px-4 mt-12 mb-12 rounded-3xl mx-4 sm:mx-8 lg:mx-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng để tìm không gian của bạn?</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Hãy tham gia cùng hàng ngàn sinh viên đã và đang tìm thấy những ngôi nhà và những người bạn cùng phòng lý tưởng thông qua StayMate.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => isAuthenticated ? navigate('/discover') : openAuthModal('register')}
                            className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/50 cursor-pointer"
                        >
                            Tham Gia Ngay
                        </button>
                        <button
                            onClick={() => navigate('/post-room')}
                            className="px-8 py-3.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
                        >
                            Đăng Phòng Cho Thuê
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
