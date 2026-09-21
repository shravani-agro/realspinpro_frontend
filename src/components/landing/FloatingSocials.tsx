"use client";

import { MessageCircle, Send, HeadphonesIcon } from "lucide-react";
import Link from "next/link";

export function FloatingSocials() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-2 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-l-2xl shadow-xl">


      <Link
        href="https://t.me/realspinpro"
        target="_blank"
        className="w-10 h-10 rounded-full bg-[#0088cc] hover:bg-[#0077b5] flex items-center justify-center transition-transform hover:-translate-x-1 shadow-[0_0_10px_rgba(0,136,204,0.3)]"
        aria-label="Telegram Community"
      >
        <Send className="w-4 h-4 text-white -ml-0.5" />
      </Link>

    </div>
  );
}
