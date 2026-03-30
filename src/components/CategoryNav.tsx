import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Sarees", slug: "sarees" },
  { name: "Lehengas", slug: "lehengas" },
  { name: "Blouses", slug: "blouses" },
  { name: "Gowns", slug: "gowns" },
  { name: "Bridal", slug: "bridal" },
  { name: "Suits", slug: "suits" },
];

const CategoryNav = () => {
  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className={cn(
                "px-6 py-2.5 rounded-full border border-border",
                "text-sm font-medium whitespace-nowrap",
                "hover:border-primary hover:text-primary hover:bg-primary/5",
                "transition-all duration-200"
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
