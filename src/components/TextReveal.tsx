import { useEffect, useRef, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  triggerStart?: string;
  split?: "chars" | "words";
}

export default function TextReveal({
  children,
  as: Tag = "p",
  className = "",
  delay = 0,
  triggerStart = "top 88%",
  split = "words",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const units = split === "chars"
      ? children.split("")
      : children.split(" ");

    el.innerHTML = units
      .map((u) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;${split === "words" ? "margin-right:0.22em" : ""}">`
        + `<span class="tr-inner" style="display:inline-block">${u === " " ? "&nbsp;" : u}</span>`
        + `</span>`
      )
      .join(split === "chars" ? "" : "");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".tr-inner"),
        { yPercent: 110, opacity: 0, rotateZ: split === "chars" ? 4 : 0 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          stagger: split === "chars" ? 0.028 : 0.06,
          duration: split === "chars" ? 0.65 : 0.75,
          delay,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: triggerStart },
        }
      );
    }, el);

    return () => { ctx.revert(); el.innerHTML = children; };
  }, [children, delay, split, triggerStart]);

  return <Tag ref={ref} className={className}>{children}</Tag>;
}
