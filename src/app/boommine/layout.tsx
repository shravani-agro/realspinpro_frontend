import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BoomMine | Minefield Multiplier Game | RealSpinPro",
  description:
    "Play BoomMine at RealSpinPro. Pick gems, avoid mines, and multiply your winnings. Cash out before hitting a bomb for instant payouts. Provably fair.",
  keywords: [
    "BoomMine",
    "mines game",
    "minefield",
    "multiplier game",
    "gaming",
    "provably fair",
    "instant payouts",
  ],
  alternates: { canonical: "https://realspinpro.com/boommine" },
  openGraph: {
    title: "BoomMine | Minefield Multiplier Game | RealSpinPro",
    description:
      "Play BoomMine at RealSpinPro. Pick gems, avoid mines, and multiply your winnings. Cash out before hitting a bomb for instant payouts. Provably fair.",
    url: "https://realspinpro.com/boommine",
    images: ["/boommine.png"],
  },
  twitter: {
    title: "BoomMine | Minefield Multiplier Game | RealSpinPro",
    description:
      "Play BoomMine at RealSpinPro. Pick gems, avoid mines, and multiply your winnings. Cash out before hitting a bomb for instant payouts.",
    images: ["/boommine.png"],
  },
};

export default function BoomMineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Game",
            "name": "BoomMine",
            "url": "https://realspinpro.com/boommine",
            "description": "Pick gems, avoid mines, and multiply your winnings. Cash out before hitting a bomb for instant payouts.",
            "genre": ["Gaming", "Minesweeper", "Gaming"],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://realspinpro.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "BoomMine",
                "item": "https://realspinpro.com/boommine"
              }
            ]
          }),
        }}
      />
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/5 blur-[120px] pointer-events-none" />
      <Toaster position="top-right" theme="dark" richColors />
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
