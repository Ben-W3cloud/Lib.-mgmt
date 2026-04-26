/**
 * =============================================================================
 * CONFIG — Wagmi chain configuration and RainbowKit setup
 * =============================================================================
 *
 * Configures the Web3 stack:
 * - Supported chains (Sepolia testnet by default, mainnet for production)
 * - RPC transports
 * - Wallet connectors via RainbowKit
 *
 * To switch networks, update NEXT_PUBLIC_CHAIN_ID in .env.local
 */

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, mainnet } from "wagmi/chains";

// ---------------------------------------------------------------------------
// Determine target chain from environment variable
// Defaults to Sepolia (11155111) for development/testing
// ---------------------------------------------------------------------------
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);

// Map of supported chains
const SUPPORTED_CHAINS = {
  1: mainnet,
  11155111: sepolia,
} as const;

const targetChain =
  SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS] ?? sepolia;

// ---------------------------------------------------------------------------
// Wagmi configuration via RainbowKit's getDefaultConfig
// This sets up wagmi with RainbowKit's wallet connectors automatically
// ---------------------------------------------------------------------------
export const wagmiConfig = getDefaultConfig({
  appName: "Bibliotheca — Digital Library",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo-project-id",
  chains: [targetChain],
  ssr: true, // Required for Next.js App Router (SSR compatibility)
});

export { targetChain };
