"use client";
import _ from "lodash";
import * as d3 from "d3";
import { nanoid } from "nanoid";

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
    DeetVis: DeetVis;
    DeetListNode: typeof DeetListNode;
    ListNode: typeof DeetListNode;
    TreeNode: typeof DeetTreeNode;
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
  directionMode?: DirectionMode;
  labelMode?: boolean;
  animationDelay?: number;
  nanoidSize: number;
}

interface DeetOptions {
  name: string;
  data: any;
  deetcode: DeetCode;
  copiedData?: any;
}

interface DeetSetOptions extends DeetOptions {
  data: Set<any>;
}

interface DeetMapOptions extends DeetOptions {
  data: Map<any, any>;
}

interface DeetArrayOptions extends DeetOptions {
  data: Array<any>;
  copiedData: Array<any>;
  indexObj?: { [key: string]: number };
}

interface DeetListNodeOptions extends DeetOptions {
  data: DeetListNode;
  copiedData: Array<DeetListNodeRenderObj>;
  pointers?: { [key: string]: DeetListNode | null };
}

interface DeetBitwiseOptions extends DeetOptions {
  data: number;
}

interface DeetTreeOptions extends DeetOptions {
  data: DeetTreeNode;
  copiedData: D3TreeNode | null;
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
  deetcodeInstance: DeetCode;
  containerRegistry: Map<string, HTMLElement>;
  emptyContainerRegistry(): void;
  renderContainer(name: string): HTMLElement;
  renderFork(name: string, instance: any): void;
  renderDelayed(name: string, instance: any): void;
  renderNow(name: string, instance: any): void;
  renderContent(name: string, instance: any): HTMLElement;
  renderFn(name: string, instance: any): () => void;
}

/**
 * DeetVisEngineV2 differs from V1 in that
 * options object is preferred over multiple parameters.
 * options object is much easier to extend.
 * there is much value in having a consistent contract
 * in which all engines much comply, but
 * also the flexibility to adjust to diverging requirements
 * of each engine. furthermore the auto native types should
 * depend on the deet engines, as the deet engines operate
 * on native structures
 */
interface DeetVisEngineV2 {
  containerRegistry: Map<string, HTMLElement>;
  emptyContainerRegistry(): void;
  renderContainer(options: DeetOptions): HTMLElement;
  renderFork(options: DeetOptions): void;
  renderDelayed(options: DeetOptions): void;
  renderNow(options: DeetOptions): void;
  renderContent(options: DeetOptions): HTMLElement;
  renderFn(options: DeetOptions): () => void;
  copyData(options: DeetOptions): any;
}

interface D3TreeNode {
  name: number;
  children: (D3TreeNode | null)[];
  color?: string;
}

interface RenderForkOptions {
  dcInstance: DeetCode;
  delayedCallback(): void;
  nowCallback(): void;
}

interface AutoVisDataType {
  id: string;
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

abstract class NativeEngine {
  deetcodeInstance: DeetCode;
  constructor(deetcodeInstance: DeetCode) {
    this.deetcodeInstance = deetcodeInstance;
  }
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
    switch (this.deetcodeInstance.renderMode) {
      case "animate":
        this.renderDelayed(instance);
        break;
      case "debug":
        this.renderNow(instance);
        break;
      case "snapshot":
        this.renderNow(instance);
        this.deetcodeInstance.takeSnapshot();
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
    this.deetcodeInstance.undoMonkeyPatchAll();
    const nativeCopy = this.transformDeetToNative(instance);
    const el = this.render(nativeCopy);
    instance.container.innerHTML = el.outerHTML;
    this.deetcodeInstance.monkeyPatchAll();
  }
  renderContainer(instance: DeetDataStructure): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("deet-container");
    div.appendChild(this.renderLabel(instance));

    const fn = () => {
      this.deetcodeInstance.el?.appendChild(div);
    };

