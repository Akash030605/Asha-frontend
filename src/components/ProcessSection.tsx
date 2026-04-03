import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Headphones, Palette, Scissors, PackageCheck, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "We Listen",
    subtitle: "Consultation",
    text: "A personal session dedicated entirely to understanding your vision, your occasion, and what makes you feel your best.",
    icon: Headphones,
    accent: "310 68% 38%",
    accentLight: "310 68% 38% / 0.08",
  },
  {
    num: "02",
    title: "We Design",
    subtitle: "Conceptualise",
    text: "Our team translates your ideas into a singular concept — selecting materials and silhouettes with precision and intent.",
    icon: Palette,
    accent: "248 46% 40%",
    accentLight: "248 46% 40% / 0.08",
  },
  {
    num: "03",
    title: "We Create",
    subtitle: "Craftsmanship",
    text: "Every detail is attended to by skilled hands. The result is not a product — it is a piece made specifically for you.",
    icon: Scissors,
    accent: "36 62% 44%",
    accentLight: "36 62% 44% / 0.08",
  },
  {
    num: "04",
    title: "We Deliver",
    subtitle: "Perfection",
    text: "Your order arrives perfectly presented, inspected to our exacting standards, and ready to make an impression.",
    icon: PackageCheck,
    accent: "310 68% 38%",
    accentLight: "310 68% 38% / 0.08",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !wrapRef.current) return;

    const ctx = gsap.context(() => {

      gsap.fromTo(".proc-hdr",
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true },
        }
      );

      const track = trackRef.current!;
      const getScrollAmount = () => track.scrollWidth - wrapRef.current!.offsetWidth;

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 8%",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 8%",
            end: () => `+=${getScrollAmount()}`,
            scrub: 0.8,
          },
        });
      }

      track.querySelectorAll(".proc-card").forEach((card, i) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.9, ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top ${85 - i * 6}%`,
              once: true,
            },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden" style={{ background: "hsl(30 14% 97%)" }}>
      <div className="container-pad pt-16 md:pt-20 pb-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="proc-hdr flex items-center gap-3 mb-4 md:mb-5">
              <span className="font-mono text-[10px]" style={{ color: "hsl(248 46% 40%)" }}>04</span>
              <span className="block w-8 h-px" style={{ background: "hsl(248 46% 40%)" }} />
              <span className="text-[10px] tracking-[0.32em] uppercase font-sans" style={{ color: "hsl(248 46% 40%)" }}>
                The Process
              </span>
            </div>
            <h2
              className="proc-hdr font-serif font-bold tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.02, color: "hsl(248 28% 9%)" }}
            >
              How It{" "}
              <span className="italic font-normal" style={{ color: "hsl(310 68% 38%)" }}>Works</span>
            </h2>
          </div>
          <p className="proc-hdr text-[13px] leading-relaxed max-w-xs" style={{ color: "hsl(248 12% 46%)" }}>
            Four steps from dream to reality — every detail crafted with intention.
          </p>
        </div>

        <div className="proc-hdr h-px w-full relative" style={{ background: "hsl(310 10% 89%)" }}>
          <div
            ref={progressRef}
            className="absolute inset-0 origin-left"
            style={{
              background: "linear-gradient(90deg, hsl(310 68% 38%), hsl(248 46% 40%))",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>

      <div ref={wrapRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-7 md:gap-9 pl-5 md:pl-10 lg:pl-16 py-6 md:py-10 will-change-transform"
          style={{ width: "max-content" }}
        >
          {steps.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.num}
                className="proc-card group relative flex-shrink-0"
                style={{ width: "clamp(300px, 34vw, 420px)", opacity: 0 }}
              >
                <div
                  className="relative h-full flex flex-col overflow-hidden transition-all duration-500 group-hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]"
                  style={{ background: "hsl(30 18% 99%)", border: "1px solid hsl(310 10% 87%)" }}
                >
                  <div className="h-[3px] w-full" style={{ background: `hsl(${s.accent})` }} />

                  <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col flex-1">

                    <div
                      className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-6 md:mb-8 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[-3deg]"
                      style={{
                        background: `hsl(${s.accentLight})`,
                        border: `1px solid hsl(${s.accent} / 0.12)`,
                      }}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: `hsl(${s.accent})` }} />
                    </div>

                    <div className="flex items-center gap-2.5 mb-3 md:mb-4">
                      <span className="font-mono text-[10px] font-semibold" style={{ color: `hsl(${s.accent})` }}>
                        {s.num}
                      </span>
                      <span className="h-px w-4" style={{ background: `hsl(${s.accent} / 0.3)` }} />
                      <span
                        className="text-[9px] tracking-[0.22em] uppercase font-medium"
                        style={{ color: `hsl(${s.accent} / 0.7)` }}
                      >
                        {s.subtitle}
                      </span>
                    </div>

                    <h3
                      className="font-serif font-bold mb-3 md:mb-4 tracking-tight transition-colors duration-300 group-hover:text-[hsl(310_68%_38%)]"
                      style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.7rem)", color: "hsl(248 28% 9%)", lineHeight: 1.15 }}
                    >
                      {s.title}
                    </h3>

                    <p className="text-[13px] leading-[1.8] flex-1" style={{ color: "hsl(248 12% 46%)" }}>
                      {s.text}
                    </p>

                    <div className="mt-6 md:mt-8 flex items-center gap-3">
                      <span
                        className="w-0 group-hover:w-8 h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ background: `hsl(${s.accent})` }}
                      />
                      <ArrowRight
                        className="w-4 h-4 transition-all duration-300 opacity-40 group-hover:opacity-100 group-hover:translate-x-1"
                        style={{ color: `hsl(${s.accent})` }}
                      />
                    </div>
                  </div>

                  <span
                    className="absolute bottom-2 right-4 font-serif font-bold select-none pointer-events-none leading-none transition-opacity duration-500 group-hover:opacity-[0.06]"
                    style={{
                      fontSize: "clamp(6rem, 12vw, 10rem)",
                      color: "hsl(248 10% 93%)",
                      letterSpacing: "-0.04em",
                      opacity: 0.4,
                    }}
                  >
                    {s.num}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="flex-shrink-0" style={{ width: "min(30vw, 300px)" }} />
        </div>
      </div>

      <div className="container-pad pb-6">
        <div className="h-px w-full" style={{ background: "hsl(310 10% 87%)" }} />
      </div>
    </section>
  );
}
