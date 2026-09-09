"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, PlayCircle, Coins, Wallet, Users, 
  ArrowRightLeft, BarChart3, Bell, Settings,
  LogOut, Hexagon, X, ClipboardList, Database,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Live Spinwheel", href: "/admin/games/spinwheel/live", icon: PlayCircle },
  { name: "Game Controls", href: "/admin/games", icon: Settings },
  { name: "Global Bets", href: "/admin/bets", icon: Coins },
  { name: "User Wallets", href: "/admin/wallet", icon: Wallet },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowRightLeft },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Support Chat", href: "/admin/support", icon: MessageSquare },
  { name: "Database", href: "/admin/database", icon: Database },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-blue-600 group-hover:text-blue-800 transition-colors" />
          <span className="font-black text-xl tracking-widest text-slate-900">CMD<span className="text-blue-600">CTR</span></span>
        </Link>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="md:hidden p-2 -mr-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-semibold" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 shrink-0">
        <button 
          onClick={async () => {
            try {
              // Call the backend logout to clear the HttpOnly cookie
              await fetch('/api-proxy/admin/logout', { method: 'POST' });
            } catch (e) {}
            router.push("/admin/login");
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
