import { Star, Clock, Bike } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  cuisine: string;
  discount?: string;
}

const RestaurantCard = ({
  name,
  image,
  rating,
  deliveryTime,
  deliveryFee,
  cuisine,
  discount,
}: RestaurantCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:scale-[1.02]">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount && (
            <div className="absolute top-3 left-3 gradient-primary px-3 py-1 rounded-full text-xs font-bold text-primary-foreground">
              {discount}
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-bold text-foreground">{rating}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{cuisine}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bike className="w-4 h-4" />
              <span>{deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
