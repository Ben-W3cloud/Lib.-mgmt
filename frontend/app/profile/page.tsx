"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { EmptyState, Field, Metric, PageHeader, SkeletonRows, Spinner, StatusNote } from "@/components/ui";
import { contractConfig, IS_CONTRACT_CONFIGURED } from "@/lib/contract";
import { useBooks, useLoanIds, useLoans, useProfile } from "@/lib/hooks";
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

  async function extendLoan(loanId: bigint) {
    setLocalError(null);
    const days = extendDays[loanId.toString()] ?? 3;
    try {
      await write.writeContractAsync({ ...contractConfig, functionName: "extendLoan", args: [loanId, BigInt(days)] });
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
      <PageHeader eyebrow="Profile" title="Borrower record and loan desk.">
        Register once, then borrow and return from the connected wallet. Updating the profile uses the same contract function.
      </PageHeader>

      <section className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="panel-solid p-5">
          <p className="eyebrow">Account</p>
          <div className="mt-5 grid gap-4">
            <Metric label="Wallet" value={isConnected ? shortAddress(address) : "No wallet"} />
            <Metric label="Profile" value={profile.data?.registered ? "Registered" : "Missing"} detail={profile.data?.fullName || "Save profile to borrow"} />
            <Metric label="Points" value={profile.data ? Number(profile.data.pointsBalance).toString() : "0"} detail="Balance after rewards and penalties" />
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
          <h2 className="mb-3 text-2xl font-semibold tracking-tight">Active loans</h2>
          {!profile.data?.registered ? <EmptyState title="Register before borrowing." body="Active loans appear here after your profile exists and a book is borrowed." /> : null}
          {activeLoans.isLoading ? <SkeletonRows rows={3} /> : null}
          {profile.data?.registered && activeLoans.loans.length === 0 && !activeLoans.isLoading ? <EmptyState title="No active loans." body="Borrowed books that need returning will appear here." /> : null}
          {activeLoans.loans.length > 0 ? (
            <div className="panel divide-y divide-[var(--line)]">
              {activeLoans.loans.map((loan) => (
                <article key={loan.id.toString()} className="grid gap-3 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold tracking-tight">{bookTitleById.get(loan.bookId.toString()) ?? `Book #${loan.bookId.toString()}`}</h3>
                    <span className="font-mono text-xs text-[var(--muted)]">Loan #{loan.id.toString()}</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">Due {dateFromSeconds(loan.dueAt)}</p>
                  <div className="flex flex-wrap items-end gap-2">
                    <button type="button" className="btn-primary gap-2" disabled={write.isPending || receipt.isLoading} onClick={() => returnLoan(loan.id)}>
                      {write.isPending || receipt.isLoading ? <Spinner /> : null}
                      Return book
                    </button>
                    <Field label="Extend (days)">
                      <select
                        value={extendDays[loan.id.toString()] ?? 3}
                        onChange={(event) => setExtendDays({ ...extendDays, [loan.id.toString()]: Number(event.target.value) })}
                      >
                        {extensionChoices().map((days) => (
                          <option key={days} value={days}>{days}</option>
                        ))}
                      </select>
                    </Field>
                    <button type="button" className="btn-secondary gap-2" disabled={write.isPending || receipt.isLoading} onClick={() => extendLoan(loan.id)}>
                      {write.isPending || receipt.isLoading ? <Spinner /> : null}
                      Extend loan
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h2 className="mb-3 text-2xl font-semibold tracking-tight">Recent loan history</h2>
          {historyLoans.isLoading ? <SkeletonRows rows={3} /> : null}
          {profile.data?.registered && historyLoans.loans.length === 0 && !historyLoans.isLoading ? <EmptyState title="No history yet." body="Borrow and return activity will collect here." /> : null}
          {historyLoans.loans.length > 0 ? (
            <div className="panel divide-y divide-[var(--line)]">
              {historyLoans.loans.map((loan) => (
                <article key={loan.id.toString()} className="grid gap-2 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold tracking-tight">{bookTitleById.get(loan.bookId.toString()) ?? `Book #${loan.bookId.toString()}`}</h3>
                    <span className="rounded-full bg-[var(--panel-strong)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">{loan.returned ? "Returned" : "Open"}</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">Borrowed {dateFromSeconds(loan.borrowedAt)} - Due {dateFromSeconds(loan.dueAt)}</p>
                  <p className="font-mono text-xs text-[var(--muted)]">Points delta {loan.pointsDelta.toString()}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
