"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { usePathname, useRouter } from "next/navigation";
import { fetchAdminSettings } from "@/lib/api";

const GRID_BG =
  "bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    if (isLoginPage) {
      setIsVerifying(false);
      return;
    }

    // Verify session with the backend using HttpOnly cookie
    fetchAdminSettings()
      .then(() => {
        setIsAuthenticated(true);
        setIsVerifying(false);
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [isLoginPage, router]);

  // If on login page, just render children without sidebar/navbar
  if (isLoginPage) {
    return (
      <div
        className="relative min-h-screen w-full bg-white font-sans text-slate-900 [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans"
        style={{ minHeight: "100dvh" }}
      >
        <div className={`fixed inset-0 pointer-events-none ${GRID_BG}`} />
        {children}
      </div>
    );
  }

  if (!isAuthenticated && isVerifying) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-50 font-sans text-slate-900"
        style={{ minHeight: "100dvh" }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl" />
          <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen bg-slate-50 font-sans text-slate-900 [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans"
      style={{ minHeight: "100dvh" }}
    >
      {/* Background Grid */}
      <div className={`fixed inset-0 pointer-events-none ${GRID_BG}`} />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle classes */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}