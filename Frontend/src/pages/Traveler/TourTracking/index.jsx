import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const itineraryItems = [
  {
    period: "Morning · 08:30",
    title: "Arashiyama Bamboo Grove",
    description:
      "Walk the bamboo corridor early to avoid crowd density and capture softer light.",
    status: "Ongoing",
    statusClass: "bg-primary text-white",
    icon: "tour",
    iconClass: "bg-primary text-white",
    accent: true,
    footerIcon: "restaurant",
    footerLabel: "Activity in progress",
    actionLabel: "Follow route",
  },
  {
    period: "Lunch · 12:30",
    title: "Shigetsu (Zen cuisine)",
    description:
      "Shojin Ryori lunch inside the temple grounds keeps the day compact and calm.",
    status: "Pending",
    statusClass: "bg-surface-container text-on-surface-variant",
    icon: "schedule",
    iconClass: "bg-surface-container-high text-on-surface-variant",
    accent: false,
  },
  {
    period: "Afternoon · 14:30",
    title: "Tenryu-ji Temple",
    description:
      "The AI keeps the garden circuit after lunch for better pacing and fewer transfers.",
    status: "Pending",
    statusClass: "bg-surface-container text-on-surface-variant",
    icon: "schedule",
    iconClass: "bg-surface-container-high text-on-surface-variant",
    accent: false,
  },
];

const travelers = [
  {
    name: "Alex Rivera",
    role: "Lead traveler",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCC_zlc7Pc3ATNIDM5wW1KXIsuJRmZwzesQsSG_FA6az9HLNjfQQHqyre0AqMUwETzJLFTPfUq9QKkmg3U5Uo_KTE6Nad6zLSpfkrX0wfC5RLzWmi_EB9WhqI3YaKCUzKwa2jfH6wk9yrfe0ijt7WWg_03crFx60sEP7yS7O_xcGOmd1DSZy4BSiiqXfZmyx80ZG9I4CAgsUSGKTGfbEqCNPEw-16CU8CZqefn8pw6tAFqoK7dD3jSHGRVTrVTL6ghH3Ez-8NTVgLuC",
    fallback: "AR",
  },
  {
    name: "Mia Lopez",
    role: "Passenger",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDx_YrV98skFMZO011p-nMRKeJKDXpbftiN-Zh9tO1zlfOk_znKM61xgfEd9tWLybD9sYwWeWlpl525T1oNvfH11WZ3iZ605VJ7WkhAU5-MN5YnF-kASxthuHmGyRz9emOMyZTg0j8ZlvPlTgUdbLUeU2httbGbpDhw1kqdt11jCRMjO9pgyuSyqYFuJa727YrWEDQNAZEoEOUEMA_qt-M1cuG9DqOnn0Rk940-comU5leQhTB9U32fX26TBUbwkQqgs65o33SwxB9e",
    fallback: "ML",
  },
];

const quickActions = [
  {
    icon: "receipt_long",
    label: "Expenses",
    cardClass:
      "bg-secondary-container/30 text-on-secondary-container hover:bg-secondary-container/50",
    iconClass: "text-on-secondary-container",
  },
  {
    icon: "medical_services",
    label: "First Aid",
    cardClass:
      "bg-tertiary-container/10 text-tertiary-container hover:bg-tertiary-container/20",
    iconClass: "text-tertiary-container",
    fill: true,
  },
];

