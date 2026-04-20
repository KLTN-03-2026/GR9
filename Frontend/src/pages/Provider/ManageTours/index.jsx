import { useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Pencil,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import DialogCreateTour from "./DialogCreateTour";

const stats = [
  {
    label: "Total Revenue",
    value: "$42,850",
    note: "+12.4%",
    icon: TrendingUp,
    accent: "text-emerald-600",
  },
  {
    label: "Active Tours",
    value: "18",
    note: "Currently listed",
  },
  {
    label: "Booking Rate",
    value: "84%",
    note: "Strong conversion this month",
    progress: 84,
  },
];

const tours = [
  {
    id: 1,
    name: "Santorini Private Sunset Sail",
    location: "Santorini, Greece",
    price: 450,
    priceNote: "Per person",
    status: "active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgWFZp6WEUOubAzFWVJ9ofi_nGcsjPGvjTaUZXes4hqD_U_1gZrXTJntvvV-jzu-215m0vM1zvVAWrkYJRLlSmba6mMACUJIWxBF0fPx5yz8SbMrygi-BcQIWmrjWV_lVSTjcj4z7v9TzmXknMHnO35ZQOa4-MvK1dvfti4RGXwN9qcr_roPpTkFgBa0rUwJ2xD0Ogg7qiqXwzMZrO7aH0uaoJ9Gmc-vDahpR2UU2J2fQrxn4obRVzlhHESW1pH3eoL8hC-n74M2vx",
  },
  {
    id: 2,
    name: "Kyoto Secret Temples & Tea",
    location: "Kyoto, Japan",
    price: 185,
    priceNote: "Per person",
    status: "draft",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgV8iIpahBGpHnQa8Fx6egNwthmj39pNhk7EDGgI6XZdQAVSFcLiPAY7nuTzzW04-ET64QLu8WnN_En_ClM75IFcHnRo7s_pS3M1swAd9L5yPPDTxxyLFOXI4Uk2pPODF_hAjfgRzFXobW8tNO1JQ_svy0ZYKzysvMdksParMVRInv2ZBjTYsNFZqLcwJlxwjLGcJvCgwURj6zxCt-F3sMqAGj1V0oVYTeO2CUS03Kv635B8sI9RmU2ia5iCI9HiAyDGNMOmrsgpWM",
  },
  {
    id: 3,
    name: "Serengeti Luxury Safari Experience",
    location: "Tanzania",
    price: 2400,
    priceNote: "Per person",
    status: "archived",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRwTvrX6x2guGebTbR0-lgj89Q7eDHarqq5pphVJOx7RwTl0w_7tIxjJfyesZvwcYoWFH2j5KXy-9bu_H-rp8xpwdCSo8tLQkFKhj7eX4jhdk1TXHF0ILLmJQDVNxFHUvKnMfYYJbwNnoEkMAvLybIfkBVG_w72WQoYmfGR9Ct5hExpgLI4P0C6OgO107LigOAS5vA3OIsWufg3VBVQmESRq5fVfEr1F9EVIucHJK9q2hKm8hJ8MJ29KnDK-5-Y0GsAAq4o_HHj_zV",
  },
  {
    id: 4,
    name: "Canadian Rockies Helicopter Tour",
    location: "Banff, Canada",
    price: 620,
    priceNote: "Per person",
    status: "active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKSLysWC0XbJIMhxQ6H-khJatfGPpZxo0wuy1FocN6fhZSbmhOUQiG7_PkXXsnu1fFgJVlEJ9tIk_ZFWvqeBBx9qz9k4lGq_nlZR-Pe27q09HaiyPyRzA-UR9CeoiPJvMAc7y5nwQJpoQJbF4N9iGWCnLttCCNMpAvq4KODt-bR5RWWe1nLUx7vMHoDWdKr_xeB2SuNJuUbrRzi1jf1ZrmxIRgjbkUjhWAp_ANUc3FAvYKNqODLAvhKWapzXYvRw4T3856lnGlM0",
  },
];

const providers = {
  name: "Skyline Tours",
  label: "Verified Provider",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8R7F4kWyZXkBFYRNJ-5cTQabufPxmyzPYbMvhuuW0qOWkqSWA-LpIl7TaWMmC_7vatf2TetuAKpSW-aZK51As1jmjhlfp-IVQ4nGyfR_tjRlCNcrmlpVn_aRDJXiCD2Lac7x-jEz0I95CduYESBTiStix3ZYBa5lS00as3zthRvQpbiYVp_HJ1RmVkugRa-5fhn7VS_1HH5P6Fv8c9cCzp8W86O_4O4reI-xOvXjKG0LBFrcsO6dfW8kvBaip3YeExOFsHzmEDIw6",
};

const statusMeta = {
  active: {
    label: "Active",
    className:
      "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  },
  draft: {
    label: "Draft",
    className:
      "border-transparent bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  archived: {
    label: "Inactive",
    className:
      "border-transparent bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  },
};

const tabOptions = ["all", "active", "draft", "archived"];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

export default function ManageTours() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredTours = tours
    .filter((tour) => {
      const matchesStatus =
        statusFilter === "all" ? true : tour.status === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        tour.name.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return b.id - a.id;
    });

  return (
    <div className="space-y-8 text-on-surface">
      <section className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(0,104,95,0.16),_transparent_35%),linear-gradient(135deg,_#ffffff,_#eef7f5)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 md:p-8">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-teal-200/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              Inventory Overview
            </p>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
              Manage Your{" "}
              <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                Experiences
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base">
              Curate, update, and monitor your tour performance across global
              markets from a single editorial dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
              <Avatar size="lg" className="h-10 w-10">
                <AvatarImage src={providers.image} alt={providers.name} />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {providers.name}
                </p>
                <p className="text-xs font-medium text-on-surface-variant">
                  {providers.label}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setCreateOpen(true)}
              className="h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container px-6 font-headline text-sm font-bold text-on-primary shadow-lg shadow-primary/15"
            >
              <Plus className="size-4" />
              Create Tour
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_1fr_1.15fr]">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="rounded-[1.5rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
            >
              <CardContent className="p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  {stat.label}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-3xl font-extrabold text-on-surface">
                      {stat.value}
                    </span>
                    {Icon ? <Icon className={cn("size-4", stat.accent)} /> : null}
                  </div>
                  <p className={cn("text-xs font-medium", stat.accent || "text-on-surface-variant")}>
                    {stat.note}
                  </p>
                  {stat.progress ? (
                    <Progress value={stat.progress} className="mt-3 h-1.5 bg-slate-200" />
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card className="rounded-[1.5rem] border-none bg-linear-to-br from-[#0b695f] via-[#0f8578] to-[#36a59a] py-0 text-white shadow-[0_18px_45px_rgba(0,104,95,0.22)]">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-teal-50/90">
              <Sparkles className="size-4" />
              AI Insight
            </div>
            <p className="text-sm leading-6 text-teal-50/95">
              Luxury Amalfi Coast tours are trending. Consider adding a sunset
              private boat option to capture higher-intent travelers.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
              View suggestions
              <ArrowUpRight className="size-4" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
        <CardContent className="space-y-6 p-5 md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <Tabs
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-full xl:w-auto"
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-surface-container-low p-1.5 xl:w-auto">
                {tabOptions.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
                  >
                    {tab === "all" ? "All Tours" : tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative min-w-[240px] flex-1 md:min-w-[300px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tours or destinations..."
                  className="h-11 rounded-xl border-outline-variant/30 bg-surface-container-low pl-10"
                />
              </div>

              <Button
                variant="outline"
                className="h-11 rounded-xl border-outline-variant/30 bg-white px-4"
              >
                <Filter className="size-4" />
                Filter by Price
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 min-w-[150px] rounded-xl border-outline-variant/30 bg-white px-4">
                  <SelectValue placeholder="Sort: Latest" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="latest">Sort: Latest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-outline-variant/20">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="hover:bg-slate-50/80">
                  <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                    Tour Details
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                    Price
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                    Booking Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTours.map((tour) => (
                  <TableRow key={tour.id} className="group">
                    <TableCell className="px-6 py-5">
                      <div
                        className={cn(
                          "flex items-center gap-4",
                          tour.status === "archived" && "opacity-70",
                        )}
                      >
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className={cn(
                            "h-16 w-16 rounded-2xl object-cover shadow-sm",
                            tour.status === "draft" && "grayscale",
                          )}
                        />
                        <div className="min-w-0">
                          <p className="font-headline text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                            {tour.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                            <MapPin className="size-3.5" />
                            {tour.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <p className="font-headline text-lg font-bold text-on-surface">
                        {formatMoney(tour.price)}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {tour.priceNote}
                      </p>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em]",
                          statusMeta[tour.status].className,
                        )}
                      >
                        {statusMeta[tour.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl text-on-surface-variant hover:bg-surface-container-low"
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl text-on-surface-variant hover:bg-surface-container-low"
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem>Edit details</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate tour</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                              Archive tour
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 rounded-[1.5rem] bg-surface-container-low px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
              Showing{" "}
              <span className="font-bold text-on-surface">1 - {filteredTours.length}</span>{" "}
              of <span className="font-bold text-on-surface">24</span> tours
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-white text-on-surface-variant"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button className="rounded-xl bg-primary px-4 text-on-primary">
                1
              </Button>
              <Button variant="outline" className="rounded-xl bg-white px-4">
                2
              </Button>
              <Button variant="outline" className="rounded-xl bg-white px-4">
                3
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-white text-on-surface-variant"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogCreateTour open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
