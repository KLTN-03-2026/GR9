import {
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  MoreVertical,
  Pencil,
  Search,
} from "lucide-react";

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

export default function ManageToursTable() {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
      <CardContent className="space-y-6 p-5 md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Tabs defaultValue="all" className="w-full xl:w-auto">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-surface-container-low p-1.5 xl:w-auto">
              <TabsTrigger
                value="all"
                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
              >
                All Tours
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
              >
                active
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
              >
                draft
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:text-on-surface"
              >
                archived
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-[240px] flex-1 md:min-w-[300px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
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

            <Select defaultValue="latest">
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
              <TableRow className="group">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgWFZp6WEUOubAzFWVJ9ofi_nGcsjPGvjTaUZXes4hqD_U_1gZrXTJntvvV-jzu-215m0vM1zvVAWrkYJRLlSmba6mMACUJIWxBF0fPx5yz8SbMrygi-BcQIWmrjWV_lVSTjcj4z7v9TzmXknMHnO35ZQOa4-MvK1dvfti4RGXwN9qcr_roPpTkFgBa0rUwJ2xD0Ogg7qiqXwzMZrO7aH0uaoJ9Gmc-vDahpR2UU2J2fQrxn4obRVzlhHESW1pH3eoL8hC-n74M2vx"
                      alt="Santorini Private Sunset Sail"
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="font-headline text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                        Santorini Private Sunset Sail
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        <MapPin className="size-3.5" />
                        Santorini, Greece
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <p className="font-headline text-lg font-bold text-on-surface">
                    $450.00
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Per person
                  </p>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge className="rounded-full border-transparent bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Active
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

              <TableRow className="group">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgV8iIpahBGpHnQa8Fx6egNwthmj39pNhk7EDGgI6XZdQAVSFcLiPAY7nuTzzW04-ET64QLu8WnN_En_ClM75IFcHnRo7s_pS3M1swAd9L5yPPDTxxyLFOXI4Uk2pPODF_hAjfgRzFXobW8tNO1JQ_svy0ZYKzysvMdksParMVRInv2ZBjTYsNFZqLcwJlxwjLGcJvCgwURj6zxCt-F3sMqAGj1V0oVYTeO2CUS03Kv635B8sI9RmU2ia5iCI9HiAyDGNMOmrsgpWM"
                      alt="Kyoto Secret Temples & Tea"
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm grayscale"
                    />
                    <div className="min-w-0">
                      <p className="font-headline text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                        Kyoto Secret Temples & Tea
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        <MapPin className="size-3.5" />
                        Kyoto, Japan
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <p className="font-headline text-lg font-bold text-on-surface">
                    $185.00
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Per person
                  </p>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge className="rounded-full border-transparent bg-slate-200 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Draft
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

              <TableRow className="group">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4 opacity-70">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRwTvrX6x2guGebTbR0-lgj89Q7eDHarqq5pphVJOx7RwTl0w_7tIxjJfyesZvwcYoWFH2j5KXy-9bu_H-rp8xpwdCSo8tLQkFKhj7eX4jhdk1TXHF0ILLmJQDVNxFHUvKnMfYYJbwNnoEkMAvLybIfkBVG_w72WQoYmfGR9Ct5hExpgLI4P0C6OgO107LigOAS5vA3OIsWufg3VBVQmESRq5fVfEr1F9EVIucHJK9q2hKm8hJ8MJ29KnDK-5-Y0GsAAq4o_HHj_zV"
                      alt="Serengeti Luxury Safari Experience"
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="font-headline text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                        Serengeti Luxury Safari Experience
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        <MapPin className="size-3.5" />
                        Tanzania
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <p className="font-headline text-lg font-bold text-on-surface">
                    $2,400.00
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Per person
                  </p>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge className="rounded-full border-transparent bg-red-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-red-700 dark:bg-red-950 dark:text-red-200">
                    Inactive
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

              <TableRow className="group">
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKSLysWC0XbJIMhxQ6H-khJatfGPpZxo0wuy1FocN6fhZSbmhOUQiG7_PkXXsnu1fFgJVlEJ9tIk_ZFWvqeBBx9qz9k4lGq_nlZR-Pe27q09HaiyPyRzA-UR9CeoiPJvMAc7y5nwQJpoQJbF4N9iGWCnLttCCNMpAvq4KODt-bR5RWWe1nLUx7vMHoDWdKr_xeB2SuNJuUbrRzi1jf1ZrmxIRgjbkUjhWAp_ANUc3FAvYKNqODLAvhKWapzXYvRw4T3856lnGlM0"
                      alt="Canadian Rockies Helicopter Tour"
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="font-headline text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                        Canadian Rockies Helicopter Tour
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                        <MapPin className="size-3.5" />
                        Banff, Canada
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <p className="font-headline text-lg font-bold text-on-surface">
                    $620.00
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Per person
                  </p>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge className="rounded-full border-transparent bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Active
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
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 rounded-[1.5rem] bg-surface-container-low px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1 - 4</span> of{" "}
            <span className="font-bold text-on-surface">24</span> tours
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
  );
}
