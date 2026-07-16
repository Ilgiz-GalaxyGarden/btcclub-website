import type { Address } from "viem";

import BTCClubABI from "./BTCClubABI.json";

export const BTC_CLUB_CONTRACT_ADDRESS =
  "0x95f505c540cDE11B5F68B23DBd0A440e75170e80" as const satisfies Address;

export const BTC_CLUB_CHAIN_ID = 8453 as const;

export const BTC_CLUB_ABI = BTCClubABI;

export const isBTCClubContractConfigured =
  BTC_CLUB_CONTRACT_ADDRESS.length === 42 &&
  BTC_CLUB_ABI.length > 0;