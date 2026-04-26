/**
 * =============================================================================
 * Home Page — Landing page with hero section and library introduction
 * =============================================================================
 *
 * The landing page serves as the entry point to the dApp:
 * - Hero section with library branding
 * - Featured books preview
 * - Quick actions (connect wallet, browse, register)
 * - System stats
 */

"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBooks } from "@/hooks/useBooks";
import { useMyProfile, useIsOwner } from "@/hooks/useUser";
import { useContractConfig } from "@/hooks/useAdmin";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Award,
  Clock,
  Library,
} from "lucide-react";

export default function HomePage() {
  const { isConnected } = useAccount();
  const { books, isLoading: booksLoading, count: totalBooks } = useBooks();
  const { isRegistered } = useMyProfile();
  const { isOwner } = useIsOwner();
  const { config } = useContractConfig();

  // Show first 3 active books as featured
  const featuredBooks = books.filter((b) => b.active).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ===================================================================
          HERO SECTION
          =================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#3b82f6]/20">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59,130,246,0.5) 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-accent/10 border border-gold-accent/20 mb-8">
              <Sparkles className="w-4 h-4 text-gold-accent" />
              <span className="text-sm text-gold-accent font-medium">
                Powered by Blockchain
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-parchment leading-tight mb-6">
              The Digital{" "}
              <span className="text-gold-accent">Library</span>{" "}
              of Tomorrow
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-parchment/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Browse, borrow, and manage books through smart contracts.
              Earn reward points for on-time returns. A fully decentralized
              library experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConnected ? (
                <ConnectButton />
              ) : (
                <>
                  <Link href="/books">
                    <Button size="lg" variant="gold">
                      <BookOpen className="w-5 h-5" />
                      Browse Library
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  {!isRegistered && (
                    <Link href="/profile">
                      <Button size="lg" variant="secondary">
                        <Users className="w-5 h-5" />
                        Register Now
                      </Button>
                    </Link>
                  )}
                  {isOwner && (
                    <Link href="/admin/dashboard">
                      <Button size="lg" variant="ghost" className="text-parchment border-parchment/20">
                        <Shield className="w-5 h-5" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60V30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z"
              fill="#020617"
            />
          </svg>
        </div>
      </section>

      {/* ===================================================================
          STATS BAR
          =================================================================== */}
      {config && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Books"
              value={totalBooks}
              icon={Library}
              accent="bg-leather-brown/10 text-leather-brown"
            />
            <StatCard
              label="Max Borrow"
              value={`${Math.floor(Number(config.maxBorrowDuration) / 86400)} days`}
              icon={Clock}
              accent="bg-forest-green/10 text-forest-green"
            />
            <StatCard
              label="Borrow Reward"
              value={`+${config.borrowRewardPoints} pts`}
              icon={Award}
              accent="bg-gold-accent/15 text-gold-accent"
            />
            <StatCard
              label="On-Time Bonus"
              value={`+${config.onTimeReturnRewardPoints} pts`}
              icon={Sparkles}
              accent="bg-forest-green/10 text-forest-green"
            />
          </div>
        </section>
      )}

      {/* ===================================================================
          FEATURED BOOKS
          =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-dark-walnut">
              Featured Books
            </h2>
            <p className="text-slate mt-1">
              Discover the latest additions to our collection
            </p>
          </div>
          <Link
            href="/books"
            className="hidden sm:flex items-center gap-1 text-sm text-leather-brown hover:text-dark-walnut font-medium transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {booksLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-cream rounded-xl border border-leather-brown/10 p-6 h-48 animate-shimmer bg-gradient-to-r from-leather-brown/5 via-leather-brown/10 to-leather-brown/5 bg-[length:400%_100%]"
              />
            ))}
          </div>
        ) : featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredBooks.map((book, i) => (
              <BookCard key={book.id.toString()} book={book} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No books in the library yet. Check back soon!</p>
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/books">
            <Button variant="ghost">
              View All Books <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===================================================================
          ABOUT SECTION
          =================================================================== */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-leather-brown/10 border border-leather-brown/20 mb-6">
                <Library className="w-4 h-4 text-leather-brown" />
                <span className="text-xs text-leather-brown font-medium tracking-wide uppercase">
                  About Bibliotheca
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-walnut mb-6">
                A Transparent, Trustless Library Protocol
              </h2>
              <p className="text-slate leading-relaxed mb-6">
                Bibliotheca bridges the gap between literary preservation and modernized web3 mechanics. 
                Instead of trusting a centralized database to handle your history, our Ethereum-powered smart contracts ensure that every book, loan, penalty, and point is verified on-chain.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Immutable loan history and transparent metadata",
                  "Automated smart-contract governed point staking",
                  "No centralized control over user accounts",
                  "Open-source implementation"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-accent" />
                    <span className="text-ink-black text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/books">
                <Button variant="secondary">Start Reading</Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-leather-brown/20 to-gold-accent/20 blur-3xl opacity-50 rounded-full" />
              <div className="relative bg-cream border border-slate/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-leather-brown/10 blur-2xl rounded-bl-full" />
                <BookOpen className="w-12 h-12 text-leather-brown mb-6" />
                <h3 className="text-xl font-serif font-bold text-dark-walnut mb-3">Our Mission</h3>
                <p className="text-slate text-sm leading-relaxed">
                  We believe that public goods like libraries should be universally accessible and permanently verifiable. 
                  By bringing our catalog on-chain, we ensure that digital ownership and reading provenance cannot be erased. 
                  Join the decentralized reading revolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          HOW IT WORKS
          =================================================================== */}
      <section className="bg-cream/50 border-y border-leather-brown/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-serif font-bold text-dark-walnut text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect & Register",
                desc: "Connect your wallet and register as a library member to start borrowing.",
                icon: Users,
              },
              {
                step: "02",
                title: "Browse & Borrow",
                desc: "Explore the catalog, choose a book, select your borrow duration, and confirm on-chain.",
                icon: BookOpen,
              },
              {
                step: "03",
                title: "Return & Earn",
                desc: "Return books on time to earn bonus points. Late returns incur a penalty per day.",
                icon: Award,
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-leather-brown/10 mb-4 group-hover:bg-leather-brown/20 transition-colors">
                  <item.icon className="w-6 h-6 text-leather-brown" />
                </div>
                <div className="text-xs text-gold-accent font-semibold tracking-wider mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-lg font-serif font-semibold text-dark-walnut mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
