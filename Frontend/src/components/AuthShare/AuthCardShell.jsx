import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
        <span className="material-symbols-outlined text-on-primary">
          travel_explore
        </span>
      </div>
      <span className="font-headline text-2xl font-bold tracking-tight text-on-surface">
        Voyager AI
      </span>
    </div>
  );
}

export default function AuthCardShell({ title, description, children, footer }) {
  return (
    <section className="flex w-full items-center justify-center bg-surface p-8 lg:w-1/2">
      <Card className="w-full max-w-md border-none bg-transparent py-0 shadow-none ring-0">
        <CardContent className="space-y-8 p-0">
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandMark />
          </div>

          <div className="space-y-2 text-left">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
              {title}
            </h1>
            <p className="font-medium text-on-surface-variant">{description}</p>
          </div>

          {children}

          <div className="flex flex-col gap-4 border-t border-outline-variant/10 pt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/50 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; 2024 Voyager AI</span>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] font-bold uppercase tracking-[0.24em] text-inherit"
              >
                Privacy
              </Button>
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] font-bold uppercase tracking-[0.24em] text-inherit"
              >
                Terms
              </Button>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">
                  shield
                </span>
                <span>Secure SSL</span>
              </div>
            </div>
          </div>

          {footer}
        </CardContent>
      </Card>
    </section>
  );
}
