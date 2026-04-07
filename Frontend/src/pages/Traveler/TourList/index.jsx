import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TRAVELER_TOURS = [
  {
    id: "da-nang-coastal",
    category: "Culture",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
    location: "Da Nang, Vietnam",
    title: "Da Nang 3D2N: Coastal Elegance",
    price: "$289",
    rating: 4.9,
    reviews: 128,
    duration: "3 Days",
    group: "Max 12",
  },
  {
    id: "hoi-an-ancient-soul",
    category: "Culture",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
    location: "Hoi An, Vietnam",
    title: "Hoi An Ancient Soul Day Trip",
    price: "$148",
    rating: 4.8,
    reviews: 96,
    duration: "1 Day",
    group: "Max 8",
  },
  {
    id: "emerald-waters",
    category: "Luxury",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
    location: "Ha Long Bay, Vietnam",
    title: "Emerald Waters & Ancient Karsts",
    price: "$1,249",
    rating: 4.9,
    reviews: 1200,
    duration: "5 Days",
    group: "Max 16",
  },
  {
    id: "azure-horizon",
    category: "Luxury",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
    location: "Santorini, Greece",
    title: "Azure Horizon Expedition",
    price: "$1,060",
    rating: 4.9,
    reviews: 215,
    duration: "7 Days",
    group: "Max 6",
  },
];

export default function TourList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const tours = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = [...TRAVELER_TOURS];

    if (q) {
      result = result.filter((t) => {
        const haystack = [
          t.title,
          t.location,
          t.category,
          t.duration,
          t.group,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    if (sortBy === "popular") {
      // Rough heuristic: rating + review count
      result.sort((a, b) => b.rating * 10000 + b.reviews - (a.rating * 10000 + a.reviews));
    } else if (sortBy === "priceLow") {
      const toNumber = (price) => {
        const clean = String(price).replace(/[^0-9.]/g, "");
        const n = Number(clean);
        return Number.isFinite(n) ? n : 0;
      };
      result.sort((a, b) => toNumber(a.price) - toNumber(b.price));
    } else if (sortBy === "ratingHigh") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, sortBy]);

  return (
    <main className="mx-auto w-full max-w-[1400px] p-6 md:p-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">
            Curated Tours
          </h1>
          <p className="mt-3 text-on-surface-variant max-w-lg leading-relaxed">
            Discover handcrafted experiences designed by our travel experts and AI
            planning engine.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="w-full md:w-[320px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tours..."
              className="h-11 rounded-full bg-white/95 border-outline-variant/20 text-slate-900 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-on-surface-variant">
              Sort by:
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-auto px-4 py-2 rounded-xl bg-white text-slate-900 shadow-sm ring-1 ring-inset ring-outline-variant/10 w-[250px]">
                <SelectValue placeholder="Most Popular" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="ratingHigh">Top Rated</SelectItem>
                <SelectItem value="priceLow">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <article
            key={tour.id}
            className="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-[4/5] overflow-hidden relative">
              <img
                alt={tour.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                src={tour.image}
              />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-on-surface text-xs font-bold rounded-full">
                  {tour.category}
                </span>
              </div>

              <button
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-error transition-colors"
                type="button"
                aria-label={`Favorite ${tour.title}`}
              >
                <span className="material-symbols-outlined">favorite</span>
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 text-white/90 text-xs font-medium mb-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  {tour.location}
                </div>
                <h3 className="text-xl font-bold text-white">{tour.title}</h3>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-2xl font-extrabold text-primary">
                    {tour.price}
                  </span>
                  <span className="text-xs text-on-surface-variant">/ person</span>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-amber-500 text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                  <span className="text-sm font-bold">{tour.rating}</span>
                  <span className="text-xs text-on-surface-variant">
                    ({tour.reviews})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8 text-on-surface-variant">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>
                  {tour.duration}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">
                    group
                  </span>
                  {tour.group}
                </div>
              </div>

              <Button
                asChild
                className="w-full py-3 bg-secondary-container text-on-secondary-container font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all active:scale-95"
              >
                <Link to={`/traveler/tour-detail/${tour.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </article>
        ))}

        <article className="group relative bg-primary-container rounded-xl overflow-hidden shadow-lg p-8 flex flex-col justify-center text-on-primary-container">
          <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <span className="material-symbols-outlined text-5xl mb-6">
              auto_awesome
            </span>
            <h3 className="text-2xl font-extrabold mb-4 leading-tight">
              Can't find your perfect match?
            </h3>
            <p className="text-on-primary-container/80 text-sm mb-8 leading-relaxed">
              Let our AI Concierge design a bespoke itinerary based on your unique
              travel style, interests, and budget.
            </p>
            <Button
              asChild
              className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Link to="/traveler/ai-plan">Build Custom Trip</Link>
            </Button>
          </div>
        </article>
      </div>

      <div className="mt-20 flex flex-col items-center gap-6">
        <Button className="px-10 py-4 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-outline-variant/20 transition-colors">
          Show More Adventures
        </Button>

        <div className="flex items-center gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold" type="button">
            1
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface font-semibold" type="button">
            2
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface font-semibold" type="button">
            3
          </button>
          <span className="px-2 text-on-surface-variant">...</span>
          <button className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface font-semibold" type="button">
            12
          </button>
        </div>
      </div>
    </main>
  );
}

