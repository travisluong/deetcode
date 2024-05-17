"use client";
import _ from "lodash";
import * as d3 from "d3";

import {
  ICompare,
  MaxPriorityQueue as MaxPriorityQueueB,
  MinPriorityQueue as MinPriorityQueueB,
  PriorityQueue as PriorityQueueB,
} from "@datastructures-js/priority-queue";

declare global {
  interface Window {
    dcInstance: DeetCode;
    DeetCode: typeof DeetCode;
    DeetSet: typeof DeetSet;
    DeetMap: typeof DeetMap;
    DeetArray: typeof DeetArray;
    DeetMinPriorityQueue: typeof DeetMinPriorityQueue;
    DeetMaxPriorityQueue: typeof DeetMaxPriorityQueue;
    DeetPriorityQueue: typeof DeetPriorityQueue;
    MinPriorityQueue: typeof MinPriorityQueueB;
    MaxPriorityQueue: typeof MaxPriorityQueueB;
    PriorityQueue: typeof PriorityQueueB;
    DeetTest: typeof DeetTest;
    DeetVis: typeof DeetVis;
    DeetListNode: typeof DeetListNode;
    ListNode: typeof DeetListNode;
  }
}

interface VisualizeIndexObj {
  [key: string]: number;
}

interface DeetListNodeRenderObj {
  val: number;
  pointers: string[];
  pos: number;
}

interface DeetConfig {
  selector: string;
  renderMode?: RenderMode;
  setEngine?: DeetSetEngine;
  mapEngine?: DeetMapEngine;
  arrayEngine?: DeetArrayEngine;
  minPriorityQueueEngine?: DeetMinPriorityQueueEngine;
  maxPriorityQueueEngine?: DeetMaxPriorityQueueEngine;
  priorityQueueEngine?: DeetPriorityQueueEngine;
  listNodeEngine?: DeetListNodeEngine;
  directionMode?: DirectionMode;
  labelMode?: boolean;
  animationDelay?: number;
}

/**
 * the DeetVisEngine is for any types that are rendered
 * by the DeetVis class. it follows a similar structure
 * as the original DeetEngine abstract class. the main reason
 * we need to use a separate interface is because of the
 * difference in the way that the container html is stored.
 * DeetVis Engines store the HTML containers in a container
 * registry, while the DeetEngine abstract class stores
 * it on the instance itself.
 */
interface DeetVisEngine {
  renderContainer(): HTMLElement;
  renderLabel(): HTMLElement;
  renderFork(instance: any, name: string): void;
  renderDelayed(instance: any, name: string): void;
  renderNow(instance: any, name: string): void;
  transformDeetToNative(instance: any): any;
  render(instance: any, name: string): HTMLElement;
}

type NativeDataStructure =
  | Set<any>
  | Map<any, any>
  | Array<any>
  | MinPriorityQueueB<any>
  | MaxPriorityQueueB<any>
  | PriorityQueueB<any>;

type DeetDataStructure =
  | DeetSet
  | DeetMap<any, any>
  | DeetArray
  | DeetMinPriorityQueue
  | DeetMaxPriorityQueue
  | DeetPriorityQueue;

export type RenderMode = "animate" | "debug";

export type DirectionMode = "row" | "column";

/**
 * DeetEngine abstract class contains common methods
 * for rendering the native data structures.
 */
abstract class DeetEngine {
  abstract transformDeetToNative(
    instance: DeetDataStructure
  ): NativeDataStructure;
  abstract render(instance: NativeDataStructure): HTMLElement;
  renderFork(instance: DeetDataStructure): void {
    // fix the duplicate rendering of array
    // the proxy is hit first and then the real object
    // thats why there is a duplicate render
    // @ts-ignore
    if (instance.__isProxy) {
      return;
    }
    switch (DeetCode.instance.renderMode) {
      case "animate":
        this.renderDelayed(instance);
        break;
      case "debug":
        this.renderNow(instance);
        break;
      default:
        break;
    }
  }
  renderDelayed(instance: DeetDataStructure): void {
    const nativeCopy = this.transformDeetToNative(instance);
    const fn = () => {
      const el = this.render(nativeCopy);
      instance.container.innerHTML = el.outerHTML;
    };
    DeetCode.enqueue(fn);
  }
  renderNow(instance: DeetDataStructure) {
    DeetCode.undoMonkeyPatchAll();
    const nativeCopy = this.transformDeetToNative(instance);
    const el = this.render(nativeCopy);
    instance.container.innerHTML = el.outerHTML;
    DeetCode.monkeyPatchAll();
  }
  renderContainer(instance: DeetDataStructure): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("deet-container");
    div.appendChild(this.renderLabel(instance));

