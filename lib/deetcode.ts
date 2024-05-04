"use client";

import {
  ICompare,
  MaxPriorityQueue as MaxPriorityQueueB,
  MinPriorityQueue as MinPriorityQueueB,
  PriorityQueue as PriorityQueueB,
} from "@datastructures-js/priority-queue";

interface DC {
  DeetSet: typeof DeetSet;
  DeetMap: typeof DeetMap;
  DeetArray: typeof DeetArray;
  DeetMinPriorityQueue: typeof DeetMinPriorityQueue;
  DeetMaxPriorityQueue: typeof DeetMaxPriorityQueue;
  DeetPriorityQueue: typeof DeetPriorityQueue;
  DeetCode: typeof DeetCode;
}

declare global {
  interface Window {
    dcInstance: DeetCode;
    DeetSet: typeof DeetSet;
    DeetMap: typeof DeetMap;
    DeetArray: typeof DeetArray;
    DeetMinPriorityQueue: typeof DeetMinPriorityQueue;
    DeetMaxPriorityQueue: typeof DeetMaxPriorityQueue;
    DeetPriorityQueue: typeof DeetPriorityQueue;
    MinPriorityQueue: typeof MinPriorityQueueB;
    MaxPriorityQueue: typeof MaxPriorityQueueB;
    PriorityQueue: typeof PriorityQueueB;
  }
}

interface RenderObject {
  container: HTMLDivElement;
  data: any;
}

class DeetSet extends Set {
  id: string;
  container?: HTMLDivElement;
  static originalSet?: SetConstructor;

  constructor(...args: any) {
    super(...args);
    this.id = crypto.randomUUID();
    this.renderContainer();
  }

  has(value: any): boolean {
    return super.has(value);
  }

  add(value: any): any {
    const res = super.add(value);
    if (!DeetSet.originalSet) {
      throw new Error("original set not found");
    }
    const rawData = new DeetSet.originalSet([...this.values()]);
    const fn = () =>
      DeetSet.render({ container: this.container!, data: rawData });
    window.dcInstance.renderQueue.push(fn);
    return res;
  }

  delete(value: any): any {
    const res = super.delete(value);
    return res;
  }

  private renderContainer() {
    const div = document.createElement("div");
    div.classList.add("deet-container");
    div.dataset.id = this.id;
    this.container = div;
    window.dcInstance.el?.appendChild(div);
  }

  private render() {
    console.log("rendering set");

    if (this.container) {
      this.container.innerHTML = "";
    }
    const ul = document.createElement("ul");
    for (const item of this) {
      const li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    }
    this.container?.appendChild(ul);
  }

  static render(obj: RenderObject) {
    if (obj.container) {
      obj.container.innerHTML = "";
    }
    const ul = document.createElement("ul");
    for (const item of obj.data) {
      const li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    }
    obj.container?.appendChild(ul);
  }

  static monkeyPatch() {
    if (this.originalSet === undefined) {
      this.originalSet = Set;
    }

    Set = DeetSet;
  }

  static undoMonkeyPatch() {
    Set = this.originalSet!;
  }
}

class DeetMap<K, V> extends Map<K, V> {
  id: string;
  container?: HTMLDivElement;
  tbody?: HTMLTableSectionElement;
  static originalMap?: MapConstructor;

  constructor(iterable?: readonly (readonly [K, V])[] | null) {
    super(iterable);
    this.id = crypto.randomUUID();
    this.renderContainer();
  }

  has(value: any): boolean {
    return super.has(value);
  }

  set(key: any, value: any): any {
    const res = super.set(key, value);
    this.render();
    return res;
  }

  delete(key: any): any {
    const res = super.delete(key);
    this.render();
    return res;
  }

  renderContainer() {
    const div = document.createElement("div");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    const th2 = document.createElement("th");
    const tbody = document.createElement("tbody");

    div.classList.add("deet-container");
    this.container = div;
    th.innerHTML = "key";
    th2.innerHTML = "value";
    tr.appendChild(th);
    tr.appendChild(th2);
    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    div.appendChild(table);

    table.dataset.id = this.id;
    this.container = div;
    this.tbody = tbody;
    window.dcInstance.el?.appendChild(div);
  }

  render() {
    if (this.tbody) {
      this.tbody.innerHTML = "";
    }
    for (const [key, value] of this.entries()) {
      const tr = document.createElement("tr");
      const tdKey = document.createElement("td");
      const tdVal = document.createElement("td");
      tdKey.innerHTML = String(key);
      tdVal.innerHTML = String(value);
      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      this.tbody?.appendChild(tr);
    }
  }

