"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";

const TOTAL_STANDARD_CARDS = 132;

export default function SuperHolderPage() {
  const [isMounted, setIsMounted] = useState(false);

  /*
   * Эти значения позже будут читаться напрямую из смарт-контракта.
   * null означает, что данные коллекции ещё не загружены.
   */
  const [standardCardsOwned] = useState<number | null>(null);
  const [rareCardDetected] = useState<boolean | null>(null);
  const [isRegistered] = useState<boolean | null>(null);
  const [missingCards] = useState<number[]>([]);
  const [isRegistering] = useState(false);

  const { isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const injectedConnector = connectors.find(
    (connector) => connector.id === "injected",
  );

  const walletConnected = isMounted && isConnected;

  const handleConnectWallet = () => {
    if (
      !walletConnected &&
      injectedConnector &&
      !isPending
    ) {
      connect({
        connector: injectedConnector,
      });
    }
  };

  const progressPercentage = useMemo(() => {
    if (standardCardsOwned === null) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (standardCardsOwned / TOTAL_STANDARD_CARDS) * 100,
      ),
    );
  }, [standardCardsOwned]);

  const hasCompleteStandardCollection =
    standardCardsOwned === TOTAL_STANDARD_CARDS;

  const isEligible =
    walletConnected &&
    hasCompleteStandardCollection &&
    rareCardDetected === true &&
    isRegistered === false;

  const registrationButtonText = useMemo(() => {
    if (!isMounted) {
      return "Connect Wallet";
    }

    if (!walletConnected) {
      return isPending
        ? "Connecting..."
        : "Connect Wallet";
    }

    if (isRegistered === true) {
      return "Super Holder Registered";
    }

    if (isRegistering) {
      return "Registering...";
    }

    return "Register as Super Holder";
  }, [
    isMounted,
    walletConnected,
    isPending,
    isRegistered,
    isRegistering,
  ]);

  const standardCardsText =
    standardCardsOwned === null
      ? "— / 132"
      : `${standardCardsOwned} / ${TOTAL_STANDARD_CARDS}`;

  const progressText =
    standardCardsOwned === null
      ? "Not Checked"
      : `${progressPercentage}%`;

  const rareCardText =
    rareCardDetected === null
      ? "Not Checked"
      : rareCardDetected
        ? "Detected"
        : "Not Detected";

  const registrationStatusText =
    isRegistered === null
      ? "Not Checked"
      : isRegistered
        ? "Registered"
        : "Not Registered";

  const registrationButtonDisabled = !isMounted
    ? true
    : !walletConnected
      ? !injectedConnector || isPending
      : !isEligible || isRegistering;

  return (
    <main className="relative flex-1 overflow-hidden bg-black text-white">
      <div
        className="
          absolute
          inset-0
          bg-[url('/backgrounds/home-mobile.png')]
          bg-cover
          bg-center
          bg-no-repeat
          sm:bg-[url('/backgrounds/home-desktop.png')]
        "
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-black/70"
        aria-hidden="true"
      />

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(216,177,90,0.12),transparent_42%)]
        "
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <section className="mx-auto max-w-4xl text-center">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.32em]
              text-[#d8b15a]
              sm:text-sm
            "
          >
            BTC CLUB · Collector Recognition
          </p>

          <h1
            className="
              mt-5
              bg-gradient-to-b
              from-[#fff3bd]
              via-[#d8b15a]
              to-[#8a6724]
              bg-clip-text
              text-4xl
              font-black
              uppercase
              leading-[0.95]
              tracking-[0.08em]
              text-transparent
              drop-shadow-[0_4px_16px_rgba(216,177,90,0.18)]
              sm:text-5xl
              md:text-6xl
            "
          >
            Super Holder
            <br />
            Registration
          </h1>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-neutral-300
              sm:text-base
            "
          >
            Connect your wallet to verify ownership of all 132 standard
            BTC CLUB cards and at least one rare collector card with a Token ID
            from 133 to 139.
          </p>

          <div className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-[#d8b15a] to-transparent sm:w-64" />
        </section>

        <section
          className="
            mx-auto
            mt-12
            max-w-5xl
            overflow-hidden
            rounded-[28px]
            border
            border-[#6e5522]
            bg-black/75
            shadow-[0_24px_80px_rgba(0,0,0,0.65)]
            backdrop-blur-xl
          "
        >
          <div className="border-b border-[#6e5522]/70 px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9f8143]">
                  Registration Status
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-wide text-[#f5d98b] sm:text-2xl">
                  Wallet Collection Verification
                </h2>
              </div>

              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={
                  !isMounted ||
                  walletConnected ||
                  !injectedConnector ||
                  isPending
                }
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#6e5522]
                  bg-black/60
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#d8b15a]
                  transition
                  hover:border-[#d8b15a]
                  hover:text-[#f5d98b]
                  disabled:cursor-default
                  disabled:opacity-100
                "
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    walletConnected
                      ? "bg-emerald-400"
                      : "bg-[#d8b15a]"
                  }`}
                />

                {walletConnected
                  ? "Wallet Connected"
                  : isPending
                    ? "Connecting..."
                    : "Connect Wallet"}
              </button>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            <article className="rounded-2xl border border-[#6e5522]/70 bg-black/65 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9f8143]">
                Standard Cards
              </p>

              <p className="mt-3 text-2xl font-bold text-[#f5d98b]">
                {standardCardsText}
              </p>

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                All standard Token IDs from 1 to 132 are required.
              </p>
            </article>

            <article className="rounded-2xl border border-[#6e5522]/70 bg-black/65 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9f8143]">
                Collection Progress
              </p>

              <p className="mt-3 text-2xl font-bold text-[#f5d98b]">
                {progressText}
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full border border-[#6e5522]/60 bg-black">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8a6724] via-[#d8b15a] to-[#f5d98b] transition-[width] duration-500"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </article>

            <article className="rounded-2xl border border-[#6e5522]/70 bg-black/65 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9f8143]">
                Rare Collector Card
              </p>

              <p
                className={`mt-3 text-lg font-semibold ${
                  rareCardDetected === true
                    ? "text-[#f5d98b]"
                    : "text-neutral-300"
                }`}
              >
                {rareCardText}
              </p>

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                One Token ID from 133 to 139 is required.
              </p>
            </article>

            <article className="rounded-2xl border border-[#6e5522]/70 bg-black/65 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9f8143]">
                Super Holder Status
              </p>

              <p
                className={`mt-3 text-lg font-semibold ${
                  isRegistered === true
                    ? "text-[#f5d98b]"
                    : "text-neutral-300"
                }`}
              >
                {registrationStatusText}
              </p>

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Registration is permanently recorded by the smart contract.
              </p>
            </article>
          </div>

          <div className="border-t border-[#6e5522]/70 px-5 py-7 sm:px-8">
            <div className="mx-auto max-w-xl text-center">
              <button
                type="button"
                onClick={() => {
                  if (!walletConnected) {
                    handleConnectWallet();
                  }
                }}
                disabled={registrationButtonDisabled}
                className={`
                  min-h-14
                  w-full
                  rounded-xl
                  border
                  px-6
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                  transition
                  sm:text-base
                  ${
                    !walletConnected &&
                    isMounted &&
                    injectedConnector &&
                    !isPending
                      ? `
                        border-[#b58a35]
                        bg-gradient-to-b
                        from-[#3a2b13]
                        to-[#171006]
                        text-[#f5d98b]
                        hover:border-[#d8b15a]
                        hover:text-white
                      `
                      : isEligible && !isRegistering
                        ? `
                          border-[#b58a35]
                          bg-gradient-to-b
                          from-[#3a2b13]
                          to-[#171006]
                          text-[#f5d98b]
                          hover:border-[#d8b15a]
                          hover:text-white
                        `
                        : `
                          cursor-not-allowed
                          border-[#6e5522]
                          bg-gradient-to-b
                          from-[#282014]
                          to-[#100d08]
                          text-[#806936]
                          opacity-75
                        `
                  }
                `}
              >
                {registrationButtonText}
              </button>

              <p className="mt-4 text-xs leading-5 text-neutral-500">
                Registration becomes available when the connected wallet owns
                all standard cards and at least one rare collector card.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-[#6e5522]
              bg-black/75
              backdrop-blur-xl
            "
          >
            <div className="border-b border-[#6e5522]/70 px-5 py-5 sm:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9f8143]">
                Collection Analysis
              </p>

              <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.08em] text-[#d8b15a]">
                Missing Standard Cards
              </h2>
            </div>

            <div className="p-5 sm:p-7">
              {!walletConnected ? (
                <div className="rounded-2xl border border-[#6e5522]/70 bg-black/50 p-6 text-center">
                  <p className="text-lg font-semibold text-[#f5d98b]">
                    Wallet Not Connected
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    Connect your wallet to read your BTC CLUB collection
                    directly from the smart contract.
                  </p>
                </div>
              ) : missingCards.length > 0 ? (
                <>
                  <p className="text-sm leading-6 text-neutral-400">
                    Your connected wallet is currently missing the following
                    standard Token IDs:
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {missingCards.map((tokenId) => (
                      <span
                        key={tokenId}
                        className="
                          inline-flex
                          min-w-14
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[#6e5522]/80
                          bg-black/70
                          px-3
                          py-2
                          font-mono
                          text-sm
                          font-bold
                          text-[#f5d98b]
                        "
                      >
                        #{tokenId}
                      </span>
                    ))}
                  </div>
                </>
              ) : hasCompleteStandardCollection ? (
                <div className="rounded-2xl border border-[#6e5522]/70 bg-[#d8b15a]/5 p-6 text-center">
                  <p className="text-lg font-semibold text-[#f5d98b]">
                    Standard Collection Complete
                  </p>

                  <p className="mt-2 text-sm text-neutral-400">
                    Your wallet owns every standard BTC CLUB card.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#6e5522]/70 bg-black/50 p-6 text-center">
                  <p className="text-lg font-semibold text-[#f5d98b]">
                    Collection Not Checked
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    Collection information will appear after the wallet data is
                    loaded from the contract.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside
            className="
              rounded-[24px]
              border
              border-[#6e5522]
              bg-black/75
              p-6
              backdrop-blur-xl
              sm:p-7
            "
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9f8143]">
              Requirements
            </p>

            <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.08em] text-[#d8b15a]">
              Super Holder
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#6e5522] text-[10px] font-bold text-[#d8b15a]">
                  1
                </span>

                <p className="text-sm leading-6 text-neutral-300">
                  Own every standard Token ID from 1 to 132.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#6e5522] text-[10px] font-bold text-[#d8b15a]">
                  2
                </span>

                <p className="text-sm leading-6 text-neutral-300">
                  Own at least one rare Token ID from 133 to 139.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#6e5522] text-[10px] font-bold text-[#d8b15a]">
                  3
                </span>

                <p className="text-sm leading-6 text-neutral-300">
                  Register through the official BTC CLUB smart contract.
                </p>
              </div>
            </div>

            <div className="mt-7 h-px bg-gradient-to-r from-transparent via-[#6e5522] to-transparent" />

            
          </aside>
        </section>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-neutral-500">
          Collection data and registration status are read from the official
          BTC CLUB smart contract on Base Mainnet.
        </p>
      </div>
    </main>
  );
}