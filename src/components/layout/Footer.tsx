export default function Footer() {
  return (
    <footer className="border-t border-[#6e5522] bg-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-7 text-center sm:px-6 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:text-left">
        {/* Left */}
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d8b15a] sm:text-sm sm:tracking-[0.25em]">
            BTC CLUB © {new Date().getFullYear()}
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#9f8143] sm:text-xs sm:tracking-[0.18em]">
            Official BTC CLUB Collection
          </p>
        </div>

        {/* Center */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs sm:gap-x-8 sm:text-sm">
            <li>
              <a
                href="https://basescan.org/address/0x95f505c540cDE11B5F68B23DBd0A440e75170e80"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.45)]"
              >
                BASESCAN
              </a>
            </li>

            <li>
              <a
                href="https://opensea.io/collection/btc-club-galaxys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.45)]"
              >
                OPENSEA
              </a>
            </li>

            <li>
              <a
                href="https://x.com/Galaxy_Garden_S"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d8b15a] transition-all duration-300 hover:text-[#f5d98b] hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.45)]"
              >
                𝕏
              </a>
            </li>
          </ul>
        </nav>

        {/* Right */}
        <div className="lg:text-right">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#9f8143] sm:text-xs sm:tracking-[0.18em]">
            Mystery Mint
          </p>

          <p className="mt-2 text-xs text-[#d8b15a] sm:text-sm">
            Base · ERC-1155
          </p>
        </div>
      </div>
    </footer>
  );
}