import { Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GuideLiveTourTrackingFooterActions() {
  return (
    <Card className="rounded-[1.75rem] border border-slate-200/20 bg-white/80 py-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-lg">
      <CardContent className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage
                alt="Sarah"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg_jGocPqxAmdVviPsdoNcnYLyy8oR0qwz9OE2o7VtOPXdIh6vaVfeizbASJjhv0Cd1RoLA2RE4T3uD0keV7ADmovCnVWLUQX6YDetc1ycIWOAWdlrsC6ur4S5OZfymcSQIGje_a_8sxxetpTE1iW9TrKStbzFOQZjwvZvxq48Lkagoee0ml_fSdmZxln-9aREzdbUoYXtHH0l2Qwuwi-R4eXxF2OR9NuFyyokoqyZmJxm0xF8aIBABxSvC7YGhB9biUvIFydEdRBO"
              />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>

            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage
                alt="Daniel"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1ndsgy58FfEvTqeE98fxrI2jYJRcNK5wk6Ee8BzIeONsYccg1vucM75gWIq6D2_upPS8o2sKVtozer1RydQnSYtXXZREI_nvP5Dmq5ksLzMSP1g-cydjfAoLrzuUxWsPI_5S0S3sk9h30H2o7RmhNHOczWST5AMBeLTVq6ht5sG5gPyafXP2d6KB1dTV4oFJcXnolBsiKe5VZuNH-gT5mavvTW2rMuq47nKF8TODCg19dqIks5wxW6HXT2cMihRhKkhaP1rSnutVs"
              />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>

            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500">
              +10
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Guests tracking your live link
          </span>
        </div>

        <div className="flex w-full gap-4 md:w-auto">
          <Button className="flex-1 rounded-xl border-2 border-outline-variant/30 px-6 py-3 font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:text-primary hover:shadow-lg active:translate-y-0 md:flex-none">
            Save Progress Update
          </Button>
          <Button className="flex-1 rounded-xl border-2 border-outline-variant/30 px-6 py-3 font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:text-primary hover:shadow-lg active:translate-y-0 md:flex-none">
            <Plus className="h-4 w-4" />
            Publish to Tracking Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
