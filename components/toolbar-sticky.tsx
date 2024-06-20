"use client";

import { useEffect, useRef } from "react";
import Toolbar from "./toolbar";

export default function ToolbarSticky() {
  const ref = useRef<HTMLElement | null>(null);
  const sticky = useRef(0);
  const stickyMax = useRef(0);

  function handleScroll() {
    if (!ref) {
      return;
    }
    const div = ref.current;
    sticky.current = div!.offsetTop;
    stickyMax.current = Math.max(stickyMax.current, sticky.current);
    if (window.scrollY < stickyMax.current) {
      div!.classList.remove("fixed", "bg-muted", "z-10", "top-0", "w-full");
    } else if (window.scrollY > sticky.current) {
      div!.classList.add("fixed", "bg-muted", "z-10", "top-0", "w-full");
    }
  }

  useEffect(() => {
    window.onscroll = handleScroll;
    return () => {
      window.onscroll = null;
    };
  }, []);
  return (
    //@ts-ignore
    <div ref={ref} className="px-5">
      <Toolbar />
    </div>
  );
}
