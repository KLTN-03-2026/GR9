import React, { useEffect, useMemo, useState } from "react";
import ServiceFilter from "./ServiceFilter";
import ServiceCard from "./ServiceCard";
import { getServices } from "@/services/api/service";
import { toast } from "react-hot-toast";

const typeLabels = {
  HOTEL: "Accommodation",
  TRANSPORT: "Transport",
  FOOD: "Dining",
  ATTRACTION_TICKET: "Attraction",
  TOUR_GUIDE: "Guide",
  COMBO: "Combo",
  OTHER: "Other",
};

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await getServices();
        setServices(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to load services", err);
        toast.error(
          err?.response?.data?.message || "Unable to load services at the moment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesCategory = category === "All" || item.type === category;
      const matchesSearch =
        !search ||
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.address?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, category, search]);

  const handleAdd = () => {
    toast("Tính năng tạo dịch vụ sẽ được bổ sung sau.");
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <ServiceFilter
          category={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
          onAdd={handleAdd}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-slate-500">
              Đang tải dịch vụ...
            </div>
          ) : filteredServices.length ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service._id || service.id}
                item={{
                  ...service,
                  title: service.name,
                  category:
                    typeLabels[service.type] || service.type || "Service",
                  location: service.address || "No address",
                  price: service.total?.[0]?.price ?? 0,
                  priceLabel: "Starting from",
                  status: service.status || "DRAFT",
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500">
              Không có dịch vụ nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ServiceManagement;