function IconActionButton({ icon, className = "" }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`rounded-full text-on-surface-variant hover:bg-surface-container ${className}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </Button>
  );
}

export default function TourTracking() {
  return (
    <main className="min-h-screen flex-1 md:ml-64">
      

      <div className="mx-auto space-y-8 px-6 pb-12 pt-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <Badge className="inline-flex rounded-full border-0 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-700">
              <span className="mr-2 h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              Ongoing Now
            </Badge>

            <h2 className="font-headline text-4xl font-extrabold leading-tight text-on-surface">
              Kyoto Immersion
            </h2>

            <p className="flex items-center font-medium text-on-surface-variant">
              <span className="material-symbols-outlined mr-1 text-sm">
                location_on
              </span>
              Kyoto, Japan • Self-guided itinerary
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-5 font-semibold text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined mr-2">
                contact_emergency
              </span>
              Emergency Protocol
            </Button>

            <Button
              type="button"
              className="h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined mr-2">
                send_to_mobile
              </span>
              Broadcast Update
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <Card className="relative overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-sm ring-0">
              <CardContent className="relative z-10 space-y-10 p-8">
                <div className="absolute right-0 top-0 p-8">
                  <div className="text-right">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Local Time
                    </span>
                    <span className="font-headline text-2xl font-extrabold text-teal-800">
                      01:03 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="rounded-2xl bg-tertiary-container/10 p-4">
                    <span
                      className="material-symbols-outlined text-3xl text-tertiary-container"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      timer
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Tour Progress: Day 1 of 2
                    </h3>
                    <p className="text-on-surface-variant">
                      This is a self-guided AI itinerary. You follow the route
                      personally and handle payments directly at each stop.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    <span>Arashiyama Bamboo Grove</span>
                    <span>Shigetsu (Zen cuisine)</span>
                    <span>Tenryu-ji Temple</span>
                  </div>

                  <div className="relative h-3 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-teal-400 to-primary"
                      style={{ width: "0%" }}
                    />
                    <div
                      className="absolute -top-0.5 -ml-2 h-4 w-4 rounded-full border-2 border-primary bg-white shadow-md"
                      style={{ left: "0%" }}
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <div className="flex items-center space-x-2 text-primary">
                      <span className="material-symbols-outlined text-base">
                        check_circle
                      </span>
                      <span className="text-sm font-semibold">
                        Completed: Planner ready
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
                      <span className="text-sm font-semibold">
                        Next: Arashiyama Bamboo Grove
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <h4 className="flex items-center font-headline text-lg font-bold text-on-surface">
                <span className="material-symbols-outlined mr-2">
                  event_repeat
                </span>
                Today&apos;s Detailed Itinerary
              </h4>

              <div className="relative space-y-0">
                <div className="absolute bottom-8 left-6 top-8 w-[2px] bg-outline-variant/30" />

                {itineraryItems.map((item) => (
                  <div
                    key={item.title}
                    className="group relative flex items-start space-x-8 pb-8"
                  >
                    <div
                      className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${item.iconClass}`}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>

                    <Card
                      className={`flex-1 rounded-2xl py-0 transition-all hover:translate-x-1 ${
                        item.accent
                          ? "border-none bg-white shadow-md ring-2 ring-primary/10"
                          : "border-none bg-surface-container-lowest shadow-none ring-0"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <span
                            className={`text-xs font-bold uppercase ${
                              item.accent
                                ? "text-primary"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {item.period}
                          </span>

                          <Badge
                            className={`rounded-full border-0 px-3 py-1 text-[10px] font-bold uppercase ${item.statusClass} ${
                              item.status === "Ongoing" ? "animate-pulse" : ""
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </div>

                        <CardTitle className="mb-2 text-lg font-bold">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                          {item.description}
                        </CardDescription>

                        {item.footerLabel ? (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-2 rounded-lg border border-outline-variant/10 bg-surface-container-low px-3 py-1.5">
                              <span className="material-symbols-outlined text-sm text-primary">
                                {item.footerIcon}
                              </span>
                              <span className="text-xs font-bold text-on-surface">
                                {item.footerLabel}
                              </span>
                            </div>

                            <Button
                              type="button"
                              variant="link"
                              className="h-auto px-0 text-xs font-bold text-primary"
                            >
                              {item.actionLabel}
                            </Button>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <Card className="relative aspect-square overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest py-0 shadow-sm">
              <div className="absolute inset-0 bg-slate-200">
                <img
                  className="h-full w-full object-cover opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPMtui2OLB2kvFBCVO5QcyZ3an7WGQE8kaAOwfbK22CM3ZLKl028JjqUWWQkPKKpjyxNl9DIzGcTt2g9A6agBjapBdLR3PkeaS7Y6tGaaXwLw4SW0ZRNRh7pvPpovme-u0oLHw54QtNNYJEaeTFOH9I3K3zm9thWWSp5c5G_GEycLwsvCN-mKWM2OK8hhoe6_G81agnV_v9kTTn40kFsm-AsG4PI0M46A48gfrQQfPMY1KQhgKh_ZhDv0vL-t1FhvT0t8di5JnL7I-"
                  alt="Tour map overview"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <div className="animate-bounce rounded-full bg-primary p-2 text-white shadow-xl ring-4 ring-primary/20">
                    <span className="material-symbols-outlined">
                      person_pin_circle
                    </span>
                  </div>
                  <Badge className="mt-2 rounded-full border-0 bg-white px-3 py-1 text-[10px] font-bold text-on-surface shadow-sm">
                    Group Alpha
                  </Badge>
                  <Badge className="mt-2 rounded-full border-0 bg-white px-3 py-1 text-[10px] font-bold text-on-surface shadow-sm">
                    COUPLE
                  </Badge>
                </div>
              </div>

              <CardContent className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className="material-symbols-outlined text-sm text-primary"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      signal_cellular_alt
                    </span>
                    <span className="text-[11px] font-bold">
                      GPS: Signal Strong
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="h-auto px-0 text-[10px] font-bold uppercase text-primary"
                  >
                    Expand Map
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-sm ring-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-0">
                <CardTitle className="font-headline text-lg font-bold">
                  Traveler Pulse
                </CardTitle>
                <Badge className="rounded-md border-0 bg-teal-50 px-2 py-1 text-xs font-bold text-teal-600">
                  2/2 Present
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6 p-8">
                <div className="no-scrollbar max-h-[400px] space-y-4 overflow-y-auto pr-2">
                  {travelers.map((traveler) => (
                    <div
                      key={traveler.name}
                      className="group flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar
                          size="lg"
                          className="after:border-transparent"
                        >
                          <AvatarImage src={traveler.src} alt={traveler.name} />
                          <AvatarFallback>{traveler.fallback}</AvatarFallback>
                          <AvatarBadge className="bg-teal-500 ring-2 ring-white" />
                        </Avatar>

                        <div>
                          <p className="text-sm font-bold">{traveler.name}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant">
                            {traveler.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <IconActionButton icon="chat_bubble" className="h-8 w-8 rounded-lg" />
                        <IconActionButton icon="info" className="h-8 w-8 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-14 w-full rounded-2xl border-2 border-dashed border-outline-variant bg-transparent text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
                >
                  View Full Attendance Sheet
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  variant="ghost"
                  className={`h-auto rounded-2xl p-5 ${action.cardClass}`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <span
                      className={`material-symbols-outlined text-2xl ${action.iconClass}`}
                      style={
                        action.fill
                          ? { fontVariationSettings: '"FILL" 1' }
                          : undefined
                      }
                    >
                      {action.icon}
                    </span>
                    <span className="text-xs font-bold uppercase">
                      {action.label}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
