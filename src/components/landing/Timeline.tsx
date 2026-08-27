"use client";

import { motion } from "framer-motion";
import { UserPlus, Coins, Gamepad2 } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    desc: "Sign up in seconds and claim your massive welcome bonus to kickstart your winning streak.",
    color: "neon-blue"
  },
  {
    icon: Coins,
    title: "Enter the Arena",
    desc: "Choose from our adrenaline-pumping live games and start playing to watch the multipliers climb.",
    color: "neon-purple"
  },
  {
    icon: Gamepad2,
    title: "Cash Out Instantly",
    desc: "Hit your target multiplier and cash out your winnings directly to your wallet with zero delays.",
    color: "neon-emerald"
  }
];

export function Timeline() {
  return (
    <section className="py-24 relative bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center mb-20">
          <p className="text-neon-purple font-semibold tracking-widest uppercase mb-2">HOW TO PLAY</p>
          <h2 className="text-4xl md:text-5xl font-black">START WINNING IN 3 STEPS</h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />
          <motion.div 
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-blue via-neon-purple to-neon-emerald -translate-x-1/2" 
          />

          {STEPS.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.3 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full glass border-2 bg-black z-10 -translate-x-1/2 flex items-center justify-center shadow-[0_0_15px_currentColor]" style={{ color: `var(--color-${step.color})` } as any}>
                <step.icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="ml-20 md:ml-0 md:w-[45%] p-6 rounded-2xl glass-panel group hover:scale-[1.02] transition-transform">
                <div className={`text-${step.color} font-mono text-sm mb-2 opacity-80`}>STEP 0{i + 1}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
