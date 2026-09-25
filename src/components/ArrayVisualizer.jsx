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
  const { array, states, highlights } = step;
  const n = array.length;
  const gap = n > 30 ? 2 : 4;
  const barW = `calc((100% - ${(n - 1) * gap}px) / ${n})`;

  return (
    <div className="flex items-end justify-center gap-1 h-full w-full px-4 pb-2">
      {array.map((value, i) => {
        const heightPct = (value / maxValue) * 100;
        const isHighlighted = highlights.includes(i);
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-end transition-all duration-300 ease-out"
            style={{ width: barW, height: `${heightPct}%` }}
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
                stateColors[states[i] ?? "default"]
              } ${isHighlighted ? "ring-2 ring-white/60 scale-y-105" : ""}`}
              style={{ height: "100%" }}
            />
          </div>
        );
      })}
    </div>
  );
}
