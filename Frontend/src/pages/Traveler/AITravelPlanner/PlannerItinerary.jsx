import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

function PlannerItinerary() {
  return (
    <div className="space-y-12">
      <div className="relative border-l-2 border-dashed border-outline-variant/30 pl-8">
        <div className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-surface bg-primary text-[10px] font-bold text-on-primary">
          1
        </div>

        <h3 className="mb-6 font-headline text-xl font-bold">
          Day 1: Tradition Meets Zen
        </h3>

        <div className="space-y-6">
          <Card className="cursor-pointer rounded-2xl border-none bg-transparent py-0 shadow-none ring-0 transition-all hover:bg-surface-container-low">
            <CardContent className="flex gap-4 p-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                <img
                  alt="Arashiyama Bamboo Grove"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9GwfO8_Nk63FVKII3QKs3GI116W1awi_Rh4dIZaHxV4otsG_9Ymdgk0FOGkJtNhU2KyVBzvn1LUG7lgGyl4YIKGiyHEeOxcoaxi14477EwX1oggu2d6bYJARC-07UDFMrGI2XjXE-TXrJxOoSj2zzyJ9U9jPl8S1pvub-Zp3KXPQepD6zYv3S9dZrxu0he5yfEX3XfUwzZOGCvIRwhFiAgdzfdweiXK51BA_W8YlAeUrUJw-0Ez_NZhbKgTz-94aYJqSqPlOqdJF_"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-primary-fixed-variant">
                  <span className="material-symbols-outlined text-sm">
                    wb_twilight
                  </span>
                  Morning · 08:30
                </div>
                <CardTitle className="font-bold text-on-surface">
                  Arashiyama Bamboo Grove
                </CardTitle>
                <CardDescription className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                  Walk the bamboo corridor early to avoid crowd density and
                  capture softer light.
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer rounded-2xl border-none bg-transparent py-0 shadow-none ring-0 transition-all hover:bg-surface-container-low">
            <CardContent className="flex gap-4 p-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                <img
                  alt="Shigetsu"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsPDoUz8nNjOAIU_nBr4ZnnXsHVXFAyALVzJ0i79bxTBsmTI3XGj1I6QuNl9-ylsCylPULawD2VoxAnBTiHh7E7YTwo8_hvWwHnDmpMjCHt2gh49NOJJDlBmIXhU5qgLrXolwJVepB7c5XOVfZjqlqN1YoJ_j2ZsqU-SFzxJ3HMR2cp2GiOCnXi49cDY12-tmotcFHAMgYuqGrfv-sh2IJ9-QP0HsbeGr2aXaO2iHP5_qQ-qnStT-wY_Pm0-Nr0HP1RU2gpuwB3vFA"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-tertiary">
                  <span className="material-symbols-outlined text-sm">
                    restaurant
                  </span>
                  Lunch · 12:30
                </div>
                <CardTitle className="font-bold text-on-surface">
                  Shigetsu (Zen cuisine)
                </CardTitle>
                <CardDescription className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                  Shojin Ryori lunch inside the temple grounds keeps the day
                  compact and calm.
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer rounded-2xl border-none bg-transparent py-0 shadow-none ring-0 transition-all hover:bg-surface-container-low">
            <CardContent className="flex gap-4 p-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                <img
                  alt="Tenryu-ji Temple"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsAKIt49aGi-R_WrGDKVRM35IgXTf4Yaw3bH_j1SIheIC8kIppod397zg8pLGHpZpOtbsnvfONug4gMPFFhDmYYAc7QTq9PJ10USrzLPipRWo9no8pE4XUwjCI60oVaZFvlhT_7CvJR_umhl3A-Zvp75MCpaQGAV0hutwQzvE9u7F-YZUZ8VDIYZEQXRH2dRtQAilV6jGhxqEs91XSCR76vZeER0o0nm7R9Qj_mDRqUd4POoLZQiCqC0YJJoErReWKH_3WsXLQvzAG"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase text-secondary">
                  <span className="material-symbols-outlined text-sm">
                    temple_buddhist
                  </span>
                  Afternoon · 14:30
                </div>
                <CardTitle className="font-bold text-on-surface">
                  Tenryu-ji Temple
                </CardTitle>
                <CardDescription className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                  The AI keeps the garden circuit after lunch for better pacing
                  and fewer transfers.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative border-l-2 border-dashed border-outline-variant/30 pl-8 opacity-50">
        <div className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-surface bg-outline-variant text-[10px] font-bold text-white">
          2
        </div>

        <h3 className="mb-6 font-headline text-xl font-bold">
          Day 2: The Crimson Path
        </h3>

        <p className="text-xs">
          Fushimi Inari, Gion lanes and a food-first evening path near Kiyomizu.
        </p>
      </div>
    </div>
  );
}

export default PlannerItinerary;
