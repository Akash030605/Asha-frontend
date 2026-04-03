import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "@/assets/hero-1.jpg";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 15,   suffix: "+", label: "Years of craft" },
  { value: 500,  suffix: "+", label: "Happy clients" },
  { value: 1000, suffix: "+", label: "Designs made" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const imgInner   = useRef<HTMLImageElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const statRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      gsap.fromTo(imgRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power4.inOut",
          scrollTrigger: { trigger: imgRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      gsap.fromTo(imgInner.current,
        { scale: 1.12 },
        {
          scale: 1, duration: 1.4, ease: "power2.out",
          scrollTrigger: { trigger: imgRef.current, start: "top 80%" },
        }
      );
      gsap.to(imgInner.current, {
        yPercent: 10, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      const lines = leftRef.current?.querySelectorAll(".abt-reveal") ?? [];
      gsap.fromTo(lines,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 78%", toggleActions: "play none none reverse" },
        }
      );

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { clipPath: "inset(0 0 100% 0)", opacity: 0 },
          {
            clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.6, ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
        const numEl = el.querySelector(".stat-val");
        const s = stats[i];
        const obj = { val: 0 };
        gsap.to(obj, {
          val: s.value, duration: 1.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => { if (numEl) numEl.textContent = Math.round(obj.val) + s.suffix; },
        });
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden" style={{ background: "hsl(30 14% 97%)" }}>
      <div className="grid md:grid-cols-2 min-h-[80vh]">

        <div ref={leftRef} className="flex flex-col justify-center container-pad py-20 md:py-28 order-2 md:order-1">

          <div className="abt-reveal flex items-center gap-3 mb-8">
            <span className="font-mono text-[10px]" style={{ color: "hsl(248 46% 40%)" }}>05</span>
            <span className="block w-8 h-px" style={{ background: "hsl(248 46% 40%)" }} />
            <span className="text-[10px] tracking-[0.32em] uppercase font-sans" style={{ color: "hsl(248 46% 40%)" }}>Our Story</span>
          </div>

          <h2
            className="abt-reveal font-serif font-bold mb-6"
            style={{ fontSize: "clamp(2.2rem,4.5vw,4rem)", lineHeight: 1.02, letterSpacing: "-0.025em", color: "hsl(248 28% 9%)" }}
          >
            Meet<br />
            <span style={{ color: "hsl(310 68% 38%)" }}>Asha</span>
            <span style={{ color: "hsl(248 46% 40%)" }}> Sharma</span>
          </h2>

          <p className="abt-reveal text-[15px] leading-relaxed mb-4 max-w-md" style={{ color: "hsl(248 12% 46%)" }}>
            With over 15 years in the fashion industry, Asha Sharma founded her boutique with a singular vision — to bring timeless elegance to every woman's wardrobe.
          </p>
          <p className="abt-reveal text-[15px] leading-relaxed mb-10 max-w-md" style={{ color: "hsl(248 12% 46%)" }}>
            Every piece is crafted with meticulous attention to detail, using the finest fabrics and intricate handwork. Because every woman deserves to feel extraordinary.
          </p>

          <div className="grid grid-cols-3 gap-0 mb-10" style={{ border: "1px solid hsl(310 10% 87%)" }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                ref={(el) => { statRefs.current[i] = el; }}
                className="text-center py-6 px-3"
                style={{ borderRight: i < 2 ? "1px solid hsl(310 10% 87%)" : "none", clipPath: "inset(0 0 100% 0)", opacity: 0 }}
              >
                <p className="stat-val font-serif font-bold" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", color: i % 2 === 0 ? "hsl(310 68% 38%)" : "hsl(248 46% 40%)", lineHeight: 1 }}>
                  0{s.suffix}
                </p>
                <p className="text-[9px] tracking-[0.22em] uppercase mt-2" style={{ color: "hsl(248 12% 56%)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="abt-reveal inline-flex items-center gap-3 self-start text-[11px] font-medium tracking-[0.22em] uppercase transition-colors duration-200 pb-0.5"
            style={{ color: "hsl(248 28% 9%)", borderBottom: "1px solid hsl(310 10% 70%)" }}
          >
            <span className="block w-6 h-px" style={{ background: "hsl(310 68% 38%)" }} />
            Read Our Story
          </Link>
        </div>

        <div ref={imgRef} className="relative overflow-hidden min-h-[50vh] md:min-h-full order-1 md:order-2" style={{ clipPath: "inset(0 100% 0 0)" }}>
          <img
            ref={imgInner}
            src={heroImg}
            alt="Asha Sharma"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scale(1.12)" }}
          />
          <div className="absolute inset-0" style={{ background: "hsl(248 28% 9% / 0.25)" }} />

          <div className="absolute bottom-0 left-0 px-7 py-5" style={{ background: "hsl(30 14% 97%)" }}>
            <p className="text-[9px] tracking-[0.28em] uppercase" style={{ color: "hsl(248 12% 56%)" }}>Est.</p>
            <p className="font-serif font-bold" style={{ fontSize: "2.2rem", lineHeight: 1, color: "hsl(310 68% 38%)" }}>2009</p>
          </div>
        </div>
      </div>
    </section>
  );
}
