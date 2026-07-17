"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { Cta } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { Roadmap } from "@/components/landing/roadmap";
import { StatsRow } from "@/components/landing/stats-row";
import { useToast } from "@/components/landing/toast";
import { Why } from "@/components/landing/why";

export function Landing() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { show, node } = useToast();

  const onNeedsConnect = useCallback(() => {
    show("Connect a wallet to open the desk. Pick one from the modal to continue.");
  }, [show]);

  // Once a wallet connects, the landing pitch is done — send them to the desk.
  useEffect(() => {
    if (isConnected) router.replace("/dashboard");
  }, [isConnected, router]);

  return (
    <div className="landing-root">
      <Hero onNeedsConnect={onNeedsConnect} />
      <StatsRow />
      <Why />
      <Roadmap />
      <Cta onNeedsConnect={onNeedsConnect} />
      {node}
    </div>
  );
}
