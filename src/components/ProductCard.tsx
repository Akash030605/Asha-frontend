import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  isNew,
  isSale,
}: ProductCardProps) => {
  // 🔹 Replace with your WhatsApp number (country code, no +)
  const whatsappNumber = "918123456789";

  const whatsappUrl = useMemo(() => {
    const whatsappMessage = encodeURIComponent(
      `Hi, I want to buy this product:\n\n` +
        `Name: ${name}\n` +
        `Price: ₹${price.toLocaleString("en-IN")}\n` +
        `Category: ${category}`
    );
    return `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  }, [category, name, price, whatsappNumber]);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="group relative animate-fade-in">
      <Link to={`/product/${id}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted mb-4">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )}
            {isSale && (
              <Badge className="bg-primary text-primary-foreground">Sale</Badge>
            )}
          </div>

          {/* Image */}
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              if (e.currentTarget.src.includes("/placeholder.svg")) return;
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {category}
          </p>

          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>

          {/* Price + WhatsApp Button Row */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-primary">
              ₹{price.toLocaleString("en-IN")}
            </p>

            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-4 w-4" />
              Buy
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(ProductCard);