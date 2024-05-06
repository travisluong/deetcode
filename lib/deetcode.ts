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
  DeetSetEngine: typeof DeetSetEngine;
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

type NativeDataStructure =
  | Set<any>
  | Map<any, any>
  | Array<any>
  | MinPriorityQueueB<any>;
type DeetDataStructure =
  | DeetSet
  | DeetMap<any, any>
  | DeetArray
  | DeetMinPriorityQueue;

abstract class DeetEngine {
  // TODO: RENAME THIS TO renderAnimateFork
  abstract renderForkAnimate(instance: DeetDataStructure): void;
  abstract render(instance: NativeDataStructure, container: HTMLElement): void;
  renderFork(instance: DeetDataStructure) {
    switch (window.dcInstance.config.renderMode) {
      case "animate":
        this.renderForkAnimate(instance);
        break;
      case "debug":
        this.renderForkDebug(instance);
        break;
      default:
        break;
    }
  }
  // TODO: RENAME THIS TO renderDebugFork
  renderForkDebug(instance: DeetDataStructure) {
    this.render(instance, instance.container);
  }
  renderContainer(instance: DeetDataStructure): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("deet-container");
    instance.container = div;
    window.dcInstance.el?.appendChild(div);
    return div;
  }
}

class DeetSetEngine extends DeetEngine {
  renderForkAnimate(instance: DeetSet) {
    let copy;
    if (DeetSet.originalSet) {
      copy = new DeetSet.originalSet([...instance.values()]);
    } else {
      copy = new Set([...instance.values()]);
    }
    const fn = () => this.render(copy, instance.container);
    DeetCode.enqueue(fn);
  }

  render(nativeInstance: Set<any>, container: HTMLElement) {
    container.innerHTML = "";
    const ul = document.createElement("ul");
    for (const item of nativeInstance) {
      const li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }
}

class DeetSet extends Set {
  container: HTMLElement;
  engine: DeetSetEngine;
  static originalSet?: SetConstructor;

  constructor(iterable: any) {
    super();
    this.engine = window.dcInstance.config.setEngine;
    this.container = this.engine.renderContainer(this);
    if (iterable) {
      for (const item of iterable) {
        this.add(item);
      }
    }
  }

  has(value: any): boolean {
    return super.has(value);
  }

  add(value: any): any {
    const res = super.add(value);
    this.engine.renderFork(this);
    return res;
  }

