"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DownloadButton } from "@/components/DownloadButton";

function AnimatedCounter({ end, prefix = "", suffix = "", duration = 2 }: { end: number, prefix?: string, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export function Stats() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0c0822]/60 border-y border-gaming-gold/15">
      {/* Background glow highlights */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gaming-gold/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-neon-pink/40 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 bg-gaming-purple/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 text-center">
          
          {/* Stat 1 */}
          <div className="relative group p-4 cursor-default">
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-orbitron drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-3 group-hover:text-gaming-gold transition-colors">
              <AnimatedCounter end={150} suffix="M+" />
            </div>
            <div className="text-xs font-black text-gaming-gold uppercase tracking-widest font-sans">Rounds Completed</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gaming-gold/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Stat 2 */}
          <div className="relative group p-4 cursor-default">
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-orbitron drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-3 group-hover:text-neon-pink transition-colors">
              <AnimatedCounter end={45} suffix="K+" />
            </div>
            <div className="text-xs font-black text-neon-pink uppercase tracking-widest font-sans">Daily Active Users</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-neon-pink/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Stat 3 */}
          <div className="relative group p-4 cursor-default">
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-orbitron drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-3 group-hover:text-neon-purple transition-colors">
              <AnimatedCounter end={3500} suffix="/s" />
            </div>
            <div className="text-xs font-black text-neon-purple uppercase tracking-widest font-sans">Draws Handled</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-neon-purple/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Stat 4 */}
          <div className="relative group p-4 cursor-default">
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-orbitron drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-3 group-hover:text-emerald-400 transition-colors">
              <AnimatedCounter end={99} suffix=".99%" />
            </div>
            <div className="text-xs font-black text-emerald-400 uppercase tracking-widest font-sans">Server Uptime</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

        </div>

        {/* Download CTA */}
        <div className="mt-12 flex justify-center">
          <DownloadButton size="lg" />
        </div>
      </div>
    </section>
  );
}
