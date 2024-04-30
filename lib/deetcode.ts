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
  static originalSet?: SetConstructor;

  constructor(...args: any) {
    super(...args);
    this.id = crypto.randomUUID();
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

  private renderValue(value: any) {
    if (window.dc.element) {
      const div = document.createElement("div");
      div.dataset.id = this.id;
      div.innerHTML = value;
      dc.element?.appendChild(div);
    }
  }

  private removeValue(value: any) {
    if (window.dc.element) {
      const div = document.querySelector(`[data-id="${this.id}"]`);
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
