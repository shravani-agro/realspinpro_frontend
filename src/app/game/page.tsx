"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Wallet, Headphones, Gamepad2, WifiOff } from "lucide-react";
import { gameGetBalance, getStoredUser } from "@/lib/game-api";

export default function GameHomeScreen() {
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("Player");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Matches Flutter _loadData()
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // Load username from stored user (silent)
      const stored = getStoredUser();
      if (stored) {
        const name = stored.username || stored.name || stored.full_name;
        if (name?.trim()) setUserName(name.trim().split(" ")[0]);
      }
      // Load real balance
      const bal = await gameGetBalance();
      setBalance(bal);
    } catch {
      setHasError(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="relative min-h-screen bg-[#0F0C16] overflow-x-hidden">
      {/* Background Glows (matches Flutter Positioned glows) */}
      <div className="absolute top-[150px] -left-[50px] w-[200px] h-[200px] bg-[#FF5252]/12 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[150px] -right-[50px] w-[200px] h-[200px] bg-[#FF5252]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <div className="flex flex-col min-h-screen relative z-10 pt-4">

        {/* Top Bar (matches Flutter Custom AppBar) */}
        <div className="flex justify-between items-center px-5 py-2 z-20">
          <Image
            src="/homelogo.png"
            alt="RealSpinPro"
            width={120}
            height={35}
            className="h-[35px] w-auto object-contain"
            onError={() => {
              // Fallback is handled by Image's built-in error
            }}
          />

          {/* Menu Button (matches Flutter PopupMenuButton) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute top-14 right-0 w-52 bg-[#1B1423] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-40 backdrop-blur-xl">
                  <Link href="/game/wallet" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white text-sm font-semibold">
                    <Wallet className="w-5 h-5" style={{ color: "#FFD700" }} />
                    Wallet
                  </Link>
                  <div className="h-px bg-white/10 my-1" />
                  <Link href="/game/support" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white text-sm font-semibold">
                    <Headphones className="w-5 h-5" style={{ color: "#4CAF50" }} />
                    Support
                  </Link>
                  <div className="h-px bg-white/10 my-1" />
                  <Link href="/game/mybets" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white text-sm font-semibold">
                    <Gamepad2 className="w-5 h-5 text-white/70" />
                    My Bets
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hero + Cards (matches Flutter Stack structure) */}
        <div className="flex-1 relative mt-2 flex flex-col justify-end pb-12">

          {/* Lady Image Background (matches Flutter Image.asset('home.png')) */}
          <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none" style={{ zIndex: -1 }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[360px] h-[360px] bg-[radial-gradient(circle,rgba(255,82,82,0.6)_10%,rgba(255,82,82,0)_70%)] rounded-full" />
            <Image
              src="/home.png"
              alt="Casino Host"
              width={400}
              height={400}
              className="w-full max-w-[400px] object-contain object-top"
              priority
            />
          </div>

          <div className="flex-1" />

          {/* Cashback Balance Card (matches Flutter ClipRRect + BackdropFilter) */}
          <div className="mx-5 mb-4 p-4 rounded-3xl bg-[#1B1423]/60 backdrop-blur-xl border border-white/15">
            {isLoading ? (
              <div className="w-[180px] h-[44px] bg-white/10 rounded-lg animate-pulse" />
            ) : hasError ? (
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-[#FF5252]" />
                <span className="text-[#FF7B7B] text-sm font-semibold">Could not load balance</span>
                <button onClick={loadData}
                  className="ml-2 px-3 py-1.5 border border-[#FF7B7B]/50 rounded-full text-[#FF7B7B] text-[11px] font-bold tracking-wider">
                  RETRY
                </button>
              </div>
            ) : (
              <div className="text-white text-[42px] font-black tracking-widest" style={{ fontFamily: "Cinzel, serif" }}>
                ₹ {balance}
              </div>
            )}
            <div className="text-[#FF7B7B] text-xs font-semibold tracking-wider mt-1 mb-4">
              CASHBACK BALANCE
            </div>

            {/* WITHDRAW ALL + ADD FUNDS buttons */}
            <div className="flex gap-4">
              <Link href="/game/wallet" className="flex-1 block">
                <div className="py-3 bg-gradient-to-b from-[#FF7B7B] to-[#FF5252] rounded-full text-center text-white text-xs font-bold shadow-[0_3px_10px_rgba(255,82,82,0.3)]">
                  WITHDRAW ALL
                </div>
              </Link>
              <Link href="/game/wallet" className="flex-1 block">
                <div className="py-3 border-2 border-[#FF5252]/50 rounded-full text-center text-[#FF7B7B] text-xs font-bold bg-transparent">
                  ADD FUNDS
                </div>
              </Link>
            </div>
          </div>

          {/* Spin & Win Banner (matches Flutter _buildSpinWheelBanner) */}
          <div className="mx-5 p-2.5 rounded-3xl bg-[#1B1423]/50 backdrop-blur-xl border border-white/10 flex items-center">
            <div className="w-[70px] h-[70px] flex-shrink-0">
              <Image
                src="/spin_wheel.png"
                alt="Spin Wheel"
                width={70}
                height={70}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="ml-4 flex-1">
              <h3 className="text-white text-lg font-black tracking-wide" style={{ fontFamily: "Cinzel, serif" }}>
                SPIN &amp; WIN
              </h3>
              <p className="text-white/50 text-[11px] font-medium">Test your luck today!</p>
            </div>

            {/* Pulsing PLAY NOW (matches Flutter .animate().scale()) */}
            <Link href="/game/spinwheel">
              <div className="px-4 py-2 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.3)] text-black text-xs font-black transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #FFD700, #FFA000)", animation: "pulseScale 1s ease-in-out infinite alternate" }}>
                PLAY NOW
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseScale { from { transform: scale(1); } to { transform: scale(1.05); } }
      ` }} />
    </div>
  );
}
