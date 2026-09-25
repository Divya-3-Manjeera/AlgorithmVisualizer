const stateColors = {
  default: "bg-slate-700 border-slate-600 text-slate-300",
  comparing: "bg-amber-500/30 border-amber-400 text-amber-200",
  swapping: "bg-rose-500/30 border-rose-400 text-rose-200",
  sorted: "bg-slate-800/60 border-slate-700 text-slate-500",
  pivot: "bg-cyan-500/30 border-cyan-400 text-cyan-200",
  found: "bg-emerald-500 border-emerald-300 text-white scale-110",
  visiting: "bg-amber-500/30 border-amber-400 text-amber-200",
  frontier: "bg-sky-500/30 border-sky-400 text-sky-200",
  visited: "bg-violet-500/30 border-violet-400 text-violet-200",
  path: "bg-emerald-500/30 border-emerald-400 text-emerald-200",
  current: "bg-cyan-500 border-cyan-300 text-white scale-110",
};

export default function SearchVisualizer({ step }) {
  const { array, states, low, high, mid, target, found } = step;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-6">
      <div className="text-sm text-slate-400">
        Target:{" "}
        <span className="text-cyan-300 font-mono font-bold text-lg">{target}</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 px-4">
        {array.map((value, i) => {
          const state = states[i] ?? "default";
          const isMid = i === mid;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              {isMid && (
                <div className="text-cyan-400 text-xs font-bold animate-bounce">
                  mid
                </div>
              )}
              <div
                className={`flex items-center justify-center rounded-lg border-2 font-mono font-bold transition-all duration-300 ease-out ${
                  stateColors[state]
                } ${found && isMid ? "animate-pulse" : ""}`}
                style={{
                  width: 48,
                  height: 48,
                  fontSize: 16,
                }}
              >
                {value}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{i}</div>
              {i === low && <div className="text-emerald-400 text-[10px] font-bold">L</div>}
              {i === high && <div className="text-rose-400 text-[10px] font-bold">H</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
