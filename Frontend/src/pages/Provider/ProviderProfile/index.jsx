import ProviderProfileCompanyDetails from "./ProviderProfileCompanyDetails";
import ProviderProfileContact from "./ProviderProfileContact";
import ProviderProfileHero from "./ProviderProfileHero";
import ProviderProfilePayout from "./ProviderProfilePayout";

export default function ProviderProfile() {
  return (
    <div className="relative overflow-hidden text-on-surface">
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary-fixed-dim/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-72 w-72 rounded-full bg-tertiary-fixed/20 blur-3xl" />

      <main className="mx-auto w-full max-w-6xl space-y-10 pb-10">
        <ProviderProfileHero />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-6 lg:col-span-7">
            <ProviderProfileCompanyDetails />
            <ProviderProfilePayout />
          </div>

          <div className="col-span-12 space-y-6 lg:col-span-5">
            <ProviderProfileContact />
          </div>
        </div>

        
      </main>

      
    </div>
  );
}