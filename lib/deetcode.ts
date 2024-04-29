"use client";

interface DeetCode {
  DeetSet: typeof DeetSet;
  configure: (config: { selector: string }) => void;
  element?: Element | null;
  monkeyPatch: (window: any) => void;
  originalAdd?: (value: any) => Set<any>;
  undoMonkeyPatch: (window: any) => void;
}

export class DeetSet {
  set: Set<any>;

  constructor(objs?: any[]) {
    this.set = new Set(objs);
  }

  has(obj: any) {
    console.log("adding to deetset");

    return this.set.has(obj);
  }

  add(obj: any) {
    debugger;
    const div = document.createElement("div");
    div.innerHTML = obj;
    dc.element?.appendChild(div);
    return this.set.add(obj);
  }
}

const dc: DeetCode = {
  DeetSet: DeetSet,
  configure,
  monkeyPatch,
  undoMonkeyPatch,
};

function configure(config: { selector: string }) {
  dc.element = document.querySelector(config.selector);
}

function monkeyPatch(window) {
  debugger;
  if (dc.originalAdd === undefined) {
    dc.originalAdd = Set.prototype.add;
  }

  Set.prototype.add = function (value) {
    // Call the original add method to ensure normal functionality
    dc.originalAdd?.call(this, value);
    if (window.dc.element) {
      const div = document.createElement("div");
      div.innerHTML = value;
      dc.element?.appendChild(div);
    }

    return this;
  };
}

function undoMonkeyPatch(window) {
  if (dc.originalAdd) {
    Set.prototype.add = dc.originalAdd;
  }
}

export default dc;
