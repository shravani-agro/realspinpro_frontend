"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Star } from "lucide-react";
import Image from "next/image";
import { DownloadButton } from "@/components/DownloadButton";

export function StickyBottomBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-2 sm:bottom-6 left-0 right-0 z-[100] px-2 sm:px-4 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto bg-[#0a0a0a]/95 backdrop-blur-xl border border-gaming-gold/40 rounded-2xl py-3 px-4 sm:py-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-auto shadow-gaming-gold/10">
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto mb-3 sm:mb-0">
              <div className="bg-gaming-gold/10 p-2 sm:p-2.5 rounded-2xl hidden sm:block">
                <Image
                  src="/homelogo.png"
                  alt="App Icon"
                  width={56}
                  height={56}
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-white font-bold text-base sm:text-xl leading-tight tracking-wide">RealSpinPro Official App</h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2 mt-1.5">
                  <div className="flex items-center text-gaming-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white/70 text-[10px] sm:text-xs font-semibold ml-1 px-2.5 py-0.5 bg-white/10 rounded-full">
                    Millions of downloads
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1.5 sm:gap-2">
              <a
                href="/store"
                className="transition-transform hover:scale-105 active:scale-95 drop-shadow-[0_4px_15px_rgba(255,255,255,0.15)] inline-flex items-center justify-center"
              >
                <Image src="/playstore.svg" alt="Get it on Google Play" width={300} height={100} className="w-[160px] sm:w-[220px] h-auto object-contain" />
              </a>
              <p className="text-[10px] sm:text-[11px] font-bold text-amber-400 flex items-center gap-1.5 drop-shadow-md text-center sm:text-right">
                🔥 Get 5% Bonus on every Add Cash up to ₹100,000
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
