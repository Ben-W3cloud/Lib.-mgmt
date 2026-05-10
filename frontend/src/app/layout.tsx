/**
 * =============================================================================
 * Root Layout â€” App shell with providers, fonts, and global structure
 * =============================================================================
 */

import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "The Permanent Library",
  description:
    "A decentralized library protocol for preserving books, tracking loans, and governing access through smart contracts.",
  keywords: ["library", "blockchain", "dApp", "books", "Web3", "decentralized"],
};

// ---------------------------------------------------------------------------
// Root Layout Component
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-parchment text-ink-black antialiased flex min-h-screen flex-col">
        <Web3Provider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0f172a",
                color: "#e2e8f0",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#020617",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#020617",
                },
              },
            }}
          />

          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
