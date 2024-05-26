// @ts-nocheck

/**
 * DeetCode supports visualizations for data structures
 * commonly used in LeetCode problems:
 * Set, Map, Array, MinPriorityQueue, MaxPriorityQueue, PriorityQueue,
 * Linked List, Binary Tree.
 * DeetCode also provides various visualization utilities such as:
 * Indexes on an array and Bitwise.
 */

/**
 * Set
 */
const set1 = new Set([1, 2, 3]);
set1.delete(3);
set1.add(3);
DeetCode.set({ id: "set1", data: set1 });

/**
 * Auto Vis Set
 */
DeetCode.enableAutoVis();
const set2 = new Set([4, 5, 6]);
set2.has(1);
set2.delete(3);
set2.add(3);
DeetCode.disableAutoVis();

/**
 * Map
 */
const map1 = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
map1.delete(3);
map1.set(3, 3);
DeetCode.map({ id: "map1", data: map1 });

/**
 * Auto Vis Map
 */
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

/**
 * Array
 */
const arr1 = [1, 2, 3];
DeetCode.array({ id: "arr1", data: arr1, indexObj: { i: 0, j: 2 } });

arr1.push(4);
DeetCode.array({ id: "arr1", data: arr1, indexObj: { i: 1, j: 1 } });

const arr2 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
DeetCode.array({ id: "arr2", data: arr2 });

/**
 * Native Array
 */
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

/**
 * MinPriorityQueue
 */
const minpq = new MinPriorityQueue();
minpq.enqueue(1);
DeetCode.minPriorityQueue({ id: "minpq", data: minpq });
minpq.enqueue(2);
DeetCode.minPriorityQueue({ id: "minpq", data: minpq });
minpq.enqueue(3);
DeetCode.minPriorityQueue({ id: "minpq", data: minpq });
minpq.dequeue();
DeetCode.minPriorityQueue({ id: "minpq", data: minpq });
minpq.front();

/**
 * MaxPriorityQueue
 */
const maxpq = new MaxPriorityQueue();
maxpq.enqueue(1);
DeetCode.maxPriorityQueue({ id: "maxpq", data: maxpq });
maxpq.enqueue(2);
DeetCode.maxPriorityQueue({ id: "maxpq", data: maxpq });
maxpq.enqueue(3);
DeetCode.maxPriorityQueue({ id: "maxpq", data: maxpq });
maxpq.dequeue();
DeetCode.maxPriorityQueue({ id: "maxpq", data: maxpq });
maxpq.front();

/**
 * PriorityQueue
 */
const pq = new PriorityQueue((a, b) => b.rank - a.rank);
pq.enqueue({ name: "foo", rank: 1 });
DeetCode.priorityQueue({ id: "pq", data: pq });
pq.enqueue({ name: "bar", rank: 2 });
DeetCode.priorityQueue({ id: "pq", data: pq });
pq.enqueue({ name: "baz", rank: 3 });
DeetCode.priorityQueue({ id: "pq", data: pq });
pq.dequeue();
DeetCode.priorityQueue({ id: "pq", data: pq });
pq.front();

/**
 * Linked List
 */
const linkedList = new ListNode(1);
linkedList.next = new ListNode(2);
linkedList.next.next = new ListNode(3);
linkedList.next.next.next = new ListNode(4);
const prev = linkedList;
const cur = linkedList.next;
DeetCode.linkedList({ id: "linked list", data: linkedList });

/**
 * Linked List Pointers
 */
DeetCode.linkedList({
  id: "with pointers",
  data: linkedList,
  pointers: { prev: prev, cur: cur },
});

/**
 * Linked List Cycle
 */
linkedList.next.next.next.next = linkedList.next;
DeetCode.linkedList({ id: "with cycle", data: linkedList });

/**
 * Bitwise
 */
DeetCode.bitwise({
  id: "binary",
  data: 123,
});

/**
 * Binary Tree
 */
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
DeetCode.tree({ id: "tree", data: rootNode });

/**
 * LeetCode style array to binary tree syntax is supported
 */
const treeFromArray = DeetCode.arrayToBinaryTree([4, 2, 7, 1, 3, 6, 9]);
DeetCode.tree({ id: "tree from array", data: treeFromArray });

/**
 * DeetCode supports auto visualizations of native JavaScript
 * data structures. This allows you to create visualizations without
 * having to call DeetCode. This experimental feature can be enabled
 * with DeetCode.enableAutoVis().
 */
DeetCode.enableAutoVis();

// const map2 = new Map([
//   [1, 1],
//   [2, 2],
//   [3, 3],
// ]);
// map2.has(1);
// map2.get(1);
// map2.delete(3);
// map2.set(3, 3);

/**
 * DeetCode still works even with Auto Native Visualization enabled
 */
DeetCode.set({ id: "set2", data: set2 });

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

/**
 * Auto native visualization can be disabled DeetCode.disableAutoVis().
 */
DeetCode.disableAutoVis();

// This set will not be rendered in the visualization.
const set3 = new Set([2, 3, 4]);

/**
 * Assertions
 */
DeetTest.equal(true, true);
DeetTest.equal(1, 2);
