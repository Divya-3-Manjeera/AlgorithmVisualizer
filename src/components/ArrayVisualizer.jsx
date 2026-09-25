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
  const compareAudio = useRef(null);
  const swapAudio = useRef(null);

  // --------------------------------------------------
  // CREATE AUDIO OBJECTS
  // --------------------------------------------------

  useEffect(() => {
    compareAudio.current = new Audio(compareSound);
    swapAudio.current = new Audio(swapSound);

    compareAudio.current.volume = 0.5;
    swapAudio.current.volume = 0.6;

    return () => {
      compareAudio.current?.pause();
      swapAudio.current?.pause();

      compareAudio.current = null;
      swapAudio.current = null;
    };
  }, []);

  // --------------------------------------------------
  // PLAY SOUND BASED ON ALGORITHM PHASE
  // --------------------------------------------------

  useEffect(() => {
    if (!step) return;

    const phase = step.phase;

    // -----------------------------------------------
    // COMPARISON SOUND
    // Bubble Sort comparison
    // Merge Sort comparison
    // -----------------------------------------------

    if (phase === "COMPARE") {
      if (compareAudio.current) {
        compareAudio.current.pause();
        compareAudio.current.currentTime = 0;

        compareAudio.current.play().catch(() => {});
      }
    }

    // -----------------------------------------------
    // ACTION SOUND
    // Bubble Sort swap
    // Merge Sort merge/place
    // -----------------------------------------------

    if (phase === "SWAP" || phase === "MERGE") {
      if (swapAudio.current) {
        swapAudio.current.pause();
        swapAudio.current.currentTime = 0;

        swapAudio.current.play().catch(() => {});
      }
    }

    // -----------------------------------------------
    // BINARY SEARCH
    // Binary Search does not currently have a
    // phase property in algorithms.js.
    //
    // So we detect its checking step.
    // -----------------------------------------------

    if (
      step.mid !== undefined &&
      step.mid !== -1 &&
      step.message?.startsWith("Checking middle index")
    ) {
      if (compareAudio.current) {
        compareAudio.current.pause();
        compareAudio.current.currentTime = 0;

        compareAudio.current.play().catch(() => {});
      }
    }

    // -----------------------------------------------
    // BINARY SEARCH FOUND
    // Use action sound when target is found.
    // -----------------------------------------------

    if (step.found === true) {
      if (swapAudio.current) {
        swapAudio.current.pause();
        swapAudio.current.currentTime = 0;

        swapAudio.current.play().catch(() => {});
      }
    }
  }, [step]);

  // --------------------------------------------------
  // SAFETY CHECK
  // --------------------------------------------------

  if (!step || !step.array) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        No visualization data
      </div>
    );
  }

  const { array, states = [], highlights = [] } = step;

  const n = array.length;

  const gap = n > 30 ? 2 : 4;

  const barW = `calc((100% - ${
    (n - 1) * gap
  }px) / ${n})`;

  // --------------------------------------------------
  // ARRAY VISUALIZATION
  // --------------------------------------------------

  return (
    <div className="flex flex-col h-full w-full">

      

      {/* ---------------------------------------------
          ARRAY
      --------------------------------------------- */}

      <div className="flex items-end justify-center gap-1 h-full w-full px-4 pb-2">

        {array.map((value, i) => {
          const heightPct =
            maxValue > 0
              ? (value / maxValue) * 100
              : 0;

          const isHighlighted =
            highlights.includes(i);

          const state =
            states[i] ?? "default";

          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end transition-all duration-300 ease-out"
              style={{
                width: barW,
                height: `${heightPct}%`,
              }}
            >

              {/* VALUE */}
              <span
                className={`text-[10px] font-mono mb-1 transition-opacity duration-200 ${
                  isHighlighted || n <= 20
                    ? "opacity-100 text-slate-300"
                    : "opacity-0"
                }`}
              >
                {value}
              </span>

              {/* BAR */}
              <div
                className={`w-full rounded-t-md transition-all duration-300 ease-out ${
                  stateColors[state]
                } ${
                  isHighlighted
                    ? "ring-2 ring-white/60 scale-y-105"
                    : ""
                }`}
                style={{
                  height: "100%",
                }}
              />

            </div>
          );
        })}

      </div>

    </div>
  );
}