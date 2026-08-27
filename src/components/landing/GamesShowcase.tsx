"use client";

import { motion } from "framer-motion";
import { Play, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";

const GAMES = [
  {
    id: 1,
    name: "Boommine",
    image: "/boommine.png",
    description: "Navigate the active minefield and scale up your massive multipliers.",
    color: "from-cyan-400 to-blue-500",
    glow: "rgba(0, 243, 255, 0.4)",
    tag: "High Stakes",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
  },
  {
    id: 2,
    name: "Pro Challenge",
    image: "/prospin.png",
    description: "The ultimate royal arena for true premium players.",
    color: "from-purple-400 to-indigo-600",
    glow: "rgba(176, 38, 255, 0.4)",
    tag: "Popular",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
  },
  {
    id: 3,
    name: "Wheel Challenge",
    image: "/spin.png",
    description: "Take on the luxurious lucky gold wheel to win daily jackpots.",
    color: "from-pink-400 to-rose-600",
    glow: "rgba(255, 0, 127, 0.4)",
    tag: "Hot Reward",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30"
  },
  {
    id: 4,
    name: "Toss Toss",
    image: "/toss.png",
    description: "Flip the double-sided gold crest coin and double your fortune.",
    color: "from-emerald-400 to-teal-500",
    glow: "rgba(0, 255, 102, 0.4)",
    tag: "Double Up",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
  },
];

export function GamesShowcase() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Colorful background lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gaming-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gaming-red/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">

        {/* Section Title */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gaming-gold/30 bg-gaming-gold/5 text-gaming-gold text-xs font-bold tracking-widest uppercase">
            <Trophy className="w-4 h-4 text-gaming-gold" />
            <span>4 Exhilarating Arenas</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-white">
            CHOOSE YOUR <span className="neon-text-gold">GAME</span>
          </h2>
          <p className="text-indigo-200/70 max-w-2xl mx-auto text-base md:text-lg">
            Immerse yourself in instant-draw games. Master the mechanics, hit massive multiplier milestones, and cash out instantly.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, type: "spring", bounce: 0.3 }}
              className="group relative"
            >
              {/* Animated hover glow shadow border */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl -z-10"
                style={{
                  background: `linear-gradient(135deg, var(--color-gaming-gold), ${game.glow})`,
                  transform: "scale(0.95)"
                }}
              />

              {/* Game Card Container */}
              <div className="luxury-glass rounded-3xl p-6 h-full flex flex-col items-center text-center relative overflow-hidden border border-white/10 group-hover:border-gaming-gold/50 transition-all duration-500 group-hover:-translate-y-2.5">

                {/* Colored Spotlight Inside Card */}
                <div
                  className="absolute top-0 inset-x-0 h-40 opacity-10 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${game.glow}, transparent 70%)` }}
                />

                {/* Game Tag Badge */}
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${game.badgeColor}`}>
                  {game.tag}
                </span>

                {/* Floating Game Illustration */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                  className="relative w-36 h-36 md:w-44 md:h-44 mb-6 mt-6 z-10"
                >
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:scale-108 transition-transform duration-500"
                  />
                </motion.div>

                {/* Name & Description */}
                <h3 className="text-2xl font-black text-white mb-2 font-orbitron tracking-wide group-hover:text-gaming-gold transition-colors">
                  {game.name}
                </h3>
                <p className="text-sm text-indigo-200/60 mb-6 flex-grow leading-relaxed">
                  {game.description}
                </p>



              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
