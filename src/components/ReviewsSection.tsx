import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Priya Mehta",
    rating: 5,
    text: "Asha Boutique created the most beautiful bridal lehenga for my wedding. The attention to detail and craftsmanship is unmatched!",
    location: "Mumbai"
  },
  {
    id: 2,
    name: "Ananya Singh",
    rating: 5,
    text: "I've been a regular customer for 3 years now. The custom tailoring service is exceptional. Asha understands exactly what I want!",
    location: "Delhi"
  },
  {
    id: 3,
    name: "Ritu Sharma",
    rating: 5,
    text: "The quality of fabrics and the intricate embroidery work is simply outstanding. Highly recommend for anyone looking for elegance.",
    location: "Bangalore"
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by hundreds of satisfied customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-background p-6 rounded-lg shadow-sm border border-border animate-fade-in"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">"{review.text}"</p>
              <div>
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
