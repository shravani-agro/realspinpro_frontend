"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";

const REVIEWS = [
  { name: "Rahul K.", text: "The app is super fast. Zero delay on my games and results are instant.", role: "Top Player", color: "neon-blue" },
  { name: "Vikram S.", text: "Best UI I've seen in gaming. Withdrawals are processed immediately to my bank.", role: "Pro Player", color: "neon-purple" },
  { name: "Pooja M.", text: "100% trusted platform. Tested the withdrawal myself and it was flawless.", role: "Daily Player", color: "neon-emerald" }
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0c0822]/30">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gaming-purple/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gaming-red/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gaming-gold/30 bg-gaming-gold/5 text-gaming-gold text-xs font-bold uppercase tracking-wider">
            ★ VERIFIED REVIEWS ★
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 mt-3 text-white">
            VIP PLAYER <span className="neon-text-gold">FEEDBACK</span>
          </h2>
            <p className="text-indigo-200/60 max-w-lg mx-auto text-base">Here is what our VIP Top Players are saying about the platform speed, interface, and fairness.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="gold-border rounded-3xl p-8 relative group hover:scale-[1.03] transition-transform duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.4)]"
            >
              {/* Gold Stars */}
              <div className="flex gap-1 mb-4 text-gaming-gold">
                {[...Array(5)].map((_, idx) => (
                  <span key={idx} className="text-sm">★</span>
                ))}
              </div>

              <Quote className="absolute top-8 right-8 w-10 h-10 text-white/5 group-hover:text-gaming-gold/15 transition-colors" />
              <p className="text-indigo-200/80 italic mb-8 relative z-10 leading-relaxed text-sm">
                &ldquo;{r.text}&rdquo;
              </p>
              
              <div className="flex items-center gap-4 mt-auto relative z-10">
                {/* Glowing Avatar border */}
                <div 
                  className="w-12 h-12 rounded-full p-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${r.color === 'neon-blue' ? '#00f3ff' : r.color === 'neon-purple' ? '#b026ff' : '#00ff66'}, #120b2e)`,
                    boxShadow: `0 0 10px ${r.color === 'neon-blue' ? 'rgba(0,243,255,0.3)' : r.color === 'neon-purple' ? 'rgba(176,38,255,0.3)' : 'rgba(0,255,102,0.3)'}`
                  }}
                >
                  <div className="w-full h-full bg-[#120b2e] rounded-full flex items-center justify-center text-xs font-black text-white">
                    {r.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-white group-hover:text-gaming-gold transition-colors font-orbitron text-sm tracking-wide">{r.name}</h4>
                  <p className="text-[11px] font-black uppercase tracking-wider text-indigo-400">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Download CTA */}
        <div className="mt-12 flex justify-center">
          <DownloadButton size="lg" />
        </div>
      </div>
    </section>
  );
}
