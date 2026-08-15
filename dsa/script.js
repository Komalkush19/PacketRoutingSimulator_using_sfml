class MinHeap {
  constructor() {
    this.heap = [];
  }
  get size() {
    return this.heap.length;
  }
  push(item) {
    this.heap.push(item);
    this.up(this.heap.length - 1);
  }
  up(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].distance <= this.heap[index].distance) {
        break;
      }
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }
  pop() {
    if (this.heap.length === 0) {
      return null;
    }
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.down(0);
    }
    return root;
  }
  down(index) {
    while (true) {
      let smallest = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      if (left < this.heap.length && this.heap[left].distance < this.heap[smallest].distance) {
        smallest = left;
      }
      if (right < this.heap.length && this.heap[right].distance < this.heap[smallest].distance) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
class Graph {
  constructor() {
    this.adj = new Map();
    this.edges = [];
  }
  addRouter(id, x, y) {
    this.adj.set(id, []);
    positions.set(id, {
      x: x,
      y: y,
    });
  }
  addEdge(u, v, weight) {
    const edge = {
      u: u,
      v: v,
      weight: weight,
      active: true,
    };
    this.edges.push(edge);
    this.adj.get(u).push(edge);
    this.adj.get(v).push(edge);
  }
  neighbors(node) {
    const result = [];
    for (const edge of this.adj.get(node) || []) {
      if (!edge.active) {
        continue;
      }
      const other = edge.u === node ? edge.v : edge.u;
      result.push({
        v: other,
        weight: edge.weight,
        edge: edge,
      });
    }
    return result;
  }
  restoreAll() {
    for (const edge of this.edges) {
      edge.active = true;
    }
  }
  dijkstra(source, destination) {
    const dist = new Map();
    const prev = new Map();
    const visited = new Set();
    const heap = new MinHeap();
    const steps = [];
    // Initially every node has infinity distance.
    for (const id of this.adj.keys()) {
      dist.set(id, Infinity);
      prev.set(id, null);
    }
    // Distance of source is zero.
    dist.set(source, 0);
    // Put source into Min Heap.
    heap.push({
      node: source,
      distance: 0,
    });
    steps.push({
      type: "start",
      node: source,
      message: `Initialize: d(R${source}) = 0 and every other distance = infinity.`,
    });
    // ====================================================
    // MAIN DIJKSTRA LOOP
    // ====================================================
    while (heap.size > 0) {
      const item = heap.pop();
      const u = item.node;
      // Ignore nodes already finalized.
      if (visited.has(u)) {
        continue;
      }
      // Mark node as finalized.
      visited.add(u);
      steps.push({
        type: "extract",
        node: u,
        distance: dist.get(u),
        message: `Min-Heap extracts R${u} because it has the smallest tentative distance ${dist.get(u)}.`,
      });
      // If destination reached, stop.
      if (u === destination) {
        steps.push({
          type: "destination",
          node: u,
          message: `R${u} is the destination. Its shortest distance is finalized.`,
        });
        break;
      }
      // =================================================
      // RELAX ALL NEIGHBORS
      // =================================================
      for (const neighbor of this.neighbors(u)) {
        const v = neighbor.v;
        const weight = neighbor.weight;
        if (visited.has(v)) {
          continue;
        }
        const oldDistance = dist.get(v);
        const candidate = dist.get(u) + weight;
        steps.push({
          type: "relax",
          from: u,
          to: v,
          candidate: candidate,
          oldDistance: oldDistance,
          weight: weight,
          message: `Relax R${u} → R${v}: ${dist.get(u)} + ${weight} = ${candidate}.`,
        });
        // =================================================
        // BETTER PATH FOUND
        // =================================================
        if (candidate < oldDistance) {
          dist.set(v, candidate);
          prev.set(v, u);
          heap.push({
            node: v,
            distance: candidate,
          });
          steps.push({
            type: "update",
            from: u,
            to: v,
            distance: candidate,
            message: `UPDATE: d(R${v}) = ${candidate}; previous(R${v}) = R${u}. Push R${v} into Min-Heap.`,
          });
        }
        // =================================================
        // PATH REJECTED
        // =================================================
        else {
          steps.push({
            type: "reject",
            from: u,
            to: v,
            candidate: candidate,
            oldDistance: oldDistance,
            message: `REJECT: ${candidate} is not smaller than current d(R${v}) = ${oldDistance === Infinity ? "infinity" : oldDistance}.`,
          });
        }
      }
    }
    // =====================================================
    // NO ROUTE
    // =====================================================
    if (dist.get(destination) === Infinity) {
      return {
        path: [],
        cost: Infinity,
        steps: steps,
        dist: dist,
        prev: prev,
      };
    }
    // =====================================================
    // PATH RECONSTRUCTION
    // =====================================================
    const path = [];
    let current = destination;
    while (current !== null) {
      path.unshift(current);
      current = prev.get(current);
    }
    return {
      path: path,
      cost: dist.get(destination),
      steps: steps,
      dist: dist,
      prev: prev,
    };
  }
}
// ============================================================
// NETWORK DEFINITIONS
// ============================================================
const NETWORKS = {
  balanced: {
    name: "Balanced Network",
    nodes: {
      1: [100, 300],
      2: [260, 120],
      3: [260, 480],
      4: [430, 300],
      5: [430, 80],
      6: [430, 520],
      7: [630, 150],
      8: [630, 450],
      9: [820, 300],
    },
    links: [
      [1, 2, 2],
      [1, 3, 4],
      [2, 4, 2],
      [3, 4, 1],
      [2, 5, 5],
      [3, 6, 3],
      [4, 5, 2],
      [4, 6, 5],
      [5, 7, 2],
      [6, 8, 2],
      [7, 9, 3],
      [8, 9, 1],
      [4, 7, 6],
      [4, 8, 4],
      [5, 6, 4],
      [7, 8, 2],
    ],
  },
  dense: {
    name: "Dense Network",
    nodes: {
      1: [80, 300],
      2: [220, 110],
      3: [220, 490],
      4: [390, 200],
      5: [390, 400],
      6: [560, 110],
      7: [560, 490],
      8: [730, 200],
      9: [730, 400],
      10: [880, 300],
    },
    links: [
      [1, 2, 3],
      [1, 3, 2],
      [1, 4, 5],
      [1, 5, 6],
      [2, 4, 2],
      [2, 6, 6],
      [2, 5, 5],
      [3, 5, 2],
      [3, 7, 5],
      [3, 4, 4],
      [4, 5, 1],
      [4, 6, 3],
      [4, 8, 5],
      [5, 7, 2],
      [5, 9, 4],
      [6, 8, 2],
      [6, 10, 7],
      [6, 9, 5],
      [7, 9, 2],
      [7, 10, 4],
      [8, 9, 1],
      [8, 10, 3],
      [9, 10, 2],
    ],
  },
  long: {
    name: "Long-Distance Network",
    nodes: {
      1: [70, 300],
      2: [200, 150],
      3: [200, 450],
      4: [340, 300],
      5: [480, 150],
      6: [480, 450],
      7: [620, 300],
      8: [760, 150],
      9: [760, 450],
      10: [890, 300],
    },
    links: [
      [1, 2, 3],
      [1, 3, 2],
      [2, 4, 4],
      [3, 4, 3],
      [4, 5, 2],
      [4, 6, 6],
      [5, 7, 3],
      [6, 7, 2],
      [5, 8, 5],
      [6, 9, 3],
      [7, 8, 2],
      [7, 9, 4],
      [8, 10, 3],
      [9, 10, 2],
      [5, 6, 7],
      [8, 9, 5],
    ],
  },
  redundant: {
    name: "High-Redundancy Network",
    nodes: {
      1: [90, 300],
      2: [240, 110],
      3: [240, 490],
      4: [410, 210],
      5: [410, 390],
      6: [580, 110],
      7: [580, 490],
      8: [750, 210],
      9: [750, 390],
      10: [900, 300],
    },
    links: [
      [1, 2, 2],
      [1, 3, 2],
      [1, 4, 4],
      [1, 5, 5],
      [2, 4, 2],
      [2, 6, 4],
      [2, 5, 5],
      [3, 5, 2],
      [3, 7, 4],
      [3, 4, 5],
      [4, 5, 2],
      [4, 6, 2],
      [4, 7, 5],
      [4, 8, 5],
      [5, 7, 2],
      [5, 6, 5],
      [5, 9, 4],
      [6, 8, 2],
      [6, 9, 5],
      [6, 10, 5],
      [7, 9, 2],
      [7, 8, 5],
      [7, 10, 4],
      [8, 9, 2],
      [8, 10, 2],
      [9, 10, 2],
    ],
  },
};
// ============================================================
// DOM ELEMENTS
// ============================================================
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const networkSelect = document.getElementById("networkSelect");
const sourceSelect = document.getElementById("sourceSelect");
const destSelect = document.getElementById("destSelect");
const logEl = document.getElementById("log");
const routeResult = document.getElementById("routeResult");
const sendBtn = document.getElementById("sendBtn");
const breakBtn = document.getElementById("breakModeBtn");
const canvasHint = document.getElementById("canvasHint");
// ============================================================
// GLOBAL STATE
// ============================================================
const graph = new Graph();
const positions = new Map();
let result = null;
let activeNode = null;
let activeEdge = null;
let stepIndex = -1;
let timer = null;
let packet = null;
let breakMode = false;
// These are ONLY for visualizing Dijkstra's progress.
// They are not a separate table.
let visualDist = new Map();
let visualPrev = new Map();
let visualVisited = new Set();
// ============================================================
// LOGGING
// ============================================================
function log(message, type = "info") {
  const div = document.createElement("div");
  div.className = type;
  div.textContent = message;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}
function clearLog() {
  logEl.innerHTML = "";
}
// ============================================================
// POPULATE SOURCE / DESTINATION
// ============================================================
function populateSelectors() {
  sourceSelect.innerHTML = "";
  destSelect.innerHTML = "";
  const ids = [...graph.adj.keys()].sort((a, b) => a - b);
  for (const id of ids) {
    sourceSelect.add(new Option(`R${id}`, id));
    destSelect.add(new Option(`R${id}`, id));
  }
}
// ============================================================
// LOAD NETWORK
// ============================================================
function loadNetwork(name) {
  stopAll();
  const network = NETWORKS[name] || NETWORKS.balanced;
  graph.adj.clear();
  graph.edges = [];
  positions.clear();
  for (const [id, position] of Object.entries(network.nodes)) {
    graph.addRouter(Number(id), position[0], position[1]);
  }
  for (const link of network.links) {
    graph.addEdge(link[0], link[1], link[2]);
  }
  populateSelectors();
  const ids = [...graph.adj.keys()].sort((a, b) => a - b);
  sourceSelect.value = String(ids[0]);
  destSelect.value = String(ids[ids.length - 1]);
  clearResult();
  clearLog();
  canvasHint.style.display = "none";
  log(`${network.name} loaded.`, "success");
  log(`${ids.length} routers and ${network.links.length} network links.`, "info");
  log("Several routes are available between source and destination.", "info");
  draw();
}
// ============================================================
// CLEAR CURRENT ROUTE
// ============================================================
function clearResult() {
  result = null;
  stepIndex = -1;
  activeNode = null;
  activeEdge = null;
  visualDist = new Map();
  visualPrev = new Map();
  visualVisited = new Set();
  routeResult.textContent = "No route calculated.";
  sendBtn.disabled = true;
  draw();
}
// ============================================================
// FIND ROUTE
// ============================================================
function findRoute() {
  stopAll();
  const source = Number(sourceSelect.value);
  const destination = Number(destSelect.value);
  if (source === destination) {
    log("Source and destination must be different.", "warning");
    return;
  }
  clearLog();
  result = graph.dijkstra(source, destination);
  stepIndex = -1;
  log(`ROUTE REQUEST: R${source} → R${destination}`, "success");
  log("Starting Dijkstra using a Min-Heap priority queue.", "info");
  // Initialize visual state.
  for (const id of graph.adj.keys()) {
    visualDist.set(id, Infinity);
    visualPrev.set(id, null);
  }
  visualDist.set(source, 0);
  runNextStep();
}
// ============================================================
// PLAY DIJKSTRA STEP BY STEP
// ============================================================
function runNextStep() {
  stepIndex++;
  if (!result || stepIndex >= result.steps.length) {
    finishRoute();
    return;
  }
  const step = result.steps[stepIndex];
  activeEdge = null;
  // --------------------------------------------------------
  // START
  // --------------------------------------------------------
  if (step.type === "start") {
    activeNode = step.node;
    log(step.message, "info");
  }
  // --------------------------------------------------------
  // EXTRACT MINIMUM
  // --------------------------------------------------------
  if (step.type === "extract") {
    activeNode = step.node;
    visualVisited.add(step.node);
    log(step.message, "queue");
  }
  // --------------------------------------------------------
  // RELAXATION
  // --------------------------------------------------------
  if (step.type === "relax") {
    activeNode = step.from;
    activeEdge = [step.from, step.to];
    log(
      `${step.message} ` +
        `Current = ${step.oldDistance === Infinity ? "infinity" : step.oldDistance}.`,
      "calc",
    );
  }
  // --------------------------------------------------------
  // UPDATE
  // --------------------------------------------------------
  if (step.type === "update") {
    visualDist.set(step.to, step.distance);
    visualPrev.set(step.to, step.from);
    activeEdge = [step.from, step.to];
    log(step.message, "success");
  }
  // --------------------------------------------------------
  // REJECT
  // --------------------------------------------------------
  if (step.type === "reject") {
    activeEdge = [step.from, step.to];
    log(step.message, "warning");
  }
  // --------------------------------------------------------
  // DESTINATION
  // --------------------------------------------------------
  if (step.type === "destination") {
    activeNode = step.node;
    log(step.message, "success");
  }
  draw();
  timer = setTimeout(runNextStep, 700);
}
// ============================================================
// FINISH ROUTING
// ============================================================
function finishRoute() {
  activeNode = null;
  activeEdge = null;
  // --------------------------------------------------------
  // NO ROUTE
  // --------------------------------------------------------
  if (!result || result.path.length === 0) {
    routeResult.innerHTML =
      '<span style="color:#ff6574">' + "No route available — packet would be dropped." + "</span>";
    log("No path exists in the current graph.", "warning");
    sendBtn.disabled = true;
    draw();
    return;
  }
  // --------------------------------------------------------
  // FINAL PATH
  // --------------------------------------------------------
  const path = result.path.map((id) => `R${id}`).join(" → ");
  routeResult.innerHTML =
    `<div style="color:#42df9b">${path}</div>` +
    `<div>Total cost = <strong>${result.cost}</strong></div>` +
    `<div>Hops = ${result.path.length - 1}</div>`;
  log("FINAL ROUTING DECISION", "success");
  log(`Selected route: ${path}`, "success");
  log(`Minimum cost = ${result.cost}`, "success");
  log("Every alternative route discovered by Dijkstra had an equal or greater cost.", "info");
  sendBtn.disabled = false;
  draw();
}
// ============================================================
// SEND PACKET
// ============================================================
function sendPacket() {
  if (!result || result.path.length < 2) {
    return;
  }
  stopTimer();
  packet = {
    segment: 0,
    t: 0,
    last: performance.now(),
  };
  log("PACKET TRANSMISSION STARTED.", "success");
  function animate(now) {
    if (!packet) {
      return;
    }
    const duration = 850;
    packet.t = Math.min(1, (now - packet.last) / duration);
    draw();
    // ----------------------------------------------------
    // PACKET ARRIVED AT NEXT ROUTER
    // ----------------------------------------------------
    if (packet.t >= 1) {
      const from = result.path[packet.segment];
      const to = result.path[packet.segment + 1];
      log(`Packet arrived at R${to} ` + `via R${from} → R${to}.`, "info");
      packet.segment++;
      packet.last = now;
      // ------------------------------------------------
      // DESTINATION REACHED
      // ------------------------------------------------
      if (packet.segment >= result.path.length - 1) {
        log(`PACKET DELIVERED TO R${result.path[result.path.length - 1]}.`, "success");
        packet = null;
        draw();
        return;
      }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
// ============================================================
// TIMER CONTROL
// ============================================================
function stopTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}
function stopAll() {
  stopTimer();
  packet = null;
}
// ============================================================
// RESTORE FAILED LINKS
// ============================================================
function restoreLinks() {
  graph.restoreAll();
  breakMode = false;
  breakBtn.classList.remove("break-active");
  breakBtn.textContent = "Break a Link";
  stopAll();
  clearResult();
  clearLog();
  log("All network links restored.", "success");
  draw();
}
// ============================================================
// FIND DISTANCE FROM CLICK TO LINE
// ============================================================
function pointSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) {
    return Math.hypot(px - ax, py - ay);
  }
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
// ============================================================
// BREAK NETWORK LINK
// ============================================================
canvas.addEventListener("click", function (event) {
  if (!breakMode) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = (canvas.logicalWidth || canvas.clientWidth) / rect.width;
  const scaleY = (canvas.logicalHeight || canvas.clientHeight) / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const width = canvas.logicalWidth || canvas.clientWidth;
  const height = canvas.logicalHeight || canvas.clientHeight;
  const scale = Math.min(width / 930, height / 600);
  const offsetX = (width - 930 * scale) / 2;
  const offsetY = (height - 600 * scale) / 2;
  let selectedEdge = null;
  let bestDistance = 12;
  for (const edge of graph.edges) {
    if (!edge.active) {
      continue;
    }
    const pointA = positions.get(edge.u);
    const pointB = positions.get(edge.v);
    const a = {
      x: offsetX + pointA.x * scale,
      y: offsetY + pointA.y * scale,
    };
    const b = {
      x: offsetX + pointB.x * scale,
      y: offsetY + pointB.y * scale,
    };
    const distance = pointSegment(x, y, a.x, a.y, b.x, b.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      selectedEdge = edge;
    }
  }
  if (!selectedEdge) {
    return;
  }
  selectedEdge.active = false;
  stopAll();
  clearResult();
  log(`LINK FAILURE: R${selectedEdge.u} ↔ R${selectedEdge.v} is now unavailable.`, "warning");
  log("Run Find Route to calculate a new path around the failure.", "info");
  draw();
});
// ============================================================
// BREAK MODE BUTTON
// ============================================================
breakBtn.addEventListener("click", function () {
  breakMode = !breakMode;
  breakBtn.classList.toggle("break-active", breakMode);
  breakBtn.textContent = breakMode ? "Break Mode: ON" : "Break a Link";
  log(
    breakMode ? "Break mode ON — click a link on the graph." : "Break mode OFF.",
    breakMode ? "warning" : "info",
  );
});
// ============================================================
// BUTTON EVENTS
// ============================================================
networkSelect.addEventListener("change", function () {
  loadNetwork(networkSelect.value);
});
document.getElementById("routeBtn").addEventListener("click", findRoute);
sendBtn.addEventListener("click", sendPacket);
document.getElementById("restoreBtn").addEventListener("click", restoreLinks);
// ============================================================
// DRAW GRAPH
// ============================================================
function draw() {
  const width = canvas.logicalWidth || canvas.clientWidth;
  const height = canvas.logicalHeight || canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);
  if (graph.adj.size === 0) {
    return;
  }
  const scale = Math.min(width / 930, height / 600);
  const offsetX = (width - 930 * scale) / 2;
  const offsetY = (height - 600 * scale) / 2;
  function getPoint(id) {
    const point = positions.get(id);
    return {
      x: offsetX + point.x * scale,
      y: offsetY + point.y * scale,
    };
  }
  // ========================================================
  // DRAW LINKS
  // ========================================================
  for (const edge of graph.edges) {
    const a = getPoint(edge.u);
    const b = getPoint(edge.v);
    const isActiveEdge =
      activeEdge &&
      ((activeEdge[0] === edge.u && activeEdge[1] === edge.v) ||
        (activeEdge[0] === edge.v && activeEdge[1] === edge.u));
    const isFinalPath =
      result &&
      result.path.length > 0 &&
      stepIndex >= result.steps.length &&
      edgeInPath(result.path, edge.u, edge.v);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    // ----------------------------------------------------
    // FAILED LINK
    // ----------------------------------------------------
    if (!edge.active) {
      ctx.strokeStyle = "#ff6574";
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 7]);
    }
    // ----------------------------------------------------
    // FINAL ROUTE
    // ----------------------------------------------------
    else if (isFinalPath) {
      ctx.strokeStyle = "#42df9b";
      ctx.lineWidth = 5;
      ctx.setLineDash([]);
    }
    // ----------------------------------------------------
    // CURRENTLY EXAMINED EDGE
    // ----------------------------------------------------
    else if (isActiveEdge) {
      ctx.strokeStyle = "#ffc857";
      ctx.lineWidth = 4;
      ctx.setLineDash([]);
    }
    // ----------------------------------------------------
    // NORMAL LINK
    // ----------------------------------------------------
    else {
      ctx.strokeStyle = "#31475b";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    // ====================================================
    // EDGE COST
    // ====================================================
    const middleX = (a.x + b.x) / 2;
    const middleY = (a.y + b.y) / 2;
    ctx.fillStyle = "#071018";
    ctx.fillRect(middleX - 13, middleY - 9, 26, 18);
    ctx.fillStyle = "#ffc857";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(edge.weight, middleX, middleY);
  }
  // ========================================================
  // DRAW PACKET
  // ========================================================
  if (packet && result) {
    const from = getPoint(result.path[packet.segment]);
    const to = getPoint(result.path[packet.segment + 1]);
    const x = from.x + (to.x - from.x) * packet.t;
    const y = from.y + (to.y - from.y) * packet.t;
    ctx.beginPath();
    ctx.fillStyle = "#55a7ff";
    ctx.shadowColor = "#55a7ff";
    ctx.shadowBlur = 18;
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#55a7ff";
    ctx.font = "bold 10px monospace";
    ctx.fillText("PACKET", x, y - 17);
  }
  // ========================================================
  // DRAW ROUTERS
  // ========================================================
  for (const id of graph.adj.keys()) {
    const point = getPoint(id);
    let fill = "#142535";
    // Source
    if (id === Number(sourceSelect.value)) {
      fill = "#245f91";
    }
    // Destination
    if (id === Number(destSelect.value)) {
      fill = "#71303a";
    }
    // Finalized by Dijkstra
    if (visualVisited.has(id)) {
      fill = "#19553f";
    }
    // Currently selected router
    if (id === activeNode) {
      fill = "#9b7425";
    }
    ctx.beginPath();
    ctx.arc(point.x, point.y, 25, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "#dbe7ef";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#e9f1f7";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`R${id}`, point.x, point.y);
  }
}
// ============================================================
// CHECK WHETHER EDGE IS PART OF FINAL PATH
// ============================================================
function edgeInPath(path, u, v) {
  for (let i = 0; i < path.length - 1; i++) {
    if ((path[i] === u && path[i + 1] === v) || (path[i] === v && path[i + 1] === u)) {
      return true;
    }
  }
  return false;
}
// ============================================================
// CANVAS RESIZE
// ============================================================
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.logicalWidth = rect.width;
  canvas.logicalHeight = rect.height;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}
// ============================================================
// INITIALIZATION
// ============================================================
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
loadNetwork("balanced");