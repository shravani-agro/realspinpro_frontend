"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, RefreshCw, Trophy, Ticket, DollarSign, CloudOff, Gamepad2 } from "lucide-react";
import { gameGetUserBetsHistory } from "@/lib/game-api";

interface Bet {
  id: number;
  number: number;
  amount: number;
  won: boolean;
  round_id: number;
  winning_number?: number;
  round_status: string;
  created_at: string;
  game_type?: string;
}

export default function MyBetsScreen() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadBets = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await gameGetUserBetsHistory(10000);
      const sorted = [...data].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setBets(sorted.map((b: any) => ({ ...b, game_type: "spinwheel" })));
    } catch {
      setHasError(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadBets(); }, [loadBets]);

  // ── Stats (matches Flutter _totalWon, _totalBets, _totalWinAmount) ──────
  const wonBets = bets.filter((b) => b.won === true);
  const totalBets = bets.length;
  const totalWon = wonBets.length;
  const totalWinAmount = wonBets.reduce((sum, bet) => sum + (bet.amount * 9), 0);

  function formatDate(iso: string) {
    if (!iso) return "---";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="min-h-screen bg-black pb-28">
      {/* Background (tpbackground.jpg + black/82) */}
      <div className="fixed inset-0 z-0">
        <Image src="/tpbackground.jpg" alt="bg" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/82" />
      </div>

      {/* AppBar (matches Flutter AppBar with game icon + title) */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 pt-8 pb-3 bg-transparent">
        <Link href="/game">
          <button className="p-2 rounded-full bg-white/5 border border-white/10">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FFD700, #FF8C00)" }}>
            <Gamepad2 size={16} className="text-black" />
          </div>
          <span className="text-white font-black text-xl tracking-wide">My Bets</span>
        </div>
        <button onClick={loadBets} className="p-2 rounded-full bg-white/5 border border-white/10">
          <RefreshCw className="w-5 h-5" style={{ color: "#FFD700" }} />
        </button>
      </div>

      <div className="relative z-10 px-5 mt-2">

        {/* STATS CARD (matches Flutter _buildStats) */}
        {!isLoading && !hasError && bets.length > 0 && (
          <div className="w-full py-5 px-2 rounded-2xl border mb-5"
            style={{ background: "rgba(24,20,37,0.85)", borderColor: "rgba(255,215,0,0.25)", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
            <div className="flex items-center justify-around">
              {/* Total Bets */}
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <Ticket size={18} className="text-white/80" />
                <span className="text-white font-black text-lg">{totalBets}</span>
                <span className="text-white/40 text-[10px] font-medium">Total Bets</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              {/* Wins */}
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <Trophy size={18} style={{ color: "#00E676" }} />
                <span className="text-[#00E676] font-black text-lg">{totalWon}</span>
                <span className="text-white/40 text-[10px] font-medium">Wins</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              {/* Total Won */}
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <DollarSign size={18} style={{ color: "#FFD700" }} />
                <span className="text-[#FFD700] font-black text-lg">₹{totalWinAmount}</span>
                <span className="text-white/40 text-[10px] font-medium">Total Won</span>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        {!isLoading && !hasError && bets.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-black text-base tracking-wide">Bet History</span>
            <div className="px-3 py-1 rounded-full border"
              style={{ borderColor: "rgba(255,215,0,0.4)", background: "rgba(255,215,0,0.12)" }}>
              <span className="text-[#FFD700] text-[11px] font-bold">{totalBets} bets</span>
            </div>
          </div>
        )}

        {/* Loading shimmer */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center border"
              style={{ background: "rgba(255,82,82,0.08)", borderColor: "rgba(255,82,82,0.3)" }}>
              <CloudOff size={44} style={{ color: "#FF5252" }} />
            </div>
            <p className="text-white font-bold text-lg">Could not load your bets</p>
            <p className="text-white/40 text-sm text-center">Please check your connection and try again.</p>
            <button onClick={loadBets}
              className="px-8 py-3 rounded-full font-black text-black text-sm"
              style={{ background: "linear-gradient(135deg, #FFD700, #FF8C00)", boxShadow: "0 6px 14px rgba(255,215,0,0.3)" }}>
              RETRY
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasError && bets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-28 h-28 rounded-full flex items-center justify-center border"
              style={{ background: "rgba(255,215,0,0.06)", borderColor: "rgba(255,215,0,0.2)" }}>
              <Gamepad2 size={48} style={{ color: "rgba(255,215,0,0.6)" }} />
            </div>
            <p className="text-white font-bold text-lg">No bets yet</p>
            <p className="text-white/40 text-sm text-center max-w-xs">
              Place your first bet on the Spin Wheel{"\n"}and watch it appear here!
            </p>
            <Link href="/game/spinwheel">
              <button className="px-8 py-3 rounded-full font-black text-black text-sm mt-2"
                style={{ background: "linear-gradient(135deg, #FFD700, #FF8C00)" }}>
                PLAY NOW
              </button>
            </Link>
          </div>
        )}

        {/* BET CARDS (matches Flutter _buildBetCard) */}
        {!isLoading && !hasError && bets.map((bet, i) => {
          const won = bet.won === true;
          const pending = bet.round_status !== "settled";
          const amount = bet.amount;
          const winAmount = won ? amount * 9 : 0;

          const statusLabel = pending ? "PENDING" : won ? "WON" : "FINISHED";
          const statusColor = pending ? "#FFA000" : won ? "#00E676" : "rgba(255,255,255,0.5)";
          const tint = pending ? "#FFA000" : won ? "#FFD700" : "rgba(255,255,255,0.2)";

          // Badge gradient (matches Flutter badgeGradient)
          const badgeBg = won
            ? "linear-gradient(135deg, #FFD700, #B8860B)"
            : pending
            ? "linear-gradient(135deg, #6B4FA1, #3D2D63)"
            : "linear-gradient(135deg, #3A3450, #211D33)";

          return (
            <div key={bet.id}
              className="flex items-center gap-3 mb-3 p-3.5 rounded-2xl border"
              style={{
                background: won
                  ? "linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(24,20,37,0.9) 100%)"
                  : "linear-gradient(135deg, rgba(30,25,48,0.9) 0%, rgba(21,17,32,0.9) 100%)",
                borderColor: won ? "rgba(0,230,118,0.35)" : "rgba(255,255,255,0.08)",
              }}
            >
              {/* Number badge (casino chip style) */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: badgeBg,
                  border: `${won ? "2px" : "1px"} solid ${tint}80`,
                  boxShadow: won ? "0 0 12px rgba(0,230,118,0.3)" : "none",
                }}>
                <span className="text-white font-black text-2xl"
                  style={{ textShadow: won ? `0 0 8px ${tint}` : "none" }}>
                  {bet.number}
                </span>
              </div>

              {/* Middle info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm truncate">
                  SpinWheel · #{bet.number}
                </p>
                <p className="text-white/50 text-[11px] mt-0.5 truncate">
                  Round: {bet.round_id}
                  {bet.winning_number != null && !pending ? ` · Win: ${bet.winning_number}` : ""}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-white/30 text-[10px]">{formatDate(bet.created_at)}</span>
                </div>
              </div>

              {/* Amount + status */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-white font-black text-[15px]">₹{amount}</span>
                {won && (
                  <span className="font-black text-xs mt-0.5" style={{ color: "#00E676" }}>
                    +₹{winAmount}
                  </span>
                )}
                <div className="mt-1.5 px-2.5 py-1 rounded-xl border text-[9px] font-black tracking-wider"
                  style={{ color: statusColor, borderColor: `${statusColor}66`, background: `${statusColor}21` }}>
                  {statusLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
