"use client";

interface DeetCode {
  DeetSet: typeof DeetSet;
  DeetMap: typeof DeetMap;
  DeetArray: typeof DeetArray;
  configure: (config: { selector: string }) => void;
  element?: Element | null;
}

declare global {
  interface Window {
    dc: DeetCode;
    DeetSet: typeof DeetSet;
    DeetMap: typeof DeetMap;
    DeetArray: typeof DeetArray;
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
    table.classList.add("deetmap");
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

    this.container?.appendChild(tr);
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
  curIdx: number;
  container?: HTMLDivElement;
  static originalArray?: ArrayConstructor;

  constructor(...args: any) {
    super(...args);
    this.id = crypto.randomUUID();
    this.curIdx = 0;
    this.renderContainer();
  }

  push(value: any): number {
    this.renderValue(value);
    return super.push(value);
  }

  renderContainer() {
    const div = document.createElement("div");
    div.classList.add("deetarray");
    div.dataset.id = this.id;
    this.container = div;
    window.dc.element?.appendChild(div);
  }

  private renderValue(value: any) {
    // create els
    const itemDiv = document.createElement("div");
    const indexDiv = document.createElement("div");
    const valueDiv = document.createElement("div");

    // classes
    itemDiv.classList.add("deetarray-item");
    indexDiv.classList.add("deetarray-index");
    valueDiv.classList.add("deetarray-value");

    // inner html
    indexDiv.innerHTML = this.curIdx.toString();
    valueDiv.innerHTML = value;

    // build tree
    itemDiv.appendChild(indexDiv);
    itemDiv.appendChild(valueDiv);
    itemDiv.dataset.id = this.id + value;
    this.container?.appendChild(itemDiv);
    this.curIdx++;
  }

  static monkeyPatch() {
    if (this.originalArray === undefined) {
      this.originalArray = Array;
    }

    Array = DeetArray;
  }

  static undoMonkeyPatch() {
    Array = this.originalArray;
  }
}

const dc: DeetCode = {
  DeetSet: DeetSet,
  DeetMap: DeetMap,
  DeetArray: DeetArray,
  configure,
};

function configure(config: { selector: string }) {
  dc.element = document.querySelector(config.selector);
  dc.element?.classList.add("deetcode");
}

export default dc;
