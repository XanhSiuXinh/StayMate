import { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, Info, Calendar, MapPin, FileText, Smile, Send, Paperclip, MoreHorizontal, CheckCircle2, ShieldCheck, Loader2, MessageSquare } from 'lucide-react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
    const { token } = useAuth();
    const [search, setSearch] = useState('');
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgText, setMsgText] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [connection, setConnection] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost:5015/api/messages/conversations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data);

                if (data.length > 0 && !activeChat) {
                    setActiveChat(data[0]);
                }
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
        } finally {
            setLoadingConversations(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [token]);

    // Initialize SignalR Connection
    useEffect(() => {
        if (!token) return;

        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5015/chathub', {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [token]);

    // Start connection and setup listeners
    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR ChatHub');

                    connection.on('ReceiveMessage', (message) => {
                        setMessages(prev => {
                            // Avoid duplicates
                            if (prev.some(m => m.messageId === message.messageId)) return prev;
                            return [...prev, message];
                        });
                        
                        // Update conversations list summary
                        setConversations(prev => prev.map(c => {
                            if (c.id === message.conversationId) {
                                return {
                                    ...c,
                                    lastMessage: message.messageContent,
                                    time: new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    unread: message.senderId !== message.otherUserId // Simple unread logic
                                };
                            }
                            return c;
                        }));
                    });
                })
                .catch(e => console.error('Connection failed: ', e));
        }
    }, [connection]);

    const fetchMessages = async () => {
        if (!activeChat || !token) return;
        try {
            const res = await fetch(`http://localhost:5015/api/messages/${activeChat.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (activeChat) {
            setLoadingMessages(true);
            fetchMessages();

            // Join the specific conversation group
            if (connection && connection.state === 'Connected') {
                connection.invoke('JoinConversation', activeChat.id)
                    .catch(err => console.error('JoinConversation failed: ', err));
            }
        }

        return () => {
            // Leave the group when switching or unmounting
            if (activeChat && connection && connection.state === 'Connected') {
                connection.invoke('LeaveConversation', activeChat.id)
                    .catch(err => console.error('LeaveConversation failed: ', err));
            }
        };
    }, [activeChat, connection]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!msgText.trim() || !activeChat) return;

        const content = msgText;
        setMsgText('');

        try {
            const res = await fetch(`http://localhost:5015/api/messages/${activeChat.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            if (res.ok) {
                await fetchMessages(); // refresh immediately after send
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    const filteredConversations = conversations.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white dark:bg-gray-900 overflow-hidden transition-colors">

            {/* Left Column: Chat List */}
            <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search matches..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-500 text-gray-900 dark:text-white outline-none text-sm transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConversations ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="animate-spin text-primary dark:text-blue-400" size={32} />
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex items-center justify-center p-8 text-gray-400 text-sm text-center font-medium">
                            No conversations yet. Go match with someone!
                        </div>
                    ) : (
                        filteredConversations.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`flex gap-3 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors border-l-4 ${activeChat?.id === chat.id ? 'border-primary dark:border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' : 'border-transparent'}`}
                            >
                                <div className="relative w-12 h-12 shrink-0">
                                    <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                                    {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={`text-sm font-semibold truncate ${chat.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{chat.name}</h3>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">{chat.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                                        <CheckCircle2 size={12} className="text-blue-500 dark:text-blue-400" /> Verified • {chat.match}% Compatible
                                    </div>
                                    <p className={`text-sm truncate ${chat.unread ? 'text-primary dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Middle Column: Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-w-0">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between bg-white dark:bg-gray-800 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img src={activeChat.avatar} alt={activeChat.name} className="w-12 h-12 rounded-full object-cover" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeChat.name}</h2>
                                        <span className="bg-blue-50 dark:bg-blue-500/10 text-primary dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-transparent dark:border-blue-500/20">
                                            <ShieldCheck size={12} /> VERIFIED
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {/* Status */}
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div> Match since {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                                <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Phone size={20} /></button>
                                <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Video size={20} /></button>
                                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                                <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Info size={20} /></button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 space-y-6">
                            {loadingMessages && messages.length === 0 ? (
                                <div className="flex h-full items-center justify-center">
                                    <Loader2 className="animate-spin text-primary dark:text-blue-400" size={32} />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-gray-400 gap-4">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <Smile size={48} className="opacity-40 text-primary dark:text-blue-400" />
                                    </div>
                                    <p className="font-medium text-lg text-gray-500 dark:text-gray-400">Say hi to {activeChat.name}!</p>
                                </div>
                            ) : (
                                messages.map((m, idx) => {
                                    const isMine = m.senderId !== activeChat.otherUserId;
                                    const timeStr = new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div key={m.messageId || idx} className={`flex gap-3 max-w-[80%] ${isMine ? 'ml-auto justify-end' : ''}`}>
                                            {!isMine && (
                                                <img src={activeChat.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-auto" />
                                            )}
                                            <div>
                                                <div className={`${isMine ? 'bg-primary dark:bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'} p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm`}>
                                                    {m.messageContent}
                                                </div>
                                                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 mt-1 ${isMine ? 'mr-1' : 'ml-1'}`}>
                                                    {timeStr} {isMine && <CheckCircle2 size={12} className={m.isRead ? 'text-primary dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'} />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-2 border border-transparent focus-within:border-gray-200 dark:focus-within:border-gray-600 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all">
                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Paperclip size={20} /></button>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent outline-none text-[15px] text-gray-900 dark:text-white px-2"
                                    placeholder="Type a message..."
                                    value={msgText}
                                    onChange={(e) => setMsgText(e.target.value)}
                                    autoFocus
                                />
                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Smile size={20} /></button>
                                <button type="submit" disabled={!msgText.trim()} className="p-2.5 bg-primary disabled:bg-primary/50 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"><Send size={18} className="translate-x-0.5 -translate-y-0.5" /></button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 flex-col gap-4">
                        <MessageSquare size={80} className="opacity-20" />
                        <p className="font-medium text-lg">Select a match to start chatting</p>
                    </div>
                )}
            </div>

            {/* Right Column: Profile Info */}
            {activeChat && (
                <div className="w-80 border-l border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900 flex flex-col overflow-y-auto hidden lg:flex">
                    <div className="p-8 flex flex-col items-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                        <img src={activeChat.avatar} alt={activeChat.name} className="w-24 h-24 rounded-full object-cover shadow-md mb-4 border-2 border-white dark:border-gray-800" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{activeChat.name}</h2>
                        <div className="flex items-center gap-1.5 text-xs text-primary dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/20 mt-2">
                            <ShieldCheck size={14} /> Student Verified
                        </div>

                        <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full justify-center">
                            <div className="text-center">
                                <div className="text-xl font-black text-primary dark:text-blue-400">{activeChat.match}%</div>
                                <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Match Score</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 mt-auto">
                        <button className="w-full mt-8 py-3.5 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20">
                            Unmatch
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
