"use client";
import _ from "lodash";
import * as d3 from "d3";
import { nanoid } from "nanoid";

import {
  ICompare,
  MaxPriorityQueue,
  MinPriorityQueue,
  PriorityQueue,
} from "@datastructures-js/priority-queue";

declare global {
  interface Window {
    DeetEngine: typeof DeetEngine;
    DeetSet: typeof DeetSet;
    DeetMap: typeof DeetMap;
    DeetArray: typeof DeetArray;
    DeetMinPriorityQueue: typeof DeetMinPriorityQueue;
    DeetMaxPriorityQueue: typeof DeetMaxPriorityQueue;
    DeetPriorityQueue: typeof DeetPriorityQueue;
    MinPriorityQueue: typeof MinPriorityQueue;
    MaxPriorityQueue: typeof MaxPriorityQueue;
    PriorityQueue: typeof PriorityQueue;
    DeetListNode: typeof DeetListNode;
    ListNode: typeof DeetListNode;
    TreeNode: typeof DeetTreeNode;
    DeetTest: DeetTest;
    DeetCode: DeetCode;
  }
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
  nanoidSize?: number;
}

interface DeetOptions {
  id: string;
  data: any;
  deetEngine: DeetEngine;
  copiedData?: any;
  hideId: boolean;
}

interface DeetStringOptions extends DeetOptions {
  data: string;
  pointers?: { [key: string]: number };
}

interface DeetObjectOptions extends DeetOptions {}

interface DeetSetOptions extends DeetOptions {
  data: Set<any>;
}

interface DeetMapOptions extends DeetOptions {
  data: Map<any, any>;
}

interface DeetArrayOptions extends DeetOptions {
  data: Array<any>;
  copiedData?: Array<any>;
  pointers?: { [key: string]: number };
}

interface DeetMinPriorityQueueOptions extends DeetOptions {
  data: MinPriorityQueue<any>;
}

interface DeetMaxPriorityQueueOptions extends DeetOptions {
  data: MaxPriorityQueue<any>;
}

interface DeetPriorityQueueOptions extends DeetOptions {
  data: PriorityQueue<any>;
}

interface DeetListNodeOptions extends DeetOptions {
  data: DeetListNode;
  copiedData?: Array<DeetListNodeRenderObj>;
  pointers?: { [key: string]: DeetListNode | null };
}

interface DeetBitwiseOptions extends DeetOptions {
  data: number;
}

interface DeetTreeOptions extends DeetOptions {
  data: DeetTreeNode;
  copiedData?: D3TreeNode | null;
}

interface D3TreeNode {
  name: number;
  children: (D3TreeNode | null)[];
  color?: string;
}

interface AutoVisDataType {
  id: string;
  engine: DeetBaseEngine;
  deetEngine: DeetEngine;
}

interface AutoVisSet extends AutoVisDataType {
  engine: DeetSetEngine;
}

interface AutoVisMap extends AutoVisDataType {
  engine: DeetMapEngine;
}

interface AutoVisArray extends AutoVisDataType {
  engine: DeetArrayEngine;
}

interface AutoVisMinPriorityQueue extends AutoVisDataType {
  engine: DeetMinPriorityQueueEngine;
}

interface AutoVisMaxPriorityQueue extends AutoVisDataType {
  engine: DeetMaxPriorityQueueEngine;
}

interface AutoVisPriorityQueue extends AutoVisDataType {
  engine: DeetPriorityQueueEngine;
}

abstract class DeetBaseEngine {
  abstract dataTypeLabel: string;
  containerRegistry: Map<string, HTMLElement> = new Map();
  abstract renderContent(opts: DeetOptions): HTMLElement;
  abstract copyData(opts: DeetOptions): any;
  emptyContainerRegistry(): void {
    for (const key of this.containerRegistry.keys()) {
      this.containerRegistry.delete(key);
    }
  }
  renderContainer(opts: DeetOptions): HTMLElement {
    const { id, hideId } = opts;
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      id: id,
      dataType: this.dataTypeLabel,
      hideId: hideId,
    });
  }
  renderFork(opts: DeetOptions): void {
    this.copyData(opts);
    DeetRender.renderFork({
      deetEngine: opts.deetEngine,
      delayedCallback: () => {
        this.renderDelayed(opts);
      },
      nowCallback: () => {
        this.renderNow(opts);
      },
    });
  }
  renderDelayed(opts: DeetOptions): void {
    const fn = this.renderFn(opts);
    opts.deetEngine.enqueue(fn);
  }
  renderNow(opts: DeetOptions): void {
    const fn = this.renderFn(opts);
    fn();
  }
  renderFn(opts: DeetOptions): () => void {
    const fn = () => {
      opts.deetEngine.undoMonkeyPatchAll();
      const el = this.renderContent(opts);
      opts.deetEngine.monkeyPatchAll();
      const container = this.containerRegistry.get(opts.id);
      if (container) {
        container.innerHTML = el.outerHTML;
      }
    };
    return fn;
  }
  renderLabel(opts: DeetOptions) {
    const label = DeetRender.renderLabel({
      dataType: this.dataTypeLabel,
      id: opts.id,
      hideId: opts.hideId,
    });
    return label;
  }
}

