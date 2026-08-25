import type { Metadata, Viewport } from "next";
import { Doto, Space_Grotesk, Space_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ProviderShell } from "@/components/provider-shell";

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Folio — on-chain library",
  description:
    "Borrow and lend real books on-chain. Listings with live copy counts, loans with due dates, points for punctuality, reviews — settled by contract.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${doto.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full">
        <ProviderShell>
          <AppShell>{children}</AppShell>
        </ProviderShell>
      </body>
    </html>
  );
}
