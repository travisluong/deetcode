"use client";

import {
  MaxPriorityQueue,
  MinPriorityQueue as MinPriorityQueueB,
} from "@datastructures-js/priority-queue";

interface DeetCode {
  DeetSet: typeof DeetSet;
  DeetMap: typeof DeetMap;
  DeetArray: typeof DeetArray;
  DeetMinPriorityQueue: typeof DeetMinPriorityQueue;
  configure: (config: { selector: string }) => void;
  element?: Element | null;
}

declare global {
  interface Window {
    dc: DeetCode;
    DeetSet: typeof DeetSet;
    DeetMap: typeof DeetMap;
    DeetArray: typeof DeetArray;
    DeetMinPriorityQueue: typeof DeetMinPriorityQueue;
    MinPriorityQueue: typeof MinPriorityQueueB;
    // DeetMaxPriorityQueue: typeof DeetMaxPriorityQueue;
  }
}

export class DeetSet extends Set {
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
    this.renderValue(value);
    return super.add(value);
  }

  delete(value: any): any {
    this.removeValue(value);
    return super.delete(value);
  }

  renderContainer() {
    const div = document.createElement("div");
    div.classList.add("deetset");
    div.dataset.id = this.id;
    this.container = div;
    window.dc.element?.appendChild(div);
  }

  private renderValue(value: any) {
    if (window.dc.element) {
      const div = document.createElement("div");
      div.classList.add("deetset-value");
      div.dataset.id = this.id + value;
      div.innerHTML = value;
      this.container?.appendChild(div);
    }
  }

  private removeValue(value: any) {
    if (window.dc.element) {
      const div = document.querySelector(`[data-id="${this.id}${value}"]`);
      div?.remove();
      return true;
    }
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

export class DeetMap<K, V> extends Map<K, V> {
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
    this.renderKeyValue(key, value);
    return super.set(key, value);
  }

  delete(key: any): any {
    this.deleteKey(key);
    return super.delete(key);
  }

  renderContainer() {
    const table = document.createElement("table");
    table.classList.add("deettable");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    const th2 = document.createElement("th");
    const tbody = document.createElement("tbody");

    th.innerHTML = "key";
    th2.innerHTML = "value";
    tr.appendChild(th);
    tr.appendChild(th2);
    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);

    table.dataset.id = this.id;
    this.container = table;
    this.tbody = tbody;
    window.dc.element?.appendChild(table);
  }

  private renderKeyValue(key: any, value: any) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const td2 = document.createElement("td");

    td.innerHTML = key;
    td2.innerHTML = value;
    tr.appendChild(td);
    tr.appendChild(td2);
    tr.dataset.id = this.id + key;

    this.tbody?.appendChild(tr);
  }

  private deleteKey(key: any) {
    if (window.dc.element) {
      const div = document.querySelector(`[data-id="${this.id}${key}"]`);
      div?.remove();
      return true;
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

export class DeetArray extends Array {
  id: string;
  container?: HTMLTableElement;
  static originalArray?: ArrayConstructor;

  constructor(...args: any) {
    super(...args);
    this.id = crypto.randomUUID();
    this.renderContainer();
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
    const table = document.createElement("table");
    table.classList.add("deettable");
    table.dataset.id = this.id;
    this.container = table;
    window.dc.element?.appendChild(table);
  }

  render() {
    if (this.container) {
      this.container.innerHTML = "";
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
    for (const [index, value] of super.entries()) {
      const th = document.createElement("th");
      th.innerHTML = index.toString();
      indexRow.appendChild(th);
      const td = document.createElement("td");
      td.innerHTML = value;
      valueRow.appendChild(td);
    }
    thead.appendChild(indexRow);
    tbody.appendChild(valueRow);
    this.container?.appendChild(thead);
    this.container?.appendChild(tbody);
  }

  render2d() {
    debugger;
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

    this.container?.appendChild(thead);
    this.container?.appendChild(tbody);
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
    container.classList.add("deetlist");
    container.dataset.id = this.id;
    this.container = container;
    window.dc.element?.appendChild(container);
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
    debugger;
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

const dc: DeetCode = {
  DeetSet: DeetSet,
  DeetMap: DeetMap,
  DeetArray: DeetArray,
  DeetMinPriorityQueue: DeetMinPriorityQueue,
  configure,
};

function configure(config: { selector: string }) {
  dc.element = document.querySelector(config.selector);
  dc.element?.classList.add("deetcode");
}

export default dc;
