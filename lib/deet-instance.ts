"use client";

import { DeetCode } from "./deetcode";

let dc: DeetCode;

export function setInstance(instance: DeetCode) {
  dc = instance;
}

export function getInstance() {
  return dc;
}
