"use client";

import { useState, useEffect, useRef } from "react";
import { 
  fetchAdminSupportChats, 
  fetchAdminSupportHistory, 
  sendAdminSupportMessage, 
  uploadAdminSupportImage,
  updateAdminSupportChatStatus,
  deleteAdminSupportChat,
  API_BASE_URL,
  getAdminHeaders
} from "@/lib/api";
import { Send, Image as ImageIcon, CheckCircle, Clock, Search, Bot, Trash2 } from "lucide-react";

export default function SupportPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial chats and set up WebSocket
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchAdminSupportChats();
        setChats(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadChats();

    // We can't proxy WebSockets via Next.js on Netlify.
    // We must fetch the token and connect directly to the backend.
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.shravaniagro.store';
    
    let reconnectAttempts = 0;
    
    const connectWS = async () => {
      try {
        const tokenRes = await fetch('/api/auth/token');
        if (!tokenRes.ok) throw new Error('No token');
        const { token } = await tokenRes.json();
        
        const wsUrl = `${wsBaseUrl}/admin/support/ws?token=${token}`;
        const ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_support_message') {
            const payload = data.data;
            if (!payload || !payload.message) return;
            
            const newMsg = payload.message;
            const userId = payload.user_id;
            
            window.dispatchEvent(new CustomEvent('new_admin_ws_message', { detail: { userId, message: newMsg } }));
            
            setChats(prevChats => {
              const chatIndex = prevChats.findIndex(c => c.user_id === userId);
              if (chatIndex >= 0) {
                const updatedChats = [...prevChats];
                const chat = updatedChats[chatIndex];
                chat.last_message = newMsg.message_type === 'text' ? newMsg.content : 'Image attached';
                chat.last_message_time = newMsg.created_at;
                chat.updated_at = newMsg.created_at;
                
                updatedChats.splice(chatIndex, 1);
                updatedChats.unshift(chat);
                return updatedChats;
              }
              loadChats();
              return prevChats;
            });
          } else if (data.type === 'chat_status_updated') {
            const payload = data.data;
            if (!payload || !payload.user_id || !payload.status) return;
            const userId = payload.user_id;
            const newStatus = payload.status;
            
            setChats(prevChats => {
              const updatedChats = prevChats.map(c => 
                c.user_id === userId ? { ...c, status: newStatus } : c
              );
              return updatedChats;
            });
            
            setSelectedUser((prev: any) => {
              if (prev && prev.user_id === userId) {
                return { ...prev, status: newStatus };
              }
              return prev;
            });
          }
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };
      
      ws.onclose = () => {
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        reconnectAttempts++;
        setTimeout(connectWS, timeout);
      };
      
      ws.onopen = () => {
        reconnectAttempts = 0;
      };
      
      wsRef.current = ws;
      } catch (err) {
        console.error('Failed to connect WS', err);
        setTimeout(connectWS, 5000);
      }
    };
    
    connectWS();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on unmount
        wsRef.current.close();
      }
    };
  }, []);

  // Handle active chat messages and CustomEvent
  useEffect(() => {
    if (!selectedUser) return;
    
    const loadInitialMessages = async () => {
      try {
        const data = await fetchAdminSupportHistory(selectedUser.user_id, 0); // cursor 0
        if (data && data.messages) {
          setMessages([...data.messages].reverse());
        } else {
          setMessages([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    loadInitialMessages();
    
    const handleNewMsg = (e: any) => {
      const { userId, message } = e.detail;
      if (userId === selectedUser.user_id) {
        setMessages(prev => [...prev, message]);
      }
    };
    
    window.addEventListener('new_admin_ws_message', handleNewMsg);
    return () => window.removeEventListener('new_admin_ws_message', handleNewMsg);
  }, [selectedUser]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !selectedUser) return;
    
    setIsSending(true);
    try {
      const newMsg = await sendAdminSupportMessage(selectedUser.user_id, inputMessage.trim());
      setMessages(prev => [...prev, newMsg]);
      setInputMessage("");
    } catch (error) {
      alert("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedUser) return;
    try {
      await updateAdminSupportChatStatus(selectedUser.user_id, newStatus);
      
      // Update local state for both the selected user and the chats list
      setSelectedUser((prev: any) => ({ ...prev, status: newStatus }));
      
      setChats(prevChats => 
        prevChats.map(c => c.id === selectedUser.id ? { ...c, status: newStatus } : c)
      );
      
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedUser) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this chat? This will clear all messages for the user as well.");
    if (!confirmDelete) return;

    try {
      await deleteAdminSupportChat(selectedUser.user_id);
      
      // Remove from chats list
      setChats(prevChats => prevChats.filter(c => c.id !== selectedUser.id));
      
      // Clear selected user
      setSelectedUser(null);
      setMessages([]);
    } catch (error) {
      alert("Failed to delete chat.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;
    
    setIsUploading(true);
    try {
      const newMsg = await uploadAdminSupportImage(selectedUser.user_id, selectedUser.id, file);
      setMessages(prev => [...prev, newMsg]);
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.user_id?.toString().includes(searchTerm) || 
    chat.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Left Pane: Chat List */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Support Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedUser(chat)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                selectedUser?.id === chat.id 
                  ? "bg-blue-50 border-l-4 border-l-blue-600" 
                  : "hover:bg-slate-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center gap-2">
                  User ID: {chat.user_id}
                  {chat.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {chat.unread_count}
                    </span>
                  )}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  chat.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {chat.status}
                </span>
              </div>
              <div className="text-sm text-slate-600 truncate mb-1">
                {chat.last_message || "No messages yet"}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Chat #{chat.id}</span>
                <span>{chat.last_message_time ? new Date(chat.last_message_time).toLocaleDateString() : new Date(chat.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {filteredChats.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No chats found.
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">User ID: {selectedUser.user_id}</h3>
                <span className="text-sm text-slate-500">Chat #{selectedUser.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedUser.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 shadow-sm text-slate-700 font-medium"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  onClick={handleDeleteChat}
                  title="Delete Chat"
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender_type === 'admin';
                const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={msg.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                      isAdmin 
                        ? 'bg-blue-600 text-white rounded-br-none border border-blue-700' 
                        : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                    }`}>
                      {msg.message_type === 'text' ? (
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      ) : (
                        <a href={`/api-proxy${msg.content}`} target="_blank" rel="noreferrer">
                          <img 
                            src={`/api-proxy${msg.content}`} 
                            alt="Attachment" 
                            className="rounded-lg max-h-60 object-contain mb-2 cursor-pointer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23e2e8f0"/><text x="50" y="50" fill="%2364748b" text-anchor="middle" alignment-baseline="middle">Broken Image</text></svg>';
                            }}
                          />
                        </a>
                      )}
                      <div className={`text-[10px] mt-1 ${isAdmin ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                        {time}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors text-slate-500 hover:text-slate-900 shadow-sm disabled:opacity-50"
                >
                  {isUploading ? <Clock className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Bot className="w-16 h-16 mb-4 opacity-50" />
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
