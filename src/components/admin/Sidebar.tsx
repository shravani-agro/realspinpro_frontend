"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlayCircle,
  Settings,
  Coins,
  Wallet,
  Users,
  ArrowRightLeft,
  BarChart3,
  Bell,
  LogOut,
  Hexagon,
  X,
  ClipboardList,
  Database,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Menu",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Live & Games",
    items: [
      { name: "Live Spinwheel", href: "/admin/games/spinwheel/live", icon: PlayCircle },
      { name: "Game Controls", href: "/admin/games", icon: Settings },
      { name: "Global Bets", href: "/admin/bets", icon: Coins },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "User Wallets", href: "/admin/wallet", icon: Wallet },
      { name: "User Management", href: "/admin/users", icon: Users },
      { name: "Transactions", href: "/admin/transactions", icon: ArrowRightLeft },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Support Chat", href: "/admin/support", icon: MessageSquare },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Database", href: "/admin/database", icon: Database },
      { name: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
      { name: "System Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-screen w-64 flex-col bg-white border-r border-slate-200">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
        <Link href="/admin" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/30 transition-shadow group-hover:shadow-blue-500/50">
            <Hexagon className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-[15px] font-black tracking-wide text-slate-900">
              Real<span className="text-blue-600">SpinPro</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Admin Panel
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 -mr-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="scrollbar-hide flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group/item relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                    )}
                    <item.icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 transition-colors group-hover/item:text-slate-600"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-blue-500" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-black text-white shadow-sm">
            AD
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-slate-900">Admin</p>
            <p className="truncate text-[11px] text-slate-500">Super Admin</p>
          </div>
          <button
            onClick={async () => {
              try {
                await fetch("/api-proxy/admin/logout", { method: "POST" });
              } catch {
                /* ignore */
              }
              router.push("/admin/login");
            }}
            title="Logout"
            className="p-2 rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}