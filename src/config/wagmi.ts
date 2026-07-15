import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

import { supportedChain } from "@/config/chains";

export const wagmiConfig = createConfig({
  chains: [supportedChain],
  connectors: [injected()],
  transports: {
    [supportedChain.id]: http(),
  },
  ssr: true,
});