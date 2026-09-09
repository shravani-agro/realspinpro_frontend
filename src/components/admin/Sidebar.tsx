"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, PlayCircle, Coins, Wallet, Users, 
  ArrowRightLeft, BarChart3, Bell, ShieldAlert, Settings,
  LogOut, Hexagon, X, ClipboardList, Database, Bomb,
  ChevronDown, ChevronRight, MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    label: "Games",
    items: [
      {
        name: "Spinwheel",
        icon: PlayCircle,
        children: [
          { name: "Live Rounds", href: "/admin/games/spinwheel/live" },
          { name: "Spin Bets", href: "/admin/games/spinwheel/bets" },
          { name: "Stats", href: "/admin/games/spinwheel/stats" },
        ]
      },
      {
        name: "BoomMine",
        icon: Bomb,
        children: [
          { name: "Live Rounds", href: "/admin/games/boommine/live" },
          { name: "Mine Bets", href: "/admin/games/boommine/bets" },
          { name: "Stats", href: "/admin/games/boommine/stats" },
        ]
      },
      {
        name: "Toss Toss",
        icon: Coins,
        children: [
          { name: "Live Rounds", href: "/admin/games/tosstoss/live" },
          { name: "Toss Bets", href: "/admin/games/tosstoss/bets" },
          { name: "Stats", href: "/admin/games/tosstoss/stats" },
        ]
      },
    ]
  },
  {
    label: "Management",
    items: [
      { name: "Global Bets", href: "/admin/bets", icon: Coins },
      { name: "Wallets", href: "/admin/wallet", icon: Wallet },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Transactions", href: "/admin/transactions", icon: ArrowRightLeft },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Support Chat", href: "/admin/support", icon: MessageSquare },
    ]
  },
  {
    label: "System",
    items: [
      { name: "Database", href: "/admin/database", icon: Database },
      { name: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "Spinwheel": false,
    "BoomMine": false,
    "Toss Toss": false
  });

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-64 flex flex-col bg-black/80 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-neon-blue group-hover:text-neon-purple transition-colors drop-shadow-[0_0_8px_var(--color-neon-blue)]" />
          <span className="font-black text-xl tracking-widest text-white">CMD<span className="text-neon-blue">CTR</span></span>
        </Link>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="md:hidden p-2 -mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item: any) => {
                if (item.children) {
                  const isExpanded = expandedItems[item.name];
                  const hasActiveChild = item.children.some((child: any) => pathname.startsWith(child.href));
                  
                  return (
                    <div key={item.name} className="flex flex-col">
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          hasActiveChild && !isExpanded
                            ? "bg-white/5 text-white"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${hasActiveChild ? "text-neon-blue" : ""}`} />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-9 mt-1 space-y-1 border-l border-white/10 pl-2">
                          {item.children.map((child: any) => {
                            const isChildActive = pathname === child.href;
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                  isChildActive
                                    ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]"
                                    : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                              >
                                <span className="font-medium text-sm">{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]" 
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-neon-blue" : ""}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 shrink-0">
        <button 
          onClick={async () => {
            try {
              // Call the backend logout to clear the HttpOnly cookie
              await fetch('/api-proxy/admin/logout', { method: 'POST' });
            } catch (e) {}
            router.push("/admin/login");
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
