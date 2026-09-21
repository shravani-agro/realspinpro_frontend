import Image from "next/image";
import Link from "next/link";

export function TopNav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 bg-transparent pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center pointer-events-auto">
        <Link href="/" className="transition-transform hover:scale-105">
          <Image
            src="/homelogo.png"
            alt="RealSpinPro Logo"
            width={180}
            height={60}
            className="w-auto h-12 md:h-16 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            priority
          />
        </Link>
      </div>
    </nav>
  );
}
