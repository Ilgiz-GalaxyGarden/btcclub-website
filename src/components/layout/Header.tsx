"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import WalletButton from "@/components/wallet/WalletButton";

const CONTRACT_ADDRESS = "0x95f505c540cDE11B5F68B23DBd0A440e75170e80";

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
  const [contractCopied, setContractCopied] = useState(false);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
      }
    };
  }, []);

  async function copyContractAddress() {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);

      setContractCopied(true);

      if (copyResetTimer.current) {
        clearTimeout(copyResetTimer.current);
      }

      copyResetTimer.current = setTimeout(() => {
        setContractCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy contract address:", error);
    }
  }

  return (
    <header className="relative z-50 border-b border-[#6e5522] bg-black/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Main header row */}
        <div className="flex min-h-16 items-center justify-between gap-3 py-3 sm:gap-6">
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="shrink-0 text-sm font-bold uppercase tracking-[0.22em] text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.45)] sm:text-lg sm:tracking-[0.3em]"
            >
              BTC CLUB
            </Link>

            {/* Desktop contract copy */}
            <button
              type="button"
              onClick={copyContractAddress}
              aria-label="Copy BTC CLUB contract address"
              className="hidden whitespace-nowrap text-sm font-medium tracking-wide text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.45)] sm:inline-flex"
            >
              {contractCopied ? "✓ Contract copied" : "📋 CONTRACT"}
            </button>
          </div>

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
            <li className="flex flex-1 justify-center">
              <button
                type="button"
                onClick={copyContractAddress}
                aria-label="Copy BTC CLUB contract address"
                className="flex min-h-11 w-full items-center justify-center px-2 text-center text-[10px] font-semibold uppercase tracking-[0.13em] text-[#d8b15a] transition-all duration-300 hover:bg-[#d8b15a]/5 hover:text-[#f5d98b]"
              >
                {contractCopied ? "✓ Copied" : "📋 Contract"}
              </button>
            </li>

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