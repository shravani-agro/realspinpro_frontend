"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";

export function PromoBanner() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Ultra-wide background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/5.png"
          alt="RealSpinPro players winning big — download and play"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, type: "spring" }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-casino-gold/40 bg-white/5 backdrop-blur-sm text-casino-gold text-xs md:text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-casino-gold animate-pulse" />
            <span>Your Winning Streak Starts Now</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.7)]">
            SPIN SMART. <span className="neon-text-gold">WIN BIG.</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Join thousands of players already cashing out daily. Download the RealSpinPro app and claim your welcome bonus in seconds.
          </p>

          <DownloadButton size="lg" />
        </motion.div>
      </div>
    </section>
  );
}
