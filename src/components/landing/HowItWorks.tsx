"use client";

import { motion } from "framer-motion";
import { Target, Trophy, Unlock, Gamepad2 } from "lucide-react";

const STEPS = [
  {
    title: "Choose Your Match",
    desc: "Select from our premium lineup of skill-based challenges like the Wheel Challenge and BoomMine.",
    icon: Gamepad2,
    color: "#00f3ff",
  },
  {
    title: "Master the Challenge",
    desc: "Test your strategy and reflexes. Every round is a new opportunity to achieve a high score.",
    icon: Target,
    color: "#ff007f",
  },
  {
    title: "Unlock Rewards",
    desc: "Score high to unlock exclusive achievements, climb the leaderboard, and claim instant prizes.",
    icon: Unlock,
    color: "#b026ff",
  },
  {
    title: "Claim Victory",
    desc: "Exchange your earned points for real-world rewards with lightning-fast instant payouts.",
    icon: Trophy,
    color: "#ffaa00",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#05030f]">
      {/* Decorative backdrop light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,38,255,0.03)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gaming-purple/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gaming-red/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full border border-gaming-gold/30 bg-gaming-gold/5 text-gaming-gold text-xs font-bold uppercase tracking-wider">
            <Gamepad2 className="w-3.5 h-3.5 text-gaming-gold" />
            <span>Play to Win</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white font-orbitron tracking-tight">
            HOW THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold via-amber-200 to-yellow-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">CHALLENGE</span> WORKS
          </h2>
          <p className="text-indigo-200/60 text-base md:text-lg">
            Master the games, score big, and unlock epic rewards in our premium entertainment arena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-8 rounded-3xl luxury-glass border border-white/5 hover:border-white/20 transition-all duration-300 group"
              >
                {/* Number indicator */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl text-white/50 group-hover:text-white transition-colors bg-[#110d29] border border-white/10 shadow-xl z-20">
                  {index + 1}
                </div>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                  style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}40`, color: step.color }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-black text-white mb-3 tracking-wide">{step.title}</h3>
                <p className="text-indigo-200/70 text-sm leading-relaxed">{step.desc}</p>
                
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${step.color}10, transparent 70%)` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
