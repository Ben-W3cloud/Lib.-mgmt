"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia } from "wagmi/chains";
import { http } from "wagmi";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "librarymanagement-dev";

export const wagmiConfig = getDefaultConfig({
  appName: "Folio",
  appDescription: "A library, kept in blocks. Borrow and lend books on-chain.",
  projectId: walletConnectProjectId,
  chains: [sepolia, hardhat],
  ssr: true,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