  static monkeyPatch() {
    if (this.originalMap === undefined) {
      this.originalMap = Map;
    }

    // @ts-ignore
    Map = DeetMap;
  }

  static undoMonkeyPatch() {
    Map = this.originalMap!;
  }
}

class DeetArray extends Array {
  id: string;
  container?: HTMLDivElement;
  table?: HTMLTableElement;
  static originalArray?: ArrayConstructor;

  constructor(...args: any) {
    super(...args);
    this.id = crypto.randomUUID();
    this.renderContainer();
    this.render();
    return new Proxy(this, {
      set: (target, prop, value) => {
        this[Number(prop)] = value;
        this.render();
        return Reflect.set(target, prop, value);
      },
    });
  }

  push(value: any): number {
    const res = super.push(value);
    this.render();
    return res;
  }

  unshift(value: any): number {
    const res = super.unshift(value);
    this.render();
    return res;
  }

  shift(): number {
    const res = super.shift();
    this.render();
    return res;
  }

  pop() {
    const res = super.pop();
    this.render();
    return res;
  }

  sort(compareFn?: ((a: any, b: any) => number) | undefined): this {
    const res = super.sort(compareFn);
    this.render();
    return res;
  }

  renderContainer() {
    const div = document.createElement("div");
    const table = document.createElement("table");
    div.classList.add("deet-container");
    div.appendChild(table);
    div.dataset.id = this.id;
    this.container = div;
    this.table = table;
    window.dcInstance.el?.appendChild(div);
  }

  render() {
    if (this.table) {
      this.table.innerHTML = "";
    }
    if (this.is2DArray(this)) {
      this.render2d();
    } else {
      this.render1d();
    }
  }

  render1d() {
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const indexRow = document.createElement("tr");
    const valueRow = document.createElement("tr");
    for (const [index, value] of this.entries()) {
      const th = document.createElement("th");
      th.innerHTML = index.toString();
      indexRow.appendChild(th);
      const td = document.createElement("td");
      td.innerHTML = value;
      valueRow.appendChild(td);
    }
    thead.appendChild(indexRow);
    tbody.appendChild(valueRow);
    this.table?.appendChild(thead);
    this.table?.appendChild(tbody);
  }

  render2d() {
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const theadTr = document.createElement("tr");
    const th = document.createElement("th");
    theadTr.appendChild(th);

    for (let i = 0; i < this.getLengthOfLongestArray(); i++) {
      const th = document.createElement("th");
      th.innerHTML = i.toString();
      theadTr.appendChild(th);
    }
    thead.appendChild(theadTr);

    for (let i = 0; i < this.length; i++) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.innerHTML = i.toString();
      tr.appendChild(th);
      for (let j = 0; j < this[i].length; j++) {
        const td = document.createElement("td");
        td.innerHTML = this[i][j];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    this.table?.appendChild(thead);
    this.table?.appendChild(tbody);
  }

  getLengthOfLongestArray() {
    let max = Number.MIN_VALUE;
    for (const arr of this) {
      max = Math.max(max, arr.length);
    }
    return max;
  }

  is2DArray(arr: any) {
    // Check if arr is an array
    if (!Array.isArray(arr)) {
      return false;
    }

    // Check if all elements of arr are arrays
    for (let i = 0; i < arr.length; i++) {
      if (!Array.isArray(arr[i])) {
        return false;
      }
    }

    // If all elements are arrays, it's a 2D array
    return true;
  }

  static monkeyPatch() {
    if (this.originalArray === undefined) {
      this.originalArray = Array;
    }

    // @ts-ignore
    Array = DeetArray;
  }

  static undoMonkeyPatch() {
    // @ts-ignore
    Array = this.originalArray;
  }
}

class DeetMinPriorityQueue extends MinPriorityQueueB<any> {
  id: string;
  container?: HTMLDivElement;
  static originalMinPriorityQueue?: typeof MinPriorityQueueB;

  constructor(...args: any) {
    super(...args);
    this.id = crypto.randomUUID();
    this.renderTable();
  }

  renderTable() {
    const container = document.createElement("div");
    container.classList.add("deet-container");
    container.dataset.id = this.id;
    this.container = container;
    window.dcInstance.el?.appendChild(container);
  }

  enqueue(value: any) {
    const res = super.enqueue(value);
    this.render();
    return res;
  }

