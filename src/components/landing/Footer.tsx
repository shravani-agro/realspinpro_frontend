"use client";

import Link from "next/link";
import { DownloadButton } from "@/components/DownloadButton";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#0c0822] to-[#05030f] pt-24 pb-12 overflow-hidden border-t border-gaming-gold/20">
      {/* Decorative Grid Overlay with Masking */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
          <div className="max-w-md">
            <h2 className="text-4xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gaming-gold via-amber-200 to-yellow-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.35)] font-orbitron">
              RealSpinPro
            </h2>
            <p className="text-indigo-200/60 leading-relaxed text-sm">
              The ultimate next-generation anime gaming and entertainment platform. Provably fair algorithms, instant lightning-fast withdrawals, and ultra-secure player vaults.
            </p>
          </div>

          {/* Age and Responsible Gaming Badges */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gaming-gold/30 bg-gaming-gold/5 text-gaming-gold text-xs font-black uppercase tracking-wider">
              🔞 18+ Entertainment &amp; Gaming
            </div>
            <div className="text-[11px] text-indigo-300/50 uppercase tracking-widest font-bold font-orbitron">Secure SSL Encrypted Play</div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="mt-12 mb-12 flex justify-center">
          <DownloadButton size="lg" />
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-indigo-300/50">
          <p>© 2026 RealSpinPro Inc. All rights reserved. Play responsibly.</p>
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center font-bold">
            <Link href="/privacy" className="hover:text-gaming-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gaming-gold transition-colors">Terms of Service</Link>
            <Link href="/provably-fair" className="hover:text-gaming-gold transition-colors">Provably Fair Specs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
