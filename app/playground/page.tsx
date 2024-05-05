import AnimateModeSwitch from "@/components/animate-mode-switch";
import ProblemDetail from "@/components/problem-detail";
import { Problem } from "@/lib/types";

const code = `
// const map = new Map([[1, 1], [2, 2], [3, 3]]);
// map.has(1);
// map.get(1);
// map.delete(3);
// map.set(3, 3);

// const numSet = new Set([1, 2, 3]);
// numSet.has(1);
// numSet.delete(3);
// numSet.add(3);

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
arr2.push([1,2,3]);
arr2.push([4,5,6]);
arr2.push([7,8,9]);
arr2[1][1] = 88;

// const minheap = new MinPriorityQueue();
// minheap.enqueue(1);
// minheap.enqueue(2);
// minheap.enqueue(3);
// minheap.dequeue();
// minheap.front();

// const maxheap = new MaxPriorityQueue();
// maxheap.enqueue(1);
// maxheap.enqueue(2);
// maxheap.enqueue(3);
// maxheap.dequeue();
// maxheap.front();

// const pq = new PriorityQueue((a, b) => b.rank - a.rank);
// pq.enqueue({name: "foo", rank: 1});
// pq.enqueue({name: "bar", rank: 2});
// pq.enqueue({name: "baz", rank: 3});
// pq.dequeue();
// pq.front();
`;

export default function Page() {
  const problem: Problem = {
    id: -1,
    name: null,
    slug: "",
    category: null,
    difficulty: null,
    leetcode_url: null,
    youtube_url: null,
    github_url: null,
    neetcode_url: null,
    notes: null,
    solution: code,
  };

  return (
    <div className="flex flex-col gap-5 px-5">
      <div className="flex justify-between">
        <h1 className="font-brand">Playground</h1>
        <div className="flex justify-end gap-2 mb-2">
          <AnimateModeSwitch />
        </div>
      </div>
      <ProblemDetail problem={problem} />
    </div>
  );
}
