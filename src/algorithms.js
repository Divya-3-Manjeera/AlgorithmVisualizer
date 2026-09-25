export function bubbleSort(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  const states = new Array(n).fill("default");

  steps.push({
    array: [...arr],
    states: [...states],
    highlights: [],
    message:
      "Starting Bubble Sort. We compare adjacent pairs and swap if the left is larger.",
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      states[j] = "comparing";
      states[j + 1] = "comparing";

      steps.push({
        array: [...arr],
        states: [...states],
        highlights: [j, j + 1],
        message: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        phase: "COMPARE",
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        states[j] = "swapping";
        states[j + 1] = "swapping";

        steps.push({
          array: [...arr],
          states: [...states],
          highlights: [j, j + 1],
          message: `${arr[j + 1]} > ${arr[j]}, so we swap them.`,
          phase: "SWAP",
        });
      }

      states[j] = "default";
      states[j + 1] = "default";
    }

    states[n - 1 - i] = "sorted";

    steps.push({
      array: [...arr],
      states: [...states],
      highlights: [n - 1 - i],
      message: `Element ${arr[n - 1 - i]} is in its final sorted position.`,
    });

    if (!swapped) break;
  }

  for (let k = 0; k < n; k++) {
    states[k] = "sorted";
  }

  steps.push({
    array: [...arr],
    states: [...states],
    highlights: [],
    message: "Bubble Sort complete! The array is fully sorted.",
  });

  return steps;
}


// ======================================================
// MERGE SORT
// ======================================================
export function mergeSort(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;

  // Initial state
  steps.push({
    array: [...arr],
    states: Array(n).fill("default"),
    highlights: [],
    phase: "START",
    ranges: [[0, n - 1]],
    comparingRanges: [],
    mergedRanges: [],
    message: "Starting Merge Sort",
  });

  // =====================================================
  // DIVIDE PHASE
  // =====================================================

  let levels = [[[0, n - 1]]];

  while (true) {
    const currentLevel = levels[levels.length - 1];
    const nextLevel = [];

    for (const [start, end] of currentLevel) {
      if (start === end) {
        nextLevel.push([start, end]);
        continue;
      }

      const mid = Math.floor((start + end) / 2);

      nextLevel.push([start, mid]);
      nextLevel.push([mid + 1, end]);
    }

    levels.push(nextLevel);

    steps.push({
      array: [...arr],
      states: Array(n).fill("default"),
      highlights: [],
      phase: "DIVIDE",
      ranges: nextLevel,
      comparingRanges: [],
      mergedRanges: [],
      message: "Divide into smaller subarrays",
    });

    const finished = nextLevel.every(
      ([start, end]) => start === end
    );

    if (finished) break;
  }

  // =====================================================
  // CONQUER / MERGE PHASE
  // =====================================================

  let width = 1;

  while (width < n) {
    const levelRanges = [];

    // Get all subarrays that exist at this level
    for (let start = 0; start < n; start += width * 2) {
      const end = Math.min(start + width * 2 - 1, n - 1);

      levelRanges.push([start, end]);
    }

    // -------------------------------------------------
    // COMPARE
    // -------------------------------------------------

    steps.push({
      array: [...arr],
      states: Array(n).fill("default"),
      highlights: [],
      phase: "COMPARE",
      ranges: levelRanges,
      comparingRanges: levelRanges,
      mergedRanges: [],
      message: "Compare subarrays",
    });

    // -------------------------------------------------
    // MERGE EACH PAIR
    // -------------------------------------------------

    for (let start = 0; start < n; start += width * 2) {
      const mid = Math.min(start + width - 1, n - 1);
      const end = Math.min(start + width * 2 - 1, n - 1);

      // No right half
      if (mid >= end) {
        continue;
      }

      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);

      let i = 0;
      let j = 0;
      let k = start;

      // -----------------------------------------------
      // Compare elements
      // -----------------------------------------------

      while (i < left.length && j < right.length) {
        const leftIndex = start + i;
        const rightIndex = mid + 1 + j;

        const states = Array(n).fill("default");

        states[leftIndex] = "comparing";
        states[rightIndex] = "comparing";

        steps.push({
          array: [...arr],
          states,
          highlights: [leftIndex, rightIndex],
          phase: "COMPARE",
          ranges: levelRanges,
          comparingRanges: [[start, end]],
          mergedRanges: [],
          message: `Compare ${left[i]} and ${right[j]}`,
        });

        // ---------------------------------------------
        // Place smaller element
        // ---------------------------------------------

        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }

        const mergeStates = Array(n).fill("default");
        mergeStates[k] = "swapping";

        steps.push({
          array: [...arr],
          states: mergeStates,
          highlights: [k],
          phase: "MERGE",
          ranges: levelRanges,
          comparingRanges: [],
          mergedRanges: [[start, k]],
          message: `Place ${arr[k]}`,
        });

        k++;
      }

      // -----------------------------------------------
      // Remaining left elements
      // -----------------------------------------------

      while (i < left.length) {
        arr[k] = left[i];

        const states = Array(n).fill("default");
        states[k] = "swapping";

        steps.push({
          array: [...arr],
          states,
          highlights: [k],
          phase: "MERGE",
          ranges: levelRanges,
          comparingRanges: [],
          mergedRanges: [[start, k]],
          message: `Place ${arr[k]}`,
        });

        i++;
        k++;
      }

      // -----------------------------------------------
      // Remaining right elements
      // -----------------------------------------------

      while (j < right.length) {
        arr[k] = right[j];

        const states = Array(n).fill("default");
        states[k] = "swapping";

        steps.push({
          array: [...arr],
          states,
          highlights: [k],
          phase: "MERGE",
          ranges: levelRanges,
          comparingRanges: [],
          mergedRanges: [[start, k]],
          message: `Place ${arr[k]}`,
        });

        j++;
        k++;
      }

      // -----------------------------------------------
      // This pair is completely merged
      // -----------------------------------------------

      steps.push({
        array: [...arr],
        states: Array(n).fill("default"),
        highlights: [],
        phase: "MERGE",
        ranges: levelRanges,
        comparingRanges: [],
        mergedRanges: [[start, end]],
        message: `Merged [${start} - ${end}]`,
      });
    }

    width *= 2;
  }

  // =====================================================
  // COMPLETE
  // =====================================================

  steps.push({
    array: [...arr],
    states: Array(n).fill("sorted"),
    highlights: [],
    phase: "COMPLETE",
    ranges: [[0, n - 1]],
    comparingRanges: [],
    mergedRanges: [[0, n - 1]],
    message: "Merge Sort complete",
  });

  return steps;
}


