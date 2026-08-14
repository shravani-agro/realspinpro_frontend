import type { Metadata } from "next";
import { SceneWrapper } from "@/components/canvas/SceneWrapper";
import { Hero } from "@/components/landing/Hero";
import { GamesShowcase } from "@/components/landing/GamesShowcase";
import { Features } from "@/components/landing/Features";
import { TopWinners } from "@/components/landing/TopWinners";
import { Timeline } from "@/components/landing/Timeline";
import { Testimonials } from "@/components/landing/Testimonials";
import { Stats } from "@/components/landing/Stats";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Premium Spin & Win | RealSpinPro",
  description:
    "Play 4 premium casino games at RealSpinPro — Spin Wheel, BoomMine, Pro Spin & Toss Toss. Daily jackpots, instant payouts, provably fair, 18+ only.",
  keywords: [
    "spin wheel",
    "BoomMine",
    "mines game",
    "Pro Spin",
    "Toss Toss",
    "casino games",
    "provably fair",
    "instant payouts",
    "daily jackpots",
    "android apk",
  ],
  alternates: { canonical: "https://realspinpro.com/" },
  openGraph: {
    title: "Premium Spin & Win | RealSpinPro",
    description:
      "Play 4 premium casino games at RealSpinPro — Spin Wheel, BoomMine, Pro Spin & Toss Toss. Daily jackpots, instant payouts, provably fair, 18+ only.",
    url: "https://realspinpro.com/",
    images: ["/logo.png"],
  },
  twitter: {
    title: "Premium Spin & Win | RealSpinPro",
    description:
      "Play 4 premium casino games at RealSpinPro — Spin Wheel, BoomMine, Pro Spin & Toss Toss. Daily jackpots, instant payouts, provably fair, 18+ only.",
    images: ["/logo.png"],
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "RealSpinPro",
            "url": "https://realspinpro.com",
            "description": "Premium spin & win gaming platform with 4 casino games, provably fair algorithms, and instant payouts.",
            "keywords": "spin wheel, casino, mines game, provably fair, real money games, instant payouts",
            "publisher": {
              "@type": "Organization",
              "name": "RealSpinPro",
              "url": "https://realspinpro.com"
            },
            "inLanguage": "en-US",
            "copyrightYear": new Date().getFullYear().toString(),
            "contentRating": "Adults Only 18+"
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Game",
            "name": "RealSpinPro - Premium Casino Games",
            "url": "https://realspinpro.com",
            "description": "Play 4 premium games: Spin Wheel, BoomMine, Pro Spin, and Toss Toss with provably fair algorithms and instant payouts.",
            "genre": ["Casino", "Gambling", "Minesweeper"],
            "gameItem": ["Spin Wheel", "BoomMine", "Pro Spin", "Toss Toss"],
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
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is RealSpinPro?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "RealSpinPro is a premium online gaming platform offering 4 casino games — Spin Wheel, BoomMine, Pro Spin, and Toss Toss — with provably fair algorithms and instant payouts."
                }
              },
              {
                "@type": "Question",
                "name": "Is RealSpinPro free to play?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can download the RealSpinPro Android APK for free and start playing immediately with daily free rewards and bonuses."
                }
              },
              {
                "@type": "Question",
                "name": "Are games provably fair?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all RealSpinPro games use cryptographic SHA-256 server seeds and client seeds to ensure provably fair, verifiable results."
                }
              },
              {
                "@type": "Question",
                "name": "How do I withdraw winnings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Winnings are credited to your RealSpinPro account instantly. Withdrawals are processed via secure payment methods with instant payouts."
                }
              },
              {
                "@type": "Question",
                "name": "What is the minimum age to play?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Players must be 18 years or older to register and play on RealSpinPro. Responsible gambling practices are enforced."
                }
              }
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            "name": "RealSpinPro",
            "operatingSystem": "Android",
            "applicationCategory": "Game",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "downloadUrl": "https://github.com/shravani-agro/realspinpro_frontend/releases/latest/download/realspinpro.apk"
          }),
        }}
      />
      <SceneWrapper />
      <Hero />
      <GamesShowcase />
      <Reveal variant="up">
        <Features />
      </Reveal>
      <Reveal variant="up">
        <TopWinners />
      </Reveal>
      <Reveal variant="left">
        <Timeline />
      </Reveal>
      <Reveal variant="scale">
        <Stats />
      </Reveal>
      <Reveal variant="up">
        <PromoBanner />
      </Reveal>
      <Reveal variant="up" stagger>
        <Testimonials />
      </Reveal>
      <Reveal variant="fade">
        <Footer />
      </Reveal>
    </main>
  );
}
