export function bubbleSort(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  const states = new Array(n).fill("default");

  steps.push({
    array: [...arr],
    states: [...states],
    highlights: [],
    message: "Starting Bubble Sort. We compare adjacent pairs and swap if the left is larger.",
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

  for (let k = 0; k < n; k++) states[k] = "sorted";
  steps.push({
    array: [...arr],
    states: [...states],
    highlights: [],
    message: "Bubble Sort complete! The array is fully sorted.",
  });
  return steps;
}

export function mergeSort(input) {
  const arr = [...input];
  const n = arr.length;
  const steps = [];
  const states = new Array(n).fill("default");

  steps.push({
    array: [...arr],
    states: [...states],
    highlights: [],
    message: "Starting Merge Sort. We recursively split the array then merge sorted halves.",
  });

  function merge(left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    for (k = left; k <= right; k++) states[k] = "comparing";
    steps.push({
      array: [...arr],
      states: [...states],
      highlights: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      message: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    i = 0; j = 0; k = left;
    while (i < leftArr.length && j < rightArr.length) {
      states[k] = "pivot";
      steps.push({
        array: [...arr],
        states: [...states],
        highlights: [k],
        message: `Compare ${leftArr[i]} and ${rightArr[j]}`,
      });
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      states[k] = "swapping";
      steps.push({
        array: [...arr],
        states: [...states],
        highlights: [k],
        message: `Placed ${arr[k]} at position ${k}`,
      });
      states[k] = "default";
      k++;
    }
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      states[k] = "swapping";
      steps.push({
        array: [...arr],
        states: [...states],
        highlights: [k],
        message: `Placed remaining ${arr[k]} at position ${k}`,
      });
      states[k] = "default";
      i++; k++;
    }
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      states[k] = "swapping";
      steps.push({
        array: [...arr],
        states: [...states],
        highlights: [k],
        message: `Placed remaining ${arr[k]} at position ${k}`,
      });
      states[k] = "default";
      j++; k++;
    }
  }

  function sort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, n - 1);

  for (let k = 0; k < n; k++) states[k] = "sorted";
  steps.push({
    array: [...arr],
    states: [...states],
    highlights: [],
    message: "Merge Sort complete! The array is fully sorted.",
  });
  return steps;
}

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

  let low = 0, high = n - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    for (let k = 0; k < n; k++) {
      if (k < low || k > high) states[k] = "sorted";
      else states[k] = "default";
    }
    states[mid] = "current";
    steps.push({
      array: [...arr],
      states: [...states],
      low, high, mid, target,
      found: false,
      message: `Checking middle index ${mid}: value ${arr[mid]}`,
    });

    if (arr[mid] === target) {
      states[mid] = "found";
      steps.push({
        array: [...arr],
        states: [...states],
        low, high, mid, target,
        found: true,
        message: `Found ${target} at index ${mid}!`,
      });
      return steps;
    } else if (arr[mid] < target) {
      for (let k = low; k <= mid; k++) states[k] = "sorted";
      steps.push({
        array: [...arr],
        states: [...states],
        low, high, mid, target,
        found: false,
        message: `${arr[mid]} < ${target}. Search the right half.`,
      });
      low = mid + 1;
    } else {
      for (let k = mid; k <= high; k++) states[k] = "sorted";
      steps.push({
        array: [...arr],
        states: [...states],
        low, high, mid, target,
        found: false,
        message: `${arr[mid]} > ${target}. Search the left half.`,
      });
      high = mid - 1;
    }
  }

  steps.push({
    array: [...arr],
    states: [...states],
    low, high, mid: -1, target,
    found: false,
    message: `${target} is not in the array.`,
  });
  return steps;
}

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
    if (visitedSet.has(current)) continue;
    visitedSet.add(current);
    visited.push(current);

    steps.push({
      visited: [...visited],
      frontier: [...frontier],
      current,
      path: [],
      edges: parent[current] != null ? [[parent[current], current]] : [],
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
      if (!visitedSet.has(neighbor) && !frontier.includes(neighbor)) {
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
        message: `Discovered neighbors of ${current}: ${newEdges.map(e => e[1]).join(", ")}`,
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
    if (visitedSet.has(current)) continue;
    visitedSet.add(current);
    visited.push(current);

    steps.push({
      visited: [...visited],
      frontier: [...stack],
      current,
      path: [],
      edges: parent[current] != null ? [[parent[current], current]] : [],
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
        if (parent[neighbor] == null && neighbor !== start) parent[neighbor] = current;
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