    const fn = () => {
      DeetCode.instance.el?.appendChild(div);
    };

    switch (DeetCode.instance.renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      default:
        break;
    }

    return div;
  }
  renderLabel(instance: DeetDataStructure): HTMLElement {
    const label = document.createElement("label");
    if (instance instanceof DeetMap) {
      label.innerHTML = "Map";
      return label;
    }
    if (instance instanceof DeetSet) {
      label.innerHTML = "Set";
      return label;
    }
    if (instance instanceof DeetArray) {
      label.innerHTML = "Array";
      return label;
    }
    if (instance instanceof DeetMinPriorityQueue) {
      label.innerHTML = "MinPriorityQueue";
      return label;
    }
    if (instance instanceof DeetMaxPriorityQueue) {
      label.innerHTML = "MaxPriorityQueue";
      return label;
    }
    if (instance instanceof DeetPriorityQueue) {
      label.innerHTML = "PriorityQueue";
      return label;
    }
    return label;
  }
}

class DeetSetEngine extends DeetEngine {
  transformDeetToNative(instance: DeetSet): Set<any> {
    let copy;
    if (DeetSet.originalSet) {
      copy = new DeetSet.originalSet([...instance.values()]);
    } else {
      copy = new Set([...instance.values()]);
    }
    return copy;
  }
  render(nativeInstance: Set<any>): HTMLElement {
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    for (const item of nativeInstance) {
      const li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    }
    const label = document.createElement("label");
    label.innerHTML = "Set";
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
}

export class DeetSet extends Set {
  container: HTMLElement;
  engine: DeetSetEngine;
  static originalSet?: SetConstructor;

  constructor(iterable: any) {
    super();
    this.engine = DeetCode.instance.setEngine;
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
  transformDeetToNative(instance: DeetMap<any, any>): Map<any, any> {
    let copy;
    if (DeetMap.originalMap) {
      copy = new DeetMap.originalMap([...instance.entries()]);
    } else {
      copy = new Map([...instance.entries()]);
    }
    return copy;
  }
  render(nativeInstance: Map<any, any>): HTMLElement {
    const div = document.createElement("div");
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

    const label = document.createElement("label");
    label.innerHTML = "Map";

    div.append(label);
    div.append(table);
    return div;
  }
}

export class DeetMap<K, V> extends Map<K, V> {
  container: HTMLElement;
  engine: DeetMapEngine;
  renderEnabled: boolean;
  static originalMap?: MapConstructor;

  /**
   * passing iterable into super doesn't work
   * since we need the container to be rendered
   * before setting and rendering the key and values
   * @param iterable
   */
  constructor(iterable?: readonly (readonly [K, V])[] | null) {
    super();
    this.renderEnabled = false;
    this.engine = DeetCode.instance.mapEngine;
    this.container = this.engine.renderContainer(this);
    if (iterable) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
    this.renderEnabled = true;
    this.engine.renderFork(this);
  }

  has(value: any): boolean {
    return super.has(value);
  }

  set(key: any, value: any): any {
    const res = super.set(key, value);
    if (this.renderEnabled) {
      this.engine.renderFork(this);
    }
    return res;
  }

  delete(key: any): any {
    const res = super.delete(key);
    if (this.renderEnabled) {
      this.engine.renderFork(this);
    }
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
  transformDeetToNative(instance: DeetArray): Array<any> {
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
    return copy;
  }

  getOriginalArrayConstructor() {
    if (DeetArray.originalArray) {
      return DeetArray.originalArray;
    } else {
      return Array;
    }
  }

  render(nativeArr: Array<any>): HTMLElement {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.innerHTML = "Array";
    div.innerHTML = label.outerHTML;
    if (nativeArr.length === 0) {
      return div;
    }
    if (this.is2DArray(nativeArr)) {
      const el = this.render2d(nativeArr);
      div.innerHTML += el.outerHTML;
    } else {
      const el = this.render1d(nativeArr);
      div.innerHTML += el.outerHTML;
    }
    return div;
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
      if (value) {
        td.innerHTML = value;
      } else {
        const div = document.createElement("div");
        div.style.height = "25px";
        td.appendChild(div);
      }
      trHead.append(th);
      trBody.append(td);
    }
    return table;
  }

