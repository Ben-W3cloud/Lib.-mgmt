/**
 * =============================================================================
 * WEB3 PROVIDER — Composes all Web3 context providers for the application
 * =============================================================================
 *
 * Wraps the app with:
 * 1. WagmiProvider — manages blockchain connections and contract interactions
 * 2. QueryClientProvider — TanStack Query for caching and state management
 * 3. RainbowKitProvider — wallet connection UI with custom theme
 *
 * This provider must wrap all pages in the root layout.
 */

"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, Theme, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

import { wagmiConfig } from "@/lib/config";

// ---------------------------------------------------------------------------
// Custom RainbowKit theme — matches our library aesthetic
// Uses warm brown tones and serif-inspired feel
// ---------------------------------------------------------------------------
const bibliothecaTheme: Theme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    accentColor: "#3b82f6",           
    accentColorForeground: "#ffffff", 
    connectButtonBackground: "#0f172a", 
    connectButtonText: "#e2e8f0",     
    modalBackground: "#020617",       
    modalText: "#f8fafb",
    modalTextSecondary: "#94a3b8",    
    profileForeground: "#0f172a",
    closeButtonBackground: "#1e293b",
  },
  radii: {
    ...darkTheme().radii,
    connectButton: "8px",
    actionButton: "8px",
    menuButton: "8px",
    modal: "12px",
    modalMobile: "12px",
  },
  fonts: {
    body: "Inter, system-ui, sans-serif",
  },
};

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------
export function Web3Provider({ children }: { children: React.ReactNode }) {
  // Create a stable QueryClient instance per component lifecycle
  // Using useState ensures it persists across re-renders but is unique per SSR request
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Blockchain data can change with every block, but we don't need
            // real-time updates. 30s stale time is a good balance.
            staleTime: 30_000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={bibliothecaTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
