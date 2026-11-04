"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  FolderKanban,
  Mail,
  HardDrive,
  Layers,
  RefreshCw,
  ImagePlus,
  UserRound,
  Globe,
} from "lucide-react";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { useAuthStore } from "@/store/auth.store";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSummary } from "@/lib/validations/dashboard";
import styles from "./dashboard-overview.module.css";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(bytes / 1024 ** i)} ${units[i]}`;
}
function date(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function Status({ value }: { value: string }) {
  return (
    <span className={styles.status} data-status={value}>
      {value.toLowerCase()}
    </span>
  );
}
export function DashboardOverviewLoading() {
  return (
    <div
      className={styles.loading}
      role="status"
      aria-label="Loading dashboard overview"
    >
      <div aria-hidden="true">
        <Skeleton className="mb-3 h-8 w-64 max-w-full" />
        <Skeleton className="mb-8 h-4 w-80 max-w-full" />
        <div className={styles.stats}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
        <div className={styles.columns}>
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
export function DashboardOverview() {
  const query = useDashboardSummary();
  const name = useAuthStore((s) => s.user?.name.split(" ")[0] || "there");
  if (!query.data) {
    if (query.isError)
      return (
        <ErrorState
          title="Dashboard could not be loaded"
          description="Your overview is unavailable right now. Try again to load the latest data."
          onRetry={() => void query.refetch()}
        />
      );
    return <DashboardOverviewLoading />;
  }
  const data = query.data;
  const cards = [
    {
      label: "Published projects",
      value: data.projects.published,
      detail: `${data.projects.total} total · ${data.projects.draft} drafts`,
      icon: FolderKanban,
      href: "/admin/dashboard/projects",
    },
    {
      label: "Unread enquiries",
      value: data.messages.unread,
      detail: `${data.messages.total} received · ${data.messages.replied} replied`,
      icon: Mail,
      href: "/admin/dashboard/messages",
    },
    {
      label: "Recorded media usage",
      value: formatBytes(data.media.bytes),
      detail: `${data.media.files} files in your library`,
      icon: HardDrive,
      href: "/admin/dashboard/media",
    },
    {
      label: "Skills & tools",
      value: data.content.skills,
      detail: `${data.content.timelineEntries} milestones · ${data.content.credentials} credentials`,
      icon: Layers,
      href: "/admin/dashboard/skills",
    },
  ];
  return (
    <div className={styles.overview} data-dashboard-overview>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Overview</p>
          <h2>Welcome back, {name}.</h2>
          <p>Keep your work current and see what needs your attention.</p>
        </div>
        <button
          className={styles.refresh}
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
        >
          <RefreshCw
            size={15}
            className={query.isFetching ? "animate-spin" : ""}
          />
          {query.isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </header>
      {query.isError && (
        <p className={styles.warning} role="alert">
          Couldn’t refresh the overview. Showing the last successful snapshot.
        </p>
      )}
      <div className={styles.stats}>
        {cards.map(({ label, value, detail, icon: Icon, href }) => (
          <Link href={href} key={label} className={styles.stat}>
            <div className={styles.statLabel}>
              <span>{label}</span>
              <Icon size={17} aria-hidden="true" />
            </div>
            <strong>{value}</strong>
            <p>{detail}</p>
          </Link>
        ))}
      </div>
      <div className={styles.columns}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <h3>Publishing overview</h3>
              <p>Project visibility across your portfolio.</p>
            </div>
            <span className={styles.total}>{data.projects.total} projects</span>
          </div>
          <Publishing data={data} />
          <div className={styles.contentCounts}>
            <Link href="/admin/dashboard/categories">
              <b>{data.content.categories}</b> Categories
            </Link>
            <Link href="/admin/dashboard/timeline">
              <b>{data.content.timelineEntries}</b> Timeline entries
            </Link>
            <Link href="/admin/dashboard/timeline">
              <b>{data.content.credentials}</b> Credentials
            </Link>
          </div>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <h3>Quick actions</h3>
              <p>Pick up where you left off.</p>
            </div>
          </div>
          <div className={styles.shortcuts}>
            {[
              {
                href: "/admin/dashboard/projects",
                label: "Manage projects",
                description: "Publish, update, or organize your work.",
                icon: FolderKanban,
              },
              {
                href: "/admin/dashboard/media",
                label: "Manage media",
                description: "Upload images and manage your library.",
                icon: ImagePlus,
              },
              {
                href: "/admin/dashboard/profile",
                label: "Update profile",
                description: "Keep your introduction and links current.",
                icon: UserRound,
              },
              {
                href: "/",
                label: "View portfolio",
                description: "See the public page your visitors see.",
                icon: Globe,
              },
            ].map(({ href, label, description, icon: Icon }) => (
              <Link href={href} key={label}>
                <span className={styles.shortcutIcon}>
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span>
                  <b>{label}</b>
                  <small>{description}</small>
                </span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <div className={styles.columns}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <h3>Recently updated projects</h3>
              <p>Your five most recently edited projects.</p>
            </div>
            <Link href="/admin/dashboard/projects" className={styles.textLink}>
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>
          {data.recentProjects.length ? (
            <ul className={styles.list}>
              {data.recentProjects.map((project) => (
                <li key={project.id}>
                  <div className={styles.projectRow}>
                    <div>
                      <Link
                        href="/admin/dashboard/projects"
                        className={styles.itemTitle}
                      >
                        {project.title}
                      </Link>
                      <p>
                        {project.category.name} · Updated{" "}
                        {date(project.updatedAt)}
                      </p>
                    </div>
                    <Status value={project.status} />
                  </div>
                  {project.status === "PUBLISHED" && (
                    <Link
                      className={styles.textLink}
                      href={`/projects/${encodeURIComponent(project.slug)}`}
                    >
                      View live project <ArrowUpRight size={12} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <FolderKanban size={24} />
              <p>No projects yet.</p>
              <Link href="/admin/dashboard/projects">
                Create your first project ↗
              </Link>
            </div>
          )}
        </section>
        <section className={styles.panel} id="recent-messages">
          <div className={styles.panelHeading}>
            <div>
              <h3>
                <Link href="/admin/dashboard/messages">Recent enquiries</Link>
              </h3>
              <p>The latest five messages from your contact form.</p>
            </div>
            <span className={styles.total}>{data.messages.unread} unread</span>
          </div>
          {data.recentMessages.length ? (
            <ul className={styles.list}>
              {data.recentMessages.map((message) => (
                <li key={message.id}>
                  <div className={styles.projectRow}>
                    <strong className={styles.itemTitle}>
                      {message.subject}
                    </strong>
                    <Status value={message.status} />
                  </div>
                  <p>
                    {message.name} · {date(message.createdAt)}
                  </p>
                  <a
                    className={styles.textLink}
                    href={`mailto:${encodeURIComponent(message.email).replace(/%40/g, "@")}`}
                  >
                    {message.email} <ArrowUpRight size={12} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <Mail size={24} />
              <p>No enquiries yet.</p>
              <span>New contact form messages will appear here.</span>
            </div>
          )}
        </section>
      </div>
      <footer className={styles.footer}>
        <span>
          Media usage is based on stored file records, not your hosting quota.
        </span>
        <time dateTime={data.generatedAt}>
          Updated{" "}
          {new Date(data.generatedAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </footer>
    </div>
  );
}
function Publishing({ data }: { data: DashboardSummary }) {
  return (
    <div className={styles.publishing}>
      {data.projects.total ? (
        <div className={styles.bar} aria-hidden="true">
          {(["published", "draft", "archived"] as const).map((status) => (
            <span
              key={status}
              data-kind={status}
              style={{
                width: `${(data.projects[status] / data.projects.total) * 100}%`,
              }}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyNote}>No projects to publish yet.</p>
      )}
      <div className={styles.legend}>
        {(["published", "draft", "archived"] as const).map((status) => (
          <div key={status}>
            <span data-kind={status} />
            <p>{status}</p>
            <strong>{data.projects[status]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