    switch (this.deetcodeInstance.renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      case "snapshot":
        fn();
        this.deetcodeInstance.takeSnapshot();
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

class NativeSetEngine extends NativeEngine {
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

class NativeMapEngine extends NativeEngine {
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

class NativeArrayEngine extends NativeEngine {
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
    switch (this.deetcodeInstance.renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      case "snapshot":
        fn();
        this.deetcodeInstance.takeSnapshot();
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

class NativeMinPriorityQueueEngine extends NativeEngine {
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

class NativeMaxPriorityQueueEngine extends NativeEngine {
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

class NativePriorityQueueEngine extends NativeEngine {
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

class DeetSetEngine implements DeetVisEngineV2 {
  containerRegistry: Map<string, HTMLElement> = new Map();
  emptyContainerRegistry(): void {
    DeetRender.emptyContainerRegistry(this.containerRegistry);
  }
  renderContainer(options: DeetSetOptions): HTMLElement {
    const { name } = options;
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      name: name,
      label: "Set",
    });
  }
  renderFork(options: DeetSetOptions): void {
    const { deetcode } = options;
    DeetRender.renderFork({
      dcInstance: deetcode,
      delayedCallback: () => {
        this.renderDelayed(options);
      },
      nowCallback: () => {
        this.renderNow(options);
      },
    });
  }
  renderDelayed(options: DeetSetOptions): void {
    const { data, deetcode } = options;
    const fn = this.renderFn(options);
    deetcode.enqueue(fn);
  }
  renderNow(options: DeetSetOptions): void {
    const { data } = options;
    const fn = this.renderFn(options);
    fn();
  }
  transformDeetToNative(instance: any) {
    let copy;
    if (DeetSet.originalSet) {
      copy = new DeetSet.originalSet([...instance.values()]);
    } else {
      copy = new Set([...instance.values()]);
    }
    return copy;
  }
  renderContent(options: DeetSetOptions): HTMLElement {
    const { name } = options;
    const data = this.copyData(options);
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    for (const item of data) {
      const li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    }
    const label = document.createElement("label");
    label.innerHTML = "Set " + name;
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
  renderFn(options: DeetSetOptions): () => void {
    const fn = () => {
      const el = this.renderContent(options);
      const container = this.containerRegistry.get(options.name);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };
    return fn;
  }
  copyData(options: DeetOptions) {
    if (options.copiedData) {
      return options.copiedData;
    }
    if (DeetCode.getInstance().isAutoNativeEnabled) {
      DeetSet.undoMonkeyPatch();
    }
    options.copiedData = new Set([...options.data]);
    if (DeetCode.getInstance().isAutoNativeEnabled) {
      DeetSet.monkeyPatch();
    }
    return options.copiedData;
  }
}

class DeetMapEngine implements DeetVisEngineV2 {
  containerRegistry: Map<string, HTMLElement> = new Map();
  emptyContainerRegistry(): void {
    DeetRender.emptyContainerRegistry(this.containerRegistry);
  }
  renderContainer(options: DeetMapOptions): HTMLElement {
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      name: options.name,
      label: "Map",
    });
  }
  renderFork(options: DeetMapOptions): void {
    DeetRender.renderFork({
      dcInstance: options.deetcode,
      delayedCallback: () => {
        this.renderDelayed(options);
      },
      nowCallback: () => {
        this.renderNow(options);
      },
    });
  }
  renderDelayed(options: DeetMapOptions): void {
    const fn = this.renderFn(options);
    options.deetcode.enqueue(fn);
  }
  renderNow(options: DeetMapOptions): void {
    options.deetcode.undoMonkeyPatchAll();
    const fn = this.renderFn(options);
    fn();
    options.deetcode.monkeyPatchAll();
  }
  transformDeetToNative(instance: any) {
    let copy;
    if (DeetMap.originalMap) {
      copy = new DeetMap.originalMap([...instance.entries()]);
    } else {
      copy = new Map([...instance.entries()]);
    }
    return copy;
  }
  renderContent(options: DeetMapOptions): HTMLElement {
    const data = this.copyData(options);
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

    for (const [key, value] of data.entries()) {
      const tr = document.createElement("tr");
      const tdKey = document.createElement("td");
      const tdVal = document.createElement("td");
      tdKey.innerHTML = String(key);
      tdVal.innerHTML = String(value);
      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      tbody.appendChild(tr);
    }

    const label = DeetRender.renderLabel("Map " + name);

    div.append(label);
    div.append(table);
    return div;
  }
  renderFn(options: DeetMapOptions): () => void {
    const fn = () => {
      const el = this.renderContent(options);
      const container = this.containerRegistry.get(options.name);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };
    return fn;
  }
  copyData(options: DeetOptions) {
    if (options.copiedData) {
      return options.copiedData;
    }
    const { data } = options;
    const copy = new Map([...data.entries()]);
    options.copiedData = copy;
    return options.copiedData;
  }
}

class DeetArrayEngine implements DeetVisEngineV2 {
  containerRegistry: Map<string, HTMLElement> = new Map();
  emptyContainerRegistry(): void {
    DeetRender.emptyContainerRegistry(this.containerRegistry);
  }
  renderContainer(options: DeetArrayOptions): HTMLElement {
    const { name } = options;
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      name: name,
      label: "Array",
    });
  }
  renderFork(options: DeetArrayOptions): void {
    // the copied data must be created here to avoid race condition
    this.copyData(options);
    DeetRender.renderFork({
      dcInstance: options.deetcode,
      delayedCallback: () => {
        this.renderDelayed(options);
      },
      nowCallback: () => {
        this.renderNow(options);
      },
    });
  }
  renderDelayed(options: DeetArrayOptions): void {
    const fn = this.renderFn(options);
    options.deetcode.enqueue(fn);
  }
  renderNow(options: DeetArrayOptions): void {
    const fn = this.renderFn(options);
    fn();
  }
  renderContent(options: DeetArrayOptions): HTMLElement {
    const { name, indexObj } = options;
    const data = this.copyData(options);
    const div = document.createElement("div");
    const label = DeetRender.renderLabel("Array " + name);
    div.innerHTML = label.outerHTML;
    if (data.length === 0) {
      return div;
    }
    if (this.is2DArray(data)) {
      const el = this.render2d(options);
      div.innerHTML += el.outerHTML;
    } else {
      const el = this.render1d(options);
      div.innerHTML += el.outerHTML;
    }
    return div;
  }
  renderFn(options: DeetArrayOptions): () => void {
    const { name } = options;
    const fn = () => {
      const el = this.renderContent(options);
      const container = this.containerRegistry.get(name);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };
    return fn;
  }
  getOriginalArrayConstructor() {
    if (DeetArray.originalArray) {
      return DeetArray.originalArray;
    } else {
      return Array;
    }
  }
  is2DArray(arr: Array<any>) {
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
  render1d(options: DeetArrayOptions) {
    const { indexObj } = options;
    const data = this.copyData(options);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const tbody = document.createElement("tbody");
    const trBody = document.createElement("tr");
    table.append(thead, tbody);
    thead.append(trHead);
    tbody.append(trBody);
    for (const [index, value] of data.entries()) {
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
    if (indexObj) {
      const tfoot = this.renderArrayIndex(options);
      if (tfoot) {
        table.append(tfoot);
      }
    }
    return table;
  }
  render2d(options: DeetArrayOptions) {
    const data = this.copyData(options);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const theadTr = document.createElement("tr");
    const th = document.createElement("th");
    theadTr.appendChild(th);
    table.append(thead, tbody);

    for (let i = 0; i < this.getLengthOfLongestArray(data); i++) {
      const th = document.createElement("th");
      th.innerHTML = i.toString();
      theadTr.appendChild(th);
    }
    thead.appendChild(theadTr);

    for (let i = 0; i < data.length; i++) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.innerHTML = i.toString();
      tr.appendChild(th);
      for (let j = 0; j < data[i].length; j++) {
        const td = document.createElement("td");
        td.innerHTML = data[i][j];
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
  renderArrayIndex(options: DeetArrayOptions): HTMLElement | null {
    const { indexObj } = options;
    if (!indexObj) {
      return null;
    }
    const data = this.copyData(options);
    let tfoot = document.createElement("tfoot");
    for (const [key, value] of Object.entries(indexObj)) {
      const tr = document.createElement("tr");
      for (let i = 0; i < data.length; i++) {
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
    return tfoot;
  }
  copyData(options: DeetArrayOptions): Array<any> {
    if (options.copiedData) {
      return options.copiedData;
    }
    const { data } = options;
    const copy = new Array();
    for (const item of data) {
      if (Array.isArray(item)) {
        // handle 2d arrays
        const newArr = new Array();
        for (const it of item) {
          newArr.push(it);
        }
        copy.push(newArr);
      } else {
        // handle 1d arrays
        copy.push(item);
      }
    }
    options.copiedData = copy;
    return copy;
  }
}

class DeetListNodeEngine implements DeetVisEngineV2 {
  containerRegistry: Map<string, HTMLElement> = new Map();
  emptyContainerRegistry() {
    DeetRender.emptyContainerRegistry(this.containerRegistry);
  }
  renderContainer(options: DeetListNodeOptions): HTMLElement {
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      name: options.name,
      label: "ListNode",
    });
  }
  renderFork(options: DeetListNodeOptions): void {
    switch (options.deetcode.renderMode) {
      case "animate":
        this.renderDelayed(options);
        break;
      case "debug":
        this.renderNow(options);
        break;
      case "snapshot":
        this.renderNow(options);
        options.deetcode.takeSnapshot();
        break;
      default:
        break;
    }
  }
  renderFn(options: DeetListNodeOptions): () => void {
    const fn = () => {
      const el = this.renderContent(options);
      const container = this.containerRegistry.get(options.name);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };
    return fn;
  }
  renderDelayed(options: DeetListNodeOptions): void {
    const fn = this.renderFn(options);
    options.deetcode.enqueue(fn);
  }
  renderNow(options: DeetListNodeOptions) {
    const { deetcode } = options;
    if (deetcode.isAutoNativeEnabled) {
      deetcode.undoMonkeyPatchAll();
    }
    const fn = this.renderFn(options);
    fn();
    if (deetcode.isAutoNativeEnabled) {
      deetcode.monkeyPatchAll();
    }
  }
  renderContent(options: DeetListNodeOptions): HTMLElement {
    const arr = this.copyData(options);
    const container = document.createElement("div");
    container.classList.add("deetcode-listnode");

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
      .attr("transform", (d, i) => `translate(${i * 100 + 50}, 50)`)
      .attr("class", "nodegroup");

    nodeGroup.append("circle").attr("r", 25);

    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .text((d) => d.val);

    nodeGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.75em")
      .text((d) => d.pointers.join(","));

    svg
      .append("text")
      .attr("class", "linked-list-label")
      .attr("transform", "translate(15, 15)")
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
  clearAllPointers(options: DeetListNodeOptions) {
    let cur: DeetListNode | null = options.data;
    // TODO: this needs to be rewritten if monkey patching
    // becomes an optional feature.
    // since it is always on, we can assume the Set
    // constructor has been monkey patched
    DeetSet.undoMonkeyPatch();
    const set = new Set();
    // redo monkey patch if auto vis enabled
    if (options.deetcode.isAutoNativeEnabled) {
      DeetSet.monkeyPatch();
    }
    while (cur && !set.has(cur)) {
      for (const val of cur.pointers) {
        cur.pointers.delete(val);
      }
      set.add(cur);
      cur = cur.next;
    }
  }
  addPointers(options: DeetListNodeOptions) {
    const { pointers } = options;
    if (pointers) {
      // push pointer keys onto pointer arrays
      for (const [k, v] of Object.entries(pointers)) {
        if (v) {
          v.pointers.add(k);
        }
      }
    }
  }
  copyData(options: DeetOptions) {
    const { deetcode } = options;
    const res = [];
    let cur: DeetListNode | null = options.data;
    // track the position of each node
    if (deetcode.isAutoNativeEnabled) {
      DeetMap.undoMonkeyPatch();
    }
    const map = new Map<DeetListNode, number>();
    if (deetcode.isAutoNativeEnabled) {
      DeetMap.monkeyPatch();
    }
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
}

class DeetBitwiseEngine implements DeetVisEngineV2 {
  containerRegistry: Map<string, HTMLElement> = new Map();
  emptyContainerRegistry() {
    for (const key of this.containerRegistry.keys()) {
      this.containerRegistry.delete(key);
    }
  }
  renderContainer(options: DeetBitwiseOptions): HTMLElement {
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      name: options.name,
      label: "Bitwise",
    });
  }
  renderFork(options: DeetBitwiseOptions): void {
    const { deetcode } = options;
    switch (deetcode.renderMode) {
      case "animate":
        this.renderDelayed(options);
        break;
      case "debug":
        this.renderNow(options);
        break;
      case "snapshot":
        this.renderNow(options);
        deetcode.takeSnapshot();
      default:
        break;
    }
  }
  renderFn(options: DeetBitwiseOptions): () => void {
    const fn = () => {
      const el = this.renderContent(options);
      const container = this.containerRegistry.get(options.name);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };

    return fn;
  }
  renderDelayed(options: DeetBitwiseOptions): void {
    const fn = this.renderFn(options);
    options.deetcode.enqueue(fn);
  }
  renderNow(options: DeetBitwiseOptions): void {
    options.deetcode.undoMonkeyPatchAll();
    const fn = this.renderFn(options);
    fn();
    options.deetcode.monkeyPatchAll();
  }
  transformDeetToNative(instance: number) {
    return instance;
  }
  renderContent(options: DeetBitwiseOptions): HTMLElement {
    const { name, data } = options;
    const div = document.createElement("div");
    const label = DeetRender.renderLabel("Bitwise " + name + " " + data);
    div.appendChild(label);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const thr = document.createElement("tr");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    const binary = DeetBitwiseEngine.integerToBinary(data);
    const arr = binary.split("");
    const n = arr.length;
    for (const [index, num] of arr.entries()) {
      const power = 2 ** (n - index - 1);
      const th = document.createElement("th");
      th.innerHTML = power.toString();
      thr.appendChild(th);
      const td = document.createElement("td");
      td.innerHTML = num;
      tr.appendChild(td);
    }
    thead.appendChild(thr);
    table.appendChild(thead);
    tbody.appendChild(tr);
    table.appendChild(tbody);
    div.appendChild(table);
    return div;
  }
  copyData(options: DeetOptions) {
    throw new Error("number type is a primitive and passed by value");
  }
  /**
   * Example usage:
   *   console.log(integerToBinary(10));  // Output: "1010"
   *   console.log(integerToBinary(-10)); // Output: "11111111111111111111111111110110" (32-bit two's complement)
   * @param num
   * @returns
   */
  static integerToBinary(num: number) {
    if (num === 0) {
      return "0";
    }

    let binary = "";
    let n = Math.abs(num);

    while (n > 0) {
      binary = (n % 2) + binary;
      n = Math.floor(n / 2);
    }

    if (num < 0) {
      // Convert to two's complement for negative numbers
      binary = DeetBitwiseEngine.twosComplement(binary);
    }

    return binary;
  }
  static twosComplement(binary: string) {
    // Invert the bits
    let inverted = "";
    for (let bit of binary) {
      inverted += bit === "0" ? "1" : "0";
    }

    // Add 1 to the inverted bits
    let carry = 1;
    let result = "";
    for (let i = inverted.length - 1; i >= 0; i--) {
      let sum = parseInt(inverted[i]) + carry;
      result = (sum % 2) + result;
      carry = Math.floor(sum / 2);
    }

    // If there's still a carry, prepend it
    if (carry) {
      result = "1" + result;
    }

    return result;
  }
}

class DeetTreeNodeEngine implements DeetVisEngineV2 {
  containerRegistry: Map<string, HTMLElement> = new Map();
  emptyContainerRegistry(): void {
    DeetRender.emptyContainerRegistry(this.containerRegistry);
  }
  renderContainer(options: DeetTreeOptions): HTMLElement {
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      name: options.name,
      label: "TreeNode",
    });
  }
  renderFork(options: DeetTreeOptions): void {
    const { deetcode } = options;
    switch (deetcode.renderMode) {
      case "animate":
        this.renderDelayed(options);
        break;
      case "debug":
        this.renderNow(options);
        break;
      case "snapshot":
        this.renderNow(options);
        deetcode.takeSnapshot();
        break;
      default:
        break;
    }
  }
  renderFn(options: DeetTreeOptions): () => void {
    const fn = () => {
      const el = this.renderContent(options);
      const container = this.containerRegistry.get(options.name);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };
    return fn;
  }
  renderDelayed(options: DeetTreeOptions): void {
    // this works even though the data types are monkey patched
    // because by the time it runs, the monkey patches would have
    // already been undone.
    const fn = this.renderFn(options);
    options.deetcode.enqueue(fn);
  }
  renderNow(options: DeetTreeOptions): void {
    // the undoing of monkeypatching is necessary here because
    // d3 requires the use of the original constructors instead
    // of the monkey patched versions. without this, we'll
    // see duplicate visualizations
    const { deetcode } = options;
    deetcode.undoMonkeyPatchAll();
    const fn = this.renderFn(options);
    fn();
    deetcode.monkeyPatchAll();
  }
  transformDeetToNative(instance: DeetTreeNode) {
    return this.treeToHierarchy(instance);
  }
  copyData(options: DeetOptions) {
    if (options.copiedData) {
      return options.copiedData;
    }
    options.copiedData = this.treeToHierarchy(options.data);
    return options.copiedData;
  }
  renderContent(options: DeetTreeOptions): HTMLElement {
    const data = this.copyData(options);
    const div = document.createElement("div");
    div.classList.add("deetcode-treenode");

    const width = 800;

    const tree = d3.tree().nodeSize([50, 40]);

    const root = d3.hierarchy(data);

    // dynamic height based on the height of tree
    const height = root.height * 40 + 22;
    const svg = d3.create("svg").attr("width", width).attr("height", height);
    const g = svg.append("g").attr("transform", "translate(400,10)");

    svg
      .append("text")
      .text("TreeNode " + name)
      .attr("transform", "translate(0, 20)");

    // @ts-ignore
    tree(root);

    // curved lines
    // const link = g
    //   .selectAll(".link")
    //   .data(root.links())
    //   .enter()
    //   .append("path")
    //   .attr("class", "link")
    //   .attr(
    //     "d",
    //     d3
    //       .linkVertical()
    //       .x((d) => d.x)
    //       .y((d) => d.y)
    //   );

    // Create straight line links
    const link = g
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link")
      // @ts-ignore
      .attr("x1", (d) => d.source.x)
      // @ts-ignore
      .attr("y1", (d) => d.source.y)
      // @ts-ignore
      .attr("x2", (d) => d.target.x)
      // @ts-ignore
      .attr("y2", (d) => d.target.y)
      .style("stroke", (d) => d.target.data.color ?? "")
      .attr("stroke-width", 2);

    const node = g
      .selectAll(".nodegroup")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "nodegroup")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    node
      .append("circle")
      .attr("r", 10)
      .style("fill", (d) => d.data.color ?? "")
      .attr("stroke-width", 0);

    node
      .append("text")
      .attr("dy", 5)
      .attr("x", 0)
      .style("text-anchor", "middle")
      .text((d) => d.data.name)
      .attr("stroke-width", "1px");

    const svgnode = svg.node();
    if (svgnode) {
      div.append(svgnode);
    }

    return div;
  }
  // Convert the TreeNode to a hierarchical format that D3 can understand
  treeToHierarchy(node?: DeetTreeNode | null): D3TreeNode | null {
    if (!node) {
      return null;
    }
    return {
      name: node.val,
      color: node.color ?? undefined,
      children: [
        this.treeToHierarchy(node.left),
        this.treeToHierarchy(node.right),
      ].filter(Boolean),
    };
  }
  arrayToBinaryTree(array: (number | null)[]): DeetTreeNode | null {
    if (array.length === 0) return null;

    const root = new DeetTreeNode(array[0]!);
    const queue: (DeetTreeNode | null)[] = [root];
    let index = 1;

    while (queue.length > 0 && index < array.length) {
      const node = queue.shift();

      if (node !== null && node !== undefined) {
        if (index < array.length && array[index] !== null) {
          node.left = new DeetTreeNode(array[index]!);
          queue.push(node.left);
        }
        index++;

        if (index < array.length && array[index] !== null) {
          node.right = new DeetTreeNode(array[index]!);
          queue.push(node.right);
        }
        index++;
      }
    }

    return root;
  }
}

/**
 * common rendering functions used anywhere
 */
const DeetRender = {
  emptyContainerRegistry(containerRegistry: Map<string, HTMLElement>) {
    for (const key of containerRegistry.keys()) {
      containerRegistry.delete(key);
    }
  },
  renderContainerFork(div: HTMLElement): void {
    const fn = () => {
      DeetCode.getInstance().el?.appendChild(div);
    };

    switch (DeetCode.getInstance().renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      case "snapshot":
        fn();
        DeetCode.getInstance().takeSnapshot();
      default:
        break;
    }
  },
  renderContainer(options: {
    containerRegistry: Map<string, HTMLElement>;
    name: string;
    label: string;
  }): HTMLElement {
    if (options.containerRegistry.has(options.name)) {
      return options.containerRegistry.get(options.name)!;
    }
    const container = document.createElement("div");
    container.classList.add("deet-container");
    const label = DeetRender.renderLabel(`${options.label} ` + options.name);
    container.appendChild(label);
    DeetRender.renderContainerFork(container);
    options.containerRegistry.set(options.name, container);
    return container;
  },
  renderLabel(name: string): HTMLElement {
    const label = document.createElement("label");
    label.innerHTML = name;
    return label;
  },
  renderFork(options: RenderForkOptions) {
    switch (options.dcInstance.renderMode) {
      case "animate":
        options.delayedCallback();
        break;
      case "debug":
        options.nowCallback();
        break;
      case "snapshot":
        options.nowCallback();
        options.dcInstance.takeSnapshot();
        break;
      default:
        break;
    }
  },
};

export type RenderMode = "animate" | "debug" | "snapshot";

export type DirectionMode = "row" | "column";

export class DeetSet extends Set implements AutoVisDataType {
  id: string;
  static originalSet?: SetConstructor;

  constructor(iterable: any) {
    super();
    const deetcode = DeetCode.getInstance();
    this.id = deetcode.nanoid();
    deetcode.deetSetEngine.renderContainer({
      name: this.id,
      data: this,
      deetcode: deetcode,
    });
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
    const deetcode = DeetCode.getInstance();
    deetcode.deetSetEngine.renderFork({
      name: this.id,
      data: this,
      deetcode: deetcode,
    });
    return res;
  }

  delete(value: any): any {
    const res = super.delete(value);
    const deetcode = DeetCode.getInstance();
    deetcode.deetSetEngine.renderFork({
      name: this.id,
      data: this,
      deetcode: deetcode,
    });
    return res;
  }

  static monkeyPatch() {
    if (this.originalSet === undefined) {
      this.originalSet = Set;
    }

    Set = DeetSet;
  }

  static undoMonkeyPatch() {
    if (this.originalSet) {
      Set = this.originalSet;
    }
  }
}

export class DeetMap<K, V> extends Map<K, V> implements AutoVisDataType {
  id: string;
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
    const deetcode = DeetCode.getInstance();
    this.id = deetcode.nanoid();
    this.renderEnabled = false;
    deetcode.deetMapEngine.renderContainer({
      name: this.id,
      data: this,
      deetcode: deetcode,
    });
    if (iterable) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
    this.renderEnabled = true;
    deetcode.deetMapEngine.renderFork({
      name: this.id,
      data: this,
      deetcode: deetcode,
    });
  }

  has(value: any): boolean {
    return super.has(value);
  }

  set(key: any, value: any): any {
    const res = super.set(key, value);
    if (this.renderEnabled) {
      const deetcode = DeetCode.getInstance();
      deetcode.deetMapEngine.renderFork({
        name: this.id,
        data: this,
        deetcode: deetcode,
      });
    }
    return res;
  }

  delete(key: any): any {
    const res = super.delete(key);
    if (this.renderEnabled) {
      const deetcode = DeetCode.getInstance();
      deetcode.deetMapEngine.renderFork({
        name: this.id,
        data: this,
        deetcode: deetcode,
      });
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
    if (this.originalMap) {
      Map = this.originalMap;
    }
  }
}

export class DeetArray extends Array {
  container: HTMLElement;
  engine: NativeArrayEngine;
  renderEnabled: boolean = false;
  static originalArray?: ArrayConstructor;

  constructor(...args: any) {
    super(...args);
    this.engine = DeetCode.getInstance().arrayEngine;
    this.container = this.engine.renderContainer(this);
    this.engine.renderFork(this);
    this.renderEnabled = true;
    return new Proxy(this, {
      get(target, key: any) {
        if (key === "__isProxy") {
          return true;
        } else if (target[key] instanceof HTMLElement) {
          return target[key];
        } else if (target[key] instanceof NativeArrayEngine) {
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
    if (this.originalArray) {
      Array = this.originalArray;
    }
  }
}

export class DeetMinPriorityQueue extends MinPriorityQueueB<any> {
  container: HTMLElement;
  engine: NativeMinPriorityQueueEngine;
  static originalMinPriorityQueue?: typeof MinPriorityQueueB;

  constructor(...args: any) {
    super(...args);
    this.engine = DeetCode.getInstance().minPriorityQueueEngine;
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
    if (this.originalMinPriorityQueue) {
      window.MinPriorityQueue = this.originalMinPriorityQueue;
    }
  }
}

export class DeetMaxPriorityQueue extends MaxPriorityQueueB<any> {
  engine: NativeMaxPriorityQueueEngine;
  container: HTMLElement;
  static originalMaxPriorityQueue?: typeof MaxPriorityQueueB;

  constructor(...args: any) {
    super(...args);
    this.engine = DeetCode.getInstance().maxPriorityQueueEngine;
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
    if (this.originalMaxPriorityQueue) {
      window.MaxPriorityQueue = this.originalMaxPriorityQueue;
    }
  }
}

export class DeetPriorityQueue extends PriorityQueueB<any> {
  engine: NativePriorityQueueEngine;
  container: HTMLElement;
  static originalPriorityQueue?: typeof PriorityQueueB;

  constructor(compare: ICompare<any>, values?: any[] | undefined) {
    super(compare, values);
    this.engine = DeetCode.getInstance().priorityQueueEngine;
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
    if (this.originalPriorityQueue) {
      window.PriorityQueue = this.originalPriorityQueue;
    }
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

export class DeetTreeNode {
  val: number;
  left?: DeetTreeNode | null;
  right?: DeetTreeNode | null;
  color?: string;
  constructor(val: number, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export class DeetCode {
  el: Element;
  renderQueue: Array<() => void>;
  selector: string;
  renderMode: RenderMode;
  setEngine: NativeSetEngine;
  mapEngine: NativeMapEngine;
  arrayEngine: NativeArrayEngine;
  minPriorityQueueEngine: NativeMinPriorityQueueEngine;
  maxPriorityQueueEngine: NativeMaxPriorityQueueEngine;
  priorityQueueEngine: NativePriorityQueueEngine;
  deetSetEngine: DeetSetEngine;
  deetMapEngine: DeetMapEngine;
  deetArrayEngine: DeetArrayEngine;
  listNodeEngine: DeetListNodeEngine;
  bitwiseEngine: DeetBitwiseEngine;
  treeNodeEngine: DeetTreeNodeEngine;
  directionMode: DirectionMode;
  labelMode: boolean;
  animationDelay: number;
  interval?: any;
  snapshots: Node[] = [];
  snapshotIndex: number = 0;
  isAutoNativeEnabled: boolean = false;
  nanoidSize: number;

  private static instance: DeetCode;

  constructor(config: DeetConfig) {
    this.selector = config.selector;
    this.renderMode = config.renderMode || "debug";
    this.setEngine = new NativeSetEngine(this);
    this.mapEngine = new NativeMapEngine(this);
    this.arrayEngine = new NativeArrayEngine(this);
    this.minPriorityQueueEngine = new NativeMinPriorityQueueEngine(this);
    this.maxPriorityQueueEngine = new NativeMaxPriorityQueueEngine(this);
    this.priorityQueueEngine = new NativePriorityQueueEngine(this);
    this.deetSetEngine = new DeetSetEngine();
    this.deetMapEngine = new DeetMapEngine();
    this.deetArrayEngine = new DeetArrayEngine();
    this.listNodeEngine = new DeetListNodeEngine();
    this.bitwiseEngine = new DeetBitwiseEngine();
    this.treeNodeEngine = new DeetTreeNodeEngine();
    this.directionMode = config.directionMode || "row";
    this.labelMode = config.labelMode || false;
    this.animationDelay = config.animationDelay || 1000;
    this.nanoidSize = config.nanoidSize || 10;

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
    this.deetSetEngine.emptyContainerRegistry();
    this.deetMapEngine.emptyContainerRegistry();
    this.deetArrayEngine.emptyContainerRegistry();
    this.listNodeEngine.emptyContainerRegistry();
    this.bitwiseEngine.emptyContainerRegistry();
    this.treeNodeEngine.emptyContainerRegistry();
  }

  takeSnapshot() {
    const snapshot = this.el.cloneNode(true);
    this.snapshots.push(snapshot);
  }

  prevSnapshot() {
    if (this.snapshotIndex <= 0) {
      return this.snapshotIndex;
    }
    this.snapshotIndex--;
    this.el.innerHTML = "";
    this.el.appendChild(this.snapshots[this.snapshotIndex]);
    return this.snapshotIndex;
  }

  nextSnapshot() {
    if (this.snapshotIndex >= this.snapshots.length - 1) {
      return this.snapshotIndex;
    }
    this.snapshotIndex++;
    this.el.innerHTML = "";
    this.el.appendChild(this.snapshots[this.snapshotIndex]);
    return this.snapshotIndex;
  }

  initialSnapshot() {
    this.snapshotIndex = 0;
    this.el.innerHTML = "";
    this.el.appendChild(this.snapshots[this.snapshotIndex]);
  }

  firstSnapshot() {
    if (this.snapshotIndex <= 0) {
      return this.snapshotIndex;
    }
    this.snapshotIndex = 0;
    this.el.innerHTML = "";
    this.el.appendChild(this.snapshots[this.snapshotIndex]);
    return this.snapshotIndex;
  }

  lastSnapshot() {
    if (this.snapshotIndex >= this.snapshots.length - 1) {
      return this.snapshotIndex;
    }
    this.snapshotIndex = this.snapshots.length - 1;
    this.el.innerHTML = "";
    this.el.appendChild(this.snapshots[this.snapshotIndex]);
    return this.snapshotIndex;
  }

  emptySnapshots() {
    this.snapshotIndex = 0;
    this.snapshots = [];
  }

  init() {
    DeetCode.setInstance(this);
    this.emptySnapshots();
    window.MinPriorityQueue = MinPriorityQueueB;
    window.MaxPriorityQueue = MaxPriorityQueueB;
    window.PriorityQueue = PriorityQueueB;
    window.DeetCode = DeetCode;
    window.DeetTest = DeetTest;
    window._ = _;
    window.ListNode = DeetListNode;
    window.TreeNode = DeetTreeNode;
    if (this.isAutoNativeEnabled) {
      this.monkeyPatchAll();
    }

    if (this.renderMode === "animate") {
      this.startRenderLoop();
    }
  }

  end() {
    this.undoMonkeyPatchAll();
    if (this.renderMode === "snapshot") {
      this.initialSnapshot();
    }
  }

  enqueue(fn: () => void) {
    this.renderQueue.push(fn);
  }

  static enqueue(fn: () => void) {
    DeetCode.getInstance().renderQueue.push(fn);
  }

  monkeyPatchAll() {
    if (!this.isAutoNativeEnabled) {
      return;
    }
    DeetSet.monkeyPatch();
    DeetMap.monkeyPatch();
    DeetArray.monkeyPatch();
    DeetMinPriorityQueue.monkeyPatch();
    DeetMaxPriorityQueue.monkeyPatch();
    DeetPriorityQueue.monkeyPatch();
  }

  undoMonkeyPatchAll() {
    DeetSet.undoMonkeyPatch();
    DeetMap.undoMonkeyPatch();
    DeetArray.undoMonkeyPatch();
    DeetMinPriorityQueue.undoMonkeyPatch();
    DeetMaxPriorityQueue.undoMonkeyPatch();
    DeetPriorityQueue.undoMonkeyPatch();
  }

  nanoid() {
    return nanoid(this.nanoidSize);
  }

  static setInstance(deetcode: DeetCode) {
    this.instance = deetcode;
  }

  static getInstance() {
    return this.instance;
  }
}

export const DeetTest = {
  equal(actual: any, expected: any) {
    const fn = () => {
      const div = document.createElement("div");
      div.classList.add("deet-assert");
      if (_.isEqual(actual, expected)) {
        div.classList.add("deet-assert-pass");
        div.innerHTML = `Assertion passed<br>Actual: ${JSON.stringify(
          actual
        )}<br>Expected: ${JSON.stringify(expected)}`;
        DeetCode.getInstance().el.appendChild(div);
      } else {
        div.classList.add("deet-assert-fail");
        div.innerHTML = `Assertion failed<br>Actual: ${JSON.stringify(
          actual
        )}<br>Expected: ${JSON.stringify(expected)}`;
        DeetCode.getInstance().el.appendChild(div);
      }
    };
    switch (DeetCode.getInstance().renderMode) {
      case "animate":
        DeetCode.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      case "snapshot":
        fn();
        DeetCode.getInstance().takeSnapshot();
      default:
        break;
    }
  },
};

/**
 * the DeetVis class is a utility that can be used from
 * the code editor. it is responsible for visualizing
 * types which are not extending the native types.
 * for example, ListNode, Bitwise, TreeNode.
 */
export class DeetVis {
  deetcode: DeetCode;

  constructor(deetcode: DeetCode) {
    this.deetcode = deetcode;
  }

  index(instance: DeetArray, obj: VisualizeIndexObj) {
    instance.engine.renderIndexFork(instance, obj);
  }

  set(options: DeetSetOptions) {
    options.deetcode = this.deetcode;
    this.deetcode.deetSetEngine.renderContainer(options);
    this.deetcode.deetSetEngine.renderFork(options);
  }

  map(options: DeetMapOptions) {
    options.deetcode = this.deetcode;
    this.deetcode.deetMapEngine.renderContainer(options);
    this.deetcode.deetMapEngine.renderFork(options);
  }

  array(options: DeetArrayOptions) {
    options.deetcode = this.deetcode;
    this.deetcode.deetArrayEngine.renderContainer(options);
    this.deetcode.deetArrayEngine.renderFork(options);
  }

  linkedList(options: DeetListNodeOptions) {
    options.deetcode = this.deetcode;
    this.deetcode.listNodeEngine.clearAllPointers(options);
    this.deetcode.listNodeEngine.addPointers(options);
    this.deetcode.listNodeEngine.renderContainer(options);
    this.deetcode.listNodeEngine.renderFork(options);
  }

  bitwise(options: DeetBitwiseOptions) {
    options.deetcode = this.deetcode;
    this.deetcode.bitwiseEngine.renderContainer(options);
    this.deetcode.bitwiseEngine.renderFork(options);
  }

  tree(options: DeetTreeOptions) {
    options.deetcode = this.deetcode;
    this.deetcode.treeNodeEngine.renderContainer(options);
    this.deetcode.treeNodeEngine.renderFork(options);
  }

  arrayToBinaryTree(array: (number | null)[]): DeetTreeNode | null {
    return this.deetcode.treeNodeEngine.arrayToBinaryTree(array);
  }

  enableNative() {
    this.deetcode.isAutoNativeEnabled = true;
    this.deetcode.monkeyPatchAll();
  }

  disableNative() {
    this.deetcode.isAutoNativeEnabled = false;
    this.deetcode.undoMonkeyPatchAll();
  }
}
