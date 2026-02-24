import { useState } from 'react';
import { Search, Phone, Video, Info, Calendar, MapPin, FileText, Smile, Send, Paperclip, MoreHorizontal, CheckCircle2, ShieldCheck } from 'lucide-react';

const DUMMY_CHATS = [
    {
        id: 1,
        name: 'Sarah Mitchell',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        lastMessage: "Totally! I'm pretty chill about it...",
        time: '2m ago',
        unread: true,
        match: 92,
        online: true
    },
    {
        id: 2,
        name: 'James Wilson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        lastMessage: 'What time do you usually wake up?',
        time: '1h ago',
        unread: false,
        match: 85,
        online: false
    },
    {
        id: 3,
        name: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        lastMessage: "Let's check the apartment tours next week.",
        time: 'Yesterday',
        unread: false,
        match: 88,
        online: false
    }
];

const Messages = () => {
    const [search, setSearch] = useState('');
    const [activeChat, setActiveChat] = useState(DUMMY_CHATS[0]);
    const [msgText, setMsgText] = useState('');

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">

            {/* Left Column: Chat List */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Chats</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search matches..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {DUMMY_CHATS.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`flex gap-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors border-l-4 ${activeChat.id === chat.id ? 'border-primary bg-blue-50/50' : 'border-transparent'}`}
                        >
                            <div className="relative">
                                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                                {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`text-sm font-semibold truncate ${chat.unread ? 'text-gray-900' : 'text-gray-700'}`}>{chat.name}</h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                    <CheckCircle2 size={12} className="text-blue-500" /> Verified • {chat.match}% Compatible
                                </div>
                                <p className={`text-sm truncate ${chat.unread ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle Column: Chat Area */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
                {/* Chat Header */}
                <div className="h-20 border-b border-gray-100 px-6 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={activeChat.avatar} alt={activeChat.name} className="w-12 h-12 rounded-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-900">{activeChat.name}</h2>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                    <ShieldCheck size={12} /> VERIFIED
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div> Active now • {activeChat.match}% Lifestyle Compatibility
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-gray-600 transition-colors"><Phone size={20} /></button>
                        <button className="hover:text-gray-600 transition-colors"><Video size={20} /></button>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <button className="hover:text-gray-600 transition-colors"><Info size={20} /></button>
                    </div>
                </div>

                {/* Chat Messages Placeholder */}
                <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">Tuesday, Oct 24</span>
                    </div>

                    <div className="flex gap-3 max-w-[80%]">
                        <img src={activeChat.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-auto" />
                        <div>
                            <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-sm text-[15px] leading-relaxed">
                                Hey Alex! I saw on your profile that we both like quiet study hours and we're both juniors. How do you feel about having guests over on the weekends? 🏡
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1 ml-1">11:02 AM</div>
                        </div>
                    </div>

                    <div className="flex gap-3 max-w-[80%] ml-auto justify-end">
                        <div>
                            <div className="bg-[#8b5cf6] text-white p-4 rounded-2xl rounded-br-sm text-[15px] leading-relaxed">
                                Hey Sarah! Glad we matched. I'm pretty chill about weekend guests as long as we give each other a quick heads up. I'm usually out at the library on Sundays anyway!
                            </div>
                            <div className="flex justify-end items-center gap-1 text-[11px] text-gray-400 mt-1 mr-1">
                                11:05 AM <CheckCircle2 size={12} className="text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 max-w-[80%]">
                        <img src={activeChat.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-auto" />
                        <div>
                            <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-sm text-[15px] leading-relaxed">
                                That sounds perfect. Same here! Do you want to meet up for coffee sometime this week to chat more? I found a place near North Campus that looks nice.
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1 ml-1">11:06 AM</div>
                        </div>
                    </div>

                    <div className="flex gap-3 max-w-[80%] ml-auto justify-end">
                        <div>
                            <div className="bg-[#8b5cf6] text-white p-4 rounded-2xl rounded-br-sm text-[15px] leading-relaxed">
                                Totally! I'm free Thursday afternoon. Does 3 PM work for you?
                            </div>
                            <div className="flex justify-end items-center gap-1 text-[11px] text-gray-400 mt-1 mr-1">
                                11:08 AM <CheckCircle2 size={12} className="text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="flex gap-0.5">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        Sarah is typing...
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {/* Action chips */}
                    <div className="flex gap-2 mb-3">
                        <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                            <Calendar size={14} /> Schedule Meetup
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                            <MapPin size={14} /> Location
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                            <FileText size={14} /> Housing Agreement
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"><Paperclip size={20} /></button>
                        <input
                            type="text"
                            className="flex-1 bg-transparent outline-none text-[15px]"
                            placeholder="Type a message..."
                            value={msgText}
                            onChange={(e) => setMsgText(e.target.value)}
                        />
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"><Smile size={20} /></button>
                        <button className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"><Send size={18} className="translate-x-0.5 -translate-y-0.5" /></button>
                    </div>
                </div>
            </div>

            {/* Right Column: Profile Info */}
            <div className="w-80 border-l border-gray-100 bg-gray-50/30 flex flex-col overflow-y-auto hidden lg:flex">
                <div className="p-8 flex flex-col items-center border-b border-gray-100 bg-white">
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-24 h-24 rounded-full object-cover shadow-sm mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{activeChat.name}</h2>
                    <p className="text-sm text-gray-500 text-center">Environmental Science, Junior</p>

                    <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100 w-full justify-center">
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{activeChat.match}%</div>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Match</div>
                        </div>
                        <div className="w-px bg-gray-200"></div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">4.9</div>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Rating</div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Top Shared Lifestyle</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="bg-white border text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Quiet Study</span>
                        <span className="bg-white border text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Early Riser</span>
                        <span className="bg-white border text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Non-Smoker</span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">University Verification</h3>
                    <div className="bg-blue-50 rounded-xl p-4 flex gap-3 border border-blue-100">
                        <ShieldCheck className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <div>
                            <div className="text-sm font-bold text-gray-900">Identity Verified</div>
                            <div className="text-xs text-blue-600 mt-1">Verified via university email (berkeley.edu)</div>
                        </div>
                    </div>

                    <button className="w-full mt-8 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        Report or Block
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Messages;