// ======================================================
// BINARY SEARCH
// ======================================================

export function binarySearch(input, target) {
  const arr = [...input].sort((a, b) => a - b);
  const n = arr.length;
  const steps = [];
  const states = new Array(n).fill("default");

  steps.push({
    array: arr,
    states: [...states],
    low: 0,
    high: n - 1,
    mid: -1,
    target,
    found: false,
    message: `Sorted array. Searching for target = ${target}.`,
  });

  let low = 0;
  let high = n - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    for (let k = 0; k < n; k++) {
      if (k < low || k > high) {
        states[k] = "sorted";
      } else {
        states[k] = "default";
      }
    }

    states[mid] = "current";

    steps.push({
      array: [...arr],
      states: [...states],
      low,
      high,
      mid,
      target,
      found: false,
      message: `Checking middle index ${mid}: value ${arr[mid]}`,
    });

    if (arr[mid] === target) {
      states[mid] = "found";

      steps.push({
        array: [...arr],
        states: [...states],
        low,
        high,
        mid,
        target,
        found: true,
        message: `Found ${target} at index ${mid}!`,
      });

      return steps;
    } else if (arr[mid] < target) {
      for (let k = low; k <= mid; k++) {
        states[k] = "sorted";
      }

      steps.push({
        array: [...arr],
        states: [...states],
        low,
        high,
        mid,
        target,
        found: false,
        message: `${arr[mid]} < ${target}. Search the right half.`,
      });

      low = mid + 1;
    } else {
      for (let k = mid; k <= high; k++) {
        states[k] = "sorted";
      }

      steps.push({
        array: [...arr],
        states: [...states],
        low,
        high,
        mid,
        target,
        found: false,
        message: `${arr[mid]} > ${target}. Search the left half.`,
      });

      high = mid - 1;
    }
  }

  steps.push({
    array: [...arr],
    states: [...states],
    low,
    high,
    mid: -1,
    target,
    found: false,
    message: `${target} is not in the array.`,
  });

  return steps;
}


