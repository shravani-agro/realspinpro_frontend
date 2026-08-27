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
    <section ref={root} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full background image (parallax target) */}
      <div
        ref={bg}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: "url('/2.png')" }}
      />
      {/* Overlays: left gradient for text contrast + overall dark tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl text-left">
          {/* Elegant Badge */}
          <div className="hero-badge inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gaming-gold/40 bg-white/5 backdrop-blur-sm text-gaming-gold text-xs md:text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <Sparkles className="w-4 h-4 text-gaming-gold animate-pulse" />
            <span>Premium Anime gaming floor</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.7)]">
            <span className="hero-word inline-block">THE</span>{" "}
            <span className="hero-word inline-block">ROYAL</span>{" "}
            <span className="hero-word neon-text-gold inline-block">GOLD</span>{" "}
            <span className="hero-word neon-text-gold inline-block">WHEEL</span>{" "}
            <span className="hero-word text-2xl sm:text-3xl lg:text-4xl block sm:inline font-medium">CHALLENGE &amp; WIN</span>
          </h1>

          <p className="hero-desc text-sm sm:text-base md:text-lg text-white/90 mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Step into a high-energy, anime-infused gaming wonderland. Experience four custom-crafted games with instant payouts, transparent fair-play, and legendary daily jackpots!
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <DownloadButton size="lg" />
            <DownloadButton size="lg" variant="ghost" label="Get APK Link" />
          </div>

          <p className="hero-cta mt-4 text-xs sm:text-sm text-white/70 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            Join 15,000+ players winning daily — free Android app
          </p>
        </div>
      </div>
    </section>
  );
}
