"use client";

import { ShieldCheck, Star, Users, Zap, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function TrustMetrics() {
  return (
    <section className="relative py-20 bg-[#0c0822] overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Withdrawal Section */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-indigo-200/60 uppercase tracking-widest mb-6">Withdraw winnings directly to your</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16">
            <div className="flex flex-col items-center">
              <Image src="/imps.svg" alt="IMPS" width={100} height={40} className="h-10 w-auto object-contain mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
              <span className="text-xs text-indigo-300/70 font-medium">Bank Transfer</span>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <Image src="/upi.svg" alt="UPI" width={100} height={40} className="h-10 w-auto object-contain mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
              <span className="text-xs text-indigo-300/70 font-medium">UPI Transfer</span>
            </div>
          </div>
        </div>

        {/* Truly Best India Game Platform */}
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6">Truly Best India Game Platform</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/30 border border-indigo-500/30 rounded-xl text-indigo-300 font-semibold text-sm shadow-sm">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            World Class Security
          </div>
        </div>

        {/* Reviews and Ratings Card */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 p-6 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Trusted by 1 Crore players</h2>
            <p className="text-indigo-200/60 mt-2 text-sm">Made with ❤️ In India, for India!</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-10 items-center justify-center">
            {/* Rating Box */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 w-full md:w-1/2 flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-indigo-300/70 font-semibold mb-1">Ratings</p>
                <div className="text-4xl font-black text-white">4.6</div>
                <div className="flex items-center justify-center text-[#1ec75f] my-2">
                  {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <Star className="w-4 h-4 fill-current opacity-50" />
                </div>
                <div className="text-[10px] text-indigo-300/50">out of 12,878</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {/* Progress bars */}
                <div className="flex items-center gap-2"><span className="text-xs text-indigo-300/70 font-medium w-3">5</span><div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#1ec75f] w-[85%] rounded-full"></div></div></div>
                <div className="flex items-center gap-2"><span className="text-xs text-indigo-300/70 font-medium w-3">4</span><div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#8de19b] w-[45%] rounded-full"></div></div></div>
                <div className="flex items-center gap-2"><span className="text-xs text-indigo-300/70 font-medium w-3">3</span><div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#fbcc33] w-[25%] rounded-full"></div></div></div>
                <div className="flex items-center gap-2"><span className="text-xs text-indigo-300/70 font-medium w-3">2</span><div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#f68f3a] w-[10%] rounded-full"></div></div></div>
                <div className="flex items-center gap-2"><span className="text-xs text-indigo-300/70 font-medium w-3">1</span><div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#ee6857] w-[5%] rounded-full"></div></div></div>
              </div>
            </div>

            {/* Review Box */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 w-full md:w-1/2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">
                    SG
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Slots Gamer</h4>
                    <p className="text-gaming-gold text-xs font-semibold italic">Won ₹2 Crore+</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-gaming-gold text-black px-2 py-1 rounded text-xs font-bold shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                  <Star className="w-3 h-3 fill-current" /> 4.5
                </div>
              </div>
              <p className="text-sm text-indigo-100/80 leading-relaxed">
                RealSpinPro is the best online earning app. I am a big Wheel Game Fan and I love playing Real Cash Games on RealSpinPro. I also play other skilled games and earn cash amount online daily.
              </p>
            </div>
          </div>
          
          {/* SEO Text / About */}
          <div className="border-t border-white/10 pt-8 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center sm:justify-start gap-2">
              Read More About RealSpinPro App <Zap className="w-5 h-5 text-gaming-gold fill-current" />
            </h3>
            <p className="text-indigo-200/70 text-sm leading-relaxed mb-6 max-w-3xl">
              RealSpinPro App is a skill-based platform where you make money while you play. This app takes your passion for games one step ahead and engages you in an enthralling real cash games experience on your mobile screen.
            </p>
            
            <div className="flex items-center justify-center sm:justify-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 w-fit mx-auto sm:mx-0">
               <div className="w-14 h-14 bg-gradient-to-br from-gaming-gold to-yellow-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                 <ShieldCheck className="w-8 h-8 text-black" />
               </div>
               <div>
                 <h4 className="font-bold text-white text-sm">Real Cash Gaming</h4>
                 <p className="text-xs text-indigo-300/70 mt-0.5">Bringing the best experience</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
