import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DialogCreateTour from "./DialogCreateTour";

export default function ManageToursHero() {
  const [service, setService] = useState(null);
  return (
    <section className="app-page-hero relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(0,104,95,0.16),_transparent_35%),linear-gradient(135deg,_#ffffff,_#eef7f5)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] dark:ring-white/10 md:p-8">
      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
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
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest/85 px-4 py-3 shadow-sm ring-1 ring-outline-variant/25 backdrop-blur">
            <Avatar size="lg" className="h-10 w-10">
              <AvatarImage
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8R7F4kWyZXkBFYRNJ-5cTQabufPxmyzPYbMvhuuW0qOWkqSWA-LpIl7TaWMmC_7vatf2TetuAKpSW-aZK51As1jmjhlfp-IVQ4nGyfR_tjRlCNcrmlpVn_aRDJXiCD2Lac7x-jEz0I95CduYESBTiStix3ZYBa5lS00as3zthRvQpbiYVp_HJ1RmVkugRa-5fhn7VS_1HH5P6Fv8c9cCzp8W86O_4O4reI-xOvXjKG0LBFrcsO6dfW8kvBaip3YeExOFsHzmEDIw6"
                alt="Skyline Tours"
              />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold text-on-surface">Skyline Tours</p>
              <p className="text-xs font-medium text-on-surface-variant">
                Verified Provider
              </p>
            </div>
          </div>

          <DialogCreateTour />
        </div>
      </div>
    </section>
  );
}
