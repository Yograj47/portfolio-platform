"use client";

import { useState } from "react";
import type { Skill } from "@/types/portfolio";
import { iconMap } from "@/lib/skill-icons";

interface SkillsWheelProps {
  skills: Skill[];
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    startOuter.x,
    startOuter.y,
    "A",
    outerRadius,
    outerRadius,
    0,
    largeArcFlag,
    0,
    endOuter.x,
    endOuter.y,
    "L",
    endInner.x,
    endInner.y,
    "A",
    innerRadius,
    innerRadius,
    0,
    largeArcFlag,
    1,
    startInner.x,
    startInner.y,
    "Z",
  ].join(" ");
}

export function SkillsWheel({ skills }: SkillsWheelProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill>(skills[0] || null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const activeSkill = hoveredSkill || selectedSkill;
  const ActiveIcon = activeSkill?.icon ? iconMap[activeSkill.icon] : null;

  const totalSkills = skills.length;
  const size = 560;
  const center = size / 2;
  const innerRadius = 120;
  const outerRadius = 240;
  const padAngle = 2;

  const anglePerSlice = 360 / Math.max(totalSkills, 1);

  return (
    <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
      {/* Interactive SVG Wheel */}
      <div className="relative flex aspect-square w-full max-w-135 items-center justify-center p-4 md:min-w-0 md:flex-1">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="size-full overflow-visible"
        >
          {skills.map((skill, index) => {
            const startAngle = index * anglePerSlice + padAngle / 2;
            const endAngle = (index + 1) * anglePerSlice - padAngle / 2;
            const midAngle = (startAngle + endAngle) / 2;

            const isSelected = activeSkill?.id === skill.id;

            // Compute slice translate vector for offset animation
            const activeOffset = isSelected ? 12 : 0;
            const offsetVec = polarToCartesian(0, 0, activeOffset, midAngle);

            const pathData = describeArc(
              center + offsetVec.x,
              center + offsetVec.y,
              innerRadius,
              outerRadius,
              startAngle,
              endAngle,
            );

            // Polar midpoints for placement inside slice
            const midRadius = (innerRadius + outerRadius) / 2;
            const pos = polarToCartesian(
              center + offsetVec.x,
              center + offsetVec.y,
              midRadius,
              midAngle,
            );

            const Icon = skill.icon ? iconMap[skill.icon] : null;

            // Keep text readable relative to circle orientation
            let textRotation = midAngle - 90;
            if (midAngle > 90 && midAngle < 270) {
              textRotation += 180;
            }

            return (
              <g
                key={skill.id}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${skill.name}`}
                aria-pressed={selectedSkill.id === skill.id}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedSkill(skill);
                  }
                }}
                className="cursor-pointer transition-transform duration-300 ease-out"
                onClick={() => setSelectedSkill(skill)}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {/* Arc Slice */}
                <path
                  d={pathData}
                  fill={skill.color || "var(--primary)"}
                  fillOpacity={isSelected ? 0.25 : 0.12}
                  stroke={skill.color || "var(--primary)"}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="transition-all duration-200 hover:fill-opacity-25"
                />

                {/* Slice Content */}
                <g
                  transform={`translate(${pos.x}, ${pos.y}) rotate(${textRotation})`}
                  className="pointer-events-none select-none"
                >
                  {/* Icon Container */}
                  <g transform="translate(-12, -26)">
                    {Icon ? (
                      <foreignObject width="24" height="24">
                        <Icon
                          className="size-6"
                          style={{ color: skill.color || "currentColor" }}
                        />
                      </foreignObject>
                    ) : (
                      <text
                        x="12"
                        y="16"
                        textAnchor="middle"
                        className="fill-foreground font-mono text-xs font-bold"
                      >
                        {"</>"}
                      </text>
                    )}
                  </g>

                  {/* Title */}
                  <text
                    x="0"
                    y="10"
                    textAnchor="middle"
                    className="fill-foreground font-sans text-[12px] font-semibold tracking-tight"
                  >
                    {skill.name}
                  </text>

                  {/* Percentage */}
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[10px] font-medium"
                  >
                    {skill.level}%
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Central Overview Circle */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-muted-foreground">
            Skills overview
          </span>
          <p className="mt-1 max-w-32.5 text-[11px] leading-tight text-muted-foreground">
            Click or hover over a skill to view details
          </p>
        </div>
      </div>

      {/* Side Details Panel & Total Count */}
      <div className="flex w-full max-w-xs flex-col justify-between gap-6 md:w-72 md:shrink-0">
        {activeSkill && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {ActiveIcon && (
                  <div
                    className="flex size-12 items-center justify-center rounded-xl border bg-muted/30"
                    style={{ color: activeSkill.color || undefined }}
                  >
                    <ActiveIcon className="size-6" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{activeSkill.name}</h3>
                  {activeSkill.group && (
                    <p className="text-xs text-muted-foreground">
                      {activeSkill.group}
                    </p>
                  )}
                </div>
              </div>
              <div
                className="shrink-0 border-l pl-3 text-right"
                aria-label={`${totalSkills} total skills`}
              >
                <div className="text-2xl font-bold">{totalSkills}</div>
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                  Total skills
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Proficiency</span>
                  <span className="font-mono font-semibold text-foreground">
                    {activeSkill.level}%
                  </span>
                </div>
                {/* Custom Segmented Bar */}
                <div className="mt-2.5 flex gap-1.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2.5 flex-1 rounded-sm transition-colors duration-300"
                      style={{
                        backgroundColor:
                          i < Math.round(activeSkill.level / 10)
                            ? activeSkill.color || "var(--primary)"
                            : "var(--muted)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Level</span>
                <span
                  className="font-semibold"
                  style={{ color: activeSkill.color || undefined }}
                >
                  {activeSkill.level >= 80
                    ? "Advanced"
                    : activeSkill.level >= 60
                      ? "Intermediate"
                      : activeSkill.level >= 40
                        ? "Working"
                        : "Learning"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
