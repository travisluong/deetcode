// @ts-nocheck

// String
DeetCode.string("str", "deetcode", { pointers: { i: 1, j: 2 } });

// Set
const set = new Set([1, 2, 3]);
set.delete(3);
set.add(3);
DeetCode.set("set", set);

// Map
const map = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
map.delete(3);
map.set(3, 3);
DeetCode.map("map", map);

// Array
const arr = [1, 2, 3];
DeetCode.array("arr", arr, { pointers: { i: 0, j: 2 } });
arr.push(4);
DeetCode.array("arr", arr, { pointers: { i: 1, j: 1 } });

// 2D Array
const arr2 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
DeetCode.array("arr2", arr2);

// Min Priority Queue
const minpq = new MinPriorityQueue();
minpq.enqueue(1);
DeetCode.minPriorityQueue("minpq", minpq);
minpq.enqueue(2);
DeetCode.minPriorityQueue("minpq", minpq);
minpq.enqueue(3);
DeetCode.minPriorityQueue("minpq", minpq);
minpq.dequeue();
DeetCode.minPriorityQueue("minpq", minpq);
minpq.front();

// Max Priority Queue
const maxpq = new MaxPriorityQueue();
maxpq.enqueue(1);
DeetCode.maxPriorityQueue("maxpq", maxpq);
maxpq.enqueue(2);
DeetCode.maxPriorityQueue("maxpq", maxpq);
maxpq.enqueue(3);
DeetCode.maxPriorityQueue("maxpq", maxpq);
maxpq.dequeue();
DeetCode.maxPriorityQueue("maxpq", maxpq);
maxpq.front();

// Priority Queue
const pq = new PriorityQueue((a, b) => b.rank - a.rank);
pq.enqueue({ name: "foo", rank: 1 });
DeetCode.priorityQueue("pq", pq);
pq.enqueue({ name: "bar", rank: 2 });
DeetCode.priorityQueue("pq", pq);
pq.enqueue({ name: "baz", rank: 3 });
DeetCode.priorityQueue("pq", pq);
pq.dequeue();
DeetCode.priorityQueue("pq", pq);
pq.front();

// Linked List
const linkedList = new ListNode(1);
linkedList.next = new ListNode(2);
linkedList.next.next = new ListNode(3);
linkedList.next.next.next = new ListNode(4);
const prev = linkedList;
const cur = linkedList.next;
DeetCode.linkedList("linked list", linkedList);

DeetCode.linkedList("with pointers", linkedList, {
  pointers: { prev: prev, cur: cur },
});

linkedList.next.next.next.next = linkedList.next;
DeetCode.linkedList("with cycle", linkedList);

// Bitwise
DeetCode.bitwise("binary", 123);

// Tree
const rootNode = new TreeNode(6);
rootNode.left = new TreeNode(2);
rootNode.left.left = new TreeNode(0);
rootNode.left.right = new TreeNode(4);
rootNode.left.right.left = new TreeNode(3);
rootNode.left.right.right = new TreeNode(5);
rootNode.right = new TreeNode(8);
rootNode.right.left = new TreeNode(7);
rootNode.right.right = new TreeNode(9);
rootNode.color = "green";
DeetCode.tree("tree", rootNode);

const treeFromArray = DeetCode.arrayToBinaryTree([4, 2, 7, 1, 3, 6, 9]);
DeetCode.tree("tree from array", treeFromArray);

// Undirected Graph
const adjList = [
  [2, 4],
  [1, 3],
  [2, 4],
  [1, 3],
];
// Build graph of Nodes from adjacency list
const nodes = DeetCode.buildGraph(adjList);
// Get the first node (index 0 of adjList)
const node = nodes[0];
// Change the node color
node.color = "green";
// Visualize graph
DeetCode.graph("node", node);

// Directed Graph
const prerequisites = [
  [0, 10],
  [3, 18],
  [5, 5],
  [6, 11],
  [11, 14],
  [13, 1],
  [15, 1],
  [17, 4],
];
// Declare adjacency list as map
const adj = new Map();
// Declare color map
const color = new Map();
// Build the initial adjacency list and color map
for (let i = 0; i < 20; i++) {
  adj.set(i, []);
  color.set(i, "white");
}
// Build the adjacency list from prerequisites array b -> a
for (const [a, b] of prerequisites) {
  adj.get(b).push(a);
}
// Visualize graph without color
DeetCode.directedGraph("directed graph", adj, { color: color });
// Set color
color.set(1, "green");
// Visualize graph with color
DeetCode.directedGraph("directed graph with color", adj, { color: color });

// Enable Auto Vis - Data structures are automatically visualized
DeetCode.enableAutoVis();

// Auto Set
const setA = new Set([4, 5, 6]);
setA.has(1);
setA.delete(3);
setA.add(3);

// Auto Map
const mapA = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
mapA.has(1);
mapA.get(1);
mapA.delete(3);
mapA.set(3, 3);

// Auto Array
const arrA = new Array();
arrA.push(1);
arrA.push(2);
arrA.push(3);
arrA.pop();
arrA.shift();
arrA.push(3);
arrA.unshift(1);
arrA[0] = 8;

// Auto 2D Array
const arrA2 = new Array();
arrA2.push([1, 2, 3]);
arrA2.push([4, 5, 6]);
arrA2.push([7, 8, 9]);
arrA2[1][1] = 88;

// Auto Min Priority Queue
const minpqA = new MinPriorityQueue();
minpqA.enqueue(1);
minpqA.enqueue(2);
minpqA.enqueue(3);
minpqA.dequeue();
minpqA.front();

// Auto Max Priority Queue
const maxpqA = new MaxPriorityQueue();
maxpqA.enqueue(1);
maxpqA.enqueue(2);
maxpqA.enqueue(3);
maxpqA.dequeue();
maxpqA.front();

// Auto Priority Queue
const pqA = new PriorityQueue((a, b) => b.rank - a.rank);
pqA.enqueue({ name: "foo", rank: 1 });
pqA.enqueue({ name: "bar", rank: 2 });
pqA.enqueue({ name: "baz", rank: 3 });
pqA.dequeue();
pqA.front();

// Disable Auto Vis - Stop automatic visualizations of data structures
DeetCode.disableAutoVis();

// Assertions
DeetTest.equal(true, true);
DeetTest.equal(1, 2);