class DeetObjectEngine extends DeetBaseEngine {
  dataTypeLabel: string = "Object";
  renderContent(opts: DeetObjectOptions): HTMLElement {
    const data = this.copyData(opts);
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

    thKey.innerHTML = "property";
    thVal.innerHTML = "value";

    for (const [key, value] of Object.entries(data)) {
      const tr = document.createElement("tr");
      const tdKey = document.createElement("td");
      const tdVal = document.createElement("td");
      tdKey.innerHTML = String(key);
      tdVal.innerHTML = String(value);
      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      tbody.appendChild(tr);
    }

    const label = this.renderLabel(opts);

    div.append(label);
    div.append(table);
    return div;
  }
  copyData(opts: DeetObjectOptions) {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    const copy = { ...opts.data };
    opts.copiedData = copy;
    return copy;
  }
}

class DeetSetEngine extends DeetBaseEngine {
  dataTypeLabel: string = "Set";
  renderContent(opts: DeetSetOptions): HTMLElement {
    const data = this.copyData(opts);
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    for (const item of data) {
      const li = document.createElement("li");
      li.innerHTML = item;
      ul.appendChild(li);
    }
    const label = this.renderLabel(opts);
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
  copyData(opts: DeetOptions) {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    const originalSet = DeetSet.getOriginalConstructor();
    opts.copiedData = new originalSet([...opts.data]);
    return opts.copiedData;
  }
}

class DeetMapEngine extends DeetBaseEngine {
  dataTypeLabel: string = "Map";
  renderContainer(opts: DeetMapOptions): HTMLElement {
    return DeetRender.renderContainer({
      containerRegistry: this.containerRegistry,
      id: opts.id,
      dataType: "Map",
      hideId: opts.hideId,
    });
  }
  renderContent(opts: DeetMapOptions): HTMLElement {
    const data = this.copyData(opts);
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

    const label = this.renderLabel(opts);

    div.append(label);
    div.append(table);
    return div;
  }
  copyData(opts: DeetOptions) {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    const { data } = opts;
    const originalMap = DeetMap.getOriginalConstructor();
    const copy = new originalMap([...data.entries()]);
    opts.copiedData = copy;
    return opts.copiedData;
  }
}

class DeetArrayEngine extends DeetBaseEngine {
  dataTypeLabel: string = "Array";
  renderContent(opts: DeetArrayOptions): HTMLElement {
    const data = this.copyData(opts);
    const div = document.createElement("div");
    const label = this.renderLabel(opts);
    div.innerHTML = label.outerHTML;
    if (data.length === 0) {
      return div;
    }
    if (this.is2DArray(data)) {
      const el = this.render2d(opts);
      div.innerHTML += el.outerHTML;
    } else {
      const el = this.render1d(opts);
      div.innerHTML += el.outerHTML;
    }
    return div;
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
  renderCell(value: any): HTMLTableCellElement {
    const td = document.createElement("td");
    if (_.isUndefined(value)) {
      td.innerHTML = "";
    } else if (_.isString(value)) {
      td.innerHTML = value;
    } else if (_.isNumber(value)) {
      td.innerHTML = value.toString();
    } else if (_.isObject(value)) {
      td.innerHTML = JSON.stringify(value);
    } else if (_.isBoolean(value)) {
      td.innerHTML = JSON.stringify(value);
    } else {
      const div = document.createElement("div");
      div.style.height = "25px";
      td.appendChild(div);
    }
    return td;
  }
  render1d(opts: DeetArrayOptions) {
    const data = this.copyData(opts);
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
      th.innerHTML = index.toString();
      const td = this.renderCell(value);
      trHead.append(th);
      trBody.append(td);
    }
    if (opts.pointers) {
      const tfoot = this.renderArrayIndex(opts);
      if (tfoot) {
        table.append(tfoot);
      }
    }
    return table;
  }
  render2d(opts: DeetArrayOptions) {
    const data = this.copyData(opts);
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
        const td = this.renderCell(data[i][j]);
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
  renderArrayIndex(opts: DeetArrayOptions): HTMLElement | null {
    if (!opts.pointers) {
      return null;
    }
    const data = this.copyData(opts);
    let tfoot = document.createElement("tfoot");
    for (const [key, value] of Object.entries(opts.pointers)) {
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
  copyData(opts: DeetArrayOptions): Array<any> {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    const { data } = opts;
    const copy = [];
    for (const item of data) {
      if (Array.isArray(item)) {
        // handle 2d arrays
        const newArr = [];
        for (const it of item) {
          newArr.push(it);
        }
        copy.push(newArr);
      } else {
        // handle 1d arrays
        copy.push(item);
      }
    }
    opts.copiedData = copy;
    return copy;
  }
}

class DeetMinPriorityQueueEngine extends DeetBaseEngine {
  dataTypeLabel: string = "MinPriorityQueue";
  renderContent(opts: DeetMinPriorityQueueOptions): HTMLElement {
    const arr = this.copyData(opts);
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      li.innerHTML = item.toString();
      ul.appendChild(li);
    }
    const label = this.renderLabel(opts);
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
  copyData(opts: DeetMinPriorityQueueOptions) {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    const arr = opts.data.toArray();
    opts.copiedData = [...arr];
    return opts.copiedData;
  }
}

class DeetMaxPriorityQueueEngine extends DeetBaseEngine {
  dataTypeLabel: string = "MaxPriorityQueue";
  renderContent(opts: DeetMaxPriorityQueueOptions): HTMLElement {
    const arr = this.copyData(opts);
    const div = document.createElement("div");
    const ul = document.createElement("ul");
    for (const item of arr) {
      const li = document.createElement("li");
      li.innerHTML = item.toString();
      ul.appendChild(li);
    }
    const label = this.renderLabel(opts);
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
  copyData(opts: DeetMaxPriorityQueueOptions) {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    const arr = opts.data.toArray();
    opts.copiedData = [...arr];
    return opts.copiedData;
  }
}

class DeetPriorityQueueEngine extends DeetBaseEngine {
  dataTypeLabel: string = "PriorityQueue";
  renderContent(opts: DeetPriorityQueueOptions): HTMLElement {
    const arr = this.copyData(opts);
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
    const label = this.renderLabel(opts);
    div.appendChild(label);
    div.appendChild(ul);
    return div;
  }
  copyData(opts: DeetPriorityQueueOptions) {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    const arr = opts.data.toArray();
    opts.copiedData = [...arr];
    return opts.copiedData;
  }
}

class DeetListNodeEngine extends DeetBaseEngine {
  dataTypeLabel: string = "ListNode";
  renderContent(opts: DeetListNodeOptions): HTMLElement {
    const arr = this.copyData(opts);
    const container = document.createElement("div");
    container.classList.add("deetcode-listnode");

    const label = this.renderLabel(opts);
    container.appendChild(label);

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
  clearAllPointers(opts: DeetListNodeOptions) {
    let cur: DeetListNode | null = opts.data;
    // TODO: this needs to be rewritten if monkey patching
    // becomes an optional feature.
    // since it is always on, we can assume the Set
    // constructor has been monkey patched
    DeetSet.undoMonkeyPatch();
    const set = new Set();
    // redo monkey patch if auto vis enabled
    if (opts.deetEngine.isAutoVisEnabled) {
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
  addPointers(opts: DeetListNodeOptions) {
    const { pointers } = opts;
    if (pointers) {
      for (const [k, v] of Object.entries(pointers)) {
        if (v) {
          v.pointers.add(k);
        }
      }
    }
  }
  copyData(opts: DeetOptions) {
    const res = [];
    let cur: DeetListNode | null = opts.data;
    const originalMap = DeetMap.getOriginalConstructor();
    const map = new originalMap<DeetListNode, number>();
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
  arrayToLinkedList(array: number[]): DeetListNode {
    if (array.length === 0) {
      throw new Error("array must have at least one number");
    }
    const dummy = new DeetListNode();
    let cur = dummy;
    for (const num of array) {
      cur.next = new DeetListNode(num);
      cur = cur.next;
    }
    return dummy.next!;
  }
  linkedListToArray(listNode: DeetListNode) {
    let cur: DeetListNode | null = listNode;
    const arr = [];
    while (cur) {
      arr.push(cur.val);
      cur = cur.next;
    }
    return arr;
  }
}

class DeetBitwiseEngine extends DeetBaseEngine {
  dataTypeLabel: string = "Bitwise";
  renderContent(opts: DeetBitwiseOptions): HTMLElement {
    const div = document.createElement("div");
    const label = this.renderLabel(opts);
    div.appendChild(label);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const thr = document.createElement("tr");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    const binary = DeetBitwiseEngine.integerToBinary(opts.data);
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
  copyData(opts: DeetOptions) {
    return opts.data;
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

class DeetTreeNodeEngine extends DeetBaseEngine {
  dataTypeLabel: string = "TreeNode";
  copyData(opts: DeetOptions) {
    if (opts.copiedData) {
      return opts.copiedData;
    }
    opts.copiedData = this.treeToHierarchy(opts.data);
    return opts.copiedData;
  }
  renderContent(opts: DeetTreeOptions): HTMLElement {
    const data = this.copyData(opts);
    const div = document.createElement("div");
    div.classList.add("deetcode-treenode");

    const label = this.renderLabel(opts);
    div.appendChild(label);

    const width = 800;

    const tree = d3.tree().nodeSize([50, 40]);

    const root = d3.hierarchy(data);

    // dynamic height based on the height of tree
    const height = root.height * 40 + 22;
    const svg = d3.create("svg").attr("width", width).attr("height", height);
    const g = svg.append("g").attr("transform", "translate(400,10)");

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
  renderContainerFork(div: HTMLElement): void {
    const fn = () => {
      DeetEngine.getInstance().el?.appendChild(div);
    };

    switch (DeetEngine.getInstance().renderMode) {
      case "animate":
        DeetEngine.enqueue(fn);
        break;
      case "debug":
        fn();
        break;
      case "snapshot":
        fn();
      case "loop":
        fn();
      default:
        break;
    }
  },
  renderContainer(opts: {
    containerRegistry: Map<string, HTMLElement>;
    id: string;
    dataType: string;
    hideId: boolean;
  }): HTMLElement {
    const { id, dataType, hideId = false } = opts;
    if (opts.containerRegistry.has(id)) {
      return opts.containerRegistry.get(id)!;
    }
    const container = document.createElement("div");
    container.classList.add("deet-container");
    const labelEl = DeetRender.renderLabel({
      id: id,
      dataType: dataType,
      hideId: hideId,
    });
    container.appendChild(labelEl);
    DeetRender.renderContainerFork(container);
    opts.containerRegistry.set(id, container);
    return container;
  },
  renderLabel({
    dataType,
    id,
    hideId = false,
  }: {
    dataType: string;
    id: string;
    hideId: boolean;
  }): HTMLElement {
    const label = document.createElement("label");
    label.classList.add("deet-label");
    if (dataType) {
      const dataTypeSpan = document.createElement("span");
      dataTypeSpan.classList.add("deet-label-data-type");
      dataTypeSpan.innerHTML = dataType;
      label.appendChild(dataTypeSpan);
    }

    if (id && !hideId) {
      const idSpan = document.createElement("span");
      idSpan.classList.add("deet-label-id");
      idSpan.innerHTML = id;
      label.appendChild(idSpan);
    }

    return label;
  },
  renderFork(opts: {
    deetEngine: DeetEngine;
    delayedCallback(): void;
    nowCallback(): void;
  }) {
    switch (opts.deetEngine.renderMode) {
      case "animate":
        opts.delayedCallback();
        break;
      case "debug":
        opts.nowCallback();
        break;
      case "snapshot":
        opts.nowCallback();
        opts.deetEngine.takeSnapshot();
        break;
      case "loop":
        opts.nowCallback();
        opts.deetEngine.takeSnapshot();
      default:
        break;
    }
  },
};

export type RenderMode = "animate" | "debug" | "snapshot" | "loop";

export type DirectionMode = "row" | "column";

export type LabelMode = "true" | "false";

export class DeetSet extends Set implements AutoVisSet {
  id: string;
  engine: DeetSetEngine;
  deetEngine: DeetEngine;
  static originalSet?: SetConstructor;

  constructor(iterable: any) {
    super();
    this.deetEngine = DeetEngine.getInstance();
    this.id = this.deetEngine.nanoid();
    this.engine = this.deetEngine.deetSetEngine;
    this.engine.renderContainer({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
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
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  delete(value: any): any {
    const res = super.delete(value);
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
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

  static getOriginalConstructor() {
    return this.originalSet || Set;
  }
}

export class DeetMap<K, V> extends Map<K, V> implements AutoVisMap {
  id: string;
  engine: DeetMapEngine;
  deetEngine: DeetEngine;
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
    this.deetEngine = DeetEngine.getInstance();
    this.id = this.deetEngine.nanoid();
    this.engine = this.deetEngine.deetMapEngine;
    this.renderEnabled = false;
    this.engine.renderContainer({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    if (iterable) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
    this.renderEnabled = true;
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
  }

  has(value: any): boolean {
    return super.has(value);
  }

  set(key: any, value: any): any {
    const res = super.set(key, value);
    if (this.renderEnabled) {
      this.engine.renderFork({
        id: this.id,
        data: this,
        deetEngine: this.deetEngine,
        hideId: true,
      });
    }
    return res;
  }

  delete(key: any): any {
    const res = super.delete(key);
    if (this.renderEnabled) {
      this.engine.renderFork({
        id: this.id,
        data: this,
        deetEngine: this.deetEngine,
        hideId: true,
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

  static getOriginalConstructor() {
    return this.originalMap || Map;
  }
}

export class DeetArray extends Array implements AutoVisArray {
  id: string;
  engine: DeetArrayEngine;
  deetEngine: DeetEngine;
  renderEnabled: boolean = false;
  static originalArray?: ArrayConstructor;

  constructor(...args: any) {
    super(...args);
    this.deetEngine = DeetEngine.getInstance();
    this.id = this.deetEngine.nanoid();
    this.engine = this.deetEngine.deetArrayEngine;
    this.engine.renderContainer({
      data: this,
      id: this.id,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return new Proxy(this, {
      get(target, key: any) {
        if (key === "__isProxy") {
          return true;
        } else if (target[key] instanceof HTMLElement) {
          return target[key];
        } else if (Array.isArray(target[key])) {
          // handle 2d array scenarios
          // so that we can get that native-like
          // behavior on 2d arrays
          return new Proxy(target[key], this);
        } else {
          return target[key];
        }
      },
      set: (target, prop, value) => {
        const res = Reflect.set(target, prop, value);
        this.engine.renderFork({
          data: this,
          id: this.id,
          deetEngine: this.deetEngine,
          hideId: true,
        });
        return res;
      },
    });
  }

  push(value: any): number {
    const res = super.push(value);
    this.engine.renderFork({
      data: this,
      id: this.id,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  unshift(value: any): number {
    const res = super.unshift(value);
    this.engine.renderFork({
      data: this,
      id: this.id,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  shift(): number {
    const res = super.shift();
    this.engine.renderFork({
      data: this,
      id: this.id,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  pop() {
    const res = super.pop();
    this.engine.renderFork({
      data: this,
      id: this.id,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  sort(compareFn?: ((a: any, b: any) => number) | undefined): this {
    const res = super.sort(compareFn);
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
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
    if (this.originalArray) {
      Array = this.originalArray;
    }
  }

  static getOriginalConstructor() {
    return this.originalArray || Array;
  }
}

export class DeetMinPriorityQueue
  extends MinPriorityQueue<any>
  implements AutoVisMinPriorityQueue
{
  id: string;
  engine: DeetMinPriorityQueueEngine;
  deetEngine: DeetEngine;
  static originalMinPriorityQueue?: typeof MinPriorityQueue;

  constructor(...args: any) {
    super(...args);
    this.deetEngine = DeetEngine.getInstance();
    this.id = this.deetEngine.nanoid();
    this.engine = this.deetEngine.deetMinPriorityQueueEngine;
    this.engine.renderContainer({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
  }

  enqueue(value: any) {
    const res = super.enqueue(value);
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  dequeue() {
    const res = super.dequeue();
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  static monkeyPatch() {
    if (this.originalMinPriorityQueue === undefined) {
      this.originalMinPriorityQueue = MinPriorityQueue;
    }

    window.MinPriorityQueue = DeetMinPriorityQueue;
  }

  static undoMonkeyPatch() {
    if (this.originalMinPriorityQueue) {
      window.MinPriorityQueue = this.originalMinPriorityQueue;
    }
  }
}

export class DeetMaxPriorityQueue
  extends MaxPriorityQueue<any>
  implements AutoVisMaxPriorityQueue
{
  id: string;
  engine: DeetMaxPriorityQueueEngine;
  deetEngine: DeetEngine;
  static originalMaxPriorityQueue?: typeof MaxPriorityQueue;

  constructor(...args: any) {
    super(...args);
    this.deetEngine = DeetEngine.getInstance();
    this.id = this.deetEngine.nanoid();
    this.engine = this.deetEngine.deetMaxPriorityQueueEngine;
    this.engine.renderContainer({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
  }

  enqueue(value: any) {
    const res = super.enqueue(value);
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  dequeue() {
    const res = super.dequeue();
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  static monkeyPatch() {
    if (this.originalMaxPriorityQueue === undefined) {
      this.originalMaxPriorityQueue = MaxPriorityQueue;
    }

    window.MaxPriorityQueue = DeetMaxPriorityQueue;
  }

  static undoMonkeyPatch() {
    if (this.originalMaxPriorityQueue) {
      window.MaxPriorityQueue = this.originalMaxPriorityQueue;
    }
  }
}

export class DeetPriorityQueue
  extends PriorityQueue<any>
  implements AutoVisPriorityQueue
{
  id: string;
  engine: DeetPriorityQueueEngine;
  deetEngine: DeetEngine;
  static originalPriorityQueue?: typeof PriorityQueue;

  constructor(compare: ICompare<any>, values?: any[] | undefined) {
    super(compare, values);
    this.deetEngine = DeetEngine.getInstance();
    this.id = this.deetEngine.nanoid();
    this.engine = this.deetEngine.deetPriorityQueueEngine;
    this.engine.renderContainer({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
  }

  enqueue(value: any) {
    const res = super.enqueue(value);
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  dequeue() {
    const res = super.dequeue();
    this.engine.renderFork({
      id: this.id,
      data: this,
      deetEngine: this.deetEngine,
      hideId: true,
    });
    return res;
  }

  static monkeyPatch() {
    if (this.originalPriorityQueue === undefined) {
      this.originalPriorityQueue = PriorityQueue;
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
    const originalSet = DeetSet.getOriginalConstructor();
    this.pointers = new originalSet();
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

export class DeetEngine {
  el: Element;
  renderQueue: Array<() => void>;
  selector: string;
  renderMode: RenderMode;
  deetObjectEngine: DeetObjectEngine;
  deetSetEngine: DeetSetEngine;
  deetMapEngine: DeetMapEngine;
  deetArrayEngine: DeetArrayEngine;
  deetMinPriorityQueueEngine: DeetMinPriorityQueueEngine;
  deetMaxPriorityQueueEngine: DeetMaxPriorityQueueEngine;
  deetPriorityQueueEngine: DeetPriorityQueueEngine;
  deetListNodeEngine: DeetListNodeEngine;
  deetBitwiseEngine: DeetBitwiseEngine;
  deetTreeNodeEngine: DeetTreeNodeEngine;
  directionMode: DirectionMode;
  labelMode: boolean;
  animationDelay: number;
  interval?: any;
  snapshots: Node[] = [];
  snapshotIndex: number = 0;
  isAutoVisEnabled: boolean = false;
  nanoidSize: number;

  private static instance: DeetEngine;

  constructor(config: DeetConfig) {
    this.selector = config.selector;
    this.renderMode = config.renderMode || "debug";
    this.deetObjectEngine = new DeetObjectEngine();
    this.deetSetEngine = new DeetSetEngine();
    this.deetMapEngine = new DeetMapEngine();
    this.deetArrayEngine = new DeetArrayEngine();
    this.deetMinPriorityQueueEngine = new DeetMinPriorityQueueEngine();
    this.deetMaxPriorityQueueEngine = new DeetMaxPriorityQueueEngine();
    this.deetPriorityQueueEngine = new DeetPriorityQueueEngine();
    this.deetListNodeEngine = new DeetListNodeEngine();
    this.deetBitwiseEngine = new DeetBitwiseEngine();
    this.deetTreeNodeEngine = new DeetTreeNodeEngine();
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
      fn();
    }, delay);
  }

  startSnapshotLoop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const delay = this.animationDelay < 10 ? 10 : this.animationDelay;
    this.interval = setInterval(() => {
      this.snapshotIndex++;
      this.el.innerHTML = "";
      this.el.appendChild(
        this.snapshots[this.snapshotIndex % this.snapshots.length]
      );
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
    this.deetListNodeEngine.emptyContainerRegistry();
    this.deetBitwiseEngine.emptyContainerRegistry();
    this.deetTreeNodeEngine.emptyContainerRegistry();
    this.deetMinPriorityQueueEngine.emptyContainerRegistry();
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
    const snapshot = this.snapshots[this.snapshotIndex] as HTMLElement;
    this.el.innerHTML = snapshot.innerHTML;
    return this.snapshotIndex;
  }

  nextSnapshot() {
    if (this.snapshotIndex >= this.snapshots.length - 1) {
      return this.snapshotIndex;
    }
    this.snapshotIndex++;
    this.el.innerHTML = "";
    const snapshot = this.snapshots[this.snapshotIndex] as HTMLElement;
    this.el.innerHTML = snapshot.innerHTML;
    return this.snapshotIndex;
  }

  initialSnapshot() {
    this.snapshotIndex = 0;
    this.el.innerHTML = "";
    const snapshot = this.snapshots[this.snapshotIndex] as HTMLElement;
    this.el.innerHTML = snapshot.innerHTML;
  }

  firstSnapshot() {
    if (this.snapshotIndex <= 0) {
      return this.snapshotIndex;
    }
    this.snapshotIndex = 0;
    this.el.innerHTML = "";
    const snapshot = this.snapshots[this.snapshotIndex] as HTMLElement;
    this.el.innerHTML = snapshot.innerHTML;
    return this.snapshotIndex;
  }

  lastSnapshot() {
    if (this.snapshotIndex >= this.snapshots.length - 1) {
      return this.snapshotIndex;
    }
    this.snapshotIndex = this.snapshots.length - 1;
    this.el.innerHTML = "";
    const snapshot = this.snapshots[this.snapshotIndex] as HTMLElement;
    this.el.innerHTML = snapshot.innerHTML;
    return this.snapshotIndex;
  }

  emptySnapshots() {
    this.snapshotIndex = 0;
    this.snapshots = [];
  }

  init() {
    DeetEngine.setInstance(this);
    this.emptySnapshots();
    window.MinPriorityQueue = MinPriorityQueue;
    window.MaxPriorityQueue = MaxPriorityQueue;
    window.PriorityQueue = PriorityQueue;
    window.DeetEngine = DeetEngine;
    window.DeetTest = new DeetTest(this);
    window._ = _;
    window.ListNode = DeetListNode;
    window.TreeNode = DeetTreeNode;
    if (this.isAutoVisEnabled) {
      this.monkeyPatchAll();
    }

    if (this.renderMode === "animate") {
      this.startRenderLoop();
    }
  }

  end() {
    this.undoMonkeyPatchAll();
    this.isAutoVisEnabled = false;
    if (this.renderMode === "snapshot") {
      this.initialSnapshot();
    }

    if (this.renderMode === "loop") {
      this.initialSnapshot();
      this.startSnapshotLoop();
    }
  }

  enqueue(fn: () => void) {
    this.renderQueue.push(fn);
  }

  static enqueue(fn: () => void) {
    DeetEngine.getInstance().renderQueue.push(fn);
  }

  monkeyPatchAll() {
    if (!this.isAutoVisEnabled) {
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

  static setInstance(deetcode: DeetEngine) {
    this.instance = deetcode;
  }

  static getInstance() {
    return this.instance;
  }
}

class DeetTest {
  deetEngine: DeetEngine;
  constructor(deetEngine: DeetEngine) {
    this.deetEngine = deetEngine;
  }
  equal(actual: any, expected: any) {
    const deetEngine = this.deetEngine;
    const fn = () => {
      const div = document.createElement("div");
      div.classList.add("deet-assert");
      if (_.isEqual(actual, expected)) {
        div.classList.add("deet-assert-pass");
        div.innerHTML = `Assertion passed<br>Actual: ${JSON.stringify(
          actual
        )}<br>Expected: ${JSON.stringify(expected)}`;
        deetEngine.el.appendChild(div);
      } else {
        div.classList.add("deet-assert-fail");
        div.innerHTML = `Assertion failed<br>Actual: ${JSON.stringify(
          actual
        )}<br>Expected: ${JSON.stringify(expected)}`;
        deetEngine.el.appendChild(div);
      }
    };
    DeetRender.renderFork({
      deetEngine: deetEngine,
      delayedCallback() {
        deetEngine.enqueue(fn);
      },
      nowCallback() {
        fn();
      },
    });
  }
}

/**
 * the DeetCode class is a utility that can be used from
 * the code editor. it is the facade to all of the deet engines.
 */
export class DeetCode {
  deetEngine: DeetEngine;

  constructor(deetEngine: DeetEngine) {
    this.deetEngine = deetEngine;
  }

  string(opts: DeetStringOptions): void;
  string(id: string, data: string, opts?: DeetStringOptions): void;
  string(
    optsOrId: DeetStringOptions | string,
    data?: string,
    opts?: DeetStringOptions
  ): void {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const arrOpts: DeetArrayOptions = {
        id: id,
        data: data ? data.split("") : [],
        deetEngine: this.deetEngine,
        pointers: opts?.pointers,
        hideId: false,
      };
      this.deetEngine.deetArrayEngine.renderContainer(arrOpts);
      this.deetEngine.deetArrayEngine.renderFork(arrOpts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      const arrOpts: DeetArrayOptions = {
        data: opts.data.split(""),
        pointers: opts.pointers,
        id: opts.id,
        hideId: false,
        deetEngine: this.deetEngine,
      };
      this.deetEngine.deetArrayEngine.renderContainer(arrOpts);
      this.deetEngine.deetArrayEngine.renderFork(arrOpts);
    }
  }

  object(opts: DeetObjectOptions): void;
  object(id: string, data: any): void;
  object(optsOrId: DeetObjectOptions | string, data?: any) {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetObjectOptions = {
        id: id,
        data: data,
        deetEngine: this.deetEngine,
        hideId: false,
      };
      this.deetEngine.deetObjectEngine.renderContainer(opts);
      this.deetEngine.deetObjectEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetObjectEngine.renderContainer(opts);
      this.deetEngine.deetObjectEngine.renderFork(opts);
    }
  }

  set(opts: DeetSetOptions): void;
  set(id: string, data: any): void;
  set(optsOrId: DeetSetOptions | string, data?: any): void {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetSetOptions = {
        id: id,
        data: data,
        deetEngine: this.deetEngine,
        hideId: false,
      };
      this.deetEngine.deetSetEngine.renderContainer(opts);
      this.deetEngine.deetSetEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetSetEngine.renderContainer(opts);
      this.deetEngine.deetSetEngine.renderFork(opts);
    }
  }

  map(opts: DeetMapOptions): void;
  map(id: string, data: Map<any, any>): void;
  map(optsOrId: DeetMapOptions | string, data?: Map<any, any>): void {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetMapOptions = {
        id: id,
        data: data!,
        hideId: false,
        deetEngine: this.deetEngine,
      };
      this.deetEngine.deetMapEngine.renderContainer(opts);
      this.deetEngine.deetMapEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetMapEngine.renderContainer(opts);
      this.deetEngine.deetMapEngine.renderFork(opts);
    }
  }

  array(opts: DeetArrayOptions): void;
  array(id: string, data: Array<any>, opts?: DeetArrayOptions): void;
  array(
    optsOrId: DeetArrayOptions | string,
    data?: Array<any>,
    options?: DeetArrayOptions
  ): void {
    if (typeof optsOrId === "string") {
      const opts = {
        id: optsOrId,
        deetEngine: this.deetEngine,
        data: data,
        hideId: false,
        pointers: options?.pointers,
      };
      this.deetEngine.deetArrayEngine.renderContainer(opts);
      this.deetEngine.deetArrayEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetArrayEngine.renderContainer(opts);
      this.deetEngine.deetArrayEngine.renderFork(opts);
    }
  }

  linkedList(opts: DeetListNodeOptions): void;
  linkedList(id: string, data: DeetListNode, opts: DeetListNodeOptions): void;
  linkedList(
    optsOrId: DeetListNodeOptions | string,
    data?: DeetListNode,
    options?: DeetListNodeOptions
  ) {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetListNodeOptions = {
        id: id,
        data: data!,
        deetEngine: this.deetEngine,
        hideId: false,
        pointers: options?.pointers,
      };
      this.deetEngine.deetListNodeEngine.clearAllPointers(opts);
      this.deetEngine.deetListNodeEngine.addPointers(opts);
      this.deetEngine.deetListNodeEngine.renderContainer(opts);
      this.deetEngine.deetListNodeEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetListNodeEngine.clearAllPointers(opts);
      this.deetEngine.deetListNodeEngine.addPointers(opts);
      this.deetEngine.deetListNodeEngine.renderContainer(opts);
      this.deetEngine.deetListNodeEngine.renderFork(opts);
    }
  }

  bitwise(opts: DeetBitwiseOptions): void;
  bitwise(id: string, data: number): void;
  bitwise(optsOrId: DeetBitwiseOptions | string, data?: number) {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetBitwiseOptions = {
        id: id,
        data: data!,
        deetEngine: this.deetEngine,
        hideId: false,
      };
      this.deetEngine.deetBitwiseEngine.renderContainer(opts);
      this.deetEngine.deetBitwiseEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetBitwiseEngine.renderContainer(opts);
      this.deetEngine.deetBitwiseEngine.renderFork(opts);
    }
  }

  tree(opts: DeetTreeOptions): void;
  tree(id: string, data: DeetTreeNode): void;
  tree(optsOrId: DeetTreeOptions | string, data?: DeetTreeNode): void {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetTreeOptions = {
        id: id,
        data: data!,
        deetEngine: this.deetEngine,
        hideId: false,
      };
      this.deetEngine.deetTreeNodeEngine.renderContainer(opts);
      this.deetEngine.deetTreeNodeEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetTreeNodeEngine.renderContainer(opts);
      this.deetEngine.deetTreeNodeEngine.renderFork(opts);
    }
  }

  arrayToBinaryTree(array: (number | null)[]): DeetTreeNode | null {
    return this.deetEngine.deetTreeNodeEngine.arrayToBinaryTree(array);
  }

  minPriorityQueue(opts: DeetMinPriorityQueueOptions): void;
  minPriorityQueue(id: string, data: MinPriorityQueue<any>): void;
  minPriorityQueue(
    optsOrId: DeetMinPriorityQueueOptions | string,
    data?: MinPriorityQueue<any>
  ) {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetMinPriorityQueueOptions = {
        id: id,
        data: data!,
        hideId: false,
        deetEngine: this.deetEngine,
      };
      this.deetEngine.deetMinPriorityQueueEngine.renderContainer(opts);
      this.deetEngine.deetMinPriorityQueueEngine.renderFork(opts);
    } else {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetMinPriorityQueueEngine.renderContainer(opts);
      this.deetEngine.deetMinPriorityQueueEngine.renderFork(opts);
    }
  }

  maxPriorityQueue(opts: DeetMaxPriorityQueueOptions): void;
  maxPriorityQueue(id: string, data: MaxPriorityQueue<any>): void;
  maxPriorityQueue(
    optsOrId: DeetMaxPriorityQueueOptions | string,
    data?: MaxPriorityQueue<any>
  ): void {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetMaxPriorityQueueOptions = {
        id: id,
        data: data!,
        hideId: false,
        deetEngine: this.deetEngine,
      };
      this.deetEngine.deetMaxPriorityQueueEngine.renderContainer(opts);
      this.deetEngine.deetMaxPriorityQueueEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetMaxPriorityQueueEngine.renderContainer(opts);
      this.deetEngine.deetMaxPriorityQueueEngine.renderFork(opts);
    }
  }

  priorityQueue(opts: DeetPriorityQueueOptions): void;
  priorityQueue(id: string, data: PriorityQueue<any>): void;
  priorityQueue(
    optsOrId: DeetPriorityQueueOptions | string,
    data?: PriorityQueue<any>
  ): void {
    if (typeof optsOrId === "string") {
      const id = optsOrId;
      const opts: DeetMaxPriorityQueueOptions = {
        id: id,
        data: data!,
        hideId: false,
        deetEngine: this.deetEngine,
      };
      this.deetEngine.deetPriorityQueueEngine.renderContainer(opts);
      this.deetEngine.deetPriorityQueueEngine.renderFork(opts);
    } else if (typeof optsOrId === "object") {
      const opts = optsOrId;
      opts.deetEngine = this.deetEngine;
      this.deetEngine.deetPriorityQueueEngine.renderContainer(opts);
      this.deetEngine.deetPriorityQueueEngine.renderFork(opts);
    }
  }

  enableAutoVis() {
    this.deetEngine.isAutoVisEnabled = true;
    this.deetEngine.monkeyPatchAll();
  }

  disableAutoVis() {
    this.deetEngine.isAutoVisEnabled = false;
    this.deetEngine.undoMonkeyPatchAll();
  }

  arrayToLinkedList(array: number[]): DeetListNode {
    return this.deetEngine.deetListNodeEngine.arrayToLinkedList(array);
  }

  linkedListToArray(listNode: DeetListNode) {
    return this.deetEngine.deetListNodeEngine.linkedListToArray(listNode);
  }
}
