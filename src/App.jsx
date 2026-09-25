import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Shuffle,
  Search,
  GitBranch,
  ArrowLeftRight,
  GitMerge,
  Network,
  Code2,
} from "lucide-react";
import { bubbleSort, mergeSort, binarySearch, bfs, dfs } from "./algorithms";
import { graphData } from "./graphData";
import ArrayVisualizer from "./components/ArrayVisualizer";
import SearchVisualizer from "./components/SearchVisualizer";
import GraphVisualizer from "./components/GraphVisualizer";
import InfoPanel from "./components/InfoPanel";

const ALGORITHMS = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    description:
      "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element 'bubbles up' to its correct position each pass.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "sorting",
    description:
      "A divide-and-conquer algorithm that splits the array into halves, recursively sorts each half, then merges the sorted halves back together.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    description:
      "Searches a sorted array by repeatedly dividing the search interval in half. Compares the target to the middle element and discards the half that cannot contain the target.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "bfs",
    name: "Breadth-First Search",
    category: "graph",
    description:
      "Explores a graph level by level. Starting from a source node, it visits all immediate neighbors first before moving to the next level. Uses a queue (FIFO).",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    category: "graph",
    description:
      "Explores as far as possible along each branch before backtracking. Starting from a source node, it dives deep into the graph. Uses a stack (LIFO).",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
  },
];

const ALGORITHM_ICONS = {
  "bubble-sort": ArrowLeftRight,
  "merge-sort": GitMerge,
  "binary-search": Search,
  bfs: GitBranch,
  dfs: Network,
};

const SORT_SIZE = 20;
const SORT_MAX = 99;
const SEARCH_TARGET = 42;

function generateArray() {
  return Array.from(
    { length: SORT_SIZE },
    () => Math.floor(Math.random() * SORT_MAX) + 5
  );
}

function generateSearchArray() {
  const arr = new Set();
  while (arr.size < SORT_SIZE) {
    arr.add(Math.floor(Math.random() * SORT_MAX) + 1);
  }
  return [...arr];
}

export default function App() {
  const [selected, setSelected] = useState("bubble-sort");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [arrayData, setArrayData] = useState(() => generateArray());
  const [searchData, setSearchData] = useState(() => generateSearchArray());
  const [searchTarget, setSearchTarget] = useState(SEARCH_TARGET);
  const intervalRef = useRef(null);

  const meta = ALGORITHMS.find((a) => a.id === selected);

  useEffect(() => {
    let newSteps = [];
    if (selected === "bubble-sort") {
      newSteps = bubbleSort(arrayData).map((d) => ({ kind: "array", data: d }));
    } else if (selected === "merge-sort") {
      newSteps = mergeSort(arrayData).map((d) => ({ kind: "array", data: d }));
    } else if (selected === "binary-search") {
      newSteps = binarySearch(searchData, searchTarget).map(
        (d) => ({ kind: "search", data: d })
      );
    } else if (selected === "bfs") {
      newSteps = bfs(graphData, 0, 9).map((d) => ({ kind: "graph", data: d }));
    } else if (selected === "dfs") {
      newSteps = dfs(graphData, 0, 9).map((d) => ({ kind: "graph", data: d }));
    }
    setSteps(newSteps);
    setStepIndex(0);
    setIsPlaying(false);
  }, [selected, arrayData, searchData, searchTarget]);

  useEffect(() => {
    if (isPlaying && stepIndex < steps.length - 1) {
      const delay = 1100 - speed * 100;
      intervalRef.current = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const handlePlayPause = useCallback(() => {
    if (stepIndex >= steps.length - 1) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  }, [stepIndex, steps.length]);

  const handleReset = useCallback(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, []);

  const handleShuffle = useCallback(() => {
    if (selected === "bubble-sort" || selected === "merge-sort") {
      setArrayData(generateArray());
    } else if (selected === "binary-search") {
      setSearchData(generateSearchArray());
      setSearchTarget(Math.floor(Math.random() * SORT_MAX) + 1);
    }
  }, [selected]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const currentStep = steps[stepIndex];
  const message =
    currentStep?.kind === "array"
      ? currentStep.data.message
      : currentStep?.kind === "search"
      ? currentStep.data.message
      : currentStep?.kind === "graph"
      ? currentStep.data.message
      : "";

  const canShuffle = selected !== "bfs" && selected !== "dfs";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600">
              <Code2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Algorithm Visualizer</h1>
              <p className="text-xs text-slate-400">
                See how algorithms work, step by step
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((algo) => {
            const Icon = ALGORITHM_ICONS[algo.id];
            const isActive = selected === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => setSelected(algo.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                  isActive
                    ? "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon size={16} />
                {algo.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-4">
            <div className="h-[420px] flex items-end justify-center">
              {currentStep?.kind === "array" && (
                <ArrayVisualizer step={currentStep.data} maxValue={SORT_MAX} />
              )}
              {currentStep?.kind === "search" && (
                <SearchVisualizer step={currentStep.data} />
              )}
              {currentStep?.kind === "graph" && (
                <GraphVisualizer step={currentStep.data} graph={graphData} />
              )}
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-5">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStepBack}
                  disabled={stepIndex === 0}
                  className="p-2.5 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-200"
                  title="Step back"
                >
                  <SkipBack size={20} />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="p-4 rounded-full bg-cyan-500 hover:bg-cyan-400 transition-colors text-white shadow-lg shadow-cyan-500/30"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={26} /> : <Play size={26} />}
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={stepIndex >= steps.length - 1}
                  className="p-2.5 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-200"
                  title="Step forward"
                >
                  <SkipForward size={20} />
                </button>

                <div className="w-px h-8 bg-slate-700 mx-1" />

                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors text-slate-200"
                  title="Reset"
                >
                  <RotateCcw size={20} />
                </button>

                {canShuffle && (
                  <button
                    onClick={handleShuffle}
                    className="p-2.5 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors text-slate-200"
                    title="Shuffle / New data"
                  >
                    <Shuffle size={20} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Speed</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-32 accent-cyan-400"
                />
                <span className="text-xs text-slate-400 font-mono w-6">
                  {speed}x
                </span>
              </div>

              <div className="w-full max-w-md">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Step {stepIndex + 1}</span>
                  <span>of {steps.length}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-200"
                    style={{
                      width: `${((stepIndex + 1) / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-5 sticky top-24">
            <InfoPanel
              algorithm={meta}
              message={message}
              category={meta.category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
