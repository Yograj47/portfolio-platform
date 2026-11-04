"use client";
import { useQuery } from "@tanstack/react-query";
import { loadPortfolio } from "@/lib/portfolio-loader";
import { CvDocument } from "./cv-document";
import { CvLoading } from "./cv-loading";
import styles from "./cv-loading.module.css";
export function CvHome() {
  const query = useQuery({
    queryKey: ["portfolio-home-v2"],
    networkMode: "always",
    queryFn: ({ signal }) => loadPortfolio({ signal }),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  if (query.data) return <CvDocument cv={query.data} />;
  if (query.isError)
    return (
      <main className={styles.error} data-cv-error>
        <div role="alert">
          <h1>The portfolio could not be loaded</h1>
          <p>
            The service may still be starting. Please try again in a moment.
          </p>
        </div>
        <button type="button" onClick={() => void query.refetch()}>
          Try again
        </button>
      </main>
    );
  return <CvLoading />;
}
