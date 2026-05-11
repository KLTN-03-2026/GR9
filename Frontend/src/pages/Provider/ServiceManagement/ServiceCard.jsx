import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { formatCurrencyVND } from "@/utils/formatPrice";

const fallbackImages = {
  HOTEL:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  TRANSPORT:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
  RESTAURANT:
    "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
  FOOD:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  ATTRACTION_TICKET:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  ACTIVITY:
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80",
  COMBO:
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  OTHER:
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80",
};
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const getPriceByType = (total = [], type) => {
  const match = total.find((item) => String(item.type).toUpperCase() === type);
  return Number(match?.price ?? 0);
};
const ServiceCard = ({ item, onEdit, onDelete }) => {
  const title = item.title || item.name || "Untitled Service";
  const category = item.category || item.type || "Service";
  const location = item.location || item.address || "Unknown location";

  const prices = [
    {
      label: "Người lớn",
      val: getPriceByType(item.total, "ADULT") || Number(item.price ?? 0),
    },
    {
      label: "Trẻ em",
      val: getPriceByType(item.total, "CHILD") || null,
    },
    {
      label: "Sơ sinh",
      val: getPriceByType(item.total, "INFANT") || null,
    },
  ].filter((p) => p.val !== null); 
  const status = item.status || "DRAFT";
  const getImageUrl = (imagePath) => {
    if (!imagePath) return fallbackImages[item.type] || fallbackImages.OTHER; 
    if (imagePath.startsWith("http")) return imagePath; 

    return `${API_BASE_URL}${imagePath}`;
  };
  const image = getImageUrl(item.image || item.imageUrl || item.images?.[0]?.imageUrl);
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border border-outline-variant/15 bg-surface-container-lowest py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Image Section */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
        />
        <Badge className="absolute right-3 top-3 border-none bg-surface-container-lowest/90 text-[10px] font-bold uppercase text-primary shadow-sm backdrop-blur-sm">
          {category}
        </Badge>
        <div className="absolute bottom-3 left-3">
          <Badge
            className={`${status === "ACTIVE" || status === "Active" ? "bg-primary text-primary-foreground" : "bg-surface-container-high text-on-surface-variant"} border-none text-[10px]`}
          >
            {status}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="mb-1 line-clamp-1 text-base font-bold text-on-surface transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-on-surface-variant">
            <MapPin className="w-3 h-3" /> {location}
          </p>
        </div>

        {/* Bảng giá được thiết kế lại */}
        <div className="mt-auto rounded-2xl border border-outline-variant/15 bg-surface-container-low p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
              Giá dịch vụ
            </span>
          </div>

          {/* Cố định chiều cao box này để các card đều nhau (ví dụ: tối đa 3 dòng ~ 60px) */}
          <div className="space-y-1.5 min-h-[60px] flex flex-col justify-center">
            {prices.map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">{p.label}</span>
                <span className="text-sm font-bold text-on-surface">
                  {formatCurrencyVND(p.val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-outline-variant/15 pt-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary"
            onClick={() => onEdit?.(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-on-surface-variant hover:bg-red-500/10 hover:text-red-500"
            onClick={() => onDelete?.(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