  renderIndexFork(instance: DeetArray, obj: VisualizeIndexObj) {
    const fn = () => this.renderIndex(instance, obj);
    switch (DeetCode.instance.renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      default:
        break;
    }
  }

  renderIndex(instance: DeetArray, obj: VisualizeIndexObj) {
    const table = instance.container.querySelector("table");
    let tfoot = table?.querySelector("tfoot");
    if (!tfoot) {
      tfoot = document.createElement("tfoot");
      table?.appendChild(tfoot);
    }
    tfoot.innerHTML = "";
    const arr = this.transformDeetToNative(instance);
    for (const [key, value] of Object.entries(obj)) {
      const tr = document.createElement("tr");
      for (let i = 0; i < arr.length; i++) {
        const th = document.createElement("th");
        if (i === value) {
          th.innerHTML = key;
        } else {
          th.innerHTML = '<div style="height: 25px"></div>';
        }
        tr.appendChild(th);
      }
      tfoot.appendChild(tr);
    }
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
}

export class DeetArray extends Array {
  container: HTMLElement;
  engine: DeetArrayEngine;
  renderEnabled: boolean = false;
  static originalArray?: ArrayConstructor;

  constructor(...args: any) {
    super(...args);
    this.engine = DeetCode.instance.arrayEngine;
    this.container = this.engine.renderContainer(this);
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return new Proxy(this, {
      get(target, key: any) {
        if (key === "__isProxy") {
          return true;
        } else if (target[key] instanceof HTMLElement) {
          return target[key];
        } else if (target[key] instanceof DeetArrayEngine) {
          return target[key];
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

  visIndex(obj: VisualizeIndexObj) {
    throw new Error("this method is deprecated in favor of Deet.visIndex");
    this.engine.renderIndexFork(this, obj);
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
  transformDeetToNative(instance: DeetMinPriorityQueue): Array<any> {
    return instance.toArray();
  }
  // override renderNow since we need an array copy
  renderNow(instance: DeetMinPriorityQueue): void {
    const arr = this.transformDeetToNative(instance);
    const el = this.render(arr);
    instance.container.innerHTML = el.outerHTML;
  }
  render(arr: Array<any>): HTMLElement {
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      li.innerHTML = item.toString();
      ul.appendChild(li);
    }
    const label = document.createElement("label");
    label.innerHTML = "MinPriorityQueue";
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
}

export class DeetMinPriorityQueue extends MinPriorityQueueB<any> {
  container: HTMLElement;
  engine: DeetMinPriorityQueueEngine;
  static originalMinPriorityQueue?: typeof MinPriorityQueueB;

  constructor(...args: any) {
    super(...args);
    this.engine = DeetCode.instance.minPriorityQueueEngine;
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

class DeetMaxPriorityQueueEngine extends DeetEngine {
  transformDeetToNative(instance: DeetMaxPriorityQueue): Array<any> {
    return instance.toArray();
  }
  // override renderNow since we need an array copy
  renderNow(instance: DeetMaxPriorityQueue): void {
    const arr = this.transformDeetToNative(instance);
    const el = this.render(arr);
    instance.container.innerHTML = el.outerHTML;
  }
  render(arr: Array<any>): HTMLElement {
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      li.innerHTML = item.toString();
      ul.appendChild(li);
    }
    const label = document.createElement("label");
    label.innerHTML = "MaxPriorityQueue";
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
}

export class DeetMaxPriorityQueue extends MaxPriorityQueueB<any> {
  engine: DeetMaxPriorityQueueEngine;
  container: HTMLElement;
  static originalMaxPriorityQueue?: typeof MaxPriorityQueueB;

  constructor(...args: any) {
    super(...args);
    this.engine = DeetCode.instance.maxPriorityQueueEngine;
    this.container = this.engine.renderContainer(this);
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
    if (this.originalMaxPriorityQueue === undefined) {
      this.originalMaxPriorityQueue = MaxPriorityQueueB;
    }

    window.MaxPriorityQueue = DeetMaxPriorityQueue;
  }

  static undoMonkeyPatch() {
    window.MaxPriorityQueue = this.originalMaxPriorityQueue!;
  }
}

class DeetPriorityQueueEngine extends DeetEngine {
  transformDeetToNative(instance: DeetPriorityQueue): Array<any> {
    return instance.toArray();
  }
  // override renderNow since we need an array copy
  renderNow(instance: DeetPriorityQueue): void {
    const arr = this.transformDeetToNative(instance);
    const el = this.render(arr);
    instance.container.innerHTML = el.outerHTML;
  }
  render(arr: Array<any>): HTMLElement {
    const div = document.createElement("div");
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
    const label = document.createElement("label");
    label.innerHTML = "PriorityQueue";
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
}

export class DeetPriorityQueue extends PriorityQueueB<any> {
  engine: DeetPriorityQueueEngine;
  container: HTMLElement;
  static originalPriorityQueue?: typeof PriorityQueueB;

  constructor(compare: ICompare<any>, values?: any[] | undefined) {
    super(compare, values);
    this.engine = DeetCode.instance.priorityQueueEngine;
    this.container = this.engine.renderContainer(this);
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

export class DeetCode {
  el: Element;
  renderQueue: Array<() => void>;
  selector: string;
  renderMode: RenderMode;
  setEngine: DeetSetEngine;
  mapEngine: DeetMapEngine;
  arrayEngine: DeetArrayEngine;
  minPriorityQueueEngine: DeetMinPriorityQueueEngine;
  maxPriorityQueueEngine: DeetMaxPriorityQueueEngine;
  priorityQueueEngine: DeetPriorityQueueEngine;
  listNodeEngine: DeetListNodeEngine;
  directionMode: DirectionMode;
  labelMode: boolean;
  animationDelay: number;
  interval?: any;

  static instance: DeetCode;

  constructor(config: DeetConfig) {
    this.selector = config.selector;
    this.renderMode = config.renderMode || "debug";
    this.setEngine = config.setEngine || new DeetSetEngine();
    this.mapEngine = config.mapEngine || new DeetMapEngine();
    this.arrayEngine = config.arrayEngine || new DeetArrayEngine();
    this.minPriorityQueueEngine =
      config.minPriorityQueueEngine || new DeetMinPriorityQueueEngine();
    this.maxPriorityQueueEngine =
      config.maxPriorityQueueEngine || new DeetMaxPriorityQueueEngine();
    this.priorityQueueEngine =
      config.priorityQueueEngine || new DeetPriorityQueueEngine();
    this.listNodeEngine = config.listNodeEngine || new DeetListNodeEngine();
    this.directionMode = config.directionMode || "row";
    this.labelMode = config.labelMode || false;
    this.animationDelay = config.animationDelay || 1000;

    const el = document.querySelector(config.selector);

    if (!el) {
      throw new Error("deetcode container element not found");
    }

    this.el = el;
    this.el.classList.add("deetcode");
    this.renderQueue = new Array();
    this.changeDirectionMode(this.directionMode);
    this.changeLabelMode(this.labelMode);
    this.changeAnimationDelay(this.animationDelay);
  }

  startRenderLoop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    // make the lowest 10 milliseconds
    const delay = this.animationDelay < 10 ? 10 : this.animationDelay;
    this.interval = setInterval(() => {
      const fn = this.renderQueue.shift();
      if (!fn) return;
      console.log(fn);
      fn();
    }, delay);
  }

  changeRenderMode(mode: RenderMode) {
    this.renderMode = mode;
  }

  changeDirectionMode(mode: DirectionMode) {
    if (mode === "column") {
      this.el.classList.add("flex-col");
    } else if (mode === "row") {
      this.el.classList.remove("flex-col");
    }
    this.directionMode = mode;
  }

  changeLabelMode(mode: boolean) {
    if (mode) {
      this.el.classList.remove("deetcode-hide-labels");
    } else {
      this.el.classList.add("deetcode-hide-labels");
    }
  }

  changeAnimationDelay(delay: number) {
    this.animationDelay = delay;
    this.startRenderLoop();
  }

  erase() {
    this.el.innerHTML = "";
    this.listNodeEngine.emptyContainerRegistry();
  }

  static enqueue(fn: () => void) {
    DeetCode.instance.renderQueue.push(fn);
  }

  static monkeyPatchAll() {
    DeetSet.monkeyPatch();
    DeetMap.monkeyPatch();
    DeetArray.monkeyPatch();
    DeetMinPriorityQueue.monkeyPatch();
    DeetMaxPriorityQueue.monkeyPatch();
    DeetPriorityQueue.monkeyPatch();
  }

  static undoMonkeyPatchAll() {
    DeetSet.undoMonkeyPatch();
    DeetMap.undoMonkeyPatch();
    DeetArray.undoMonkeyPatch();
    DeetMinPriorityQueue.undoMonkeyPatch();
    DeetMaxPriorityQueue.undoMonkeyPatch();
    DeetPriorityQueue.undoMonkeyPatch();
  }

  static setInstance(deetcode: DeetCode) {
    DeetCode.instance = deetcode;
  }
}

export class DeetTest {
  static equal(actual: any, expected: any) {
    const fn = () => {
      const div = document.createElement("div");
      div.classList.add("deet-assert");
      if (_.isEqual(actual, expected)) {
        div.classList.add("deet-assert-pass");
        div.innerHTML = `Assertion passed<br>Actual: ${JSON.stringify(
          actual
        )}<br>Expected: ${JSON.stringify(expected)}`;
        DeetCode.instance.el.appendChild(div);
      } else {
        div.classList.add("deet-assert-fail");
        div.innerHTML = `Assertion failed<br>Actual: ${JSON.stringify(
          actual
        )}<br>Expected: ${JSON.stringify(expected)}`;
        DeetCode.instance.el.appendChild(div);
      }
    };
    switch (DeetCode.instance.renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      default:
        break;
    }
  }
}

/**
 * the DeetVis class is a utility that can be used from
 * the code editor. it is responsible for visualizing
 * types which are not extending the native types.
 * for example, ListNode and Bitwise.
 */
export class DeetVis {
  static index(instance: DeetArray, obj: VisualizeIndexObj) {
    instance.engine.renderIndexFork(instance, obj);
  }

  /**
   * a static linked list visualization utility function.
   *
   * @param name the label to be rendered
   * @param node the root ListNode object to start rendering at
   * @param pointers an object with the name of pointers as keys and DeetListNode instance as key. used to render to the pointer labels under each node.
   */
  static linkedList(
    name: string,
    node: DeetListNode,
    pointers?: { [key: string]: DeetListNode | null }
  ) {
    // clear all the pointers properties
    let cur: DeetListNode | null = node;
    DeetSet.undoMonkeyPatch();
    const set = new Set();
    DeetSet.monkeyPatch();
    while (cur && !set.has(cur)) {
      for (const val of cur.pointers) {
        cur.pointers.delete(val);
      }
      set.add(cur);
      cur = cur.next;
    }
    if (pointers) {
      // push pointer keys onto pointer arrays
      for (const [k, v] of Object.entries(pointers)) {
        if (v) {
          v.pointers.add(k);
        }
      }
    }
    if (!DeetCode.instance.listNodeEngine.containerRegistry.get(name)) {
      const div = DeetCode.instance.listNodeEngine.renderContainer();
      DeetCode.instance.listNodeEngine.containerRegistry.set(name, div);
    }
    DeetCode.instance.listNodeEngine.renderFork(node, name);
  }
}

class DeetListNodeEngine implements DeetVisEngine {
  containerRegistry: Map<string, HTMLElement> = new Map();
  emptyContainerRegistry() {
    for (const key of this.containerRegistry.keys()) {
      this.containerRegistry.delete(key);
    }
  }
  renderContainer(): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("deet-container");
    div.appendChild(this.renderLabel());

    const fn = () => {
      DeetCode.instance.el?.appendChild(div);
    };

    switch (DeetCode.instance.renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      default:
        break;
    }

    return div;
  }
  renderLabel() {
    const label = document.createElement("label");
    label.innerHTML = "ListNode";
    return label;
  }
  renderFork(instance: DeetListNode, name: string): void {
    switch (DeetCode.instance.renderMode) {
      case "animate":
        this.renderDelayed(instance, name);
        break;
      case "debug":
        this.renderNow(instance, name);
        break;
      default:
        break;
    }
  }
  renderDelayed(instance: DeetListNode, name: string): void {
    const nativeCopy = this.transformDeetToNative(instance);
    const fn = () => {
      const el = this.render(nativeCopy, name);
      const container = this.containerRegistry.get(name);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };
    DeetCode.enqueue(fn);
  }
  renderNow(instance: DeetListNode, name: string) {
    DeetCode.undoMonkeyPatchAll();
    const nativeCopy = this.transformDeetToNative(instance);
    const el = this.render(nativeCopy, name);
    const container = this.containerRegistry.get(name);
    if (container) {
      container.innerHTML = el.outerHTML;
    }
    DeetCode.monkeyPatchAll();
  }
  /**
   * need to create a copy of each node
   * so that each animation frame doesn't pick up
   * the current state of object
   * @param instance
   * @returns
   */
  transformDeetToNative(instance: DeetListNode): Array<DeetListNodeRenderObj> {
    const res = [];
    let cur: DeetListNode | null = instance;
    // track the position of each node
    DeetMap.undoMonkeyPatch();
    const map = new Map<DeetListNode, number>();
    DeetMap.monkeyPatch();
    let index = 0;
    while (cur && !map.has(cur)) {
      const deetListNodeRenderObj: DeetListNodeRenderObj = {
        val: cur.val,
        pointers: [...cur.pointers],
        pos: index,
      };
      res.push(deetListNodeRenderObj);
      map.set(cur, index);
      cur = cur.next;
      // check for cycle here
      if (cur && map.has(cur)) {
        deetListNodeRenderObj.pos = map.get(cur) || index;
      }
      index++;
    }

    return res;
  }
  render(arr: Array<DeetListNodeRenderObj>, name: string): HTMLElement {
    const container = document.createElement("div");

    // Declare the chart dimensions and margins.
    const width = 800;
    const height = 100;

    // D3 visualization
    const svg = d3.create("svg").attr("width", width).attr("height", height);
    const nodeGroup = svg
      .selectAll("g")
      .data(arr)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${i * 100 + 50}, 50)`);

    nodeGroup
      .append("circle")
      .attr("class", "node")
      .attr("r", 25)
      .style("fill", "lightgray");

    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text((d) => d.val);

    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.75em")
      .style("fill", "lightgray")
      .text((d) => d.pointers.join(","));

    svg
      .append("text")
      .attr("class", "linked-list-label")
      .attr("transform", "translate(15, 15)")
      .style("fill", "lightgray")
      .text("Linked List " + name);

    // Draw arrows
    for (let i = 0; i < arr.length - 1; i++) {
      svg
        .append("path")
        .attr("class", "arrow")
        .attr("d", `M ${i * 100 + 75},50 L ${i * 100 + 125},50`)
        .attr("marker-end", "url(#arrowhead)");
    }

    // handle cycle arrow
    const cycleNode = arr[arr.length - 1];

    if (cycleNode && cycleNode.pos !== arr.length - 1) {
      const startX = (arr.length - 1) * 100 + 50;
      const startY = 100;
      const endX = cycleNode.pos * 100 + 50;
      const endY = 100;

      svg
        .append("path")
        .attr("class", "arrow")
        .attr(
          "d",
          `M ${startX},${startY - 25} Q ${(startX + endX) / 2},${
            startY + 10
          } ${endX},${endY - 25}`
        )
        .attr("marker-end", "url(#arrowhead)");
    }

    // Define arrowhead marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("class", "arrowhead");

    const node = svg.node();
    if (node) {
      container.append(node);
    }
    return container;
  }
}

export class DeetListNode {
  val = 0;
  next: DeetListNode | null = null;
  pointers: Set<string>;

  constructor(val: number = 0, next: DeetListNode | null = null) {
    this.val = val;
    this.next = next;
    DeetSet.undoMonkeyPatch();
    this.pointers = new Set();
    DeetSet.monkeyPatch();
  }
}

class DeetBitwiseEngine implements DeetVisEngine {
  renderContainer(): HTMLElement {
    throw new Error("Method not implemented.");
  }
  renderLabel(): HTMLElement {
    throw new Error("Method not implemented.");
  }
  renderFork(instance: any, name: string): void {
    throw new Error("Method not implemented.");
  }
  renderDelayed(instance: any, name: string): void {
    throw new Error("Method not implemented.");
  }
  renderNow(instance: any, name: string): void {
    throw new Error("Method not implemented.");
  }
  transformDeetToNative(instance: any) {
    throw new Error("Method not implemented.");
  }
  render(instance: any, name: string): HTMLElement {
    throw new Error("Method not implemented.");
  }
}
