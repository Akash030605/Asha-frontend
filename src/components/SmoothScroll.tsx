import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { initLenis, destroyLenis, getLenis } from "@/lib/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedRefresh = useCallback((delay = 100) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => ScrollTrigger.refresh(), delay);
  }, []);

  useEffect(() => {
    initLenis();

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 800);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    let prevHeight = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (h !== prevHeight) {
        prevHeight = h;
        debouncedRefresh(150);
      }
    });
    ro.observe(document.body);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      window.removeEventListener("load", onLoad);
      ro.disconnect();
      destroyLenis();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [debouncedRefresh]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true });

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.clearScrollMemory("manual");
      ScrollTrigger.refresh(true);
    });

    const rt1 = setTimeout(() => ScrollTrigger.refresh(), 150);
    const rt2 = setTimeout(() => ScrollTrigger.refresh(), 600);
    const rt3 = setTimeout(() => ScrollTrigger.refresh(), 1400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt1);
      clearTimeout(rt2);
      clearTimeout(rt3);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (isTouch()) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
    };

    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {!isTouch() && <div id="cursor-dot"  ref={dotRef}  />}
      {!isTouch() && <div id="cursor-ring" ref={ringRef} />}
      {children}
    </>
  );
}
