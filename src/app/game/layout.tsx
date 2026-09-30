"use client";

import { Home, MessageSquare, Star, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Matches Flutter NavigationContainer exactly:
// - Frosted glass bottom bar (backdropFilter: blur(15))
// - 4 nav items: Home, Support, [Spade center], MyBets, Profile
// - Active item: #FFD700 icon + #FF5252 red indicator dot
// - Center: Red/gradient circle with ♠ spade

export default function GameLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Hide nav bar for spinwheel page (matches Flutter: _currentIndex != 2)
  const hideNav = pathname?.startsWith("/game/spinwheel");

  const navItems = [
    { icon: Home, path: "/game", exact: true },
    { icon: MessageSquare, path: "/game/support" },
    { type: "center" },
    { icon: Star, path: "/game/mybets" },
    { icon: User, path: "/game/profile" },
  ];

  return (
    <div className="bg-[#0F0C16] min-h-screen text-white relative overflow-x-hidden">
      {children}

      {!hideNav && (
        /* Bottom Navigation (matches Flutter _buildCustomBottomNavBar) */
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          {/* Gradient overlay (matches Flutter 3-stop gradient: 0.0→0.8→1.0 alpha) */}
          <div className="absolute bottom-0 w-full h-[140px] pointer-events-none"
            style={{
              background: "linear-gradient(to top, #0F0C16 0%, rgba(15,12,22,0.8) 40%, transparent 100%)",
            }}
          />

          {/* The actual nav bar pill */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="relative rounded-[35px] h-[65px] flex items-center justify-evenly px-2"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}>
              {navItems.map((item, index) => {
                if (item.type === "center") {
                  return <div key="center-spacer" className="w-[60px] flex-shrink-0" />;
                }

                const isActive = item.exact
                  ? pathname === item.path
                  : pathname?.startsWith(item.path || "");

                const Icon = item.icon!;

                return (
                  <Link
                    key={index}
                    href={item.path || "/game"}
                    className="flex flex-col items-center justify-center w-12 h-full"
                  >
                    <Icon
                      className="w-[26px] h-[26px] transition-colors"
                      style={{ color: isActive ? "#FFD700" : "rgba(255,255,255,0.38)" }}
                    />
                    {isActive && (
                      <div
                        className="w-[18px] h-[4px] rounded-full mt-1"
                        style={{
                          background: "#FF5252",
                          boxShadow: "0 0 6px rgba(255,82,82,0.6)",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Center Glowing Spade Button (matches Flutter exact colors from [#FF7B7B, #FF5252]) */}
            <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 pointer-events-auto">
              <Link href="/game/spinwheel">
                <div
                  className="w-[65px] h-[65px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #FF7B7B, #FF5252)",
                    boxShadow: "0 5px 15px rgba(255,82,82,0.4), 0 -5px 5px #0F0C16",
                    border: "2px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="text-white text-[34px] leading-none mb-0.5">♠</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