  delete(value: any): any {
    const res = super.delete(value);
    this.engine.renderFork(this);
    return res;
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

class DeetMapEngine extends DeetEngine {
  renderForkAnimate(instance: DeetMap<any, any>): void {
    let copy;
    if (DeetMap.originalMap) {
      copy = new DeetMap.originalMap([...instance.entries()]);
    } else {
      copy = new Map([...instance.entries()]);
    }
    const fn = () => this.render(copy, instance.container);
    DeetCode.enqueue(fn);
  }
  render(nativeInstance: Map<any, any>, container: HTMLElement): void {
    container.innerHTML = "";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const thKey = document.createElement("th");
    const thVal = document.createElement("th");
    const tbody = document.createElement("tbody");

    table.append(thead);
    thead.append(tr);
    tr.append(thKey, thVal);
    table.append(tbody);

    thKey.innerHTML = "key";
    thVal.innerHTML = "value";

    for (const [key, value] of nativeInstance.entries()) {
      const tr = document.createElement("tr");
      const tdKey = document.createElement("td");
      const tdVal = document.createElement("td");
      tdKey.innerHTML = String(key);
      tdVal.innerHTML = String(value);
      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      tbody.appendChild(tr);
    }

    container.append(table);
  }
}

class DeetMap<K, V> extends Map<K, V> {
  container: HTMLElement;
  engine: DeetMapEngine;
  static originalMap?: MapConstructor;

  /**
   * passing iterable into super doesn't work
   * since we need the container to be rendered
   * before setting and rendering the key and values
   * @param iterable
   */
  constructor(iterable?: readonly (readonly [K, V])[] | null) {
    super();
    this.engine = window.dcInstance.config.mapEngine;
    this.container = this.engine.renderContainer(this);
    if (iterable) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
  }

  has(value: any): boolean {
    return super.has(value);
  }

  set(key: any, value: any): any {
    const res = super.set(key, value);
    this.engine.renderFork(this);
    return res;
  }

  delete(key: any): any {
    const res = super.delete(key);
    this.engine.renderFork(this);
    return res;
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

class DeetArrayEngine extends DeetEngine {
  lastArrayRendered?: Array<any>;

  renderFork(instance: DeetArray) {
    switch (window.dcInstance.config.renderMode) {
      case "animate":
        this.renderForkAnimate(instance);
        break;
      case "debug":
        this.renderForkDebug(instance);
        break;
      default:
        break;
    }
  }
  getOriginalArrayConstructor() {
    if (DeetArray.originalArray) {
      return DeetArray.originalArray;
    } else {
      return Array;
    }
  }
  renderForkAnimate(instance: DeetArray): void {
    let copy;
    const arrayConstructor = this.getOriginalArrayConstructor();
    copy = new arrayConstructor();
    for (const item of instance) {
      if (Array.isArray(item)) {
        // handle 2d arrays
        const newArr = new arrayConstructor();
        for (const it of item) {
          newArr.push(it);
        }
        copy.push(newArr);
      } else {
        // handle 1d arrays
        copy.push(item);
      }
    }
    // no need to re-render the exact same values
    if (this.lastArrayRendered) {
      const isSame = this.shallowCompareArrays(copy, this.lastArrayRendered);
      if (isSame) {
        return;
      }
    }
    this.lastArrayRendered = copy;
    const fn = () => this.render(copy, instance.container);
    DeetCode.enqueue(fn);
  }
  render(nativeArr: Array<any>, container: HTMLElement): void {
    console.log(nativeArr, container);
    container.innerHTML = "";

    if (nativeArr.length === 0) {
      return;
    }
    if (this.is2DArray(nativeArr)) {
      const el = this.render2d(nativeArr);
      container.innerHTML = el.outerHTML;
    } else {
      const el = this.render1d(nativeArr);
      container.innerHTML = el.outerHTML;
    }
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

  render1d(arr: Array<any>) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const tbody = document.createElement("tbody");
    const trBody = document.createElement("tr");
    table.append(thead, tbody);
    thead.append(trHead);
    tbody.append(trBody);
    for (const [index, value] of arr.entries()) {
      const th = document.createElement("th");
      const td = document.createElement("td");
      th.innerHTML = index.toString();
      td.innerHTML = value;
      trHead.append(th);
      trBody.append(td);
    }
    return table;
  }

  render2d(arr: Array<Array<any>>) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const theadTr = document.createElement("tr");
    const th = document.createElement("th");
    theadTr.appendChild(th);
    table.append(thead, tbody);

    for (let i = 0; i < this.getLengthOfLongestArray(arr); i++) {
      const th = document.createElement("th");
      th.innerHTML = i.toString();
      theadTr.appendChild(th);
    }
    thead.appendChild(theadTr);

    for (let i = 0; i < arr.length; i++) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.innerHTML = i.toString();
      tr.appendChild(th);
      for (let j = 0; j < arr[i].length; j++) {
        const td = document.createElement("td");
        td.innerHTML = arr[i][j];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    return table;
  }

  getLengthOfLongestArray(arr: Array<Array<any>>) {
    let max = Number.MIN_VALUE;
    for (const a of arr) {
      max = Math.max(max, a.length);
    }
    return max;
  }

  shallowCompareArrays<T>(arr1: T[], arr2: T[]): boolean {
    // If arrays have different lengths, they're not equal
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Check if every element in arr1 is equal to the corresponding element in arr2
    return arr1.every((value, index) => value === arr2[index]);
  }
}

class DeetArray extends Array {
  container: HTMLElement;
  engine: DeetArrayEngine;
  renderEnabled: boolean = false;
  static originalArray?: ArrayConstructor;

  constructor(...args: any) {
    super(...args);
    this.engine = window.dcInstance.config.arrayEngine;
    this.container = this.engine.renderContainer(this);
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return new Proxy(this, {
      get(target, key: any) {
        if (key === "__isProxy") {
          return true;
        } else if (typeof target[key] === "object") {
          return new Proxy(target[key], this);
        } else {
          return target[key];
        }
      },
      set: (target, prop, value) => {
        console.log(target, prop, value);
        const res = Reflect.set(target, prop, value);
        if (this.renderEnabled) {
          this.engine.renderFork(this);
        }
        return res;
      },
    });
  }

  push(value: any): number {
    console.log("push", value);
    this.renderEnabled = false;
    const res = super.push(value);
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return res;
  }

  unshift(value: any): number {
    console.log("unshift", value);
    this.renderEnabled = false;
    const res = super.unshift(value);
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return res;
  }

  shift(): number {
    console.log("shift");
    this.renderEnabled = false;
    const res = super.shift();
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return res;
  }

  pop() {
    console.log("pop");
    this.renderEnabled = false;
    const res = super.pop();
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return res;
  }

  sort(compareFn?: ((a: any, b: any) => number) | undefined): this {
    this.renderEnabled = false;
    const res = super.sort(compareFn);
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return res;
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

class DeetMinPriorityQueueEngine extends DeetEngine {
  renderForkAnimate(instance: DeetMinPriorityQueue): void {
    const arr = instance.toArray();
    const fn = () => this.render(arr, instance.container);
    DeetCode.enqueue(fn);
  }
  render(arr: Array<any>, container: HTMLElement): void {
    if (container) {
      container.innerHTML = "";
    }
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      li.innerHTML = item.toString();
      ul.appendChild(li);
    }
    container.appendChild(ul);
  }
}

class DeetMinPriorityQueue extends MinPriorityQueueB<any> {
  container: HTMLElement;
  engine: DeetMinPriorityQueueEngine;
  static originalMinPriorityQueue?: typeof MinPriorityQueueB;

  constructor(...args: any) {
    super(...args);
    this.engine = window.dcInstance.config.minPriorityQueueEngine;
    this.container = this.engine.renderContainer(this);
    this.engine.renderFork(this);
  }

  enqueue(value: any) {
    const res = super.enqueue(value);
    this.engine.renderFork(this);
    return res;
  }

  dequeue() {
    const res = super.dequeue();
    this.engine.renderFork(this);
    return res;
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

type RenderMode = "animate" | "debug";

interface DeetConfigInit {
  selector: string;
  renderMode?: RenderMode;
  setEngine?: DeetSetEngine;
  mapEngine?: DeetMapEngine;
  arrayEngine?: DeetArrayEngine;
  minPriorityQueueEngine?: DeetMinPriorityQueueEngine;
}

// TODO: STORE THIS ON DEETCODE PROPERTIES INSTEAD
interface DeetConfig {
  selector: string;
  renderMode: RenderMode;
  setEngine: DeetSetEngine;
  mapEngine: DeetMapEngine;
  arrayEngine: DeetArrayEngine;
  minPriorityQueueEngine: DeetMinPriorityQueueEngine;
}

class DeetCode {
  el: Element;
  renderQueue: Array<Function>;
  config: DeetConfig;

  constructor(config: DeetConfigInit) {
    const renderModeStr = localStorage.getItem("deetcode-render-mode");

    let renderMode: RenderMode = "debug";

    switch (renderModeStr) {
      case "animate":
        renderMode = "animate";
        break;
      case "debug":
        renderMode = "debug";
        break;
      default:
        break;
    }

    this.config = {
      renderMode: renderMode,
      setEngine: new DeetSetEngine(),
      mapEngine: new DeetMapEngine(),
      arrayEngine: new DeetArrayEngine(),
      minPriorityQueueEngine: new DeetMinPriorityQueueEngine(),
      ...config,
    };
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

  changeRenderMode(mode: RenderMode) {
    this.config.renderMode = mode;
  }

  static enqueue(fn: Function) {
    window.dcInstance.renderQueue.push(fn);
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
  DeetSetEngine: DeetSetEngine,
};

export default dc;
