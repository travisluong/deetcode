// @ts-nocheck

const map = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
map.has(1);
map.get(1);
map.delete(3);
map.set(3, 3);

const numSet = new Set([1, 2, 3]);
numSet.has(1);
numSet.delete(3);
numSet.add(3);

const arr = new Array();
arr.push(1);
arr.push(2);
arr.push(3);
arr.pop();
arr.shift();
arr.push(3);
arr.unshift(1);
arr[0] = 8;

const arr2 = new Array();
arr2.push([1, 2, 3]);
arr2.push([4, 5, 6]);
arr2.push([7, 8, 9]);
arr2[1][1] = 88;

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

const linkedlist = new ListNode(1);
linkedlist.next = new ListNode(2);
linkedlist.next.next = new ListNode(3);
linkedlist.next.next.next = new ListNode(4);
linkedlist.next.next.next.next = linkedlist.next;
const prev = linkedlist;
const cur = linkedlist.next;
DeetVis.linkedList("linkedlist", linkedlist, { prev, cur });

DeetVis.bitwise("binary", 123);

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
DeetVis.tree("rootNode", rootNode);

const treeFromArray = DeetVis.arrayToBinaryTree([4, 2, 7, 1, 3, 6, 9]);
DeetVis.tree("treeFromArray", treeFromArray);
