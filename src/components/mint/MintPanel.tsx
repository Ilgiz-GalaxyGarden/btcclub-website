"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  decodeEventLog,
  formatEther,
  parseAbiItem,
  type Abi,
  type Hash,
} from "viem";
import {
  useAccount,
  useChainId,
  useConnect,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import {
  BTC_CLUB_ABI,
  BTC_CLUB_CHAIN_ID,
  BTC_CLUB_CONTRACT_ADDRESS,
} from "@/lib/contract";

const contractAbi = BTC_CLUB_ABI as Abi;

const mysteryMintRequestedEvent = parseAbiItem(
  "event MysteryMintRequested(uint256 indexed mintId, uint256 indexed requestId, address indexed buyer, uint256 payment)",
);

const mysteryMintCompletedEvent = parseAbiItem(
  "event MysteryMintCompleted(uint256 indexed mintId, uint256 indexed requestId, address indexed buyer, uint256 tokenId)",
);

export type RevealedCard = {
  tokenId: number;
  imageUrl: string;
  name?: string;
};

type MintPanelProps = {
  onReveal?: (card: RevealedCard | null) => void;
};

type PendingMint = {
  mintId: bigint;
  fromBlock: bigint;
};

type NftMetadata = {
  name?: string;
  image?: string;
};

function ipfsToHttp(uri: string): string {
  if (uri.startsWith("ipfs://ipfs/")) {
    return uri.replace(
      "ipfs://ipfs/",
      "https://ipfs.io/ipfs/",
    );
  }

  if (uri.startsWith("ipfs://")) {
    return uri.replace(
      "ipfs://",
      "https://ipfs.io/ipfs/",
    );
  }

  return uri;
}

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Transaction failed. Please try again.";
  }

  const message = error.message.toLowerCase();

  if (
    message.includes("user rejected") ||
    message.includes("user denied")
  ) {
    return "Transaction cancelled in wallet.";
  }

  if (message.includes("publicmintclosed")) {
    return "Public mint is currently closed.";
  }

  if (message.includes("enforcedpause")) {
    return "The contract is currently paused.";
  }

  if (message.includes("invalidpayment")) {
    return "Mint price changed. Please try again.";
  }

  if (message.includes("insufficient funds")) {
    return "Not enough ETH for the mint and network fee.";
  }

  if (message.includes("collectionsoldout")) {
    return "The BTC CLUB collection is sold out.";
  }

  return "Transaction failed. Please try again.";
}

