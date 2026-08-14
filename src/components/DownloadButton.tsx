"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";

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
  const base =
    variant === "ghost"
      ? "relative overflow-hidden font-bold tracking-wider uppercase text-white bg-white/5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-white/10 hover:scale-[1.03] active:scale-[0.98]"
      : "purple-button";
  return (
    <motion.a
      href={DOWNLOAD_URL}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`${base} inline-flex items-center justify-center gap-2 cursor-pointer ${padding} ${className}`}
    >
      <Download className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </motion.a>
  );
}
