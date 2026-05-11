import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const categories = [
  { value: "All", labelKey: "all" },
  { value: "HOTEL", labelKey: "HOTEL" },
  { value: "TRANSPORT", labelKey: "TRANSPORT" },
  { value: "RESTAURANT", labelKey: "RESTAURANT" },
  { value: "ACTIVITY", labelKey: "ACTIVITY" },
  { value: "FOOD", labelKey: "FOOD" },
  { value: "ATTRACTION_TICKET", labelKey: "ATTRACTION_TICKET" },
  { value: "COMBO", labelKey: "COMBO" },
  { value: "OTHER", labelKey: "OTHER" },
];

const ServiceFilter = ({
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  search,
  onSearchChange,
  onAdd,
  showAddButton = true,
}) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm lg:flex-row">
      <div className="flex w-full flex-col items-center gap-4 md:flex-row lg:w-auto lg:flex-wrap">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-12 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest pl-12 pr-6 text-sm text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/15"
            placeholder={t("provider.services.search")}
          />
        </div>
        <div className="w-full md:w-56">
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-12 w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest font-bold text-on-surface outline-none focus-visible:border-primary/30 focus-visible:ring-0 data-[state=open]:border-outline-variant/40 data-[state=open]:ring-0">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-on-surface-variant" />
                <SelectValue placeholder={t("provider.services.selectType")} />
              </div>
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="rounded-2xl border-outline-variant/20 bg-surface-container-lowest"
            >
              {categories.map((cat) => (
                <SelectItem
                  key={cat.value}
                  value={cat.value}
                  className="cursor-pointer rounded-xl font-medium focus:bg-primary/10 focus:text-primary"
                >
                  {t(`provider.services.types.${cat.labelKey}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-56">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-12 w-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest font-bold text-on-surface outline-none focus-visible:border-primary/30 focus-visible:ring-0">
              <SelectValue placeholder={t("provider.services.sort")} />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="rounded-2xl border-outline-variant/20 bg-surface-container-lowest"
            >
              <SelectItem value="latest">{t("provider.services.sortOptions.latest")}</SelectItem>
              <SelectItem value="name-asc">{t("provider.services.sortOptions.nameAsc")}</SelectItem>
              <SelectItem value="price-low">{t("provider.services.sortOptions.priceLow")}</SelectItem>
              <SelectItem value="price-high">{t("provider.services.sortOptions.priceHigh")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showAddButton ? (
        <div className="w-full lg:w-auto">
          <Button
            onClick={onAdd}
            className="group w-full rounded-full bg-primary px-8 py-6 text-sm font-bold text-primary-foreground shadow-md shadow-primary/10 transition-all hover:bg-primary-container hover:text-on-primary-container lg:w-auto"
          >
            <span className=" mr-2 group-hover:rotate-90 transition-transform">
              <Plus className="h-4 w-4" />
            </span>
            {t("provider.services.add")}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ServiceFilter;
