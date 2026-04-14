import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash2 } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";

const ServiceCard = ({ item, onEdit, onDelete }) => {
  const title = item.title || item.name || "Untitled Service";
  const category = item.category || item.type || "Service";
  const location = item.location || item.address || "Unknown location";
  const price = item.price ?? item.total?.[0]?.price ?? 0;
  const priceLabel = item.priceLabel || "Starting from";
  const status = item.status || "DRAFT";
  const image = item.image || fallbackImage;

  return (
    <Card className="group overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all flex flex-col">
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
        />
        <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-teal-700 hover:bg-white/90 border-none font-bold text-[10px] uppercase">
          {category}
        </Badge>
        <div className="absolute bottom-4 left-4">
          <Badge
            variant={status === "Active" ? "default" : "secondary"}
            className={`${
              status === "Active" ? "bg-teal-500" : "bg-slate-400"
            } text-white border-none`}
          >
            {status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {location}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {priceLabel}
            </p>
            <p className="text-lg font-extrabold text-slate-900">
              {price.toLocaleString()}{" "}
              <span className="text-xs font-medium">VNĐ</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-teal-50 hover:text-primary"
              onClick={() => onEdit?.(item)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500"
              onClick={() => onDelete?.(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
