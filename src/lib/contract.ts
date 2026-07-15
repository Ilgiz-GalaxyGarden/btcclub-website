import type { Address } from "viem";

import BTCClubABI from "./BTCClubABI.json";

export const BTC_CLUB_CONTRACT_ADDRESS =
  "0x422d4C354f7D49ab5A88Ca19695aD0F1eA03e8cb" as const satisfies Address;

export const BTC_CLUB_CHAIN_ID = 8453 as const;

export const BTC_CLUB_ABI = BTCClubABI;

export const isBTCClubContractConfigured =
  BTC_CLUB_CONTRACT_ADDRESS.length === 42 &&
  BTC_CLUB_ABI.length > 0;