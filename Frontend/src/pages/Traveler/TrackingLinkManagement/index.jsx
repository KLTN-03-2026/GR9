import TrackingLinkHero from "./TrackingLinkHero";
import TrackingLinkOverviewSection from "./TrackingLinkOverviewSection";
import TrackingLinkVisualCards from "./TrackingLinkVisualCards";
import TrackingLinkAccessCard from "./TrackingLinkAccessCard";
import TrackingLinkPrivacyNote from "./TrackingLinkPrivacyNote";

export default function TrackingLinkManagement() {
  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto w-full max-w-[1600px] space-y-10 px-6 pb-12 pt-24 text-on-surface md:px-10">
        <TrackingLinkHero />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-8 lg:col-span-7">
            <TrackingLinkOverviewSection />
            <TrackingLinkVisualCards />
          </section>

          <aside className="space-y-8 lg:col-span-5">
            <TrackingLinkAccessCard />
            <TrackingLinkPrivacyNote />
          </aside>
        </div>
      </div>
    </main>
  );
}
