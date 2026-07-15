"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletButton() {
  const [isMounted, setIsMounted] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const injectedConnector = connectors.find(
    (connector) => connector.id === "injected",
  );

  const handleClick = () => {
    if (!isMounted) {
      return;
    }

    if (isConnected) {
      disconnect();
      return;
    }

    if (injectedConnector) {
      connect({
        connector: injectedConnector,
      });
    }
  };

  const isButtonDisabled =
    !isMounted ||
    (!isConnected &&
      (!injectedConnector || isPending));

  const buttonText = (() => {
    if (!isMounted) {
      return "Connect Wallet";
    }

    if (isConnected && address) {
      return shortenAddress(address);
    }

    if (isPending) {
      return "Connecting...";
    }

    return "Connect Wallet";
  })();

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isButtonDisabled}
      className="
        min-h-12
        border
        border-[#b58a35]
        bg-transparent
        px-6
        text-xs
        font-semibold
        uppercase
        tracking-[0.20em]
        text-[#d8b15a]
        transition-all
        duration-300
        hover:border-[#f0d78a]
        hover:bg-[#d8b15a]/5
        hover:text-[#f5d98b]
        hover:shadow-[0_0_18px_rgba(216,177,90,0.22)]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {buttonText}
    </button>
  );
}