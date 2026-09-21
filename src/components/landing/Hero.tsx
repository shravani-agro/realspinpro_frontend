"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", { opacity: 0, y: 20, scale: 0.8, duration: 0.7, delay: 0.2 })
        .from(
          ".hero-word",
          { opacity: 0, y: 40, filter: "blur(8px)", duration: 0.8, stagger: 0.12 },
          "-=0.3"
        )
        .from(".hero-desc", { opacity: 0, y: 24, duration: 0.8 }, "-=0.4")
        .from(".hero-cta", { opacity: 0, y: 24, scale: 0.95, duration: 0.7 }, "-=0.4");

      // Subtle background parallax on scroll
      gsap.to(bg.current, {
        yPercent: 18,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">

      {/* ================= DESKTOP VIEW (Hidden on Mobile) ================= */}
      <div className="hidden md:flex absolute inset-0 w-full h-full">
        {/* Full background image (parallax target) */}
        <div
          ref={bg}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ backgroundImage: "url('/2.png')" }}
        />
        {/* Overlays: left gradient for text contrast + overall dark tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center h-full">
          <div className="max-w-xl text-left">
            {/* Elegant Badge */}
            <div className="hero-badge inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gaming-gold/40 bg-white/5 backdrop-blur-sm text-gaming-gold text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.15)]">
              <Sparkles className="w-4 h-4 text-gaming-gold animate-pulse" />
              <span>Premium Anime gaming floor</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.7)]">
              <span className="hero-word inline-block">THE</span>{" "}
              <span className="hero-word inline-block">ROYAL</span>{" "}
              <span className="hero-word neon-text-gold inline-block">GOLD</span>{" "}
              <span className="hero-word neon-text-gold inline-block">WHEEL</span>{" "}
              <span className="hero-word text-3xl lg:text-4xl block mt-2 font-medium">CHALLENGE &amp; WIN</span>
            </h1>

            <p className="hero-desc text-lg text-white/90 mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Step into a high-energy, anime-infused gaming wonderland. Experience four custom-crafted games with instant payouts, transparent fair-play, and legendary daily jackpots!
            </p>

            <div className="hero-cta flex items-center gap-4">
              <DownloadButton size="lg" />
              <DownloadButton size="lg" variant="ghost" label="Get APK Link" />
            </div>

            <p className="hero-cta mt-4 text-sm font-bold text-amber-400 flex items-center gap-1.5 drop-shadow-md">
              🔥 Get 5% Bonus on every Add Cash up to ₹100,000
            </p>

            <p className="hero-cta mt-2 text-xs text-white/60 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Join 15,000+ players winning daily — free Android app
            </p>
          </div>
        </div>
      </div>

      {/* ================= MOBILE VIEW (Hidden on Desktop) ================= */}
      <div className="md:hidden flex flex-col items-center justify-center w-full min-h-[100dvh] bg-[#0c0822] px-5 py-8 pt-16 text-center relative z-10 overflow-hidden">

        {/* Subtle glowing orb behind the main image */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-gaming-gold/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="hero-badge w-full flex flex-col items-center justify-center gap-4 mb-6 relative z-10">
          <img src="/homelogo.png" alt="RealSpinPro" className="w-[70%] max-w-[220px] h-auto object-contain drop-shadow-[0_10px_35px_rgba(255,215,0,0.3)]" />
          <img src="/spin_wheel.png" alt="Spin Wheel Game" className="w-[90%] max-w-[300px] h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)]" />
        </div>

        <h1 className="hero-word text-[28px] font-extrabold text-white leading-[1.2] mb-3 drop-shadow-lg tracking-tight relative z-10">
          RealSpinPro Casino<br />
          Win Upto ₹5 Crores Daily
        </h1>

        <p className="hero-desc text-[13px] text-white/90 mb-6 font-medium max-w-sm px-2 relative z-10">
          Step into a high-energy, anime-infused gaming wonderland. Experience four custom-crafted games with instant payouts, transparent fair-play, and legendary daily jackpots!
        </p>

        <div className="hero-cta w-full flex flex-col items-center gap-3">
          <a
            href="/store"
            className="transition-transform hover:scale-105 active:scale-95 drop-shadow-[0_4px_15px_rgba(255,255,255,0.15)] inline-flex items-center justify-center mb-1"
          >
            <img src="/playstore.svg" alt="Get it on Google Play" className="w-[200px] h-auto object-contain" />
          </a>
          <p className="text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1.5 drop-shadow-md">
            🔥 Get 5% Bonus on every Add Cash up to ₹100,000
          </p>
        </div>
      </div>

    </section>
  );
}
