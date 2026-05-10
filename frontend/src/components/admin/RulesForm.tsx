/**
 * =============================================================================
 * RulesForm â€” Admin controls for point and borrow rules
 * =============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { useContractConfig, useSetPointRules, useSetBorrowRules } from "@/hooks/useAdmin";
import { secondsToDays, daysToSeconds } from "@/lib/utils";
import { Award, Clock, Save, Shield } from "lucide-react";

export function RulesForm() {
  const { config, isLoading } = useContractConfig();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PointRulesSection config={config} isLoading={isLoading} />
      <BorrowRulesSection config={config} isLoading={isLoading} />
    </div>
  );
}

function PointRulesSection({
  config,
  isLoading,
}: {
  config: ReturnType<typeof useContractConfig>["config"];
  isLoading: boolean;
}) {
  const [borrowReward, setBorrowReward] = useState<string | null>(null);
  const [onTimeReward, setOnTimeReward] = useState<string | null>(null);
  const [latePenalty, setLatePenalty] = useState<string | null>(null);
  const { setPointRules, isPending, isSuccess, reset } = useSetPointRules();

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => reset(), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowReward || !onTimeReward || !latePenalty) return;
    setPointRules(parseInt(borrowReward, 10), parseInt(onTimeReward, 10), parseInt(latePenalty, 10));
  };

  const borrowRewardValue = borrowReward ?? (config ? config.borrowRewardPoints.toString() : "");
  const onTimeRewardValue = onTimeReward ?? (config ? config.onTimeReturnRewardPoints.toString() : "");
  const latePenaltyValue = latePenalty ?? (config ? config.latePenaltyPerDay.toString() : "");

  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-cyan-200" />
          <h2 className="text-lg font-serif font-semibold text-[#edf0ff]">
            Point Rules
          </h2>
        </div>
        <p className="mt-1 text-sm text-[#8e9ab8]">
          Configure reward and penalty points for borrowing activities.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Borrow Reward Points"
            type="number"
            min="0"
            value={borrowRewardValue}
            onChange={(e) => setBorrowReward(e.target.value)}
            hint="Points earned when borrowing a book"
            disabled={isLoading || isPending}
          />
          <Input
            label="On-Time Return Bonus"
            type="number"
            min="0"
            value={onTimeRewardValue}
            onChange={(e) => setOnTimeReward(e.target.value)}
            hint="Bonus points for returning on time"
            disabled={isLoading || isPending}
          />
          <Input
            label="Late Penalty (per day)"
            type="number"
            min="0"
            value={latePenaltyValue}
            onChange={(e) => setLatePenalty(e.target.value)}
            hint="Points deducted per day of late return"
            disabled={isLoading || isPending}
          />
          <Button type="submit" isLoading={isPending} disabled={isSuccess} className="w-full">
            <Save className="h-4 w-4" />
            {isSuccess ? "Saved" : "Update Point Rules"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function BorrowRulesSection({
  config,
  isLoading,
}: {
  config: ReturnType<typeof useContractConfig>["config"];
  isLoading: boolean;
}) {
  const [maxDays, setMaxDays] = useState<string | null>(null);
  const [maxLoans, setMaxLoans] = useState<string | null>(null);
  const { setBorrowRules, isPending, isSuccess, reset } = useSetBorrowRules();

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => reset(), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maxDays || !maxLoans) return;
    const durationSeconds = daysToSeconds(parseInt(maxDays, 10));
    setBorrowRules(durationSeconds, parseInt(maxLoans, 10));
  };

  const maxDaysValue = maxDays ?? (config ? secondsToDays(config.maxBorrowDuration).toString() : "");
  const maxLoansValue = maxLoans ?? (config ? config.maxActiveLoansPerCustomer.toString() : "");

  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-200" />
          <h2 className="text-lg font-serif font-semibold text-[#edf0ff]">
            Borrow Rules
          </h2>
        </div>
        <p className="mt-1 text-sm text-[#8e9ab8]">
          Set maximum borrow durations and active loan limits.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Max Borrow Duration (days)"
            type="number"
            min="1"
            value={maxDaysValue}
            onChange={(e) => setMaxDays(e.target.value)}
            hint="Maximum number of days a book can be borrowed"
            disabled={isLoading || isPending}
          />
          <Input
            label="Max Active Loans per Customer"
            type="number"
            min="1"
            value={maxLoansValue}
            onChange={(e) => setMaxLoans(e.target.value)}
            hint="Maximum simultaneous active loans per customer"
            disabled={isLoading || isPending}
          />
          <Button type="submit" isLoading={isPending} disabled={isSuccess} className="w-full">
            <Shield className="h-4 w-4" />
            {isSuccess ? "Saved" : "Update Borrow Rules"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
