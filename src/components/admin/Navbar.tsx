"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search, ShieldCheck, ChevronRight } from "lucide-react";
import { NAV_GROUPS } from "./Sidebar";

const FLAT_ITEMS = NAV_GROUPS.flatMap((group) => group.items);

function getPageTitle(pathname: string) {
  const item = FLAT_ITEMS.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/")
  );
  return item?.name ?? "Dashboard";
}

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            <ShieldCheck className="h-3 w-3" />
            Admin Panel
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-blue-600">{title}</span>
          </div>
          <h1 className="truncate text-lg font-bold leading-tight text-slate-900">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-52 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 lg:w-64"
          />
        </div>

        {/* Live status */}
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-700">Live</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2 md:pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white shadow-sm">
            AD
          </div>
          <div className="hidden leading-tight xl:block">
            <p className="text-sm font-semibold text-slate-900">Admin</p>
            <p className="text-[11px] text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}