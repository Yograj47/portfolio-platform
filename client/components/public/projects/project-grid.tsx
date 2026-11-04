"use client";
import { useEffect, useRef, useState } from "react";
import type { PublicProject } from "@/types/portfolio";
import { ProjectCard } from "./project-card";
import styles from "./project-grid.module.css";

interface ProjectGridProps {
  projects: PublicProject[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft <= 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    element.scrollLeft = 0;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [projects]);
  function move(direction: number) {
    const element = track.current;
    element?.scrollBy({
      left: direction * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <div className={styles.carousel}>
      <div className={styles.controls}>
        <span>{projects.length} projects · Swipe or use the arrows</span>
        <div>
          <button
            type="button"
            aria-label="Previous projects"
            disabled={edges.start}
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next projects"
            disabled={edges.end}
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={track}
        className={styles.track}
        data-count={projects.length}
        role="region"
        aria-label="Project list"
        tabIndex={0}
      >
        {projects.map((project) => (
          <div className={styles.item} key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
