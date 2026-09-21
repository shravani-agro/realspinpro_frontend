"use client";

import Link from "next/link";
import Image from "next/image";
import { DownloadButton } from "@/components/DownloadButton";
import { ArrowUp, ShieldCheck, Zap, Users, Shield } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0c0822] pt-20 pb-8 overflow-hidden text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Download CTA & Logo */}
        <div className="flex flex-col items-center mb-16 text-center border-b border-white/5 pb-16">
          <Image src="/homelogo.png" alt="RealSpinPro" width={180} height={60} className="w-auto h-16 mb-8 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] object-contain" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Play India's Fastest Growing Game</h2>
          <DownloadButton size="lg" className="w-full sm:w-auto" />
          <p className="mt-4 text-xs font-bold text-amber-400 drop-shadow-md">
            🔥 Get 5% Bonus on every Add Cash up to ₹100,000
          </p>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-indigo-200">
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-gaming-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-gaming-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Games</h3>
            <ul className="space-y-3">
              <li><Link href="/games/wheel" className="hover:text-gaming-gold transition-colors">Wheel Challenge</Link></li>
              <li><Link href="/games/boommine" className="hover:text-gaming-gold transition-colors">Boom Mine</Link></li>
              <li><Link href="/games/tosstoss" className="hover:text-gaming-gold transition-colors">Toss Toss</Link></li>
              <li><Link href="/provably-fair" className="hover:text-gaming-gold transition-colors">Provably Fair</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="hover:text-gaming-gold transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-gaming-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/responsible-gaming" className="hover:text-gaming-gold transition-colors">Responsible Gaming</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Help</h3>
            <ul className="space-y-3">
              <li><Link href="/support" className="hover:text-gaming-gold transition-colors">24/7 Online Customer Service</Link></li>
              <li><a href="mailto:support@realspinpro.com" className="hover:text-gaming-gold transition-colors">Email Support</a></li>
            </ul>
          </div>
        </div>

        {/* Secured Payments Section */}
        <div className="mb-12">
          <h3 className="text-white font-bold mb-4">Secured payments by</h3>
          <div className="flex flex-wrap gap-3 items-center">
            {['UPI', 'PayTM', 'VISA', 'Mastercard', 'RuPay', 'NetBanking'].map((method) => (
              <div key={method} className="bg-white px-3 py-1.5 rounded text-[10px] font-black text-[#0c0822] uppercase border border-slate-300">
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="border border-white/10 rounded-xl p-4 flex items-center gap-3 bg-white/5">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-white font-bold text-sm">100% Secure</div>
              <div className="text-indigo-300/70 text-xs">Fair Play Policy</div>
            </div>
          </div>
          <div className="border border-white/10 rounded-xl p-4 flex items-center gap-3 bg-white/5">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-white font-bold text-sm">ISO Certified</div>
              <div className="text-indigo-300/70 text-xs">Company</div>
            </div>
          </div>
          <div className="border border-white/10 rounded-xl p-4 flex items-center gap-3 bg-white/5">
            <Zap className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-white font-bold text-sm">Instant</div>
              <div className="text-indigo-300/70 text-xs">Withdrawal</div>
            </div>
          </div>
          <div className="border border-white/10 rounded-xl p-4 flex items-center gap-3 bg-white/5">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-white font-bold text-sm">1 Crore +</div>
              <div className="text-indigo-300/70 text-xs">Trusted Users</div>
            </div>
          </div>
        </div>

        {/* Bottom Text & SEO */}
        <div className="border-t border-white/5 pt-8 text-xs text-indigo-300/50 leading-relaxed text-center md:text-left relative">
          <p className="mb-4 max-w-4xl">
            Launched in 2026, RealSpinPro is the fast-growing online gaming app in India. RealSpinPro has made its way to the hearts of millions of players around India. Join now for exciting cash games, huge tournaments, and show your skills on RealSpinPro now.
          </p>
          <p>© 2026 RealSpinPro Inc. All rights reserved. Play responsibly. 🔞 18+</p>
          
          {/* Back to top button */}
          <button 
            onClick={scrollToTop}
            className="absolute right-0 bottom-4 w-12 h-12 bg-white text-[#0c0822] rounded-full flex items-center justify-center shadow-lg hover:bg-slate-200 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </footer>
  );
}
