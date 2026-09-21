"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const DOWNLOAD_URL =
  "https://github.com/shravani-agro/realspinpro_frontend/releases/latest/download/realspinpro.apk";

type Props = {
  className?: string;
  size?: "md" | "lg";
  label?: string;
  variant?: "solid" | "ghost";
};

export function DownloadButton({
  className = "",
  size = "md",
  label = "Download Android App",
  variant = "solid",
}: Props) {
  const padding = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  if (variant === "ghost") {
    return (
      <motion.a
        href={DOWNLOAD_URL}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={`relative overflow-hidden font-bold tracking-wider uppercase text-white bg-white/5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer ${padding} ${className}`}
      >
        <span>{label}</span>
      </motion.a>
    );
  }

  // Primary (solid) uses the SVG Play Store Badge
  return (
    <motion.a
      href={DOWNLOAD_URL}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center justify-center cursor-pointer drop-shadow-[0_4px_15px_rgba(255,255,255,0.15)] ${className}`}
    >
      <Image src="/playstore.svg" alt="Get it on Google Play" width={400} height={120} className="w-[180px] sm:w-[240px] h-auto object-contain" />
    </motion.a>
  );
}
