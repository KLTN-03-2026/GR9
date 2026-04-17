import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function PlannerResultHeader() {
  return (
    <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge className="border-0 bg-tertiary-container px-3 py-1 text-[10px] font-bold text-on-tertiary-fixed">
            AI RECOMMENDED
          </Badge>
        </div>
        <h2 className="font-headline text-5xl font-extrabold leading-tight text-on-surface">
          Kyoto <br />
          <span className="text-primary">Immersion</span>
        </h2>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="rounded-full bg-white px-6 py-3 text-sm font-bold text-primary shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">share</span>
          <span>Share</span>
        </Button>
        <Button
          type="button"
          className="rounded-full bg-on-surface px-6 py-3 text-sm font-bold text-surface shadow-md hover:bg-on-surface/90"
        >
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            bookmark
          </span>
          <span>Save Trip</span>
        </Button>
      </div>
    </div>
  );
}

export default PlannerResultHeader;