export default function MintPanel({
  onReveal,
}: MintPanelProps) {
  const [transactionHash, setTransactionHash] =
    useState<Hash | undefined>();

  const [pendingMint, setPendingMint] =
    useState<PendingMint | null>(null);

  const [revealedTokenId, setRevealedTokenId] =
    useState<number | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const publicClient = usePublicClient({
    chainId: BTC_CLUB_CHAIN_ID,
  });

  const {
    connectAsync,
    connectors,
    isPending: isConnecting,
  } = useConnect();

  const {
    switchChainAsync,
    isPending: isSwitchingChain,
  } = useSwitchChain();

  const {
    writeContractAsync,
    isPending: isWaitingForWallet,
  } = useWriteContract();

  const injectedConnector = connectors.find(
    (connector) => connector.id === "injected",
  );

  const publicMintQuery = useReadContract({
    address: BTC_CLUB_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: "publicMintOpen",
    chainId: BTC_CLUB_CHAIN_ID,
    query: {
      refetchInterval: 15_000,
    },
  });

  const pausedQuery = useReadContract({
    address: BTC_CLUB_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: "paused",
    chainId: BTC_CLUB_CHAIN_ID,
    query: {
      refetchInterval: 15_000,
    },
  });

  const mintPriceQuery = useReadContract({
    address: BTC_CLUB_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: "currentMintPriceWei",
    chainId: BTC_CLUB_CHAIN_ID,
    query: {
      refetchInterval: 15_000,
    },
  });

  const totalMintedQuery = useReadContract({
    address: BTC_CLUB_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: "totalMinted",
    chainId: BTC_CLUB_CHAIN_ID,
    query: {
      refetchInterval: 15_000,
    },
  });

  const maxTotalSupplyQuery = useReadContract({
    address: BTC_CLUB_CONTRACT_ADDRESS,
    abi: contractAbi,
    functionName: "MAX_TOTAL_SUPPLY",
    chainId: BTC_CLUB_CHAIN_ID,
    query: {
      refetchInterval: 60_000,
    },
  });

  const publicMintOpen =
    publicMintQuery.data === true;

  const contractPaused =
    pausedQuery.data === true;

  const mintPriceWei =
    typeof mintPriceQuery.data === "bigint"
      ? mintPriceQuery.data
      : undefined;

  const totalMinted =
    typeof totalMintedQuery.data === "bigint"
      ? totalMintedQuery.data
      : BigInt(0);

  const maxTotalSupply =
    typeof maxTotalSupplyQuery.data === "bigint"
      ? maxTotalSupplyQuery.data
      : BigInt(1_000_000);

  const isCorrectChain =
    chainId === BTC_CLUB_CHAIN_ID;

  const receiptQuery = useWaitForTransactionReceipt({
    hash: transactionHash,
    confirmations: 1,
    query: {
      enabled: transactionHash !== undefined,
    },
  });

  /*
   * После подтверждения mint-транзакции находим mintId
   * в событии MysteryMintRequested.
   */
  useEffect(() => {
    if (
      !receiptQuery.isSuccess ||
      !receiptQuery.data ||
      pendingMint !== null ||
      revealedTokenId !== null
    ) {
      return;
    }

    for (const log of receiptQuery.data.logs) {
      if (
        log.address.toLowerCase() !==
        BTC_CLUB_CONTRACT_ADDRESS.toLowerCase()
      ) {
        continue;
      }

      try {
        const decoded = decodeEventLog({
          abi: [mysteryMintRequestedEvent],
          data: log.data,
          topics: log.topics,
          strict: true,
        });

        if (
          decoded.eventName !==
          "MysteryMintRequested"
        ) {
          continue;
        }

        setPendingMint({
          mintId: decoded.args.mintId,
          fromBlock: receiptQuery.data.blockNumber,
        });

        return;
      } catch {
        // Лог относится к другому событию.
      }
    }

    setActionError(
      "Mint confirmed, but the reveal request could not be identified.",
    );
  }, [
    receiptQuery.isSuccess,
    receiptQuery.data,
    pendingMint,
    revealedTokenId,
  ]);

  /*
   * Пока VRF не завершён, каждые 4 секунды проверяем появление
   * MysteryMintCompleted для текущего mintId и кошелька.
   */
  useEffect(() => {
    if (
      pendingMint === null ||
      !publicClient ||
      !address
    ) {
      return;
    }

    let cancelled = false;
    let requestRunning = false;

    const checkReveal = async () => {
      if (cancelled || requestRunning) {
        return;
      }

      requestRunning = true;

      try {
        const logs = await publicClient.getLogs({
          address: BTC_CLUB_CONTRACT_ADDRESS,
          event: mysteryMintCompletedEvent,
          args: {
            mintId: pendingMint.mintId,
            buyer: address,
          },
          fromBlock: pendingMint.fromBlock,
          toBlock: "latest",
        });

        const completionLog =
          logs.length > 0
            ? logs[logs.length - 1]
            : undefined;

        if (!completionLog || cancelled) {
          return;
        }

        const tokenIdBigInt =
          completionLog.args.tokenId;

        if (tokenIdBigInt === undefined) {
          return;
        }

        const metadataUri =
          await publicClient.readContract({
            address: BTC_CLUB_CONTRACT_ADDRESS,
            abi: contractAbi,
            functionName: "uri",
            args: [tokenIdBigInt],
          });

        if (typeof metadataUri !== "string") {
          throw new Error(
            "Invalid metadata URI returned by contract.",
          );
        }

        const metadataResponse = await fetch(
          ipfsToHttp(metadataUri),
          {
            cache: "no-store",
          },
        );

        if (!metadataResponse.ok) {
          throw new Error(
            "Failed to load NFT metadata.",
          );
        }

        const metadata =
          (await metadataResponse.json()) as NftMetadata;

        if (
          typeof metadata.image !== "string" ||
          metadata.image.length === 0
        ) {
          throw new Error(
            "NFT metadata does not contain an image.",
          );
        }

        const tokenId = Number(tokenIdBigInt);

        if (
          !Number.isSafeInteger(tokenId) ||
          cancelled
        ) {
          return;
        }

        setRevealedTokenId(tokenId);

        onReveal?.({
          tokenId,
          imageUrl: ipfsToHttp(metadata.image),
          name: metadata.name,
        });

        setPendingMint(null);
        setTransactionHash(undefined);
        setActionError(null);

        void totalMintedQuery.refetch();
        void publicMintQuery.refetch();
        void pausedQuery.refetch();
        void mintPriceQuery.refetch();
      } catch (error) {
        console.error(
          "Reveal check failed:",
          error,
        );
      } finally {
        requestRunning = false;
      }
    };

    void checkReveal();

    const intervalId = window.setInterval(
      () => {
        void checkReveal();
      },
      4_000,
    );

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [
    pendingMint,
    publicClient,
    address,
    onReveal,
    totalMintedQuery,
    publicMintQuery,
    pausedQuery,
    mintPriceQuery,
  ]);

  useEffect(() => {
    if (!receiptQuery.isSuccess) {
      return;
    }

    void totalMintedQuery.refetch();
    void publicMintQuery.refetch();
    void pausedQuery.refetch();
    void mintPriceQuery.refetch();
  }, [
    receiptQuery.isSuccess,
    totalMintedQuery,
    publicMintQuery,
    pausedQuery,
    mintPriceQuery,
  ]);

  const isContractStateLoading =
    publicMintQuery.isLoading ||
    pausedQuery.isLoading ||
    mintPriceQuery.isLoading ||
    totalMintedQuery.isLoading ||
    maxTotalSupplyQuery.isLoading;

  const isWaitingForReveal =
    receiptQuery.isSuccess &&
    revealedTokenId === null;

  const isTransactionBusy =
    isConnecting ||
    isSwitchingChain ||
    isWaitingForWallet ||
    receiptQuery.isLoading ||
    isWaitingForReveal;

  const mintPriceEth = useMemo(() => {
    if (mintPriceWei === undefined) {
      return "—";
    }

    const formatted = Number(
      formatEther(mintPriceWei),
    );

    if (!Number.isFinite(formatted)) {
      return "—";
    }

    return formatted.toFixed(6);
  }, [mintPriceWei]);

  const formattedTotalMinted =
    totalMinted.toLocaleString("en-US");

  const formattedMaxSupply =
    maxTotalSupply.toLocaleString("en-US");

  const buttonText = (() => {
    if (isContractStateLoading) {
      return "LOADING CONTRACT";
    }

    if (contractPaused) {
      return "MINT PAUSED";
    }

    if (!publicMintOpen) {
      return "MINT CLOSED";
    }

    if (!isConnected) {
      return isConnecting
        ? "CONNECTING"
        : "CONNECT WALLET";
    }

    if (!isCorrectChain) {
      return isSwitchingChain
        ? "SWITCHING NETWORK"
        : "SWITCH TO BASE";
    }

    if (isWaitingForWallet) {
      return "CONFIRM IN WALLET";
    }

    if (receiptQuery.isLoading) {
      return "CONFIRMING MINT";
    }

    if (isWaitingForReveal) {
      return "MINT REQUESTED";
    }

    return "MINT MYSTERY CARD";
  })();

  const isButtonDisabled =
    isContractStateLoading ||
    contractPaused ||
    !publicMintOpen ||
    isTransactionBusy ||
    mintPriceWei === undefined;

  const handleMint = async () => {
    setActionError(null);

    try {
      if (!isConnected) {
        if (!injectedConnector) {
          setActionError(
            "No compatible wallet was found.",
          );
          return;
        }

        await connectAsync({
          connector: injectedConnector,
        });

        return;
      }

      if (!isCorrectChain) {
        await switchChainAsync({
          chainId: BTC_CLUB_CHAIN_ID,
        });

        return;
      }

      if (!publicMintOpen) {
        setActionError(
          "Public mint is currently closed.",
        );
        return;
      }

      if (contractPaused) {
        setActionError(
          "The contract is currently paused.",
        );
        return;
      }

      if (mintPriceWei === undefined) {
        setActionError(
          "The current mint price is unavailable.",
        );
        return;
      }

      /*
       * Новый mint снова показывает закрытую Club Card,
       * пока Chainlink VRF не завершит reveal.
       */
      setPendingMint(null);
      setRevealedTokenId(null);
      setTransactionHash(undefined);
      onReveal?.(null);

      const hash = await writeContractAsync({
        address: BTC_CLUB_CONTRACT_ADDRESS,
        abi: contractAbi,
        functionName: "mint",
        value: mintPriceWei,
        chainId: BTC_CLUB_CHAIN_ID,
        account: address,
      });

      setTransactionHash(hash);
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  };

  const statusText = (() => {
    if (actionError) {
      return actionError;
    }

    if (receiptQuery.isError) {
      return "Mint transaction failed.";
    }

    if (revealedTokenId !== null) {
      return `REVEAL COMPLETE · CARD #${revealedTokenId}`;
    }

    if (isWaitingForReveal) {
      return "Transaction confirmed. Waiting for Chainlink VRF reveal.";
    }

    if (receiptQuery.isLoading) {
      return "Mint transaction submitted. Waiting for confirmation.";
    }

    if (contractPaused) {
      return "CONTRACT PAUSED";
    }

    if (!publicMintOpen) {
      return "PUBLIC MINT IS CURRENTLY CLOSED";
    }

    return `CURRENT CONTRACT PRICE: ${mintPriceEth} ETH`;
  })();

  const collectionStats = [
    {
      value: `${formattedTotalMinted} / ${formattedMaxSupply}`,
      label: "MINTED",
    },
    {
      value: "139",
      label: "CARD DESIGNS",
    },
    {
      value: "$3",
      label: "MINT PRICE",
    },
  ];

  return (
    <>
      <div className="relative mt-6 w-full max-w-[670px] overflow-hidden px-3 py-3 sm:mt-8 sm:px-5 sm:py-5">
        <Image
          src="/ui/mint-panel-master.png"
          alt=""
          fill
          sizes="670px"
          className="pointer-events-none object-fill"
        />

        <div className="pointer-events-none absolute inset-[8px] bg-black/16 backdrop-blur-[2px]" />

        <Image
          src="/ui/glass-overlay-master.png"
          alt=""
          fill
          sizes="670px"
          className="pointer-events-none object-cover opacity-[0.28]"
        />

        <Image
          src="/ui/noise-master.png"
          alt=""
          fill
          sizes="670px"
          className="pointer-events-none object-cover opacity-[0.12] mix-blend-soft-light"
        />

        <div className="relative z-10 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleMint}
            disabled={isButtonDisabled}
            className="relative flex h-[62px] w-full shrink-0 items-center justify-center overflow-hidden px-5 text-[10px] font-bold tracking-[0.18em] text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-55 sm:h-[66px] sm:w-auto sm:flex-1 sm:px-7 sm:text-[11px] sm:tracking-[0.24em]"
          >
            <Image
              src="/ui/button-frame-master.png"
              alt=""
              fill
              sizes="390px"
              className="pointer-events-none object-fill"
            />

            <span className="pointer-events-none absolute inset-[7px] bg-[linear-gradient(135deg,#7d5717_0%,#d7ad4d_47%,#805a19_100%)]" />

            <span className="pointer-events-none absolute inset-[8px] border border-white/20" />

            <Image
              src="/ui/glass-overlay-master.png"
              alt=""
              fill
              sizes="390px"
              className="pointer-events-none object-cover opacity-[0.38]"
            />

            <span className="relative z-10">
              {buttonText}
            </span>
          </button>

          <Link
            href="/book"
            className="relative flex h-[62px] w-full min-w-0 shrink-0 items-center justify-center overflow-hidden px-4 text-center text-[9px] font-semibold tracking-[0.13em] text-white/85 transition-colors duration-200 hover:text-[#f0d98d] sm:h-[66px] sm:w-auto sm:min-w-[250px] sm:px-6 sm:text-[10px] sm:tracking-[0.16em]"
          >
            <Image
              src="/ui/button-frame-master.png"
              alt=""
              fill
              sizes="250px"
              className="pointer-events-none object-fill opacity-75"
            />

            <span className="pointer-events-none absolute inset-[7px] bg-black/58 backdrop-blur-md" />

            <Image
              src="/ui/glass-overlay-master.png"
              alt=""
              fill
              sizes="250px"
              className="pointer-events-none object-cover opacity-[0.2]"
            />

            <span className="relative z-10">
              EXPLORE COLLECTOR&apos;S BOOK
            </span>
          </Link>
        </div>

        <p
          className={`relative z-10 mt-3 px-1 text-center text-[8px] font-medium tracking-[0.1em] sm:mt-4 sm:text-left sm:text-[10px] sm:tracking-[0.15em] ${
            actionError || receiptQuery.isError
              ? "text-red-300/80"
              : revealedTokenId !== null
                ? "text-[#ead28a]"
                : "text-white/45"
          }`}
        >
          {statusText}
        </p>

        <p className="relative z-10 mt-2 px-1 text-center text-[8px] font-medium tracking-[0.1em] text-white/30 sm:text-left sm:text-[9px] sm:tracking-[0.13em]">
          BASE MAINNET · ERC-1155 · IMMEDIATE REVEAL
        </p>
      </div>

      <div className="relative mt-6 grid w-full max-w-[650px] grid-cols-3 overflow-hidden sm:mt-8">
        <div className="pointer-events-none absolute inset-0 bg-black/18 backdrop-blur-[3px]" />

        <Image
          src="/ui/glass-overlay-master.png"
          alt=""
          fill
          sizes="650px"
          className="pointer-events-none object-cover opacity-[0.17]"
        />

        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px">
          <Image
            src="/ui/divider-master.png"
            alt=""
            fill
            sizes="650px"
            className="object-fill opacity-70"
          />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px">
          <Image
            src="/ui/divider-master.png"
            alt=""
            fill
            sizes="650px"
            className="object-fill opacity-45"
          />
        </div>

        {collectionStats.map((stat, index) => (
          <div
            key={stat.label}
            className={`relative z-10 px-1 py-4 text-center sm:py-6 ${
              index !== collectionStats.length - 1
                ? "border-r border-white/10"
                : ""
            }`}
          >
            <p className="text-[12px] font-medium tracking-[-0.02em] text-[#ead28a] sm:text-xl">
              {stat.value}
            </p>

            <p className="mt-1 text-[7px] font-semibold tracking-[0.12em] text-white/42 sm:text-[9px] sm:tracking-[0.2em]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}