"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, SendHorizonal, Image as ImageIcon, Headphones, Trash2 } from "lucide-react";
import { GAME_API, getToken } from "@/lib/game-api";

function buildHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Support Service mirrors Flutter's SupportService
const SUPPORT_WS = `wss://api.shravaniagro.store/ws/support`;

interface SupportMessage {
  id: number;
  sender_type: "user" | "admin";
  message_type: "text" | "image";
  content: string;
  created_at: string;
}

const DEFAULT_QUICK_REPLIES = [
  "Deposit Issue", "Withdrawal Issue", "Betting Issue",
  "Account Issue", "Payment Failed", "Other"
];

function formatTime(iso: string) {
  const d = new Date(iso);
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  const hh = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min}`;
}

function formatDateDivider(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (+msgDate === +today) return "Today";
  if (+msgDate === +yesterday) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SupportScreen() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);
  const [chatStatus, setChatStatus] = useState("open");
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState(DEFAULT_QUICK_REPLIES);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load History (matches Flutter _loadHistory) ───────────────────────
  const loadHistory = useCallback(async (cursor = 0) => {
    try {
      const res = await fetch(`${GAME_API}/support/chat/messages?cursor=${cursor}`, {
        headers: buildHeaders(),
      });
      const data = await res.json();
      const msgs = (data.messages || []) as SupportMessage[];
      setMessages(msgs);
      setHasMore(data.hasMore ?? false);
      setChatStatus(data.status ?? "open");
      setIsLoading(false);

      // Quick replies
      try {
        const qr = await fetch(`${GAME_API}/support/quick-replies`, { headers: buildHeaders() });
        const qData = await qr.json();
        if (Array.isArray(qData) && qData.length > 0) setQuickReplies(qData);
      } catch {}
    } catch {
      setIsLoading(false);
    }
  }, []);

  // ── WebSocket (matches Flutter SupportService.connect) ────────────────
  useEffect(() => {
    loadHistory();
    const token = getToken();
    const url = token ? `${SUPPORT_WS}?token=${token}` : SUPPORT_WS;
    const socket = new WebSocket(url);

    socket.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === "MESSAGE") {
          const msg = data.data as SupportMessage;
          setMessages((prev) => [msg, ...prev]);
        } else if (data.type === "STATUS") {
          const status = data.data?.status;
          if (status) {
            setChatStatus(status);
            if (status === "deleted") setMessages([]);
          }
        }
      } catch {}
    };

    wsRef.current = socket;
    return () => socket.close();
  }, [loadHistory]);

  const scrollToBottom = () => {
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  // ── Send Message ──────────────────────────────────────────────────────
  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setIsSending(true);
    try {
      const res = await fetch(`${GAME_API}/support/chat/message`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ content: msg }),
      });
      const data = await res.json();
      if (data.id) {
        setMessages((prev) => [data, ...prev]);
        if (chatStatus === "resolved") setChatStatus("open");
        scrollToBottom();
      }
    } catch {}
    setIsSending(false);
  };

  // ── Send Image ─────────────────────────────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setIsAttaching(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${GAME_API}/support/chat/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken() || ""}` },
        body: formData,
      });
      const data = await res.json();
      if (data.id) {
        setMessages((prev) => [data, ...prev]);
        scrollToBottom();
      }
    } catch {}
    setIsAttaching(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image src="/tpbackground.jpg" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* AppBar (matches Flutter AppBar style) */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-10 pb-3 bg-transparent">
        <Link href="/game">
          <button className="p-2 rounded-full">
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,215,0,0.15)" }}>
            <Headphones className="w-5 h-5" style={{ color: "#FFD700" }} />
          </div>
          <span className="text-white font-bold text-lg">Support Chat</span>
        </div>
      </div>

      {/* "Messages disappear" banner (matches Flutter _buildDisappearingBanner) */}
      <div className="relative z-10 flex items-center justify-center gap-2 py-2 text-white/50 text-xs bg-black/30 border-b border-white/5">
        <Trash2 size={13} />
        <span>Messages disappear after 3 days.</span>
      </div>

      {/* Messages */}
      <div ref={listRef} className="relative z-10 flex-1 overflow-y-auto flex flex-col-reverse px-3 py-4 gap-1">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          // Welcome message + quick replies (matches Flutter empty state)
          <div className="flex flex-col">
            <div className="flex justify-start mb-2">
              <div className="max-w-[75%] p-3 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl text-sm text-white leading-relaxed"
                style={{ background: "#4A0000" }}>
                👋 Hello! Welcome to Support.{"\n\n"}Please select the issue you're facing so we can assist you faster.
                <p className="text-white/50 text-[10px] mt-1 text-left">{formatTime(new Date().toISOString())}</p>
              </div>
            </div>
            {/* Quick replies */}
            <div className="flex flex-wrap gap-2 mt-3 px-2">
              {quickReplies.map((qr) => (
                <button key={qr} onClick={() => handleSend(qr)}
                  className="px-4 py-2.5 rounded-full border text-sm font-semibold"
                  style={{ borderColor: "rgba(255,215,0,0.6)", color: "#FFD700", background: "rgba(0,0,0,0.5)" }}>
                  {qr}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.sender_type === "user";
            const isImage = msg.message_type === "image";
            const showDivider = i === messages.length - 1 ||
              new Date(messages[i + 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
            return (
              <div key={msg.id}>
                {showDivider && (
                  <p className="text-center text-white/50 text-xs font-bold py-4">
                    {formatDateDivider(msg.created_at)}
                  </p>
                )}
                <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-1.5`}>
                  <div
                    className={`max-w-[74%] text-sm text-white ${isImage ? "" : "px-3 py-2.5"}`}
                    style={{
                      background: isUser ? "rgba(0,0,0,0.6)" : "#4A0000",
                      border: isUser ? "1px solid rgba(255,215,0,0.5)" : "none",
                      borderRadius: `${isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px"}`,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    {isImage ? (
                      <img src={`${GAME_API}${msg.content}`} alt="img"
                        className="rounded-2xl max-w-full max-h-64 object-contain cursor-pointer"
                        onClick={() => window.open(`${GAME_API}${msg.content}`, "_blank")}
                      />
                    ) : (
                      <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                    )}
                    <p className={`text-white/50 text-[10px] mt-1 ${isUser ? "text-right" : "text-left"} ${isImage ? "px-2 pb-1" : ""}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Status Banner (resolved/closed/deleted) */}
      {chatStatus === "deleted" && (
        <div className="relative z-10 bg-black/60 border-t border-[#FF5252]/30 py-4 text-center text-[#FF5252] text-sm font-medium">
          This chat was deleted by an administrator.
        </div>
      )}
      {(chatStatus === "resolved" || chatStatus === "closed") && (
        <div className="relative z-10 bg-black/60 border-t border-teal-500/30 py-2 text-center text-teal-400 text-xs">
          {chatStatus === "resolved"
            ? "This chat is resolved. Send a message to reopen."
            : "This chat is closed. Send a message to start a new one."}
        </div>
      )}

      {/* Input Area (matches Flutter _buildInputArea) */}
      {chatStatus !== "deleted" && (
        <div className="relative z-10 flex items-center gap-2 px-3 py-3 pb-28 bg-black/60 border-t border-white/10">
          {/* Image button */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
          <button onClick={() => fileInputRef.current?.click()}
            disabled={isAttaching}
            className="p-2.5 shrink-0 transition-opacity">
            {isAttaching ? (
              <div className="w-5 h-5 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6" style={{ color: "#FFD700" }} />
            )}
          </button>

          {/* Text input */}
          <div className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isAttaching || isSending}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
            />
          </div>

          {/* Send button (gold, matches Flutter) */}
          <button onClick={() => handleSend()} disabled={isSending || !input.trim()}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all"
            style={{ background: "linear-gradient(135deg, #FFD700, #FFA000)", boxShadow: "0 3px 12px rgba(255,215,0,0.4)" }}>
            {isSending ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendHorizonal className="w-5 h-5 text-black ml-0.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
