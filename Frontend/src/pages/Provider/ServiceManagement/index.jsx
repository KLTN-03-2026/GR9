import React, { useEffect, useMemo, useState } from "react";
import ServiceFilter from "./ServiceFilter";
import ServiceCard from "./ServiceCard";
import DialogCreateService from "./DialogCreateService";
import DialogEditService from "./DialogEditService";
import DialogDeleteService from "./DialogDeleteService";
import { getServices } from "@/services/api/service";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageHero from "@/components/shared/page-hero";
import { CardGridSkeleton } from "@/components/shared/page-skeletons";
import { useSearchParams } from "react-router-dom";

const typeLabels = {
  HOTEL: "Accommodation",
  TRANSPORT: "Transport",
  RESTAURANT: "Restaurant",
  ACTIVITY: "Activity",
  FOOD: "Food",
  ATTRACTION_TICKET: "Attraction Ticket",
  COMBO: "Combo",
  OTHER: "Other",
};

const ServiceManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await getServices();
      setServices(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load services", err);
      toast.error(
        err?.response?.data?.message ||
          "Unable to load services at the moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch((current) => (current === urlSearch ? current : urlSearch));
  }, [searchParams]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        if (search.trim()) {
          next.set("search", search.trim());
        } else {
          next.delete("search");
        }
        return next;
      }, { replace: true });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search, setSearchParams]);

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesCategory = category === "All" || item.type === category;
      const searchText = debouncedSearch.toLowerCase();
      const matchesSearch =
        !searchText ||
        item.name?.toLowerCase().includes(searchText) ||
        item.address?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        typeLabels[item.type]?.toLowerCase().includes(searchText) ||
        item.type?.toLowerCase().includes(searchText);
      return matchesCategory && matchesSearch;
    });
  }, [services, category, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, services]);

  const handleAdd = () => {
    setCreateDialogOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setEditDialogOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / itemsPerPage),
  );
  const visibleServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const visiblePageButtons = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxButtons + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [totalPages, currentPage]);

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto w-full space-y-8">
        <PageHero
          eyebrow="Service Catalog"
          heading={
            <>
              Service{" "}
              <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                Management
              </span>
            </>
          }
          description="Organize transport, accommodation, dining, and support services that power each provider experience."
          actions={
            <Button
              onClick={handleAdd}
              className="group w-full rounded-full bg-primary px-8 py-6 text-sm font-bold text-primary-foreground shadow-md shadow-primary/10 transition-all hover:bg-primary-container hover:text-on-primary-container sm:w-auto"
            >
              <span className="mr-2 group-hover:rotate-90 transition-transform">
                <Plus className="h-4 w-4" />
              </span>
              ADD NEW SERVICE
            </Button>
          }
        />
        <ServiceFilter
          category={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={handleSearchChange}
          onAdd={handleAdd}
          showAddButton={false}
        />
        <DialogCreateService
          open={createDialogOpen}
          setOpen={setCreateDialogOpen}
          onCreated={loadServices}
        />
        <DialogEditService
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          service={selectedService}
          onUpdated={() => {
            loadServices();
            setSelectedService(null);
          }}
        />
        <DialogDeleteService
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          service={selectedService}
          onDeleted={() => {
            loadServices();
            setSelectedService(null);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full">
              <CardGridSkeleton count={6} />
            </div>
          ) : visibleServices.length ? (
            visibleServices.map((service) => (
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-on-surface-variant">
              Không có dịch vụ nào phù hợp.
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex flex-col gap-3 rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-on-surface-variant">
              Hiển thị{" "}
              <span className="font-semibold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, filteredServices.length)}
              </span>{" "}
              trên{" "}
              <span className="font-semibold">{filteredServices.length}</span>{" "}
              dịch vụ
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                className="bg-primary text-primary-foreground hover:bg-primary-container hover:text-on-primary-container disabled:bg-surface-container-high disabled:text-on-surface-variant"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Trước
              </Button>
              {visiblePageButtons.map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  className={
                    page === currentPage
                      ? "bg-primary text-primary-foreground hover:bg-primary-container hover:text-on-primary-container"
                      : "bg-surface-container-lowest text-on-surface hover:bg-primary/10 hover:text-primary"
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                className="bg-primary text-primary-foreground hover:bg-primary-container hover:text-on-primary-container disabled:bg-surface-container-high disabled:text-on-surface-variant"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Tiếp
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ServiceManagement;
