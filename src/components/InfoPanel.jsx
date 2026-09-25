const stateLabels = [
  { state: "default", label: "Unsorted" },
  { state: "comparing", label: "Comparing" },
  { state: "swapping", label: "Swapping" },
  { state: "sorted", label: "Sorted" },
  { state: "current", label: "Current" },
  { state: "found", label: "Found" },
  { state: "visiting", label: "Visiting" },
  { state: "frontier", label: "Frontier / Queue" },
  { state: "visited", label: "Visited" },
  { state: "path", label: "Path" },
  { state: "pivot", label: "Merge Element" },
];

const stateDotColors = {
  default: "bg-slate-600",
  comparing: "bg-amber-400",
  swapping: "bg-rose-500",
  sorted: "bg-emerald-500",
  pivot: "bg-cyan-400",
  found: "bg-emerald-400",
  visiting: "bg-amber-400",
  frontier: "bg-sky-400",
  visited: "bg-violet-400",
  path: "bg-emerald-400",
  current: "bg-cyan-400",
};

export default function InfoPanel({ algorithm, message, category }) {
  const relevantStates = stateLabels.filter((s) => {
    if (category === "sorting")
      return ["default", "comparing", "swapping", "sorted", "pivot"].includes(s.state);
    if (category === "searching")
      return ["default", "current", "sorted", "found"].includes(s.state);
    return ["default", "visiting", "frontier", "visited", "path", "current"].includes(
      s.state
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{algorithm.name}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {algorithm.description}
        </p>
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-slate-500">Time</span>
          <span className="font-mono text-cyan-300 font-bold">
            {algorithm.timeComplexity}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-500">Space</span>
          <span className="font-mono text-cyan-300 font-bold">
            {algorithm.spaceComplexity}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {relevantStates.map(({ state, label }) => (
          <div key={state} className="flex items-center gap-1.5">
            <span
              className={`inline-block w-3 h-3 rounded-full ${stateDotColors[state]}`}
            />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
        <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wide">
          Current Step
        </div>
        <div className="text-sm text-slate-200 min-h-[2.5rem] leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
}
