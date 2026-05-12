import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/I18nProvider";

const formatDateInputValue = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatCurrencyVND = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)} đ`;

function PlannerSidebar({
  budget,
  isGenerating = false,
  quantity,
  destination,
  duration,
  handleGenerateTour,
  onBudgetChange,
  onCompanionChange,
  onDestinationChange,
  onDurationChange,
  onStartDateChange,
  startDate,
  describe,
  setDescribe,
}) {
  const { t } = useI18n();
  return (
    <section className="scrollbar-hide h-full w-full overflow-y-auto bg-surface-container-low p-8 md:w-[400px] xl:w-[450px]">
      <div className="mx-auto max-w-md">
        <header className="mb-10">
          <h1 className="mb-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            {t("planner.title")}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {t("planner.subtitle")}
          </p>
        </header>

        <div className="space-y-8">
          <div className="space-y-2">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("planner.destination")}
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                location_on
              </span>
              <Input
                type="text"
                value={destination}
                disabled={isGenerating}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="h-14 rounded-2xl border-outline-variant/20 bg-surface-container-lowest py-4 pl-12 pr-4 font-medium text-on-surface focus-visible:border-primary focus-visible:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("planner.startDate")}
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                calendar_month
              </span>
              <Input
                type="date"
                value={formatDateInputValue(startDate)}
                disabled={isGenerating}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-14 rounded-2xl border-outline-variant/20 bg-surface-container-lowest pl-12 pr-4 font-medium text-on-surface focus-visible:border-primary focus-visible:ring-primary/10"
              />
            </div>
          </div>

          <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white py-0 shadow-none">
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("planner.duration")}
                  </Label>
                  <Select
                    value={String(duration)}
                    disabled={isGenerating}
                    onValueChange={onDurationChange}
                  >
                    <SelectTrigger className="!h-14 w-full rounded-2xl border-outline-variant/20 bg-white px-4 text-base font-semibold text-on-surface">
                      <SelectValue placeholder={t("planner.selectDuration")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">{t("planner.days", { count: 3 })}</SelectItem>
                      <SelectItem value="5">{t("planner.days", { count: 5 })}</SelectItem>
                      <SelectItem value="7">{t("planner.days", { count: 7 })}</SelectItem>
                      <SelectItem value="14">{t("planner.days", { count: 14 })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("planner.budget")}
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">
                      đ
                    </span>
                    <Input
                      type="number"
                      min="0"
                      value={budget}
                      disabled={isGenerating}
                      onChange={(e) => onBudgetChange(e.target.value)}
                      placeholder={t("planner.enterBudget")}
                      className="h-14 rounded-2xl border-outline-variant/20 bg-white pl-9 text-base font-semibold text-on-surface"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-[11px] text-on-surface-variant">
                <span>{t("planner.suggestedRange")}</span>
                <span className="font-bold text-on-surface">
                  {formatCurrencyVND(2000000)} - {formatCurrencyVND(6000000)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("planner.describeTrip")}
            </Label>
            <div className="flex flex-wrap gap-2">
              <Textarea
                value={describe}
                disabled={isGenerating}
                onChange={(e) => setDescribe(e.target.value)}
                className="h-32 rounded-2xl border-outline-variant/20 bg-surface-container-lowest  font-medium text-on-surface focus-visible:border-primary focus-visible:ring-primary/10"
                placeholder={t("planner.describeTrip")}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("planner.quantity")}
            </Label>
            <div className="grid grid-cols-1 gap-3">
              <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white py-0 shadow-none">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface">{t("planner.adult")}</p>
                      <p className="text-xs text-on-surface-variant">
                        {t("planner.adultText")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {t("planner.quantity")}
                      </p>
                      <Input
                        type="number"
                        min="0"
                        value={quantity.adult}
                        disabled={isGenerating}
                        onChange={(e) =>
                          onCompanionChange("adult", e.target.value)
                        }
                        className="h-12 rounded-2xl border-outline-variant/20 bg-slate-50 text-center font-semibold text-on-surface"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {t("planner.height")}
                      </p>
                      <div className="flex h-12 items-center justify-center rounded-2xl border border-outline-variant/20 bg-slate-100 text-center font-semibold text-on-surface">
                        170 cm
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white py-0 shadow-none">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <span className="material-symbols-outlined">wc</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface">{t("planner.child")}</p>
                      <p className="text-xs text-on-surface-variant">
                        {t("planner.childText")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {t("planner.quantity")}
                      </p>
                      <Input
                        type="number"
                        min="0"
                        value={quantity.child}
                        disabled={isGenerating}
                        onChange={(e) =>
                          onCompanionChange("child", e.target.value)
                        }
                        className="h-12 rounded-2xl border-outline-variant/20 bg-slate-50 text-center font-semibold text-on-surface"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {t("planner.height")}
                      </p>
                      <div className="flex h-12 items-center justify-center rounded-2xl border border-outline-variant/20 bg-slate-100 text-center font-semibold text-on-surface">
                        120 cm
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white py-0 shadow-none">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                      <span className="material-symbols-outlined">
                        child_care
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface">{t("planner.infant")}</p>
                      <p className="text-xs text-on-surface-variant">
                        {t("planner.infantText")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {t("planner.quantity")}
                      </p>
                      <Input
                        type="number"
                        min="0"
                        value={quantity.infant}
                        disabled={isGenerating}
                        onChange={(e) =>
                          onCompanionChange("infant", e.target.value)
                        }
                        className="h-12 rounded-2xl border-outline-variant/20 bg-slate-50 text-center font-semibold text-on-surface"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {t("planner.height")}
                      </p>
                      <div className="flex h-12 items-center justify-center rounded-2xl border border-outline-variant/20 bg-slate-100 text-center font-semibold text-on-surface">
                        75 cm
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Button
            onClick={() => handleGenerateTour()}
            disabled={isGenerating}
            type="button"
            className="h-auto w-full rounded-2xl bg-gradient-to-r from-primary to-primary-container py-5 font-headline text-lg font-bold text-on-primary shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/20 active:scale-95"
          >
            <span>{isGenerating ? t("planner.generatingButton") : t("planner.generate")}</span>
            <span className={`material-symbols-outlined ${isGenerating ? "animate-spin" : ""}`}>
              {isGenerating ? "progress_activity" : "auto_awesome"}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PlannerSidebar;
