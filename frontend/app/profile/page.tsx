"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { EmptyState, Field, Metric, PageHeader, SegmentedBar, SkeletonRows, Spinner, StatusNote } from "@/components/ui";
import { contractConfig, IS_CONTRACT_CONFIGURED } from "@/lib/contract";
import { useBooks, useLoanIds, useLoans, useProfile } from "@/lib/hooks";
import type { Loan } from "@/lib/types";
import { asNumber, dateFromSeconds, explainError, shortAddress } from "@/lib/types";

const EXTEND_CHOICES = [1, 3, 5, 7];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const profile = useProfile(address);
  const [localError, setLocalError] = useState<string | null>(null);
  const [extendDays, setExtendDays] = useState<Record<string, number>>({});
  const write = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: write.data });
  const queryClient = useQueryClient();
  const loanIds = useLoanIds(Boolean(profile.data?.registered), address);
  const activeIds = (loanIds.active.data ?? []) as bigint[];
  const historyIds = ((loanIds.history.data ?? []) as bigint[]).slice(-8).reverse();
  const activeLoans = useLoans(activeIds, Boolean(profile.data?.registered));
  const historyLoans = useLoans(historyIds, Boolean(profile.data?.registered));
  const { books } = useBooks();
  const maxExtension = useReadContract({
    ...contractConfig,
    functionName: "maxExtensionDays",
    query: { enabled: IS_CONTRACT_CONFIGURED },
  });

  // Clock for due-date instruments; ticks once a minute so bars stay honest.
  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = window.setInterval(() => setNowSec(Math.floor(Date.now() / 1000)), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const bookTitleById = useMemo(() => new Map(books.map((book) => [book.id.toString(), book.title])), [books]);

  useEffect(() => {
    if (receipt.isSuccess) {
      void queryClient.invalidateQueries();
    }
  }, [receipt.isSuccess, queryClient]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    if (!IS_CONTRACT_CONFIGURED) {
      setLocalError("Set the contract address before writing.");
      return;
    }
    if (!isConnected) {
      setLocalError("Connect a wallet before saving a profile.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const memberCode = String(data.get("memberCode") ?? "").trim();
    const metadataURI = String(data.get("metadataURI") ?? "").trim();
    if (!fullName) {
      setLocalError("Full name is required.");
      return;
    }
    try {
      await write.writeContractAsync({
        ...contractConfig,
        functionName: "registerCustomer",
        args: [fullName, email, memberCode, metadataURI],
      });
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  async function returnLoan(loanId: bigint) {
    setLocalError(null);
    try {
      await write.writeContractAsync({ ...contractConfig, functionName: "returnBook", args: [loanId] });
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  async function extendLoan(loanId: bigint, days: number) {
    setLocalError(null);
    if (!Number.isInteger(days) || days < 1) {
      setLocalError("Extension must be a whole number of days.");
      return;
    }
    try {
      await write.writeContractAsync({ ...contractConfig, functionName: "extendLoan", args: [loanId, days] });
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  function extensionChoices() {
    const max = asNumber(maxExtension.data as bigint | undefined);
    return EXTEND_CHOICES.filter((days) => !max || days <= max);
  }

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Profile" title="Your borrower record.">
        Register once, then borrow and return from the connected wallet. Updating the profile uses the same contract function.
      </PageHeader>

      <section className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="panel-solid grid content-start gap-0 divide-y divide-[var(--line)] p-5">
          {/* Hero readout: the one display number on this screen */}
          <div className="grid gap-1 pb-5">
            <span className="label-caps">Points balance</span>
            <span className="font-doto text-6xl font-semibold leading-none text-[var(--display)]">
              {profile.data ? Number(profile.data.pointsBalance).toString() : "0"}
            </span>
            <span className="text-xs leading-5 text-[var(--disabled)]">Balance after rewards and penalties</span>
          </div>
          <div className="py-4">
            <Metric label="Wallet" value={isConnected ? shortAddress(address) : "No wallet"} />
          </div>
          <div className="py-4">
            <Metric label="Profile" value={profile.data?.registered ? "Registered" : "Missing"} detail={profile.data?.fullName || "Save profile to borrow"} />
          </div>
          <div className="py-4">
            <Metric
              label="Member since"
              value={profile.data?.registered ? dateFromSeconds(profile.data.joinedAt) : "—"}
              detail={profile.data?.lifetimeBorrows !== undefined ? `${asNumber(profile.data.lifetimeBorrows)} lifetime borrows` : undefined}
            />
          </div>
          <div className="pt-4">
            <Metric label="Active loans" value={profile.data ? asNumber(profile.data.activeLoansCount) : 0} detail="Contract-enforced limit applies" />
          </div>
        </aside>

        <form key={`${address ?? "guest"}-${profile.data?.updatedAt?.toString() ?? "new"}`} onSubmit={submit} className="panel grid gap-5 p-5 md:p-7">
          <Field label="Full name">
            <input name="fullName" defaultValue={profile.data?.fullName ?? ""} placeholder="Mira Okonkwo" />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Email">
              <input type="email" name="email" defaultValue={profile.data?.email ?? ""} placeholder="mira@provenance.studio" />
            </Field>
            <Field label="Member code">
              <input name="memberCode" defaultValue={profile.data?.memberCode ?? ""} placeholder="BR-4827" />
            </Field>
          </div>
          <Field label="Metadata URI" help="Optional profile metadata pointer.">
            <input name="metadataURI" defaultValue={profile.data?.metadataURI ?? ""} placeholder="ipfs://profile-json" />
          </Field>
          {localError || write.error || receipt.error ? <StatusNote tone="error">{localError ?? explainError(write.error ?? receipt.error)}</StatusNote> : null}
          {receipt.isSuccess ? <StatusNote tone="success">Profile or loan state updated.</StatusNote> : null}
          <button className="btn-primary justify-self-start gap-2" type="submit" disabled={write.isPending || receipt.isLoading}>
            {write.isPending || receipt.isLoading ? <Spinner /> : null}
            {write.isPending ? "Confirm in wallet" : receipt.isLoading ? "Waiting for chain" : profile.data?.registered ? "Update profile" : "Register profile"}
          </button>
        </form>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div>
          <h2 className="label-caps mb-3">
            Active loans {activeLoans.loans.length > 0 ? `[ ${activeLoans.loans.length} ]` : ""}
          </h2>
          {!profile.data?.registered ? <EmptyState title="Register before borrowing." body="Active loans appear here after your profile exists and a book is borrowed." /> : null}
          {activeLoans.isLoading ? <SkeletonRows rows={3} /> : null}
          {profile.data?.registered && activeLoans.loans.length === 0 && !activeLoans.isLoading ? <EmptyState title="No active loans." body="Borrowed books that need returning will appear here." /> : null}
          {activeLoans.loans.length > 0 ? (
            <div className="panel divide-y divide-[var(--line)]">
              {activeLoans.loans.map((loan) => (
                <LoanRow
                  key={loan.id.toString()}
                  loan={loan}
                  nowSec={nowSec}
                  title={bookTitleById.get(loan.bookId.toString()) ?? `Book #${loan.bookId.toString()}`}
                  busy={write.isPending || receipt.isLoading}
                  onReturn={() => returnLoan(loan.id)}
                  onExtend={(days) => extendLoan(loan.id, days)}
                  extendChoices={extensionChoices()}
                  extendValue={extendDays[loan.id.toString()] ?? 3}
                  onExtendValueChange={(days) => setExtendDays({ ...extendDays, [loan.id.toString()]: days })}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h2 className="label-caps mb-3">
            Loan history {historyLoans.loans.length > 0 ? `[ last ${historyLoans.loans.length} ]` : ""}
          </h2>
          {historyLoans.isLoading ? <SkeletonRows rows={3} /> : null}
          {profile.data?.registered && historyLoans.loans.length === 0 && !historyLoans.isLoading ? <EmptyState title="No history yet." body="Borrow and return activity will collect here." /> : null}
          {historyLoans.loans.length > 0 ? (
            <div className="panel divide-y divide-[var(--line)]">
              {historyLoans.loans.map((loan) => (
                <article key={loan.id.toString()} className="grid gap-1.5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[var(--fg)] md:text-base">{bookTitleById.get(loan.bookId.toString()) ?? `Book #${loan.bookId.toString()}`}</h3>
                    <span className={loan.returned ? "rounded-full border border-[var(--success)] px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--success)]" : "rounded-full border border-[var(--warning)] px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--warning)]"}>
                      {loan.returned ? "Returned" : "Open"}
                    </span>
                  </div>
                  <p className="font-mono text-xs leading-5 text-[var(--muted)]">Borrowed {dateFromSeconds(loan.borrowedAt)} — Due {dateFromSeconds(loan.dueAt)}</p>
                  <p className="font-mono text-xs leading-5">
                    <span className="text-[var(--disabled)]">Points delta </span>
                    <span className={asNumber(loan.pointsDelta) >= 0 ? "font-bold text-[var(--success)]" : "font-bold text-[var(--accent)]"}>{asNumber(loan.pointsDelta) >= 0 ? `+${asNumber(loan.pointsDelta)}` : asNumber(loan.pointsDelta)}</span>
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function LoanRow({
  loan,
  nowSec,
  title,
  busy,
  onReturn,
  onExtend,
  extendChoices,
  extendValue,
  onExtendValueChange,
}: {
  loan: Loan;
  nowSec: number;
  title: string;
  busy: boolean;
  onReturn: () => void;
  onExtend: (days: number) => void;
  extendChoices: number[];
  extendValue: number;
  onExtendValueChange: (days: number) => void;
}) {
  // Time-to-due as the instrument: proportion of the loan window remaining.
  const start = asNumber(loan.borrowedAt);
  const due = asNumber(loan.dueAt);
  const span = Math.max(due - start, 1);
  const left = due - nowSec;
  const ratio = Math.max(0, Math.min(left / span, 1));
  const filled = Math.round(ratio * 24);
  const tone = left < 0 ? "var(--accent)" : ratio < 0.25 ? "var(--warning)" : "var(--success)";
  const daysLeft = Math.ceil(left / 86400);

  return (
    <article className="grid gap-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--display)] md:text-base">{title}</h3>
        <span className="font-mono text-xs text-[var(--muted)]">#{loan.id.toString()}</span>
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="label-caps">{left < 0 ? "Overdue" : `${daysLeft}d ${Math.floor((left % 86400) / 3600)}h left`}</span>
          <span className="font-mono text-xs" style={{ color: tone }}>Due {dateFromSeconds(loan.dueAt)}</span>
        </div>
        <SegmentedBar filled={filled} total={24} tone={tone} height="h-[6px]" />
      </div>

      <div className="flex flex-wrap items-end gap-2 pt-1">
        <button type="button" className="btn-primary gap-2" disabled={busy} onClick={onReturn}>
          {busy ? <Spinner /> : null}
          Return book
        </button>
        <Field label="Extend">
          <select value={extendValue} onChange={(event) => onExtendValueChange(Number(event.target.value))}>
            {extendChoices.map((days) => (
              <option key={days} value={days}>{days}d</option>
            ))}
          </select>
        </Field>
        <button type="button" className="btn-secondary gap-2" disabled={busy} onClick={() => onExtend(extendValue)}>
          {busy ? <Spinner /> : null}
          Extend loan
        </button>
      </div>
    </article>
  );
}
