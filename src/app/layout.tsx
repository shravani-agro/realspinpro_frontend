import type { Metadata, Viewport } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/lenis-provider";
import { Cursor } from "@/components/Cursor";
import { FetchTimeoutGuard } from "@/components/FetchTimeoutGuard";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RealSpinPro | Premium Spin & Win Experience",
    template: "%s | RealSpinPro",
  },
  description:
    "Join the ultimate spin wheel experience. Spin daily, unlock massive rewards, and climb the leaderboard. Play BoomMine, Pro Spin, Spin Wheel, and Toss Toss with provably fair algorithms.",
  keywords: [
    "spin wheel",
    "casino",
    "online gambling",
    "real money games",
    "provably fair",
    "BoomMine",
    "mines game",
    "crypto gambling",
    "instant payouts",
    "daily jackpots",
    "android casino",
    "free apk",
    "win real money",
    "gaming",
    "betting",
    "spin to win",
    "crypto gaming",
    "mobile casino",
  ],
  authors: [{ name: "RealSpinPro" }],
  creator: "RealSpinPro",
  publisher: "RealSpinPro Inc.",
  metadataBase: new URL("https://realspinpro.com"),
  alternates: {
    canonical: "https://realspinpro.com",
  },
  openGraph: {
    type: "website",
    locale: "en-US",
    url: "https://realspinpro.com",
    siteName: "RealSpinPro",
    title: "RealSpinPro | Premium Spin & Win Experience",
    description:
      "Join the ultimate spin wheel experience. Spin daily, unlock massive rewards, and climb the leaderboard.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "RealSpinPro - Premium Spin & Win Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RealSpinPro | Premium Spin & Win Experience",
    description:
      "Join the ultimate spin wheel experience. Spin daily, unlock massive rewards, and climb the leaderboard.",
    images: ["/logo.png"],
    creator: "@realspinpro",
    site: "@realspinpro",
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/favicon_io/apple-touch-icon.png',
    shortcut: '/favicon_io/favicon.ico',
  },
  manifest: '/favicon_io/site.webmanifest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "games",
  referrer: "strict-origin-when-cross-origin",
  other: {
    rating: "RTA-5+",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${orbitron.variable} ${inter.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18397257443"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18397257443');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RealSpinPro",
              "url": "https://realspinpro.com",
              "logo": "https://realspinpro.com/logo.png",
              "sameAs": [
                "https://twitter.com/realspinpro",
                "https://t.me/realspinpro",
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "availableLanguage": ["English"],
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground antialiased selection:bg-neon-purple selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <LenisProvider>
            <FetchTimeoutGuard />
            <Cursor />
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
