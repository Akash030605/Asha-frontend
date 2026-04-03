import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cols = [
  {
    heading: "Explore",
    links: [
      { label: "Shop All",    href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "About Us",    href: "/about" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "My Orders",   href: "/my-orders" },
      { label: "Admin Login", href: "/admin-login" },
    ],
  },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current.querySelectorAll(".ft-reveal"),
      { yPercent: 25, opacity: 0 },
      {
        yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%" },
      }
    );
  }, []);

  return (
    <footer ref={ref} className="bg-foreground text-white">
      <div className="container-pad pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="ft-reveal lg:col-span-1">
            <div className="mb-5">
              <span className="font-serif text-xl font-bold text-white">Asha</span>
              <span className="font-sans text-[10px] tracking-[0.22em] uppercase ml-2 text-white/35">Boutique</span>
            </div>
            <p className="text-[13px] text-white/45 leading-relaxed mb-7 max-w-[220px]">
              Crafting timeless elegance through exquisite fashion and bespoke tailoring since 2009.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors duration-200">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map((col) => (
            <div key={col.heading} className="ft-reveal">
              <h4 className="text-[9px] tracking-[0.35em] uppercase text-white/30 mb-5 font-sans">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="text-[13px] text-white/50 hover:text-white transition-colors duration-200 tracking-wide">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="ft-reveal">
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-white/30 mb-5 font-sans">Contact</h4>
            <ul className="space-y-3 text-[13px] text-white/50">
              <li className="flex items-start gap-3"><MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/25" /><span>Mumbai, India</span></li>
              <li className="flex items-center gap-3"><Phone className="w-3.5 h-3.5 flex-shrink-0 text-white/25" /><span>+91 98765 43210</span></li>
              <li className="flex items-center gap-3"><Mail className="w-3.5 h-3.5 flex-shrink-0 text-white/25" /><span>hello@ashaboutique.in</span></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="ft-reveal border-t border-white/10 pt-10 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-serif text-lg font-semibold mb-1">Stay in the loop</p>
              <p className="text-[13px] text-white/40">New arrivals, exclusive offers & style notes.</p>
            </div>
            <div className="flex gap-0 max-w-sm w-full">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/[0.06] border border-white/10 px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
              />
              <button className="px-5 py-2.5 bg-primary text-white text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-primary-light transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="ft-reveal flex flex-col md:flex-row justify-between items-center gap-3 border-t border-white/8 pt-7">
          <p className="text-[11px] text-white/25 tracking-wide">© {new Date().getFullYear()} Asha Boutique. All rights reserved.</p>
          <p className="text-[11px] text-white/15 tracking-wide">Handcrafted with care in India</p>
        </div>
      </div>
    </footer>
  );
}
