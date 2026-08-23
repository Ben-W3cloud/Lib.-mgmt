"use client";

import { FormEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Field, PageHeader, Spinner, StatusNote } from "@/components/ui";
import { contractConfig, IS_CONTRACT_CONFIGURED } from "@/lib/contract";
import { explainError } from "@/lib/types";

const initial = { title: "", author: "", isbn: "", copies: "1", category: "", tags: "" };

export default function ListBookPage() {
  const { isConnected } = useAccount();
  const [form, setForm] = useState(initial);
  const [localError, setLocalError] = useState<string | null>(null);
  const write = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: write.data });
  const queryClient = useQueryClient();

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
      setLocalError("Connect a wallet before listing a book.");
      return;
    }
    const copies = Number(form.copies);
    if (!form.title.trim() || !form.author.trim() || !form.isbn.trim()) {
      setLocalError("Title, author, and ISBN are required.");
      return;
    }
    if (!Number.isInteger(copies) || copies < 1) {
      setLocalError("Copies must be a whole number above zero.");
      return;
    }
    const tags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    try {
      await write.writeContractAsync({
        ...contractConfig,
        functionName: "addBook",
        args: [form.title.trim(), form.author.trim(), form.isbn.trim(), BigInt(copies), form.category.trim(), tags],
      });
    } catch (err) {
      setLocalError(explainError(err));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="List" title="Put a book into circulation.">
        Your connected wallet becomes the lister. Only that wallet can add copies or pause the listing later.
      </PageHeader>
      <form onSubmit={submit} className="panel grid gap-5 p-5 md:max-w-3xl md:p-7">
        <Field label="Title">
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="The Ministry for the Future" />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Author">
            <input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} placeholder="Kim Stanley Robinson" />
          </Field>
          <Field label="ISBN">
            <input value={form.isbn} onChange={(event) => setForm({ ...form, isbn: event.target.value })} placeholder="978-0316300131" />
          </Field>
        </div>
        <Field label="Copies" help="Use whole copies. Additional copies can be added from My listings.">
          <input type="number" min="1" step="1" value={form.copies} onChange={(event) => setForm({ ...form, copies: event.target.value })} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Category" help="Optional, e.g. fiction or science.">
            <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="fiction" />
          </Field>
          <Field label="Tags" help="Optional, comma separated.">
            <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="fantasy, adventure" />
          </Field>
        </div>
        {localError || write.error || receipt.error ? <StatusNote tone="error">{localError ?? explainError(write.error ?? receipt.error)}</StatusNote> : null}
        {receipt.isSuccess ? <StatusNote tone="success">Book listed. It is now visible in Browse and My listings.</StatusNote> : null}
        <button className="btn-primary justify-self-start gap-2" type="submit" disabled={write.isPending || receipt.isLoading}>
          {write.isPending || receipt.isLoading ? <Spinner /> : null}
          {write.isPending ? "Confirm in wallet" : receipt.isLoading ? "Waiting for chain" : "List book"}
        </button>
      </form>
    </div>
  );
}


