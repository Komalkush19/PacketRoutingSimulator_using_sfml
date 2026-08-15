Internet Packet Routing Simulator
1. Project Overview
The Internet Packet Routing Simulator is an interactive simulation
of how packets can be routed through a network of interconnected
routers.
The network is represented as a weighted graph:
Routers → vertices/nodes
Network links → edges
Link cost → edge weight
The simulator uses Dijkstra's shortest-path algorithm with a
Min-Heap priority queue to find the minimum-cost route between a
source router and a destination router.
The selected route is visualized on the network, and a packet is
animated hop-by-hop along that route. The simulator also supports link
failures and recalculates routing on the modified graph.

2. Main Objectives
Represent a network using a weighted graph.
Use an adjacency-list graph representation.
Implement a Min-Heap / Priority Queue.
Implement Dijkstra's shortest-path algorithm.
Demonstrate distance calculation and edge relaxation.
Reconstruct the selected shortest path.
Display the minimum-cost route and its cost.
Show routing decisions step-by-step.
Animate packet transmission.
Demonstrate dynamic re-routing after a link failure.

3. Data Structures Used
Graph
The network uses an adjacency-list representation. Each router stores
its connected links and their costs.
Example:
R1
├── R2 : cost 2
├── R3 : cost 4
└── R4 : cost 5

Min-Heap
A custom Min-Heap is used as the priority queue for Dijkstra's
algorithm.
It supports:
push() --- insert an element
pop() --- remove the minimum element
up() --- restore heap order after insertion
down() --- restore heap order after removal
The heap stores a router and its tentative distance.

Maps and Sets
The algorithm uses:
dist --- shortest currently known distance to each router
prev --- previous router used to reach a router
visited --- routers whose shortest distance has been finalized

4. Dijkstra's Algorithm
Step 1 --- Initialization
Every router initially has an infinite distance. The source router is
assigned distance 0 and inserted into the Min-Heap.

Step 2 --- Extract Minimum
The Min-Heap returns the router with the smallest tentative distance.

Step 3 --- Relax Neighbours
For each neighbour:
new distance = current distance + link cost
If the new distance is smaller than the existing distance, the distance
and previous-router information are updated and the neighbour is
inserted into the Min-Heap.

Step 4 --- Repeat
The process continues until the destination is reached or no reachable
routers remain.

Step 5 --- Reconstruct the Route
The prev structure is followed backwards from the destination to the
source.
Example:
prev[R9] = R7
prev[R7] = R4
prev[R4] = R2
prev[R2] = R1
Result:
R1 → R2 → R4 → R7 → R9

5. Step-by-Step Calculation Display
The simulator records Dijkstra's decisions in a calculation/decision
log.
For example:
Relax R2 → R4: 2 + 2 = 4
UPDATE: d(R4) = 4
previous(R4) = R2
If a candidate route is worse:
REJECT: 7 is not smaller than current d(R5) = 5
This makes the algorithm visible rather than showing only the final
route.

6. Network Topologies
The simulator contains four predefined networks:
Balanced Network --- moderately connected with several possible
routes.
Dense Network --- highly connected with many alternatives.
Long-Distance Network --- demonstrates routing through several
intermediate routers.
High-Redundancy Network --- contains multiple alternative
connections and is useful for failure/re-routing demonstrations.
Each network contains weighted links, so the route with the fewest hops
is not necessarily the minimum-cost route.

7. Link Failure and Dynamic Re-Routing
A network link can be broken during the simulation.
Example:
Before:
R1 → R2 → R4 → R7 → R9
If R4 ↔ R7 fails, that edge becomes unavailable. Running the routing
algorithm again can produce another valid minimum-cost route:
After:
R1 → R3 → R6 → R8 → R9
This demonstrates how routing changes when the network topology changes.

8. Packet Simulation
After a route is calculated, Send Packet starts packet animation.
The packet moves router-by-router along the selected route:
R1 ●────→ R2 ────→ R4 ────→ R7 ────→ R9
The simulator logs packet arrivals and reports when the destination is
reached.

9. Visual Representation
The canvas displays:
Routers
Network links
Link costs
Current Dijkstra activity
Final selected route
Failed links
Moving packet
Different visual states distinguish normal links, the currently examined
link, the final route, and failed links.

10. Project Workflow
Select Network
      ↓
Select Source & Destination
      ↓
Load Weighted Graph
      ↓
Run Dijkstra
      ↓
Min-Heap selects minimum-distance router
      ↓
Relax neighbouring edges
      ↓
Update distances and previous routers
      ↓
Reach Destination
      ↓
Reconstruct Shortest Path
      ↓
Display Route + Cost
      ↓
Animate Packet
      ↓
Optional Link Failure
      ↓
Run Routing Again
      ↓
New Shortest Route


11. Project Files
index.html
Contains the simulator structure, controls, network canvas, calculation
log, selected-route section, and link-failure controls.

style.css
Controls the layout, panels, buttons, colors, canvas area, logs, and
route display.

script.js
Contains the main project logic:
MinHeap
Graph
Dijkstra's algorithm
Network definitions
Route calculation
Step-by-step execution
Packet animation
Link failure and restoration
Canvas drawing
User interaction

12. Important Functions
MinHeap
Handles priority queue operations.
Graph
Handles routers, weighted edges, neighbours, active/failed links, and
Dijkstra's algorithm.
dijkstra(source, destination)
Calculates the minimum-cost path and returns the path, cost, algorithm
steps, distances, and previous-router information.
findRoute()
Starts routing between the selected source and destination.
runNextStep()
Displays Dijkstra's operations step-by-step.
sendPacket()
Animates packet transmission along the calculated route.
restoreLinks()
Restores failed network links.
draw()
Draws the current network and simulation state on the canvas.

13. Complexity
For a graph with V routers and E links, using an adjacency list and
binary Min-Heap:
Time Complexity: O((V + E) log V)
For a connected graph this is commonly written as:
O(E log V)
The graph representation requires:
Space: O(V + E)


15. Why This Is a DSA Project
The routing decision is produced by actual DSA structures and
algorithms:
Weighted Graph
      +
Adjacency List
      +
Min-Heap
      +
Dijkstra
      +
Path Reconstruction
      ↓
Minimum-Cost Route
The visualization demonstrates what those algorithms are doing in a
network scenario.



15. How to Run
Keep the three files together:
packet-routing-simulator/
├── index.html
├── style.css
└── script.js

Open index.html in a modern web browser.
No server or external installation is required.

16. Basic Demonstration
Open the simulator.
Select a network topology.
Select source and destination routers.
Click Find Route.
Observe the Dijkstra calculations in the decision log.
Observe the selected minimum-cost path.
Click Send Packet.
Watch the packet travel through the selected routers.
Activate Break a Link.
Click a network link.
Run Find Route again.
Observe the new route.
Use Restore Links to restore the network.

17. Conclusion
The Internet Packet Routing Simulator applies fundamental DSA concepts
to a realistic networking problem.
It connects:
DSA Algorithm
      ↓
Network Routing Decision
      ↓
Visual Network
      ↓
Packet Transmission
      ↓
Network Failure
      ↓
Dynamic Re-Routing

The project therefore demonstrates graphs, weighted edges, priority
queues, shortest-path algorithms, path reconstruction, and dynamic graph
changes in one practical simulation.
