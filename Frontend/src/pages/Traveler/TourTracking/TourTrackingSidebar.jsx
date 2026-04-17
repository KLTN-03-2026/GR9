import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TourTrackingSidebar() {
  return (
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
              <span className="text-[11px] font-bold">GPS: Signal Strong</span>
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
            <div className="group flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar size="lg" className="after:border-transparent">
                  <AvatarImage
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC_zlc7Pc3ATNIDM5wW1KXIsuJRmZwzesQsSG_FA6az9HLNjfQQHqyre0AqMUwETzJLFTPfUq9QKkmg3U5Uo_KTE6Nad6zLSpfkrX0wfC5RLzWmi_EB9WhqI3YaKCUzKwa2jfH6wk9yrfe0ijt7WWg_03crFx60sEP7yS7O_xcGOmd1DSZy4BSiiqXfZmyx80ZG9I4CAgsUSGKTGfbEqCNPEw-16CU8CZqefn8pw6tAFqoK7dD3jSHGRVTrVTL6ghH3Ez-8NTVgLuC"
                    alt="Alex Rivera"
                  />
                  <AvatarFallback>AR</AvatarFallback>
                  <AvatarBadge className="bg-teal-500 ring-2 ring-white" />
                </Avatar>

                <div>
                  <p className="text-sm font-bold">Alex Rivera</p>
                  <p className="text-[10px] font-medium text-on-surface-variant">
                    Lead traveler
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">chat_bubble</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">info</span>
                </Button>
              </div>
            </div>

            <div className="group flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar size="lg" className="after:border-transparent">
                  <AvatarImage
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx_YrV98skFMZO011p-nMRKeJKDXpbftiN-Zh9tO1zlfOk_znKM61xgfEd9tWLybD9sYwWeWlpl525T1oNvfH11WZ3iZ605VJ7WkhAU5-MN5YnF-kASxthuHmGyRz9emOMyZTg0j8ZlvPlTgUdbLUeU2httbGbpDhw1kqdt11jCRMjO9pgyuSyqYFuJa727YrWEDQNAZEoEOUEMA_qt-M1cuG9DqOnn0Rk940-comU5leQhTB9U32fX26TBUbwkQqgs65o33SwxB9e"
                    alt="Mia Lopez"
                  />
                  <AvatarFallback>ML</AvatarFallback>
                  <AvatarBadge className="bg-teal-500 ring-2 ring-white" />
                </Avatar>

                <div>
                  <p className="text-sm font-bold">Mia Lopez</p>
                  <p className="text-[10px] font-medium text-on-surface-variant">
                    Passenger
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">chat_bubble</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">info</span>
                </Button>
              </div>
            </div>
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
        <Button
          type="button"
          variant="ghost"
          className="h-auto rounded-2xl bg-secondary-container/30 p-5 text-on-secondary-container hover:bg-secondary-container/50"
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <span className="material-symbols-outlined text-2xl text-on-secondary-container">
              receipt_long
            </span>
            <span className="text-xs font-bold uppercase">Expenses</span>
          </div>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-auto rounded-2xl bg-tertiary-container/10 p-5 text-tertiary-container hover:bg-tertiary-container/20"
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <span
              className="material-symbols-outlined text-2xl text-tertiary-container"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              medical_services
            </span>
            <span className="text-xs font-bold uppercase">First Aid</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
