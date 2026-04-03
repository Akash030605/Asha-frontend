import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroImg from "@/assets/background image/img.png";

gsap.registerPlugin(ScrollTrigger);

const TICKER = ["Sarees", "Lehengas", "Blouses", "Bridal Wear", "Custom Tailoring", "Gowns", "Suits", "Anarkalis"];

export default function Hero() {
  const wrapRef    = useRef<HTMLElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const maskRef    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(maskRef.current,
        { yPercent: 0 },
        { yPercent: -100, duration: 1.1, ease: "power4.inOut" }
      )
      .fromTo(imgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 2, ease: "power2.out" },
        "-=0.9"
      )
      .fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.6 },
        "-=1.0"
      )
      .fromTo(contentRef.current?.querySelectorAll(".hero-line") ?? [],
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.8 },
        "-=0.7"
      )
      .fromTo(contentRef.current?.querySelectorAll(".hero-cta") ?? [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2"
      );

      gsap.to(imgRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, wrapRef);
    return () => {
      ctx.revert();
      if (maskRef.current) gsap.set(maskRef.current, { yPercent: -100 });
    };
  }, []);

  const repeated = [...TICKER, ...TICKER, ...TICKER];

  return (
    <section ref={wrapRef} className="relative w-full h-screen min-h-[640px] overflow-hidden bg-foreground">

      <div ref={imgRef} className="absolute inset-0">
        <img
          src={HeroImg}
          alt="Asha Boutique"
          className="w-full h-full object-cover opacity-70"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div ref={maskRef} className="absolute inset-0 bg-foreground z-20 pointer-events-none" />

      <div ref={lineRef} className="absolute top-16 left-0 right-0 z-20 h-px bg-white/10 pointer-events-none" />

      <div ref={contentRef} className="relative z-20 h-full flex flex-col justify-center px-5 md:px-10 lg:px-16 pt-16">
        <div className="max-w-4xl">

          <div className="overflow-hidden mb-6">
            <p className="hero-line text-[11px] font-sans tracking-[0.4em] uppercase text-white/40">
              Est. 2009 · Mumbai, India
            </p>
          </div>

          {["Timeless", "Elegance"].map((word, i) => (
            <div key={word} className="overflow-hidden">
              <h1 className={`hero-line font-serif font-bold text-white leading-[0.92] tracking-[-0.03em]
                text-[clamp(4rem,10vw,8.5rem)]
                ${i === 1 ? "text-white/25 -mt-1 md:-mt-2" : ""}`}>
                {word}
              </h1>
            </div>
          ))}

          <div className="overflow-hidden mt-2">
            <h1 className="hero-line font-serif font-bold text-white leading-[0.92] tracking-[-0.03em] text-[clamp(4rem,10vw,8.5rem)]">
              Crafted
              <span className="italic font-normal text-white/50 ml-4">for You</span>
            </h1>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="overflow-hidden">
              <p className="hero-cta text-white/55 text-sm leading-relaxed max-w-xs font-sans">
                Exquisite sarees, lehengas & bespoke tailoring — handcrafted with love.
              </p>
            </div>

            <div className="overflow-hidden">
              <Link
                to="/about"
                className="hero-cta inline-flex items-center gap-3 text-[11px] font-sans font-medium tracking-[0.28em] uppercase text-white/50 hover:text-white transition-colors duration-200"
              >
                <span className="block w-6 h-px bg-white/30" />
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 w-full h-1/2 bg-white/60 animate-[scroll-line_1.8s_ease-in-out_infinite]" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/30 backdrop-blur-sm py-2.5 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: "ticker 35s linear infinite" }}>
          {repeated.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-5 text-[10px] font-sans tracking-[0.28em] uppercase text-white/35">
              {item} <span className="text-white/15">·</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        @keyframes scroll-line { 0%,100% { transform: translateY(-100%) } 50% { transform: translateY(200%) } }
      `}</style>
    </section>
  );
}
