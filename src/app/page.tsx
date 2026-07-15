import Image from "next/image";

import MintPanel from "@/components/mint/MintPanel";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Desktop background */}
      <Image
        src="/backgrounds/home-desktop.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />

      {/* Mobile background */}
      <Image
        src="/backgrounds/home-mobile.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />

      {/* Background shading */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.39)_50%,rgba(0,0,0,0.17)_100%)] max-md:bg-[linear-gradient(180deg,rgba(0,0,0,0.26)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.88)_100%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(213,167,67,0.13),transparent_34%)]" />

      {/* Global noise */}
      <Image
        src="/ui/noise-master.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none z-[2] object-cover opacity-[0.13] mix-blend-soft-light"
      />

      {/* Global glass reflection */}
      <Image
        src="/ui/glass-overlay-master.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none z-[3] object-cover opacity-[0.16]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Hero */}
        <section className="grid flex-1 items-center gap-5 py-6 sm:gap-7 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(330px,0.8fr)] md:py-12 lg:grid-cols-[minmax(0,0.98fr)_minmax(440px,0.74fr)]">
          {/* Left content */}
          <div className="order-2 flex w-full max-w-[735px] flex-col items-start md:order-1">
            {/* Hero logo */}
            <div className="relative mb-5 h-[68px] w-[245px] sm:mb-8 sm:h-[90px] sm:w-[340px] lg:h-[105px] lg:w-[400px]">
              <Image
                src="/brand/btc-club-logo-master.png"
                alt="BTC CLUB"
                fill
                priority
                sizes="400px"
                className="object-contain object-left"
              />
            </div>

            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3 sm:mb-7">
              <span className="h-px w-8 bg-[#d9b759]" />

              <p className="text-[9px] font-semibold tracking-[0.28em] text-[#ddc477] sm:text-[11px] sm:tracking-[0.33em]">
                OFFICIAL MYSTERY MINT
              </p>
            </div>

            {/* Title */}
            <h1 className="max-w-[720px] uppercase leading-[0.92]">
              <span
                className="
                  block
                  bg-gradient-to-b
                  from-[#fff7d0]
                  via-[#e3bf63]
                  to-[#9a6a19]
                  bg-clip-text
                  text-[39px]
                  font-semibold
                  tracking-[-0.045em]
                  text-transparent
                  drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)]
                  sm:text-[62px]
                  md:text-[64px]
                  lg:text-[82px]
                  xl:text-[94px]
                "
              >
                ENTER THE
              </span>

              <span
                className="
                  block
                  bg-gradient-to-b
                  from-[#fff8dc]
                  via-[#f0cf78]
                  via-[45%]
                  to-[#a36e18]
                  bg-clip-text
                  text-[43px]
                  font-bold
                  tracking-[-0.05em]
                  text-transparent
                  drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                  sm:text-[68px]
                  md:text-[72px]
                  lg:text-[92px]
                  xl:text-[106px]
                "
                style={{
                  textShadow:
                    "0 1px 0 rgba(255,248,220,.35), 0 -1px 0 rgba(92,58,14,.55)",
                }}
              >
                BTC CLUB
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[600px] text-sm leading-6 text-white/64 sm:mt-6 sm:text-[15px] sm:leading-7 lg:text-base">
              Mint a mystery collectible card from the official BTC CLUB
              collection. Every confirmed mint reveals one of 139 premium card
              designs.
            </p>

            {/* Production mint panel */}
            <MintPanel />
          </div>

          {/* Mystery card */}
          <div className="order-1 flex items-center justify-center md:order-2 md:justify-end">
            <div className="relative flex w-full max-w-[315px] items-center justify-center sm:max-w-[430px] lg:max-w-[510px] xl:max-w-[560px]">
              {/* Back glow */}
              <div className="pointer-events-none absolute h-[70%] w-[70%] rounded-full bg-[#d7a63e]/10 blur-[70px] sm:blur-[105px]" />

              {/* Card shadow */}
              <div className="pointer-events-none absolute bottom-[-1%] left-1/2 h-[29%] w-[94%] -translate-x-1/2 opacity-75">
                <Image
                  src="/ui/card-shadow-master.png"
                  alt=""
                  fill
                  sizes="560px"
                  className="object-contain object-bottom"
                />
              </div>

              {/* Card */}
              <div className="relative aspect-square w-full">
                <Image
                  src="/mint/mystery-card-master.png"
                  alt="BTC CLUB mystery collectible card"
                  fill
                  priority
                  sizes="(max-width: 767px) 315px, (max-width: 1279px) 510px, 560px"
                  className="object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.68)]"
                />

                <Image
                  src="/ui/glass-overlay-master.png"
                  alt=""
                  fill
                  sizes="560px"
                  className="pointer-events-none object-contain opacity-[0.21]"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}