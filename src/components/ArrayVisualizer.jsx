import { useEffect, useRef } from "react";

import compareSound from "../sounds/compare.mp3";
import swapSound from "../sounds/swap.mp3";

const stateColors = {
  default: "bg-slate-600",
  comparing: "bg-amber-400",
  swapping: "bg-rose-500",
  sorted: "bg-emerald-500",
  pivot: "bg-cyan-400",
  found: "bg-emerald-400 ring-2 ring-emerald-200",
  visiting: "bg-amber-400",
  frontier: "bg-sky-400",
  visited: "bg-violet-400",
  path: "bg-emerald-400",
  current: "bg-cyan-400",
};

export default function ArrayVisualizer({ step, maxValue }) {
  const {
    array,
    states,
    highlights,
    phase,
    ranges = [],
    comparingRanges = [],
    mergedRanges = [],
  } = step;

  const compareAudio = useRef(null);
  const swapAudio = useRef(null);

  // Create audio objects once
  useEffect(() => {
    compareAudio.current = new Audio(compareSound);
    swapAudio.current = new Audio(swapSound);

    compareAudio.current.volume = 0.5;
    swapAudio.current.volume = 0.5;

    return () => {
      compareAudio.current?.pause();
      swapAudio.current?.pause();
    };
  }, []);

  // ==============================
  // SOUND
  // ==============================

  useEffect(() => {
    if (!step) return;

    const message = step.message || "";

    let sound = null;

    // ------------------------------
    // BUBBLE SORT
    // ------------------------------

    if (message.startsWith("Comparing")) {
      sound = compareAudio.current;
    }

    if (message.includes("so we swap them")) {
      sound = swapAudio.current;
    }

    // ------------------------------
    // MERGE SORT
    // ------------------------------

    if (phase === "DIVIDE") {
      sound = compareAudio.current;
    }

    if (phase === "COMPARE") {
      sound = compareAudio.current;
    }

    if (phase === "MERGE") {
      sound = swapAudio.current;
    }

    // Play selected sound
    if (sound) {
      sound.currentTime = 0;

      sound.play().catch(() => {
        // Browser may block audio until user interaction.
      });
    }
  }, [step, phase]);

  const n = array.length;

  const gap = n > 30 ? 2 : 4;

  const barW = `calc((100% - ${(n - 1) * gap}px) / ${n})`;

  const isInRange = (index, range) => {
    return index >= range[0] && index <= range[1];
  };

  const isInRanges = (index, rangeList) => {
    return rangeList.some((range) => isInRange(index, range));
  };

  return (
    <div className="flex flex-col h-full w-full">

      {/* EXISTING BARS */}
      <div className="flex items-end justify-center gap-1 h-full w-full px-4 pb-2">

        {array.map((value, i) => {
          const heightPct = (value / maxValue) * 100;

          const isHighlighted = highlights.includes(i);

          let barColor = stateColors[states[i] ?? "default"];

          // Merge Sort highlighting only
          if (
            phase === "DIVIDE" &&
            isInRanges(i, ranges)
          ) {
            barColor = "bg-cyan-400";
          }

          if (
            phase === "COMPARE" &&
            isInRanges(i, comparingRanges)
          ) {
            barColor = "bg-amber-400";
          }

          if (
            phase === "MERGE" &&
            isInRanges(i, mergedRanges)
          ) {
            barColor = "bg-emerald-500";
          }

          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end transition-all duration-300 ease-out"
              style={{
                width: barW,
                height: `${heightPct}%`,
              }}
            >
              <span
                className={`text-[10px] font-mono mb-1 transition-opacity duration-200 ${
                  isHighlighted || n <= 20
                    ? "opacity-100 text-slate-300"
                    : "opacity-0"
                }`}
              >
                {value}
              </span>

              <div
                className={`w-full rounded-t-md transition-all duration-300 ease-out ${
                  barColor
                } ${
                  isHighlighted
                    ? "ring-2 ring-white/60 scale-y-105"
                    : ""
                }`}
                style={{ height: "100%" }}
              />
            </div>
          );
        })}
      </div>

      {/* MERGE SORT DIVIDE / CONQUER INDICATOR */}
      {phase && ranges.length > 0 && (
        <div className="px-4 pb-2">

          <div className="flex w-full">

            {ranges.map(([start, end], index) => {
              const width =
                ((end - start + 1) / n) * 100;

              return (
                <div
                  key={`${start}-${end}-${index}`}
                  className="flex justify-center"
                  style={{
                    width: `${width}%`,
                  }}
                >
                  <div
                    className={`
                      w-[90%]
                      h-1
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        phase === "DIVIDE"
                          ? "bg-cyan-400"
                          : phase === "COMPARE"
                          ? "bg-amber-400"
                          : phase === "MERGE"
                          ? "bg-emerald-400"
                          : "bg-slate-500"
                      }
                    `}
                  />
                </div>
              );
            })}

          </div>

          <div className="text-center text-xs font-bold mt-1">

            {phase === "DIVIDE" && (
              <span className="text-cyan-400">
                DIVIDE
              </span>
            )}

            {phase === "COMPARE" && (
              <span className="text-amber-400">
                COMPARE
              </span>
            )}

            {phase === "MERGE" && (
              <span className="text-emerald-400">
                CONQUER → MERGE
              </span>
            )}

            {phase === "COMPLETE" && (
              <span className="text-emerald-400">
                SORTED
              </span>
            )}

          </div>

        </div>
      )}

    </div>
  );
}