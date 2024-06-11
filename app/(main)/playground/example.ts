// @ts-nocheck

DeetCode.string("str", "deetcode", { pointers: { i: 1, j: 2 } });

const set1 = new Set([1, 2, 3]);
set1.delete(3);
set1.add(3);
DeetCode.set("set1", set1);

DeetCode.enableAutoVis();
const set2 = new Set([4, 5, 6]);
set2.has(1);
set2.delete(3);
set2.add(3);
DeetCode.disableAutoVis();

const map1 = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
map1.delete(3);
map1.set(3, 3);
DeetCode.map("map1", map1);

DeetCode.enableAutoVis();
const map2 = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
map2.has(1);
map2.get(1);
map2.delete(3);
map2.set(3, 3);
DeetCode.disableAutoVis();

const arr1 = [1, 2, 3];
DeetCode.array("arr1", arr1, { pointers: { i: 0, j: 2 } });

arr1.push(4);
DeetCode.array("arr1", arr1, { pointers: { i: 1, j: 1 } });

const arr2 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
DeetCode.array("arr2", arr2);

DeetCode.enableAutoVis();
const arr3 = new Array();
arr3.push(1);
arr3.push(2);
arr3.push(3);
arr3.pop();
arr3.shift();
arr3.push(3);
arr3.unshift(1);
arr3[0] = 8;
const arr4 = new Array();
arr4.push([1, 2, 3]);
arr4.push([4, 5, 6]);
arr4.push([7, 8, 9]);
arr4[1][1] = 88;
DeetCode.disableAutoVis();

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

DeetCode.bitwise("binary", 123);

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

const adjList = [
  [2, 4],
  [1, 3],
  [2, 4],
  [1, 3],
];
const nodes = DeetCode.buildGraph(adjList);
const root = nodes[0];
root.color = "green";
DeetCode.graph("root", root);

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
const adj = new Map();
const color = new Map();
for (let i = 0; i < 20; i++) {
  adj.set(i, []);
  color.set(i, "white");
}
for (const [a, b] of prerequisites) {
  adj.get(b).push(a);
}
DeetCode.directedGraph("directed graph", { adj: adj });

color.set(1, "green");
DeetCode.directedGraph("directed graph with color", { adj: adj, color: color });

DeetCode.enableAutoVis();

const minpq2 = new MinPriorityQueue();
minpq2.enqueue(1);
minpq2.enqueue(2);
minpq2.enqueue(3);
minpq2.dequeue();
minpq2.front();

const maxpq2 = new MaxPriorityQueue();
maxpq2.enqueue(1);
maxpq2.enqueue(2);
maxpq2.enqueue(3);
maxpq2.dequeue();
maxpq2.front();

const pq2 = new PriorityQueue((a, b) => b.rank - a.rank);
pq2.enqueue({ name: "foo", rank: 1 });
pq2.enqueue({ name: "bar", rank: 2 });
pq2.enqueue({ name: "baz", rank: 3 });
pq2.dequeue();
pq2.front();

DeetCode.disableAutoVis();

DeetTest.equal(true, true);
DeetTest.equal(1, 2);