// ======================================================
// BFS
// ======================================================

export function bfs(graph, start, target) {
  const { adjacencyList } = graph;

  const steps = [];
  const visited = [];
  const frontier = [start];
  const visitedSet = new Set();
  const parent = {};

  parent[start] = null;

  steps.push({
    visited: [],
    frontier: [start],
    current: null,
    path: [],
    edges: [],
    message: `BFS from node ${start}. Queue: [${start}]. Looking for node ${target}.`,
  });

  while (frontier.length > 0) {
    const current = frontier.shift();

    if (visitedSet.has(current)) {
      continue;
    }

    visitedSet.add(current);
    visited.push(current);

    steps.push({
      visited: [...visited],
      frontier: [...frontier],
      current,
      path: [],
      edges:
        parent[current] != null
          ? [[parent[current], current]]
          : [],
      message: `Visiting node ${current}.`,
    });

    if (current === target) {
      const path = [];

      let node = current;

      while (node != null) {
        path.unshift(node);
        node = parent[node];
      }

      steps.push({
        visited: [...visited],
        frontier: [...frontier],
        current,
        path,
        edges: [],
        message: `Found target ${target}! Path: ${path.join(" -> ")}`,
      });

      return steps;
    }

    const newEdges = [];

    for (const neighbor of adjacencyList[current]) {
      if (
        !visitedSet.has(neighbor) &&
        !frontier.includes(neighbor)
      ) {
        parent[neighbor] = current;
        frontier.push(neighbor);
        newEdges.push([current, neighbor]);
      }
    }

    if (newEdges.length > 0) {
      steps.push({
        visited: [...visited],
        frontier: [...frontier],
        current,
        path: [],
        edges: newEdges,
        message: `Discovered neighbors of ${current}: ${newEdges
          .map((e) => e[1])
          .join(", ")}`,
      });
    }
  }

  steps.push({
    visited: [...visited],
    frontier: [],
    current: null,
    path: [],
    edges: [],
    message: `Node ${target} is not reachable from node ${start}.`,
  });

  return steps;
}


// ======================================================
// DFS
// ======================================================

export function dfs(graph, start, target) {
  const { adjacencyList } = graph;

  const steps = [];
  const visited = [];
  const visitedSet = new Set();
  const parent = {};

  parent[start] = null;

  const stack = [start];

  steps.push({
    visited: [],
    frontier: [start],
    current: null,
    path: [],
    edges: [],
    message: `DFS from node ${start}. Stack: [${start}]. Looking for node ${target}.`,
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (visitedSet.has(current)) {
      continue;
    }

    visitedSet.add(current);
    visited.push(current);

    steps.push({
      visited: [...visited],
      frontier: [...stack],
      current,
      path: [],
      edges:
        parent[current] != null
          ? [[parent[current], current]]
          : [],
      message: `Visiting node ${current}.`,
    });

    if (current === target) {
      const path = [];

      let node = current;

      while (node != null) {
        path.unshift(node);
        node = parent[node];
      }

      steps.push({
        visited: [...visited],
        frontier: [...stack],
        current,
        path,
        edges: [],
        message: `Found target ${target}! Path: ${path.join(" -> ")}`,
      });

      return steps;
    }

    const newEdges = [];

    for (const neighbor of [...adjacencyList[current]].reverse()) {
      if (!visitedSet.has(neighbor)) {
        if (
          parent[neighbor] == null &&
          neighbor !== start
        ) {
          parent[neighbor] = current;
        }

        if (!stack.includes(neighbor)) {
          stack.push(neighbor);
          newEdges.push([current, neighbor]);
        }
      }
    }

    if (newEdges.length > 0) {
      steps.push({
        visited: [...visited],
        frontier: [...stack],
        current,
        path: [],
        edges: newEdges,
        message: `Pushing neighbors of ${current} onto the stack.`,
      });
    }
  }

  steps.push({
    visited: [...visited],
    frontier: [],
    current: null,
    path: [],
    edges: [],
    message: `Node ${target} is not reachable from node ${start}.`,
  });

  return steps;
}