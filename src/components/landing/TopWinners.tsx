"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";

const WINNERS = [
  { rank: 1, user: "Rahul K.", game: "Boommine", multiplier: "1,250x", payout: "₹1,25,000", color: "#ffd700", glow: "rgba(255, 215, 0, 0.4)" },
  { rank: 2, user: "Vikram S.", game: "Pro Challenge", multiplier: "850x", payout: "₹85,000", color: "#e2e8f0", glow: "rgba(255, 255, 255, 0.3)" },
  { rank: 3, user: "Pooja M.", game: "Toss Toss", multiplier: "500x", payout: "₹50,000", color: "#cd7f32", glow: "rgba(205, 127, 50, 0.3)" },
  { rank: 4, user: "Amit D.", game: "Wheel Challenge", multiplier: "250x", payout: "₹25,000", color: "#ff007f", glow: "rgba(255, 0, 127, 0.2)" },
  { rank: 5, user: "Suresh P.", game: "Boommine", multiplier: "100x", payout: "₹10,000", color: "#00f3ff", glow: "rgba(0, 243, 255, 0.2)" },
];

export function TopWinners() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Premium gradient backdrop (no image) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.06)_0%,transparent_55%)] pointer-events-none" />

      {/* Background neon flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10 w-full">
        
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-gaming-gold/5 border border-gaming-gold/30">
            <Trophy className="w-5 h-5 text-gaming-gold animate-bounce" />
            <span className="text-xs font-bold tracking-widest text-gaming-gold uppercase font-orbitron">Hall of Fame</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-white">
            RECENT HUGE <span className="neon-text-gold">PAYOUTS</span>
          </h2>
          <p className="text-indigo-200/70 text-base md:text-lg">Real players hitting high multipliers. Next draw starts in seconds!</p>
        </div>

        {/* Leaderboard Panel */}
        <div className="luxury-glass-gold rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.06)] border border-gaming-gold/30">
          
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#19103b]/90 border-b border-gaming-gold/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 font-orbitron">Live Feed</span>
            </div>
            <div className="text-[10px] md:text-xs text-indigo-300 font-semibold">Updated 1s ago</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#120b2e]/60 text-indigo-200/60 text-xs font-black uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Arena</th>
                  <th className="px-6 py-4">Multiplier</th>
                  <th className="px-6 py-4 text-right">Payout Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold">
                {WINNERS.map((winner, i) => (
                  <motion.tr
                    key={winner.rank}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Rank */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {winner.rank <= 3 ? (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center border text-slate-950 font-black text-sm"
                            style={{ 
                              backgroundColor: winner.color,
                              borderColor: winner.color,
                              boxShadow: `0 0 12px ${winner.glow}`
                            }}
                          >
                            {winner.rank === 1 ? "👑" : winner.rank}
                          </div>
                        ) : (
                          <span className="w-8 text-center text-indigo-300/50 font-bold">#{winner.rank}</span>
                        )}
                      </div>
                    </td>

                    {/* Player Info */}
                    <td className="px-6 py-5 text-white flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-full p-0.5" 
                        style={{ 
                          background: `linear-gradient(135deg, ${winner.color}, #120b2e)`,
                          boxShadow: `0 0 10px ${winner.glow}`
                        }}
                      >
                        <div className="w-full h-full bg-[#120b2e] rounded-full flex items-center justify-center text-xs font-black text-white">
                          {winner.user.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <span className="group-hover:text-gaming-gold transition-colors font-bold">{winner.user}</span>
                    </td>

                    {/* Game */}
                    <td className="px-6 py-5 text-indigo-200/80 font-medium">{winner.game}</td>

                    {/* Multiplier Badge */}
                    <td className="px-6 py-5">
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border uppercase transition-transform group-hover:scale-105"
                        style={{ 
                          color: winner.color,
                          borderColor: `${winner.color}40`,
                          backgroundColor: `${winner.color}10`,
                          boxShadow: `0 0 10px ${winner.color}15`
                        }}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        {winner.multiplier}
                      </span>
                    </td>

                    {/* Payout */}
                    <td className="px-6 py-5 text-right font-black text-lg text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                      {winner.payout}
                    </td>

                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download CTA */}
          <div className="mt-10 flex justify-center">
            <DownloadButton size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
