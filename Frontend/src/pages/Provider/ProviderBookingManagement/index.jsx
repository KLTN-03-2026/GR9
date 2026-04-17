import ProviderBookingFilters from "./ProviderBookingFilters";
import ProviderBookingTable from "./ProviderBookingTable";
import ProviderBookingPagination from "./ProviderBookingPagination";

export default function ProviderBookingManagement() {
  return (
    <div className="space-y-8 text-on-surface">
      <ProviderBookingFilters />
      <ProviderBookingTable />
      <ProviderBookingPagination />
    </div>
  );
}
