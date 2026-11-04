"use client";

import { useState } from "react";
import { Mail, RefreshCw, Search, Trash2, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { ErrorState } from "@/components/feedback/error-state";
import {
  useMessages,
  type InboxMessage,
  type MessageStatus,
} from "@/hooks/use-messages";

const labels = { UNREAD: "Unread", READ: "Read", REPLIED: "Replied" };
export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [selected, setSelected] = useState<InboxMessage | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { query, update, remove } = useMessages(page, status, search);
  const totalPages = Math.max(1, Math.ceil((query.data?.total ?? 0) / 12));
  function openMessage(message: InboxMessage) {
    setSelected(message);
    if (message.status === "UNREAD") changeStatus(message, "READ");
  }
  function changeStatus(message: InboxMessage, next: MessageStatus) {
    update.mutate(
      { id: message.id, status: next },
      {
        onSuccess: (updated) =>
          setSelected((current) =>
            current?.id === updated.id ? updated : current,
          ),
      },
    );
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <PageHeader
        description="Private enquiries from your portfolio. Reply through your email app, then mark the conversation as replied."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw className={query.isFetching ? "animate-spin" : ""} />
            Refresh
          </Button>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
        <div className="flex flex-wrap gap-1" aria-label="Filter messages">
          {[["", "All"], ...Object.entries(labels)].map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={status === value ? "secondary" : "ghost"}
              aria-pressed={status === value}
              onClick={() => {
                setStatus(value);
                setPage(1);
                setSelected(null);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
        <form
          className="flex w-full gap-2 sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(draftSearch.trim());
            setPage(1);
            setSelected(null);
          }}
        >
          <Input
            aria-label="Search messages"
            placeholder="Search enquiries…"
            maxLength={100}
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
          />
          <Button variant="outline" size="icon" aria-label="Search">
            <Search />
          </Button>
        </form>
      </div>
      {query.isError && (
        <ErrorState
          title="Messages could not be loaded"
          description="Try again to reconnect to the inbox."
          onRetry={() => void query.refetch()}
        />
      )}
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.4fr)]">
        <section
          className={`${selected ? "hidden lg:flex" : "flex"} min-w-0 flex-col overflow-hidden rounded-xl border bg-card`}
          aria-label="Message list"
        >
          <div className="border-b px-4 py-3 text-sm text-muted-foreground">
            {query.data?.total ?? "…"} enquiries
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {query.isPending ? (
              <div
                className="space-y-4 p-4"
                role="status"
                aria-label="Loading messages"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : query.data?.items.length ? (
              query.data.items.map((message) => (
                <button
                  type="button"
                  key={message.id}
                  disabled={update.isPending}
                  onClick={() => openMessage(message)}
                  className={`block w-full space-y-2 border-b p-4 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${selected?.id === message.id ? "bg-muted/70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate font-medium">{message.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${message.status === "UNREAD" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {labels[message.status]}
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium">
                    {message.subject}
                  </p>
                  <p className="line-clamp-2 break-words text-xs text-muted-foreground">
                    {message.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            ) : (
              !query.isError && (
                <div className="px-6 py-16 text-center">
                  <Mail className="mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium">No enquiries found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {status || search
                      ? "Try a different filter or search."
                      : "Messages from your contact form will appear here."}
                  </p>
                </div>
              )
            )}
          </div>
          <div className="flex items-center justify-between gap-2 border-t p-3 text-xs text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || query.isFetching}
              onClick={() => {
                setPage(page - 1);
                setSelected(null);
              }}
            >
              Previous
            </Button>
            <span>
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || query.isFetching}
              onClick={() => {
                setPage(page + 1);
                setSelected(null);
              }}
            >
              Next
            </Button>
          </div>
        </section>
        <section
          className={`${selected ? "flex" : "hidden lg:flex"} min-w-0 flex-col rounded-xl border bg-card p-4 sm:p-6`}
          aria-label="Message details"
        >
          {selected ? (
            <>
              <Button
                className="mb-4 self-start lg:hidden"
                size="sm"
                variant="ghost"
                onClick={() => setSelected(null)}
              >
                <ArrowLeft />
                Back to inbox
              </Button>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-muted px-3 py-1 text-xs">
                  {labels[selected.status]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(selected.createdAt).toLocaleString()}
                </span>
              </div>
              <h2 className="mt-5 break-words text-xl font-semibold">
                {selected.subject}
              </h2>
              <p className="mt-2 break-words text-sm text-muted-foreground">
                {selected.name} · {selected.email}
              </p>
              <p className="my-6 min-h-24 flex-1 whitespace-pre-wrap break-words border-y py-6 text-sm leading-7">
                {selected.message}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  render={
                    <a
                      href={`mailto:${encodeURIComponent(selected.email).replace(/%40/g, "@")}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                    />
                  }
                >
                  <Mail />
                  Reply by email
                </Button>
                {selected.status !== "REPLIED" && (
                  <Button
                    variant="outline"
                    disabled={update.isPending}
                    onClick={() => changeStatus(selected, "REPLIED")}
                  >
                    Mark replied
                  </Button>
                )}
                <Button
                  variant="outline"
                  disabled={update.isPending}
                  onClick={() =>
                    changeStatus(
                      selected,
                      selected.status === "UNREAD" ? "READ" : "UNREAD",
                    )
                  }
                >
                  {selected.status === "UNREAD" ? "Mark read" : "Mark unread"}
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive"
                  disabled={remove.isPending}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <div className="m-auto py-24 text-center">
              <Mail className="mx-auto mb-3 size-8 text-muted-foreground" />
              <h2 className="font-medium">Your conversations, in one place</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Select an enquiry to read it and respond.
              </p>
            </div>
          )}
        </section>
      </div>
      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete enquiry?"
        message="This permanently removes the message from your inbox."
        loading={remove.isPending}
        onConfirm={() =>
          selected &&
          remove.mutate(selected.id, {
            onSuccess: () => {
              setDeleteOpen(false);
              setSelected(null);
              if (query.data?.items.length === 1 && page > 1) setPage(page - 1);
            },
          })
        }
      />
    </div>
  );
}
