import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | RealSpinPro",
  description:
    "Read RealSpinPro's Terms of Service. Learn about eligibility, account responsibility, fair play policies, and how to use our provably fair gaming platform.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "RealSpinPro",
    "casino rules",
    "fair play",
    "eligibility",
  ],
  alternates: { canonical: "https://realspinpro.com/terms" },
  openGraph: {
    title: "Terms of Service | RealSpinPro",
    description:
      "Read RealSpinPro's Terms of Service. Learn about eligibility, account responsibility, fair play policies, and how to use our provably fair gaming platform.",
    url: "https://realspinpro.com/terms",
    images: ["/logo.png"],
  },
  twitter: {
    title: "Terms of Service | RealSpinPro",
    description:
      "Read RealSpinPro's Terms of Service. Learn about eligibility, account responsibility, fair play policies.",
    images: ["/logo.png"],
  },
};

export default function TermsOfService() {
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
              { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": "https://realspinpro.com/terms" }
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
            "name": "Terms of Service | RealSpinPro",
            "url": "https://realspinpro.com/terms",
            "description": "Read RealSpinPro's Terms of Service. Learn about eligibility, account responsibility, fair play policies, and how to use our provably fair gaming platform."
          }),
        }}
      />
      <div className="glass-panel rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
          Terms of Service
        </h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Welcome to RealSpinPro. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Eligibility</h2>
          <p>
            You must be at least 18 years of age and reside in a jurisdiction where online gaming is legally permitted to use RealSpinPro.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. RealSpinPro is not liable for any losses resulting from unauthorized access to your account.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Fair Play</h2>
          <p>
            Any attempt to manipulate our systems, exploit bugs, or use automated scripts will result in immediate account termination and forfeiture of all balances.
          </p>
          <p className="mt-12 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  );
}
