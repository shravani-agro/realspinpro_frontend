import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | RealSpinPro",
  description: "Secure admin portal authentication for RealSpinPro administrators.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: { canonical: "https://realspinpro.com/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
