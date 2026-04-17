import {
  BusFront,
  Check,
  Ellipsis,
  History,
  Hotel,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProviderBookingTable() {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
      <CardHeader className="px-6 py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-heading text-lg font-bold">
              Incoming Bookings
            </CardTitle>
            <p className="text-sm text-on-surface-variant">
              Review requests, track confirmations and inspect booking history.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground">
            4 active rows
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-sm">
            <thead>
              <tr className="border-none bg-slate-200">
                <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Customer
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Tour Details
                </th>
                <th className="px-8 py-5 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Date
                </th>
                <th className="px-8 py-5 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="group border-b border-slate-100 transition-colors hover:bg-surface-container-low">
                <td className="px-8 py-6 align-middle">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11 rounded-xl">
                      <AvatarImage
                        alt="Portrait of Elena Rodriguez"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpAS8ysq28vxxzbyV-6QvBFgXGilqAwngD-YBSWf4OEkg1BYvjXtSOlhpxCkWBIvWO9uKAnyBcsf7vUXEYdBMhD05ZYp3h9PTUONfCD8kobIP1BKK3_Ytqj0m3hCMfD1hi0Sp1x40GGeHvs-TqIRyT0dIfpgUPU8GYw_WN8sEymgZXrWcgq17LZdfnu1XWn-_iHydTzknT0I6rg6VqFU08PFJwihWZsbOArd5EtlfPQ2rNyEW2eluKbZpEG4tUF7_4DlkHpv2tsmoA"
                      />
                      <AvatarFallback className="rounded-xl font-semibold">
                        ER
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-heading font-bold text-on-surface">
                        Elena Rodriguez
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        e.rodriguez@email.com
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 align-middle">
                  <p className="font-bold text-on-surface">
                    Alpine Peaks Helicopter Tour
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                    <p className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      3 Travelers
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Hotel className="size-3.5" />
                      Boutique Caldera Suite
                    </p>
                    <p className="flex items-center gap-1.5">
                      <BusFront className="size-3.5" />
                      Private SUV
                    </p>
                  </div>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <p className="font-semibold text-on-surface">Oct 24, 2023</p>
                  <p className="text-[11px] font-medium uppercase text-on-surface-variant">
                    10:30 AM
                  </p>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-tight text-amber-700">
                    Pending
                  </span>
                </td>

                <td className="px-8 py-6 align-middle">
                  <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <Button className="h-9 rounded-xl px-3" size="sm">
                      <Check className="size-4" />
                      Accept
                    </Button>
                    <Button
                      className="h-9 rounded-xl px-3"
                      size="sm"
                      variant="destructive"
                    >
                      <X className="size-4" />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>

              <tr className="group border-b border-slate-100 transition-colors hover:bg-surface-container-low">
                <td className="px-8 py-6 align-middle">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11 rounded-xl">
                      <AvatarImage
                        alt="Portrait of Marcus Chen"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX7gv0nRtERkrqBWCRNqvh7vdDRh4sWMGY3KqUynKt4A9T7QHiK4iS5eyZGm4aOCP3mGA5RSnpqllq2B0lonKSUF22MzYtTuZnq4R37G3ZOEMwgKwFI0q9NAgoVn7-qU3LHBcD0H2EZOXv4R9ft8J2bpkNJceM1siUiYRnwoeFfAnobk_XVZiBk6LTgK7W4jgasR-fjzML5gbL-s0cw8i0X53Mz5H7Rgkhlbi-cCfc-i_owheJv_V-QZdf20ZIFqLrebeYKHkT0I18"
                      />
                      <AvatarFallback className="rounded-xl font-semibold">
                        MC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-heading font-bold text-on-surface">
                        Marcus Chen
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        m.chen@outlook.com
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 align-middle">
                  <p className="font-bold text-on-surface">
                    Azure Coast Private Yacht
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                    <p className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      4 Travelers
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Hotel className="size-3.5" />
                      Boutique Caldera Suite
                    </p>
                    <p className="flex items-center gap-1.5">
                      <BusFront className="size-3.5" />
                      Concierge Van
                    </p>
                  </div>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <p className="font-semibold text-on-surface">Oct 28, 2023</p>
                  <p className="text-[11px] font-medium uppercase text-on-surface-variant">
                    02:00 PM
                  </p>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-tight text-emerald-700">
                    Confirmed
                  </span>
                </td>

                <td className="px-8 py-6 align-middle">
                  <div className="flex justify-end">
                    <Button className="rounded-full" size="icon-sm" variant="ghost">
                      <Ellipsis className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>

              <tr className="group border-b border-slate-100 transition-colors hover:bg-surface-container-low">
                <td className="px-8 py-6 align-middle">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11 rounded-xl">
                      <AvatarImage
                        alt="Portrait of Sarah Jenkins"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwXfjKw4qk26jHyz8-BMJFEt_GMZLnulJhbkEKwg7qdm1V9kcEAvHZpweA1G_c-hCSwmPr7z3teOOFQDvv4Bk5Ukr1vyC7QTOsKkZfweuH6CdkEATHLnPHnNesklWUXsM7FHT4bMG-PcByBHLWoHU2f9omLf2JRkbvF0HJ48-expthmLqU4pkYJmcMnoC5zxqSDF77hl8s9Mg-1OfRKhFsOeYZQT9QvU2yQv89QdElk4EUKnl5ceJUTS50T1hjDOkxNSe3DgMshDr8"
                      />
                      <AvatarFallback className="rounded-xl font-semibold">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-heading font-bold text-on-surface">
                        Sarah Jenkins
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        s.jenkins@webmail.com
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 align-middle">
                  <p className="font-bold text-on-surface">
                    Kyoto Zen Garden Walk
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                    <p className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      1 Traveler
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Hotel className="size-3.5" />
                      Boutique Caldera Suite
                    </p>
                    <p className="flex items-center gap-1.5">
                      <BusFront className="size-3.5" />
                      Concierge Van
                    </p>
                  </div>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <p className="font-semibold text-on-surface">Nov 02, 2023</p>
                  <p className="text-[11px] font-medium uppercase text-on-surface-variant">
                    09:00 AM
                  </p>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold uppercase tracking-tight text-red-700">
                    Cancelled
                  </span>
                </td>

                <td className="px-8 py-6 align-middle">
                  <div className="flex justify-end">
                    <Button className="rounded-full" size="icon-sm" variant="ghost">
                      <History className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>

              <tr className="group border-b border-slate-100 transition-colors hover:bg-surface-container-low">
                <td className="px-8 py-6 align-middle">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11 rounded-xl">
                      <AvatarImage
                        alt="Portrait of David Wilson"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB31QjKyjc1o1cY4xZv-kgWWaut3YgAIwPD326Ahq3w16vBceuhP8QXBdXsJ6TgcgXg5JCsUQ7dn7iTsZ2oioAii9qtkta27sDa1AILDDK2HIGgMob5pL9T1icAp1OusXagJ9zxMVuelNI-a_nJRAr8rxk2w2zqjaNpJG03CArFHaazadslIV3IGJXfP4NOlU6Z8c6Gn1MLFzaMO_sal9JrJX5n5twu7_jwBzUwbxGLL0-Wk6JFhzLURAY_803yKLIfLfYT8ApCn0dM"
                      />
                      <AvatarFallback className="rounded-xl font-semibold">
                        DW
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-heading font-bold text-on-surface">
                        David Wilson
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        dwilson@proton.me
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 align-middle">
                  <p className="font-bold text-on-surface">
                    Alpine Peaks Helicopter Tour
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                    <p className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      2 Travelers
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Hotel className="size-3.5" />
                      Boutique Caldera Suite
                    </p>
                    <p className="flex items-center gap-1.5">
                      <BusFront className="size-3.5" />
                      Concierge Van
                    </p>
                  </div>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <p className="font-semibold text-on-surface">Nov 05, 2023</p>
                  <p className="text-[11px] font-medium uppercase text-on-surface-variant">
                    01:30 PM
                  </p>
                </td>

                <td className="px-8 py-6 text-center align-middle">
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-tight text-amber-700">
                    Pending
                  </span>
                </td>

                <td className="px-8 py-6 align-middle">
                  <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <Button className="h-9 rounded-xl px-3" size="sm">
                      <Check className="size-4" />
                      Accept
                    </Button>
                    <Button
                      className="h-9 rounded-xl px-3"
                      size="sm"
                      variant="destructive"
                    >
                      <X className="size-4" />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
