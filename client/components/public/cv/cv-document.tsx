"use client";
import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { CvContent } from "@/lib/validations/cv";
import { ProjectGrid } from "@/components/public/projects/project-grid";
import { SkillsWheel } from "@/components/public/skills/skills-wheel";
import { MessageForm } from "@/components/public/contact/message-form";
import styles from "./cv-document.module.css";
const sections = ["About", "Projects", "Skills", "Timeline", "Contact"];
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionTitle}>
        <span>{title}</span>
        <div />
      </div>
      {children}
    </section>
  );
}
export function CvDocument({ cv }: { cv: CvContent }) {
  const { profile, projects, skills, timelines } = cv;
  const [category, setCategory] = useState("All");
  const [timelineType, setTimelineType] = useState("All");
  const categories = ["All", ...new Set(projects.map((p) => p.category.name))];
  const training = timelines.filter((t) =>
    ["TRAINING", "CERTIFICATION"].includes(t.type),
  );
  const journey = timelines
    .filter((t) => !["TRAINING", "CERTIFICATION"].includes(t.type))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  return (
    <main className={styles.page}>
      <nav className={styles.navigation} aria-label="Portfolio sections">
        <a href="#about" className={styles.brand}>
          {profile.name}
        </a>
        <div>
          {sections.map((s) => (
            <a key={s} href={`#${s.toLowerCase()}`}>
              {s}
            </a>
          ))}
        </div>
      </nav>
      <article className={styles.document} data-cv-document>
        <header id="about" className={styles.hero}>
          <p className={styles.eyebrow}>
            {profile.location}
            {profile.isAvailable ? " · Open to opportunities" : ""}
          </p>
          <h1>
            {profile.name}
            <span>{profile.role || "Developer"}</span>
          </h1>
          {profile.summary && (
            <p className={styles.summary}>{profile.summary}</p>
          )}
          <div className={styles.actions}>
            <a href="#projects" className={styles.primary}>
              Explore my work ↗
            </a>
            <a href="#contact">Let’s talk</a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View CV ↗
              </a>
            )}
          </div>
          <div className={styles.stats}>
            <span>
              <b>{projects.length.toString().padStart(2, "0")}</b> Projects
            </span>
            <span>
              <b>{skills.length.toString().padStart(2, "0")}</b> Skills & tools
            </span>
            <span>
              <b>{training.length.toString().padStart(2, "0")}</b> Training &
              badges
            </span>
          </div>
        </header>
        <Section id="projects" title="01 / Selected work">
          <div className={styles.sectionHeading}>
            <h2>Things I’ve built.</h2>
            <p>Explore the work, then open a project for the details.</p>
          </div>
          <div
            className={styles.filters}
            role="group"
            aria-label="Filter projects"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ))}
          </div>
          {projects.length ? (
            <ProjectGrid
              projects={projects.filter(
                (p) => category === "All" || p.category.name === category,
              )}
            />
          ) : (
            <p>New projects are on the way.</p>
          )}
        </Section>
        <Section id="skills" title="02 / Skills & tools">
          <div className={styles.sectionHeading}>
            <h2>My working toolkit.</h2>
            <p>Select a skill to explore its details.</p>
          </div>
          {skills.length ? (
            <SkillsWheel
              skills={skills.map((s) => ({
                ...s,
                icon: s.icon ?? undefined,
                color: s.color ?? undefined,
              }))}
            />
          ) : (
            <p>Skills will appear here once added.</p>
          )}
        </Section>
        <Section id="timeline" title="03 / The journey">
          <div className={styles.sectionHeading}>
            <h2>Learning. Building. Growing.</h2>
            <p>Experience, education, and the milestones in between.</p>
          </div>
          <div
            className={styles.filters}
            role="group"
            aria-label="Filter timeline"
          >
            {["All", ...new Set(journey.map((t) => t.type))].map((t) => (
              <button
                key={t}
                aria-pressed={timelineType === t}
                onClick={() => setTimelineType(t)}
              >
                {t.toLowerCase()}
              </button>
            ))}
          </div>
          <div className={styles.timeline}>
            {journey
              .filter((t) => timelineType === "All" || t.type === timelineType)
              .map((t) => (
                <details key={t.id} className={styles.milestone}>
                  <summary>
                    <time dateTime={t.startDate}>
                      {new Date(t.startDate).getUTCFullYear()}
                    </time>
                    <span>
                      <small>{t.type.toLowerCase()}</small>
                      <h3>{t.title}</h3>
                      <p>{t.organization}</p>
                    </span>
                    <span className={styles.expand} aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className={styles.description}>
                    <p>{t.location}</p>
                    {t.type !== "EDUCATION" && (
                      <p>
                        {new Date(t.startDate).toLocaleDateString("en-GB", {
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        })}{" "}
                        —{" "}
                        {t.current
                          ? "Present"
                          : t.endDate
                            ? new Date(t.endDate).toLocaleDateString("en-GB", {
                                month: "short",
                                year: "numeric",
                                timeZone: "UTC",
                              })
                            : "Completed"}
                      </p>
                    )}
                    <p>{t.description}</p>
                  </div>
                </details>
              ))}
          </div>
          {!journey.length && (
            <p>Timeline entries will appear here once added.</p>
          )}
        </Section>
        <Section id="contact" title="04 / Get in touch">
          <div className={styles.sectionHeading}>
            <h2>Have something in mind?</h2>
            <p>Let’s build something useful together.</p>
          </div>
          <div className={styles.actions}>
            <a className={styles.primary} href={`mailto:${profile.email}`}>
              Send an email ↗
            </a>
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>Call me</a>
            )}
          </div>
          <MessageForm />
        </Section>
        <Section id="training" title="05 / Training & certifications">
          <div className={styles.sectionHeading}>
            <h2>Always learning.</h2>
          </div>
          <div className={styles.credentials}>
            {training.map((t) => (
              <article key={t.id}>
                <small>{t.organization}</small>
                <h3>{t.title}</h3>
                <p>
                  Issued{" "}
                  {new Date(t.startDate).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
                {t.credentialUrl && (
                  <a
                    href={t.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View credential ↗
                  </a>
                )}
              </article>
            ))}
          </div>
          {!training.length && (
            <p>Training and certifications will appear here once added.</p>
          )}
        </Section>
        <footer className={styles.footer}>
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <Link href="#about">Back to top ↑</Link>
        </footer>
      </article>
    </main>
  );
}
