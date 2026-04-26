/**
 * =============================================================================
 * RulesForm — Admin forms for updating point and borrow rules
 * =============================================================================
 *
 * Two forms:
 * 1. Point Rules → setPointRules(borrowReward, onTimeReturn, latePenalty)
 * 2. Borrow Rules → setBorrowRules(maxBorrowDuration, maxActiveLoans)
 *
 * Pre-populates with current config from the contract.
 */

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { useContractConfig, useSetPointRules, useSetBorrowRules } from "@/hooks/useAdmin";
import { secondsToDays, daysToSeconds } from "@/lib/utils";
import { Award, Clock, Save } from "lucide-react";

export function RulesForm() {
  const { config, isLoading } = useContractConfig();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PointRulesSection config={config} isLoading={isLoading} />
      <BorrowRulesSection config={config} isLoading={isLoading} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Point Rules Section
// ---------------------------------------------------------------------------
function PointRulesSection({
  config,
  isLoading,
}: {
  config: ReturnType<typeof useContractConfig>["config"];
  isLoading: boolean;
}) {
  const [borrowReward, setBorrowReward] = useState("");
  const [onTimeReward, setOnTimeReward] = useState("");
  const [latePenalty, setLatePenalty] = useState("");
  const { setPointRules, isPending, isSuccess, reset } = useSetPointRules();

  // Pre-fill with current config values
  useEffect(() => {
    if (config) {
      setBorrowReward(config.borrowRewardPoints.toString());
      setOnTimeReward(config.onTimeReturnRewardPoints.toString());
      setLatePenalty(config.latePenaltyPerDay.toString());
    }
  }, [config]);

  useEffect(() => {
    if (isSuccess) setTimeout(() => reset(), 2000);
  }, [isSuccess, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPointRules(parseInt(borrowReward), parseInt(onTimeReward), parseInt(latePenalty));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-gold-accent" />
          <h2 className="text-lg font-serif font-semibold text-dark-walnut">
            Point Rules
          </h2>
        </div>
        <p className="text-sm text-slate mt-1">
          Configure reward and penalty points for borrowing activities.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Borrow Reward Points"
            type="number"
            min="0"
            value={borrowReward}
            onChange={(e) => setBorrowReward(e.target.value)}
            hint="Points earned when borrowing a book"
            disabled={isLoading || isPending}
          />
          <Input
            label="On-Time Return Bonus"
            type="number"
            min="0"
            value={onTimeReward}
            onChange={(e) => setOnTimeReward(e.target.value)}
            hint="Bonus points for returning on time"
            disabled={isLoading || isPending}
          />
          <Input
            label="Late Penalty (per day)"
            type="number"
            min="0"
            value={latePenalty}
            onChange={(e) => setLatePenalty(e.target.value)}
            hint="Points deducted per day of late return"
            disabled={isLoading || isPending}
          />
          <Button type="submit" isLoading={isPending} disabled={isSuccess}>
            <Save className="w-4 h-4" />
            {isSuccess ? "Saved! ✓" : "Update Point Rules"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Borrow Rules Section
// ---------------------------------------------------------------------------
function BorrowRulesSection({
  config,
  isLoading,
}: {
  config: ReturnType<typeof useContractConfig>["config"];
  isLoading: boolean;
}) {
  const [maxDays, setMaxDays] = useState("");
  const [maxLoans, setMaxLoans] = useState("");
  const { setBorrowRules, isPending, isSuccess, reset } = useSetBorrowRules();

  // Pre-fill with current config values
  useEffect(() => {
    if (config) {
      setMaxDays(secondsToDays(config.maxBorrowDuration).toString());
      setMaxLoans(config.maxActiveLoansPerCustomer.toString());
    }
  }, [config]);

  useEffect(() => {
    if (isSuccess) setTimeout(() => reset(), 2000);
  }, [isSuccess, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationSeconds = daysToSeconds(parseInt(maxDays));
    setBorrowRules(durationSeconds, parseInt(maxLoans));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-leather-brown" />
          <h2 className="text-lg font-serif font-semibold text-dark-walnut">
            Borrow Rules
          </h2>
        </div>
        <p className="text-sm text-slate mt-1">
          Set maximum borrow durations and active loan limits.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Max Borrow Duration (days)"
            type="number"
            min="1"
            value={maxDays}
            onChange={(e) => setMaxDays(e.target.value)}
            hint="Maximum number of days a book can be borrowed"
            disabled={isLoading || isPending}
          />
          <Input
            label="Max Active Loans per Customer"
            type="number"
            min="1"
            value={maxLoans}
            onChange={(e) => setMaxLoans(e.target.value)}
            hint="Maximum simultaneous active loans per customer"
            disabled={isLoading || isPending}
          />
          <Button type="submit" isLoading={isPending} disabled={isSuccess}>
            <Save className="w-4 h-4" />
            {isSuccess ? "Saved! ✓" : "Update Borrow Rules"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
