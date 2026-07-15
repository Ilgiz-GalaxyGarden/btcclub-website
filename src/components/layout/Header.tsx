import Link from "next/link";

import WalletButton from "@/components/wallet/WalletButton";

const navigation = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/book",
    label: "Collector’s Book",
  },
  {
    href: "/super-holder",
    label: "Super Holder",
  },
];

export default function Header() {
  return (
    <header className="relative z-50 border-b border-[#6e5522] bg-black/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Main header row */}
        <div className="flex min-h-16 items-center justify-between gap-3 py-3 sm:gap-6">
          <Link
            href="/"
            className="shrink-0 text-sm font-bold uppercase tracking-[0.22em] text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.45)] sm:text-lg sm:tracking-[0.3em]"
          >
            BTC CLUB
          </Link>

          <div className="flex min-w-0 items-center gap-3 sm:gap-7 lg:gap-8">
            {/* Desktop navigation */}
            <nav
              className="hidden sm:block"
              aria-label="Main navigation"
            >
              <ul className="flex items-center gap-7 lg:gap-9">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="whitespace-nowrap text-sm font-medium tracking-wide text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.45)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop X link */}
            <a
              href="https://x.com/Galaxy_Garden_S"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BTC CLUB on X"
              className="hidden text-xl font-light text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.45)] sm:inline-flex"
            >
              𝕏
            </a>

            <WalletButton />
          </div>
        </div>

        {/* Mobile navigation */}
        <nav
          className="border-t border-[#6e5522]/45 sm:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex min-h-11 items-center justify-center divide-x divide-[#6e5522]/45">
            {navigation.map((item) => (
              <li
                key={item.href}
                className="flex flex-1 justify-center"
              >
                <Link
                  href={item.href}
                  className="flex min-h-11 w-full items-center justify-center px-2 text-center text-[10px] font-semibold uppercase tracking-[0.13em] text-[#d8b15a] transition-all duration-300 hover:bg-[#d8b15a]/5 hover:text-[#f5d98b]"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="flex w-14 shrink-0 justify-center">
              <a
                href="https://x.com/Galaxy_Garden_S"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BTC CLUB on X"
                className="flex min-h-11 w-full items-center justify-center text-lg font-light text-[#d8b15a] transition-all duration-300 hover:bg-[#d8b15a]/5 hover:text-[#f5d98b]"
              >
                𝕏
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}