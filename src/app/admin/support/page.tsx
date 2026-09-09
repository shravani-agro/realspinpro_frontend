"use client";

import { useState, useEffect, useRef } from "react";
import { 
  fetchAdminSupportChats, 
  fetchAdminSupportHistory, 
  sendAdminSupportMessage, 
  uploadAdminSupportImage,
  API_BASE_URL,
  getAdminHeaders
} from "@/lib/api";
import { Send, Image as ImageIcon, CheckCircle, Clock, Search, Bot } from "lucide-react";

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

    // Setup WebSocket using the Next.js API Proxy which handles cross-site cookies
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api-proxy/admin/support/ws`;
    
    let reconnectAttempts = 0;
    
    const connectWS = () => {
      // The backend AuthMiddleware will parse the token from HttpOnly cookie
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
    <div className="flex h-screen bg-black text-white pt-16 -mt-16">
      {/* Left Pane: Chat List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col bg-gray-900/50">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold mb-4">Support Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedUser(chat)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                selectedUser?.id === chat.id 
                  ? "bg-neon-blue/10 border-l-4 border-l-neon-blue" 
                  : "hover:bg-white/5 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold flex items-center gap-2">
                  User ID: {chat.user_id}
                  {chat.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {chat.unread_count}
                    </span>
                  )}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  chat.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {chat.status}
                </span>
              </div>
              <div className="text-sm text-gray-300 truncate mb-1">
                {chat.last_message || "No messages yet"}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Chat #{chat.id}</span>
                <span>{chat.last_message_time ? new Date(chat.last_message_time).toLocaleDateString() : new Date(chat.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {filteredChats.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No chats found.
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Chat Window */}
      <div className="flex-1 flex flex-col bg-black">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-white/10 bg-gray-900/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">User ID: {selectedUser.user_id}</h3>
                <span className="text-sm text-gray-400">Chat #{selectedUser.id} • {selectedUser.status}</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender_type === 'admin';
                const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={msg.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-3 ${
                      isAdmin 
                        ? 'bg-neon-blue/20 text-white rounded-br-none border border-neon-blue/30' 
                        : 'bg-white/10 text-white rounded-bl-none border border-white/10'
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
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23333"/><text x="50" y="50" fill="%23999" text-anchor="middle" alignment-baseline="middle">Broken Image</text></svg>';
                            }}
                          />
                        </a>
                      )}
                      <div className={`text-[10px] mt-1 ${isAdmin ? 'text-neon-blue/60 text-right' : 'text-gray-400'}`}>
                        {time}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-white/10 bg-gray-900/50">
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
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white disabled:opacity-50"
                >
                  {isUploading ? <Clock className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className="px-6 py-2 bg-neon-blue hover:bg-neon-blue/80 text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <Bot className="w-16 h-16 mb-4 opacity-50" />
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
