import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provably Fair | RealSpinPro",
  description:
    "Learn how RealSpinPro ensures provably fair outcomes using cryptographic SHA-256 server seeds, client seeds, and nonce-based verification for every game round.",
  keywords: [
    "provably fair",
    "cryptographic verification",
    "SHA-256",
    "server seed",
    "client seed",
    "fair play",
    "transparent gaming",
    "RealSpinPro",
  ],
  alternates: { canonical: "https://realspinpro.com/provably-fair" },
  openGraph: {
    title: "Provably Fair | RealSpinPro",
    description:
      "Learn how RealSpinPro ensures provably fair outcomes using cryptographic SHA-256 server seeds, client seeds, and nonce-based verification for every game round.",
    url: "https://realspinpro.com/provably-fair",
    images: ["/logo.png"],
  },
  twitter: {
    title: "Provably Fair | RealSpinPro",
    description:
      "Learn how RealSpinPro ensures provably fair outcomes using cryptographic verification for every game round.",
    images: ["/logo.png"],
  },
};

export default function ProvablyFair() {
  return (
    <main className="min-h-screen pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://realspinpro.com/" },
              { "@type": "ListItem", "position": 2, "name": "Provably Fair", "item": "https://realspinpro.com/provably-fair" }
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Provably Fair | RealSpinPro",
            "url": "https://realspinpro.com/provably-fair",
            "description": "Learn how RealSpinPro ensures provably fair outcomes using cryptographic SHA-256 server seeds, client seeds, and nonce-based verification for every game round."
          }),
        }}
      />
      <div className="glass-panel rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
          Provably Fair
        </h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            At RealSpinPro, trust and transparency are fundamental to our platform. We use cryptographic algorithms to ensure that every outcome is 100% random and provably fair.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How It Works</h2>
          <p>
            Before each round starts, our server generates a secret seed and provides you with its cryptographic hash (SHA-256). You can provide your own client seed to add entropy.
          </p>
          <div className="bg-black/50 p-6 rounded-xl border border-white/10 font-mono text-sm mt-4">
            <span className="text-neon-blue">outcome</span> = HMAC_SHA256(server_seed, client_seed + nonce)
          </div>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Verification</h2>
          <p>
            After the round concludes, the server seed is revealed. You can independently verify that the outcome matches the initial hash we provided, proving that the result was not manipulated after your bet was placed.
          </p>
          <p className="mt-12 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  );
}
