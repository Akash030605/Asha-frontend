import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  { id: 1, name: "Priya Mehta",   city: "Mumbai",    text: "The most beautiful piece I've ever owned. Exquisite attention to detail and truly personal service." },
  { id: 2, name: "Ananya Singh",  city: "Delhi",     text: "Three years, many occasions. The quality is consistently exceptional and the experience is always personal." },
  { id: 3, name: "Ritu Sharma",   city: "Bangalore", text: "Outstanding craftsmanship and quality of material. I recommend Asha Boutique to everyone I know." },
  { id: 4, name: "Kavya Reddy",   city: "Hyderabad", text: "Wore my piece to a family celebration. Received compliments from every single guest. Stunning work." },
];

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        ".rv-hdr",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Cards stagger in
      const cards = gridRef.current?.querySelectorAll(".review-card") || [];
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20 cursor-default">
          <div className="rv-hdr flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-6" style={{ background: "hsl(310 10% 87%)" }} />
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: "hsl(248 12% 46%)" }}>
              Testimonials
            </span>
            <span className="h-px w-6" style={{ background: "hsl(310 10% 87%)" }} />
          </div>
          <h2 className="rv-hdr font-serif font-bold tracking-tight mb-5" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "hsl(248 28% 9%)", lineHeight: 1.05 }}>
            Client <span className="italic font-normal" style={{ color: "hsl(310 68% 38%)" }}>Stories</span>
          </h2>
          <p className="rv-hdr text-[14px] leading-relaxed max-w-md mx-auto" style={{ color: "hsl(248 12% 46%)" }}>
            Words from the women who inspire our creations. We measure our success by the confidence you feel.
          </p>
        </div>

        {/* Reviews Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 gap-px bg-black/5 p-px">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="review-card group relative p-10 md:p-14 bg-white transition-colors duration-500 hover:bg-[hsl(30_18%_99%)] flex flex-col justify-between min-h-[280px]"
            >
              {/* Top accent line sliding in on hover */}
              <div 
                className="absolute top-0 left-0 h-[2px] w-0 bg-[hsl(310_68%_38%)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
              />

              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-[14px] h-[14px] fill-current" style={{ color: "hsl(36 62% 44%)" }} />
                  ))}
                </div>
                {/* Large aesthetic quote mark */}
                <span className="block font-serif text-[4rem] leading-none h-6 select-none -translate-x-1" style={{ color: "hsl(310 10% 92%)" }}>
                  "
                </span>
                <p className="font-serif text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.8] mt-4" style={{ color: "hsl(248 28% 9%)" }}>
                  {r.text}
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mt-12 pt-6 border-t" style={{ borderColor: "hsl(310 10% 94%)" }}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm transition-colors duration-500 group-hover:bg-[hsl(310_68%_38%)] group-hover:text-white"
                  style={{ 
                    background: "hsl(30 18% 97%)", 
                    color: "hsl(248 28% 9%)",
                    border: "1px solid hsl(310 10% 90%)"
                  }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[13px] tracking-wide" style={{ color: "hsl(248 28% 9%)" }}>
                    {r.name}
                  </p>
                  <p className="text-[9px] tracking-[0.2em] uppercase mt-1 font-medium" style={{ color: "hsl(248 12% 46%)" }}>
                    {r.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
