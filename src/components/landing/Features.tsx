"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Zap, Wallet, Activity, Star, Award, ShieldCheck, Flame } from "lucide-react";



const PREVIEWS = [
  { src: "/3.png", label: "Instant Payouts", desc: "Withdraw winnings instantly to your account.", color: "#00f3ff", icon: Zap },
  { src: "/1.png", label: "1000x Multipliers", desc: "Watch rewards multiply in real-time, legendary returns.", color: "#ff007f", icon: Activity },
  { src: "/4.png", label: "24/7 Live Draws", desc: "Non-stop gaming floor action, real-time rooms.", color: "#e6003a", icon: Flame },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } }
};

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0c0822]/40">
      {/* Decorative backdrop light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03)_0%,transparent_75%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">

        {/* Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full border border-[#b026ff]/30 bg-[#b026ff]/5 text-[#a78bfa] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>The Platinum Advantage</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">WHY PLAY ON <span className="neon-text-gold">REALSPINPRO?</span></h2>
          <p className="text-indigo-200/60 text-base md:text-lg">The most rewarding, secure, and transparent gaming environment online.</p>
        </div>





        {/* Feature showcases — image + beautifully highlighted feature text */}
        <div className="mt-20 flex flex-col gap-16 lg:gap-24">
          {PREVIEWS.map((p, i) => {
            const Icon = p.icon;
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={p.src}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-14 ${reversed ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Image side */}
                <div className="w-full lg:w-1/2 relative">
                  <div
                    className="absolute -inset-3 rounded-[2rem] blur-2xl opacity-40 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${p.color}, transparent 70%)` }}
                  />
                  <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden luxury-glass border border-white/10 group">
                    <Image
                      src={p.src}
                      alt={p.label}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, ${p.color}40, transparent 55%)` }}
                    />
                  </div>
                </div>

                {/* Text side — highlighted feature */}
                <div className="w-full lg:w-1/2 text-left">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border"
                    style={{
                      color: p.color,
                      borderColor: `${p.color}55`,
                      backgroundColor: `${p.color}12`,
                      boxShadow: `0 0 22px ${p.color}30`
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest">{p.label}</span>
                  </div>

                  <h3
                    className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                    style={{ color: p.color }}
                  >
                    {p.label}
                  </h3>

                  <div
                    className="w-16 h-1 rounded-full mb-5"
                    style={{ background: p.color, boxShadow: `0 0 14px ${p.color}` }}
                  />

                  <p className="text-base md:text-lg text-indigo-200/85 leading-relaxed max-w-md">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
