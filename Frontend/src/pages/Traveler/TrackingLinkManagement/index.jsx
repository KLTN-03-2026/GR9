import TrackingLinkHero from "./TrackingLinkHero";
import TrackingLinkOverviewSection from "./TrackingLinkOverviewSection";
import TrackingLinkVisualCards from "./TrackingLinkVisualCards";
import TrackingLinkAccessCard from "./TrackingLinkAccessCard";
import TrackingLinkPrivacyNote from "./TrackingLinkPrivacyNote";

export default function TrackingLinkManagement() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 text-on-surface">
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
    </main>
  );
}
