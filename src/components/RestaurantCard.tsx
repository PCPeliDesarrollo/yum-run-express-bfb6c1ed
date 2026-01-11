import { Star, Clock } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  discount?: string;
}

const RestaurantCard = ({
  name,
  image,
  rating,
  deliveryTime,
  cuisine,
  discount,
}: RestaurantCardProps) => {
  return (
    <div className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <div className="absolute top-3 left-3 bg-accent px-3 py-1 rounded-full text-xs font-bold text-accent-foreground">
            {discount}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{cuisine}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-secondary-foreground">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="font-semibold">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
