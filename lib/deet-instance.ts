"use client";

import { DeetEngine } from "./deetcode";

let deetEngine: DeetEngine;

export function setInstance(instance: DeetEngine) {
  deetEngine = instance;
}

export function getInstance() {
  return deetEngine;
}
