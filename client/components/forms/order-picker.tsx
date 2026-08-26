"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

interface OrderPickerProps {
  value: number;
  onChange: (value: number) => void;
  disabledOrders?: number[];
  maxCount?: number;
}

export function OrderPicker({
  value,
  onChange,
  disabledOrders = [],
  maxCount = 25,
}: OrderPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector(
        `[data-order="${value}"]`
      ) as HTMLElement;

      if (selectedEl) {
        const container = scrollRef.current;
        const scrollLeft =
          selectedEl.offsetLeft -
          container.offsetWidth / 2 +
          selectedEl.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [value]);

  const handleScrollStep = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const step = 140;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full space-y-3 overflow-hidden rounded-xl border bg-card p-3 shadow-xs sm:p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-muted-foreground">
          POSITION_SLOT: <strong className="text-foreground">#{String(value || 1).padStart(2, "0")}</strong>
        </span>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/30" /> Occupied
          </span>
        </div>
      </div>

      {/* Reel Track with explicit overflow boundary */}
      <div className="relative flex w-full min-w-0 items-center">
        <button
          type="button"
          onClick={() => handleScrollStep("left")}
          className="absolute left-0 z-10 flex size-7 items-center justify-center rounded-full border bg-background/90 text-muted-foreground shadow-xs backdrop-blur-xs transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          ref={scrollRef}
          className="no-scrollbar flex w-full min-w-0 gap-2 overflow-x-auto scroll-smooth px-8 py-1.5"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {Array.from({ length: maxCount }).map((_, index) => {
            const orderNum = index + 1;
            const isTaken = disabledOrders.includes(orderNum);
            const isSelected = value === orderNum;

            return (
              <button
                key={orderNum}
                data-order={orderNum}
                type="button"
                disabled={isTaken}
                onClick={() => onChange(orderNum)}
                className={cn(
                  "relative flex size-10 shrink-0 flex-col items-center justify-center rounded-lg font-mono text-xs font-bold transition-all duration-200 sm:size-11",
                  "scroll-snap-align-center",
                  isSelected &&
                    "scale-105 bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background",
                  !isSelected &&
                    !isTaken &&
                    "border bg-muted/30 text-foreground hover:border-primary/50 hover:bg-muted/60",
                  isTaken &&
                    "cursor-not-allowed border border-dashed border-muted-foreground/20 bg-muted/10 text-muted-foreground/30"
                )}
              >
                {isTaken ? (
                  <Lock className="size-3.5 opacity-40" />
                ) : (
                  <>
                    <span className="text-[9px] opacity-60">#</span>
                    <span>{String(orderNum).padStart(2, "0")}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleScrollStep("right")}
          className="absolute right-0 z-10 flex size-7 items-center justify-center rounded-full border bg-background/90 text-muted-foreground shadow-xs backdrop-blur-xs transition-colors hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}