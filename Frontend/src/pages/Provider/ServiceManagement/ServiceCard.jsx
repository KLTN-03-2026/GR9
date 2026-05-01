import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash2 } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");
const ServiceCard = ({ item, onEdit, onDelete }) => {
  const title = item.title || item.name || "Untitled Service";
  const category = item.category || item.type || "Service";
  const location = item.location || item.address || "Unknown location";

  const prices = [
    {
      label: "Người lớn",
      val:
        item.total?.find((t) => t.type === "ADULT")?.price ?? item.price ?? 0,
    },
    {
      label: "Trẻ em",
      val: item.total?.find((t) => t.type === "CHILD")?.price ?? null,
    },
    {
      label: "Sơ sinh",
      val: item.total?.find((t) => t.type === "INFANT")?.price ?? null,
    },
  ].filter((p) => p.val !== null); 
  const status = item.status || "DRAFT";
  const getImageUrl = (imagePath) => {
    if (!imagePath) return fallbackImage; 
    if (imagePath.startsWith("http")) return imagePath; 

    return `${API_BASE_URL}${imagePath}`;
  };
  const image = getImageUrl(item.image);
  return (
    <Card className="group overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
        />
        <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-teal-700 border-none font-bold text-[10px] uppercase shadow-sm">
          {category}
        </Badge>
        <div className="absolute bottom-3 left-3">
          <Badge
            className={`${status === "Active" ? "bg-teal-500" : "bg-slate-500"} text-white border-none text-[10px]`}
          >
            {status}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {location}
          </p>
        </div>

        {/* Bảng giá được thiết kế lại */}
        <div className="mt-auto bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Giá dịch vụ
            </span>
          </div>

          {/* Cố định chiều cao box này để các card đều nhau (ví dụ: tối đa 3 dòng ~ 60px) */}
          <div className="space-y-1.5 min-h-[60px] flex flex-col justify-center">
            {prices.map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs text-slate-500">{p.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-900">
                    {p.val.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">
                    VNĐ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-teal-50 hover:text-teal-600 text-slate-400"
            onClick={() => onEdit?.(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500 text-slate-400"
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