  dequeue() {
    const res = super.dequeue();
    this.render();
    return res;
  }

  render() {
    if (this.container) {
      this.container.innerHTML = "";
    }
    const arr = super.toArray();
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      li.innerHTML = item.toString();
      ul.appendChild(li);
    }
    this.container?.appendChild(ul);
  }

  static monkeyPatch() {
    if (this.originalMinPriorityQueue === undefined) {
      this.originalMinPriorityQueue = MinPriorityQueueB;
    }

    window.MinPriorityQueue = DeetMinPriorityQueue;
  }

  static undoMonkeyPatch() {
    //@ts-ignore
    window.MinPriorityQueue = this.originalMinPriorityQueue;
  }
}

class DeetMaxPriorityQueue extends MaxPriorityQueueB<any> {
  id: string;
  container?: HTMLDivElement;
  static originalMaxPriorityQueue?: typeof MaxPriorityQueueB;

  constructor(...args: any) {
    super(...args);
    this.id = crypto.randomUUID();
    this.renderTable();
  }

  renderTable() {
    const container = document.createElement("div");
    container.classList.add("deet-container");
    container.dataset.id = this.id;
    this.container = container;
    window.dcInstance.el?.appendChild(container);
  }

  enqueue(value: any) {
    const res = super.enqueue(value);
    this.render();
    return res;
  }

  dequeue() {
    const res = super.dequeue();
    this.render();
    return res;
  }

  render() {
    if (this.container) {
      this.container.innerHTML = "";
    }
    const arr = super.toArray();
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      li.innerHTML = item.toString();
      ul.appendChild(li);
    }
    this.container?.appendChild(ul);
  }

  static monkeyPatch() {
    if (this.originalMaxPriorityQueue === undefined) {
      this.originalMaxPriorityQueue = MaxPriorityQueueB;
    }

    window.MaxPriorityQueue = DeetMaxPriorityQueue;
  }

  static undoMonkeyPatch() {
    window.MaxPriorityQueue = this.originalMaxPriorityQueue!;
  }
}

class DeetPriorityQueue extends PriorityQueueB<any> {
  id: string;
  container?: HTMLDivElement;
  static originalPriorityQueue?: typeof PriorityQueueB;

  constructor(compare: ICompare<any>, values?: any[] | undefined) {
    super(compare, values);
    this.id = crypto.randomUUID();
    this.renderContainer();
  }

  renderContainer() {
    const container = document.createElement("div");
    container.classList.add("deet-container");
    container.dataset.id = this.id;
    this.container = container;
    window.dcInstance.el?.appendChild(container);
  }

  enqueue(value: any) {
    const res = super.enqueue(value);
    this.render();
    return res;
  }

  dequeue() {
    const res = super.dequeue();
    this.render();
    return res;
  }

  render() {
    if (this.container) {
      this.container.innerHTML = "";
    }
    const arr = super.toArray();
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      let html = "";
      for (const [key, value] of Object.entries(item)) {
        html += `${key}: ${value}<br>`;
      }
      li.innerHTML = html;
      ul.appendChild(li);
    }
    this.container?.appendChild(ul);
  }

  static monkeyPatch() {
    if (this.originalPriorityQueue === undefined) {
      this.originalPriorityQueue = PriorityQueueB;
    }

    window.PriorityQueue = DeetPriorityQueue;
  }

  static undoMonkeyPatch() {
    window.PriorityQueue = this.originalPriorityQueue!;
  }
}

interface DeetConfig {
  selector: string;
}

class DeetCode {
  el: Element;
  renderQueue: Array<Function>;

  constructor(config: DeetConfig) {
    const el = document.querySelector(config.selector);

    if (!el) {
      throw new Error("deetcode container element not found");
    }

    this.el = el;
    this.el.classList.add("deetcode");
    this.renderQueue = new Array();
  }

  startRenderLoop() {
    setInterval(() => {
      const fn = this.renderQueue.shift();
      if (!fn) return;
      console.log(fn);
      fn();
    }, 1000);
  }
}

const dc: DC = {
  DeetSet: DeetSet,
  DeetMap: DeetMap,
  DeetArray: DeetArray,
  DeetMinPriorityQueue: DeetMinPriorityQueue,
  DeetMaxPriorityQueue: DeetMaxPriorityQueue,
  DeetPriorityQueue: DeetPriorityQueue,
  DeetCode: DeetCode,
};

export default dc;
