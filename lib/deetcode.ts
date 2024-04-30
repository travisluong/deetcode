"use client";

interface DeetCode {
  DeetSet: typeof DeetSet;
  configure: (config: { selector: string }) => void;
  element?: Element | null;
}

declare global {
  interface Window {
    dc: DeetCode;
    DeetSet: typeof DeetSet;
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
    div.dataset.id = this.id;
    div.style.display = "flex";
    div.style.alignContent = "flex-start";
    div.style.flexWrap = "wrap";
    div.style.padding = "5px";
    div.style.border = "2px solid lightgray";
    div.style.margin = "5px";
    div.style.aspectRatio = "1 / 1";
    this.container = div;
    window.dc.element?.appendChild(div);
  }

  private renderValue(value: any) {
    if (window.dc.element) {
      const div = document.createElement("div");
      div.style.backgroundColor = "lightgray";
      div.style.padding = "5px";
      div.style.margin = "5px";
      div.style.color = "black";
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

const dc: DeetCode = {
  DeetSet: DeetSet,
  configure,
};

function configure(config: { selector: string }) {
  dc.element = document.querySelector(config.selector);
}

export default dc;
