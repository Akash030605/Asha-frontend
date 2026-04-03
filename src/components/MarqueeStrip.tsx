import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const words = [
  "Handcrafted", "Timeless", "Bespoke",
  "Artisan", "Couture", "Traditional",
  "Refined", "Exquisite", "Luxurious",
];

interface Props {
  direction?: "left" | "right";
  dark?: boolean;
}

export default function MarqueeStrip({ direction = "left", dark = false }: Props) {
  const trackRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const tweenRef   = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalW = track.scrollWidth / 2;
    const dir = direction === "left" ? -1 : 1;

    tweenRef.current = gsap.to(track, {
      x: dir * totalW,
      duration: 28,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => {
          const v = parseFloat(x) * dir;
          return (((v % totalW) + totalW) % totalW) * dir + "px";
        },
      },
    });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 1800, 4);
        if (tweenRef.current) {
          gsap.to(tweenRef.current, { timeScale: 1 + v, duration: 0.4 });
          gsap.to(tweenRef.current, { timeScale: 1, duration: 1.2, delay: 0.4 });
        }
      },
    });

    return () => { tweenRef.current?.kill(); st.kill(); };
  }, [direction]);

  const items = [...words, ...words, ...words];

  return (
    <div
      ref={sectionRef}
      className="py-3.5 overflow-hidden border-y"
      style={dark
        ? { background: "hsl(248 28% 9%)", borderColor: "hsl(0 0% 100% / 0.07)" }
        : { background: "hsl(310 28% 95%)", borderColor: "hsl(310 10% 87%)" }
      }
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {items.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-7 text-[10px] font-sans font-medium tracking-[0.32em] uppercase"
            style={dark
              ? { color: "hsl(0 0% 100% / 0.22)" }
              : { color: i % 2 === 0 ? "hsl(310 68% 38% / 0.55)" : "hsl(248 46% 40% / 0.55)" }
            }
          >
            {w}
            <span style={dark ? { color: "hsl(0 0% 100% / 0.08)" } : { color: "hsl(310 10% 80%)" }}>—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
