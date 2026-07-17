import { createConfig, http } from "wagmi";
import {
  injected,
  walletConnect,
} from "wagmi/connectors";

import { supportedChain } from "@/config/chains";

const walletConnectProjectId =
  "5118b4575f4e1273176c198f2f4c16fd";

export const wagmiConfig = createConfig({
  chains: [supportedChain],

  connectors: [
    injected(),

    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
      metadata: {
        name: "BTC CLUB",
        description:
          "Official BTC CLUB mystery collectible card collection.",
        url: "https://btcclub.io",
        icons: [
          "https://btcclub.io/favicon.ico",
        ],
      },
    }),
  ],

  transports: {
    [supportedChain.id]: http(),
  },

  ssr: true,
});