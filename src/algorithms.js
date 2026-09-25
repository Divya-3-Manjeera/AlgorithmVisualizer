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

  function addStep(
    message,
    phase,
    activeRanges = [],
    comparingRanges = [],
    mergedRanges = []
  ) {
    const states = new Array(n).fill("default");
    const highlights = [];

    // Show all active subarrays
    activeRanges.forEach(([start, end]) => {
      for (let i = start; i <= end; i++) {
        states[i] = "pivot";
      }
    });

    // Show all currently comparing ranges
    comparingRanges.forEach(([start, end]) => {
      for (let i = start; i <= end; i++) {
        states[i] = "comparing";
        highlights.push(i);
      }
    });

    // Show all completed merged ranges
    mergedRanges.forEach(([start, end]) => {
      for (let i = start; i <= end; i++) {
        states[i] = "sorted";
      }
    });

    steps.push({
      array: [...arr],
      states,
      highlights,
      message,
      phase,
      activeRanges: [...activeRanges],
      comparingRanges: [...comparingRanges],
      mergedRanges: [...mergedRanges],
    });
  }

  // ==================================================
  // START
  // ==================================================

  addStep(
    `Starting Merge Sort with [${arr.join(", ")}]`,
    "START",
    [[0, n - 1]]
  );

  // ==================================================
  // DIVIDE VISUALIZATION
  // Show ALL splits at the same level
  // ==================================================

  let ranges = [[0, n - 1]];

  while (ranges.length > 0) {
    const nextRanges = [];

    ranges.forEach(([start, end]) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);

        nextRanges.push([start, mid]);
        nextRanges.push([mid + 1, end]);
      } else {
        nextRanges.push([start, end]);
      }
    });

    const splitRanges = [];

    ranges.forEach(([start, end]) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);

        splitRanges.push([start, mid]);
        splitRanges.push([mid + 1, end]);
      }
    });

    if (splitRanges.length === 0) {
      break;
    }

    addStep(
      `Divide into ${splitRanges.length} subarrays`,
      "DIVIDE",
      splitRanges
    );

    ranges = splitRanges;
  }

  // ==================================================
  // RESET ARRAY
  // ==================================================

  const original = [...input];

  for (let i = 0; i < n; i++) {
    arr[i] = original[i];
  }

  // ==================================================
  // BOTTOM-UP MERGE SORT
  //
  // This is important:
  //
  // Every independent pair at the same level
  // is processed simultaneously.
  // ==================================================

  let width = 1;

  while (width < n) {
    const mergeGroups = [];

    // -----------------------------------------------
    // Create ALL pairs/groups for this level
    // -----------------------------------------------

    for (let start = 0; start < n; start += width * 2) {
      const mid = Math.min(
        start + width - 1,
        n - 1
      );

      const end = Math.min(
        start + width * 2 - 1,
        n - 1
      );

      if (mid < end) {
        mergeGroups.push({
          start,
          mid,
          end,
          left: arr.slice(start, mid + 1),
          right: arr.slice(mid + 1, end + 1),
          i: 0,
          j: 0,
          k: start,
          result: [],
        });
      }
    }

    if (mergeGroups.length === 0) {
      break;
    }

    // -----------------------------------------------
    // Show ALL merge pairs simultaneously
    // -----------------------------------------------

    const allComparingRanges = mergeGroups.flatMap(
      (group) => [
        [group.start, group.mid],
        [group.mid + 1, group.end],
      ]
    );

    addStep(
      `Compare ${mergeGroups.length} pairs simultaneously`,
      "COMPARE",
      [],
      allComparingRanges
    );

    // -----------------------------------------------
    // Process all groups together
    // -----------------------------------------------

    let finished = false;

    while (!finished) {
      finished = true;

      const comparingRanges = [];
      const mergedRanges = [];

      // ---------------------------------------------
      // One merge operation for EACH group
      // in this round
      // ---------------------------------------------

      mergeGroups.forEach((group) => {
        const { left, right } = group;

        if (
          group.i < left.length &&
          group.j < right.length
        ) {
          finished = false;

          const leftIndex =
            group.start + group.i;

          const rightIndex =
            group.mid + 1 + group.j;

          comparingRanges.push([
            leftIndex,
            leftIndex,
          ]);

          comparingRanges.push([
            rightIndex,
            rightIndex,
          ]);
        }
      });

      // ---------------------------------------------
      // Show all comparisons simultaneously
      // ---------------------------------------------

      if (comparingRanges.length > 0) {
        addStep(
          `Comparing elements from all pairs`,
          "COMPARE",
          [],
          comparingRanges
        );
      }

      // ---------------------------------------------
      // Place ONE element from every active pair
      // ---------------------------------------------

      const placementRanges = [];

      mergeGroups.forEach((group) => {
        const { left, right } = group;

        if (
          group.i < left.length &&
          group.j < right.length
        ) {
          const leftValue = left[group.i];
          const rightValue = right[group.j];

          if (leftValue <= rightValue) {
            arr[group.k] = leftValue;

            placementRanges.push([
              group.start + group.i,
              group.start + group.i,
            ]);

            group.i++;
          } else {
            arr[group.k] = rightValue;

            placementRanges.push([
              group.mid + 1 + group.j,
              group.mid + 1 + group.j,
            ]);

            group.j++;
          }

          group.result.push(arr[group.k]);
          group.k++;
        }
      });

      // ---------------------------------------------
      // Sound = MERGE
      // ---------------------------------------------

      if (placementRanges.length > 0) {
        addStep(
          `Place selected elements from all pairs`,
          "MERGE",
          [],
          placementRanges
        );
      }

      // ---------------------------------------------
      // Copy remaining LEFT values
      // from all groups simultaneously
      // ---------------------------------------------

      const remainingLeft = [];

      mergeGroups.forEach((group) => {
        if (
          group.i < group.left.length &&
          group.j >= group.right.length
        ) {
          finished = false;

          const index =
            group.start + group.i;

          arr[group.k] = group.left[group.i];

          remainingLeft.push([index, index]);

          group.result.push(arr[group.k]);

          group.i++;
          group.k++;
        }
      });

      if (remainingLeft.length > 0) {
        addStep(
          `Copy remaining left elements`,
          "MERGE",
          [],
          remainingLeft
        );
      }

      // ---------------------------------------------
      // Copy remaining RIGHT values
      // from all groups simultaneously
      // ---------------------------------------------

      const remainingRight = [];

      mergeGroups.forEach((group) => {
        if (
          group.j < group.right.length &&
          group.i >= group.left.length
        ) {
          finished = false;

          const index =
            group.mid + 1 + group.j;

          arr[group.k] = group.right[group.j];

          remainingRight.push([index, index]);

          group.result.push(arr[group.k]);

          group.j++;
          group.k++;
        }
      });

      if (remainingRight.length > 0) {
        addStep(
          `Copy remaining right elements`,
          "MERGE",
          [],
          remainingRight
        );
      }
    }

    // -----------------------------------------------
    // All groups at this level are now merged
    // -----------------------------------------------

    const completedRanges = mergeGroups.map(
      (group) => [group.start, group.end]
    );

    addStep(
      `Merged ${completedRanges.length} groups simultaneously`,
      "MERGED",
      [],
      [],
      completedRanges
    );

    width *= 2;
  }

  // ==================================================
  // COMPLETE
  // ==================================================

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [
          arr[j + 1],
          arr[j],
        ];
      }
    }
  }

  addStep(
    `Merge Sort complete → [${arr.join(", ")}]`,
    "COMPLETE",
    [],
    [],
    [[0, n - 1]]
  );

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