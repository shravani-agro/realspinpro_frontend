"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { usePathname, useRouter } from "next/navigation";
import { fetchAdminSettings } from "@/lib/api";

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
        // fetchAdminSettings triggers handleResponse which redirects on 401, 
        // but just in case, we do it here too
        router.replace("/admin/login");
      });
  }, [isLoginPage, router]);

  // If on login page, just render children without sidebar/navbar
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        {children}
      </div>
    );
  }

  if (!isAuthenticated && isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle classes */}
      <div className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
