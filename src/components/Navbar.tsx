import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home",        href: "/" },
  { label: "Shop",        href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About",       href: "/about" },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location   = useLocation();
  const menuRef    = useRef<HTMLDivElement>(null);
  const isHome     = location.pathname === "/";
  const didMount   = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    gsap.killTweensOf(el);

    if (menuOpen) {
      gsap.set(el, { display: "flex", pointerEvents: "auto" });
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.65, ease: "power4.inOut" }
      );
      gsap.fromTo(
        el.querySelectorAll(".menu-link, .menu-extra"),
        { yPercent: 80, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.5, delay: 0.28, ease: "power3.out" }
      );
    } else {
      gsap.set(el, { pointerEvents: "none" });
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power4.inOut",
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, [menuOpen]);

  const transparent = isHome && !scrolled && !menuOpen;
  const navBg = menuOpen
    ? "bg-transparent border-transparent"
    : transparent
      ? "bg-transparent border-transparent"
      : "bg-white/95 backdrop-blur-sm border-b border-border";

  const logoWhite = transparent || menuOpen;

  return (
    <>
      <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", navBg)}>
        <div className="flex items-center justify-between h-14 md:h-16 px-5 md:px-10 lg:px-16">

          <Link to="/" className="relative z-[60] flex items-baseline gap-1.5 flex-shrink-0">
            <span className={cn(
              "font-serif text-xl font-bold tracking-tight leading-none transition-colors duration-300",
              logoWhite ? "text-white" : "text-primary"
            )}>
              Asha
            </span>
            <span className={cn(
              "font-sans text-[10px] font-medium tracking-[0.22em] uppercase transition-colors duration-300",
              logoWhite ? "text-white/55" : "text-secondary"
            )}>
              Boutique
            </span>
          </Link>

          <div className={cn(
            "hidden md:flex items-center gap-9 transition-opacity duration-300",
            menuOpen && "opacity-0 pointer-events-none"
          )}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={cn(
                  "relative text-[11px] font-bold tracking-[0.2em] uppercase group pb-1 transition-colors duration-300",
                  transparent
                    ? "text-white/80 hover:text-white"
                    : "text-foreground/80 hover:text-primary",
                  location.pathname === l.href && (transparent ? "text-white" : "text-primary")
                )}
              >
                {l.label}
                <span className={cn(
                  "absolute bottom-0 left-0 h-px w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300",
                  transparent ? "bg-white" : "bg-primary"
                )} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative z-[60] w-8 h-8 flex items-center justify-center"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={cn(
                "absolute block h-[1.5px] transition-all duration-350 origin-center",
                menuOpen
                  ? "w-5 rotate-45 bg-white"
                  : cn("w-5", transparent ? "bg-white -translate-y-[5px]" : "bg-foreground -translate-y-[5px]")
              )} />
              <span className={cn(
                "absolute block h-[1.5px] transition-all duration-250",
                menuOpen
                  ? "w-0 opacity-0 bg-white"
                  : cn("w-5", transparent ? "bg-white" : "bg-foreground")
              )} />
              <span className={cn(
                "absolute block h-[1.5px] transition-all duration-350 origin-center",
                menuOpen
                  ? "w-5 -rotate-45 bg-white"
                  : cn("w-5", transparent ? "bg-white translate-y-[5px]" : "bg-foreground translate-y-[5px]")
              )} />
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={menuRef}
        style={{ display: "none", clipPath: "inset(0 0 100% 0)", pointerEvents: "none" }}
        className="fixed inset-0 z-[55] bg-foreground flex-col justify-center items-start px-10 md:px-24"
      >
        <nav className="flex flex-col gap-1 mb-10">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMenuOpen(false)}
              className="menu-link group flex items-baseline gap-5"
            >
              <span className="text-[10px] text-white/20 font-mono w-5 flex-shrink-0 mt-1">
                0{i + 1}
              </span>
              <span className="font-serif text-[clamp(2rem,5.5vw,4.5rem)] font-bold text-white leading-tight group-hover:text-primary transition-colors duration-200">
                {l.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="menu-extra h-px w-16 bg-white/15 mb-6" />

        <Link
          to="/about"
          onClick={() => setMenuOpen(false)}
          className="menu-extra inline-flex items-center gap-3 text-white/35 text-[10px] tracking-[0.3em] uppercase hover:text-white transition-colors duration-200"
        >
          <span className="block w-5 h-px bg-white/25" />
          Our Story
        </Link>
      </div>
    </>
  );
}
