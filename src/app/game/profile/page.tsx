"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LogOut, Wallet, Lock, Phone, User } from "lucide-react";
import { gameGetBalance, gameGetProfile, clearSession, gameChangePassword, gameUpdateProfile, getStoredUser } from "@/lib/game-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, any> | null>(getStoredUser());
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Modals
  const [showEditName, setShowEditName] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [newName, setNewName] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      const [profile, bal] = await Promise.all([
        gameGetProfile(),
        gameGetBalance(),
      ]);
      setUser(profile);
      setBalance(bal);
    } catch {}
    setIsLoading(false);
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // Display helpers (matches Flutter _displayName, _initials, _displayMobile)
  const displayName = (() => {
    if (!user) return "---";
    const n = user.name || user.username || user.full_name;
    if (n?.trim()) return n;
    const m = user.mobile?.toString() || "";
    if (m.length >= 4) return `User ${m.slice(-4)}`;
    return "Player";
  })();

  const displayMobile = user?.mobile ? `+91 ${user.mobile}` : "---";

  const initials = (() => {
    const name = displayName;
    if (name === "---" || !name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  })();

  const walletBalance = balance > 0 ? balance : (user?.balance || user?.wallet || 0);

  // Logout (matches Flutter _logout with confirmation dialog)
  const handleLogout = async () => {
    setIsLoggingOut(true);
    clearSession();
    router.push("/login");
  };

  // Edit Profile
  const handleEditName = async () => {
    try {
      await gameUpdateProfile(newName.trim());
      setUser((u) => ({ ...u!, name: newName.trim() }));
      toast.success("Profile updated!");
      setShowEditName(false);
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    try {
      await gameChangePassword(oldPass, newPass);
      toast.success("Password changed!");
      setShowChangePass(false);
      setOldPass(""); setNewPass("");
    } catch (e: any) {
      toast.error(e.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-black pb-28">
      {/* Background (matches Flutter tpbackground.jpg + 0.75 alpha) */}
      <div className="fixed inset-0 z-0">
        <Image src="/tpbackground.jpg" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {isLoading && !user ? (
        <div className="relative z-10 flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-2 border-[#8E2DE2] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative z-10 overflow-y-auto pt-10 px-5">

          {/* HEADER (matches Flutter _buildHeader) */}
          <div className="w-full p-6 rounded-3xl border mb-6"
            style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,215,0,0.3)", borderWidth: 1.5 }}>
            {/* Avatar with sweep gradient ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                {/* Glowing ring */}
                <div className="absolute inset-0 rounded-full"
                  style={{ background: "conic-gradient(#FFD700, #FF5252, #FF7B7B, #FFD700)", boxShadow: "0 0 20px rgba(255,82,82,0.4)" }} />
                {/* Inner circle with initials */}
                <div className="absolute inset-1 rounded-full flex items-center justify-center"
                  style={{ background: "#1B182B" }}>
                  <span className="text-3xl font-black" style={{ color: "#FFD700", letterSpacing: 1 }}>
                    {initials}
                  </span>
                </div>
                {/* VIP Badge */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-lg"
                  style={{ background: "linear-gradient(135deg, #FFD700, #FFA000)", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                  <span className="text-black text-[9px] font-black tracking-widest">VIP</span>
                </div>
              </div>
              <h2 className="text-white text-2xl font-black tracking-[2px] text-center"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                {displayName.toUpperCase()}
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Phone size={12} style={{ color: "#FFD700" }} />
                <span className="text-white/70 text-sm tracking-wider">{displayMobile}</span>
              </div>
            </div>
          </div>

          {/* WALLET CARD (matches Flutter _buildWalletCard: dark red gradient) */}
          <div className="w-full p-6 rounded-3xl border mb-6 flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #8B0000, #4A0000)",
              borderColor: "rgba(255,215,0,0.6)",
              borderWidth: 1.5,
              boxShadow: "0 8px 24px rgba(255,0,0,0.3)",
            }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #FFD700, #FFA000)", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }}>
              <Wallet size={26} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-[#FFD700] text-xs font-black tracking-[1.5px]">MAIN WALLET</p>
              <p className="text-white text-3xl font-black mt-0.5" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                ₹{walletBalance}
              </p>
            </div>
            <Link href="/game/wallet">
              <button className="px-4 py-2.5 rounded-xl border text-xs font-black tracking-wider"
                style={{ borderColor: "#FFD700", color: "#FFD700", background: "rgba(0,0,0,0.4)" }}>
                MANAGE
              </button>
            </Link>
          </div>

          {/* MENU SECTION (matches Flutter _buildMenuSection) */}
          <p className="text-white/50 text-xs font-black tracking-[2px] mb-4">ACCOUNT SETTINGS</p>
          <div className="space-y-3 mb-8">
            {[
              { icon: <User size={22} style={{ color: "#FFD700" }} />, label: "Edit Profile", sub: "Update your name and details", color: "#FFD700", action: () => { setNewName(displayName); setShowEditName(true); } },
              { icon: <Wallet size={22} style={{ color: "#FFD700" }} />, label: "Bank Details / Wallet", sub: "Manage withdrawal account", color: "#FFD700", action: () => router.push("/game/wallet") },
              { icon: <Lock size={22} style={{ color: "#FF5252" }} />, label: "Security", sub: "Change your password", color: "#FF5252", action: () => setShowChangePass(true) },
              { icon: <Phone size={22} style={{ color: "#4CAF50" }} />, label: "Support", sub: "24/7 Support", color: "#4CAF50", action: () => router.push("/game/support") },
            ].map((item, i) => (
              <button key={i} onClick={item.action}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all hover:scale-[1.01]"
                style={{ background: "rgba(0,0,0,0.4)", borderColor: `${item.color}4D`, borderWidth: 1.2 }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}1E`, border: `1px solid ${item.color}80` }}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-[15px]">{item.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.sub}</p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5">
                  <ChevronRight size={18} className="text-white/40" />
                </div>
              </button>
            ))}
          </div>

          {/* LOGOUT (matches Flutter _buildLogoutBtn) */}
          <button onClick={() => setShowLogoutConfirm(true)} disabled={isLoggingOut}
            className="w-full py-5 rounded-2xl flex items-center justify-center gap-2.5 border transition-all"
            style={{ background: "linear-gradient(180deg, #3A0000, #1A0000)", borderColor: "rgba(255,82,82,0.8)", borderWidth: 1.5, boxShadow: "0 0 16px rgba(255,82,82,0.2)" }}>
            {isLoggingOut ? (
              <div className="w-5 h-5 border-2 border-[#FF5252] border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut size={20} style={{ color: "#FF5252" }} />
            )}
            <span className="text-[#FF5252] font-black text-sm tracking-[3px]">LOGOUT</span>
          </button>

        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditName && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowEditName(false)} />
          <div className="relative w-full rounded-t-[28px] p-7 z-10"
            style={{ background: "#1B182B", borderTop: "1.5px solid rgba(255,215,0,0.3)" }}>
            <p className="text-white font-bold text-xl mb-4">Edit Name</p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white/5 rounded-2xl p-4 text-white text-lg font-bold outline-none mb-4"
              placeholder="Your display name"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowEditName(false)} className="flex-1 py-3 text-white/50 font-medium">Cancel</button>
              <button onClick={handleEditName}
                className="flex-1 py-4 rounded-xl font-bold text-black"
                style={{ background: "linear-gradient(135deg, #FFD700, #FFA000)" }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showChangePass && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowChangePass(false)} />
          <div className="relative w-full rounded-t-[28px] p-7 z-10"
            style={{ background: "#1B182B", borderTop: "1.5px solid rgba(255,82,82,0.3)" }}>
            <p className="text-white font-bold text-xl mb-4">Change Password</p>
            <div className="space-y-3 mb-4">
              <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)}
                placeholder="Current password"
                className="w-full bg-white/5 rounded-2xl p-4 text-white outline-none placeholder-white/20" />
              <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password"
                className="w-full bg-white/5 rounded-2xl p-4 text-white outline-none placeholder-white/20" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowChangePass(false)} className="flex-1 py-3 text-white/50 font-medium">Cancel</button>
              <button onClick={handleChangePassword}
                className="flex-1 py-4 rounded-xl font-bold text-white"
                style={{ background: "#FF5252" }}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRM DIALOG (matches Flutter confirm dialog) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-3xl p-6 z-10"
            style={{ background: "#1B182B" }}>
            <p className="text-white font-bold text-lg mb-2">Confirm Logout</p>
            <p className="text-white/60 text-sm mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 text-white/40 font-medium">Cancel</button>
              <button onClick={handleLogout}
                className="flex-1 py-3 text-[#FF5252] font-bold">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
