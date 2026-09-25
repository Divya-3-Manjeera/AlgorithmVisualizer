import { useEffect, useRef } from "react";

import compareSound from "../sounds/compare.mp3";
import swapSound from "../sounds/swap.mp3";

export default function GraphVisualizer({ step, graph }) {
  const { visited, frontier, current, path, edges, message } = step;

  // ==================================================
  // AUDIO
  // ==================================================

  const compareAudio = useRef(new Audio(compareSound));
  const swapAudio = useRef(new Audio(swapSound));

  useEffect(() => {
    compareAudio.current.volume = 0.5;
    swapAudio.current.volume = 0.6;
  }, []);

  // ==================================================
  // BFS / DFS SOUND
  // ==================================================

  useEffect(() => {
    if (!step || !message) return;

    // Visiting a node -> compare sound
    if (message.startsWith("Visiting node")) {
      compareAudio.current.pause();
      compareAudio.current.currentTime = 0;
      compareAudio.current.play().catch(() => {});
    }

    // Discovering / pushing neighbors -> swap sound
    if (
      message.startsWith("Discovered neighbors") ||
      message.startsWith("Pushing neighbors") ||
      message.startsWith("Found target")
    ) {
      swapAudio.current.pause();
      swapAudio.current.currentTime = 0;
      swapAudio.current.play().catch(() => {});
    }
  }, [step, message]);

  // ==================================================
  // ORIGINAL GRAPH LOGIC
  // ==================================================

  const visitedSet = new Set(visited);
  const frontierSet = new Set(frontier);
  const pathSet = new Set(path);

  const activeEdgeSet = new Set(
    edges.map(([a, b]) => `${a}-${b}`)
  );

  const nodeRadius = 24;

  const edgeColor = (a, b) =>
    activeEdgeSet.has(`${a}-${b}`)
      ? "#fbbf24"
      : pathSet.has(a) && pathSet.has(b)
      ? "#34d399"
      : "#475569";

  const nodeFill = (id) => {
    if (pathSet.has(id)) return "#34d399";
    if (id === current) return "#22d3ee";
    if (frontierSet.has(id)) return "#38bdf8";
    if (visitedSet.has(id)) return "#a78bfa";
    return "#334155";
  };

  const nodeStroke = (id) => {
    if (pathSet.has(id)) return "#6ee7b7";
    if (id === current) return "#67e8f9";
    if (frontierSet.has(id)) return "#7dd3fc";
    if (visitedSet.has(id)) return "#c4b5fd";
    return "#64748b";
  };

  // ==================================================
  // ORIGINAL UI
  // ==================================================

  return (
    <div className="flex items-center justify-center h-full w-full">
      <svg
        viewBox="0 0 500 400"
        className="w-full h-full max-w-3xl"
      >
        {graph.adjacencyList.map((neighbors, i) =>
          neighbors.map((j) => {
            if (j <= i) return null;

            const a = graph.positions[i];
            const b = graph.positions[j];

            return (
              <line
                key={`${i}-${j}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={edgeColor(i, j)}
                strokeWidth={
                  activeEdgeSet.has(`${i}-${j}`)
                    ? 4
                    : 2
                }
                className="transition-all duration-300"
              />
            );
          })
        )}

        {graph.positions.map((pos, id) => (
          <g
            key={id}
            className="transition-all duration-300"
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius}
              fill={nodeFill(id)}
              stroke={nodeStroke(id)}
              strokeWidth={3}
              className="transition-all duration-300"
            />

            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              className="fill-white font-bold text-sm transition-all duration-300"
              style={{ fontSize: 16 }}
            >
              {id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}