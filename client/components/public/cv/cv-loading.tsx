import styles from "./cv-loading.module.css";
import { ProjectsSkeleton } from "@/components/public/projects/projects-skeleton";
import { SkillsSkeleton } from "@/components/public/skills/skills-skeleton";
import { TimelineSkeleton } from "@/components/public/timeline/timeline-skeleton";
export function CvLoading() {
  return (
    <main
      className={styles.page}
      data-cv-loading
      aria-busy="true"
      aria-label="Loading Yograj Rijal’s portfolio"
    >
      <div className={styles.status} role="status" aria-live="polite">
        <p>
          Connecting to server
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </p>
        <span>
          Loading Yograj Rijal’s portfolio — projects, experience, skills, and
          AWS training. The server may take about a minute to wake up. Thank you
          for your patience.
        </span>
      </div>
      <div className={styles.document} aria-hidden="true">
        <div className={styles.header}>
          <div className={styles.name} />
          <div className={styles.subtitle} />
          <div className={styles.contact} />
        </div>
        <ProjectsSkeleton cardCount={2} />
        <div className={styles.section}>
          <SkillsSkeleton />
        </div>
        <div className={styles.section}>
          <TimelineSkeleton />
        </div>
      </div>
    </main>
  );
}
