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
 * Deet Set
 */
const set1 = new Set([1, 2, 3]);
set1.delete(3);
set1.add(3);
DeetVis.set({
  name: "set1",
  data: set1,
});

/**
 * Native Set
 */
DeetVis.enableNative();
const set2 = new Set([1, 2, 3]);
set2.has(1);
set2.delete(3);
set2.add(3);
DeetVis.disableNative();

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
DeetVis.map({
  name: "map1",
  data: map1,
});

/**
 * Array
 */
const arr1 = [1, 2, 3];
DeetVis.array({
  name: "arr1",
  data: arr1,
  indexObj: { i: 0, j: 2 },
});

arr1.push(4);
DeetVis.array({
  name: "arr1",
  data: arr1,
  indexObj: { i: 1, j: 1 },
});

const arr2 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
DeetVis.array({
  name: "arr2",
  data: arr2,
});

/**
 * Native Array
 */
DeetVis.enableNative();
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
DeetVis.disableNative();

/**
 * Linked List
 */
const linkedList = new ListNode(1);
linkedList.next = new ListNode(2);
linkedList.next.next = new ListNode(3);
linkedList.next.next.next = new ListNode(4);
const prev = linkedList;
const cur = linkedList.next;
DeetVis.linkedList({
  name: "linked list",
  data: linkedList,
});

/**
 * Linked List Pointers
 */
DeetVis.linkedList({
  name: "with pointers",
  data: linkedList,
  pointers: { prev: prev, cur: cur },
});

/**
 * Linked List Cycle
 */
linkedList.next.next.next.next = linkedList.next;
DeetVis.linkedList({
  name: "with cycle",
  data: linkedList,
});

/**
 * Bitwise
 */
DeetVis.bitwise({
  name: "binary",
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
DeetVis.tree({
  name: "tree",
  data: rootNode,
});

/**
 * LeetCode style array to binary tree syntax is supported
 */
const treeFromArray = DeetVis.arrayToBinaryTree([4, 2, 7, 1, 3, 6, 9]);
DeetVis.tree({
  name: "tree from array",
  data: treeFromArray,
});

/**
 * DeetCode supports auto visualizations of native JavaScript
 * data structures. This allows you to create visualizations without
 * having to call DeetVis. This experimental feature can be enabled
 * with DeetVis.enableNative().
 */
DeetVis.enableNative();

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
 * DeetVis still works even with Auto Native Visualization enabled
 */
DeetVis.set({
  name: "set2",
  data: set2,
});

const minheap = new MinPriorityQueue();
minheap.enqueue(1);
minheap.enqueue(2);
minheap.enqueue(3);
minheap.dequeue();
minheap.front();

const maxheap = new MaxPriorityQueue();
maxheap.enqueue(1);
maxheap.enqueue(2);
maxheap.enqueue(3);
maxheap.dequeue();
maxheap.front();

const pq = new PriorityQueue((a, b) => b.rank - a.rank);
pq.enqueue({ name: "foo", rank: 1 });
pq.enqueue({ name: "bar", rank: 2 });
pq.enqueue({ name: "baz", rank: 3 });
pq.dequeue();
pq.front();

/**
 * Auto native visualization can be disabled DeetVis.disableNative().
 */
DeetVis.disableNative();

// This set will not be rendered in the visualization.
const set3 = new Set([2, 3, 4]);
