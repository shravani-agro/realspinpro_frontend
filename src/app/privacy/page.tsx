import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RealSpinPro",
  description:
    "Read RealSpinPro's Privacy Policy to understand how we collect, use, and protect your personal data when you play our provably fair casino games.",
  keywords: [
    "privacy policy",
    "data protection",
    "user data",
    "GDPR",
    "cookies",
    "RealSpinPro privacy",
    "information security",
  ],
  alternates: { canonical: "https://realspinpro.com/privacy" },
  openGraph: {
    title: "Privacy Policy | RealSpinPro",
    description:
      "Read RealSpinPro's Privacy Policy to understand how we collect, use, and protect your personal data when you play our provably fair casino games.",
    url: "https://realspinpro.com/privacy",
    images: ["/logo.png"],
  },
  twitter: {
    title: "Privacy Policy | RealSpinPro",
    description:
      "Read RealSpinPro's Privacy Policy to understand how we collect, use, and protect your personal data.",
    images: ["/logo.png"],
  },
};

export default function PrivacyPolicy() {
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
              { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://realspinpro.com/privacy" }
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
            "name": "Privacy Policy | RealSpinPro",
            "url": "https://realspinpro.com/privacy",
            "description": "Read RealSpinPro's Privacy Policy to understand how we collect, use, and protect your personal data when you play our provably fair casino games."
          }),
        }}
      />
      <div className="glass-panel rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            At RealSpinPro, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform and games.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect minimal information required to provide our services, including account details (username, email) and transaction history. We do not store sensitive payment information directly on our servers.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Data</h2>
          <p>
            Your data is used exclusively to facilitate gameplay, process withdrawals, and ensure the security and integrity of our platform. We never sell your personal information to third parties.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Security</h2>
          <p>
            We implement industry-standard encryption and strict access controls to protect your data from unauthorized access or disclosure.
          </p>
          <p className="mt-12 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  );
}
