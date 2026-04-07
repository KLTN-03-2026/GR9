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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const travelStyles = [
    { label: "Relax", selected: false },
    { label: "Adventure", selected: true },
    { label: "Food", selected: true },
    { label: "Culture", selected: false },
];

const companions = [
    { icon: "person", label: "SOLO", selected: false },
    { icon: "group", label: "COUPLE", selected: true },
    { icon: "family_restroom", label: "FAMILY", selected: false },
];

const itineraryDays = [
    {
        day: 1,
        title: "Day 1: Tradition Meets Zen",
        faded: false,
        summary: null,
        activities: [
            {
                title: "Arashiyama Bamboo Grove",
                time: "Morning · 08:30",
                icon: "wb_twilight",
                accentClass: "text-primary-fixed-variant",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuD9GwfO8_Nk63FVKII3QKs3GI116W1awi_Rh4dIZaHxV4otsG_9Ymdgk0FOGkJtNhU2KyVBzvn1LUG7lgGyl4YIKGiyHEeOxcoaxi14477EwX1oggu2d6bYJARC-07UDFMrGI2XjXE-TXrJxOoSj2zzyJ9U9jPl8S1pvub-Zp3KXPQepD6zYv3S9dZrxu0he5yfEX3XfUwzZOGCvIRwhFiAgdzfdweiXK51BA_W8YlAeUrUJw-0Ez_NZhbKgTz-94aYJqSqPlOqdJF_",
                description:
                    "Walk the bamboo corridor early to avoid crowd density and capture softer light.",
            },
            {
                title: "Shigetsu (Zen cuisine)",
                time: "Lunch · 12:30",
                icon: "restaurant",
                accentClass: "text-tertiary",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDsPDoUz8nNjOAIU_nBr4ZnnXsHVXFAyALVzJ0i79bxTBsmTI3XGj1I6QuNl9-ylsCylPULawD2VoxAnBTiHh7E7YTwo8_hvWwHnDmpMjCHt2gh49NOJJDlBmIXhU5qgLrXolwJVepB7c5XOVfZjqlqN1YoJ_j2ZsqU-SFzxJ3HMR2cp2GiOCnXi49cDY12-tmotcFHAMgYuqGrfv-sh2IJ9-QP0HsbeGr2aXaO2iHP5_qQ-qnStT-wY_Pm0-Nr0HP1RU2gpuwB3vFA",
                description:
                    "Shojin Ryori lunch inside the temple grounds keeps the day compact and calm.",
            },
            {
                title: "Tenryu-ji Temple",
                time: "Afternoon · 14:30",
                icon: "temple_buddhist",
                accentClass: "text-secondary",
                image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAsAKIt49aGi-R_WrGDKVRM35IgXTf4Yaw3bH_j1SIheIC8kIppod397zg8pLGHpZpOtbsnvfONug4gMPFFhDmYYAc7QTq9PJ10USrzLPipRWo9no8pE4XUwjCI60oVaZFvlhT_7CvJR_umhl3A-Zvp75MCpaQGAV0hutwQzvE9u7F-YZUZ8VDIYZEQXRH2dRtQAilV6jGhxqEs91XSCR76vZeER0o0nm7R9Qj_mDRqUd4POoLZQiCqC0YJJoErReWKH_3WsXLQvzAG",
                description:
                    "The AI keeps the garden circuit after lunch for better pacing and fewer transfers.",
            },
        ],
    },
    {
        day: 2,
        title: "Day 2: The Crimson Path",
        faded: true,
        summary:
            "Fushimi Inari, Gion lanes and a food-first evening path near Kiyomizu.",
        activities: [],
    },
];

export default function AITravelPlanner() {
    return (
        <div>
            <div className="flex h-screen pt-16">
                <main className="flex flex-1 overflow-hidden">
                    <section className="scrollbar-hide h-full w-full overflow-y-auto bg-surface-container-low p-8 md:w-[400px] xl:w-[450px]">
                        <div className="mx-auto max-w-md">
                            <header className="mb-10">
                                <h1 className="mb-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
                                    Build your dream.
                                </h1>
                                <p className="text-sm text-on-surface-variant">
                                    Fill in the details, and our AI concierge will curate a
                                    bespoke itinerary just for you.
                                </p>
                            </header>

                            <form className="space-y-8">
                                <div className="space-y-2">
                                    <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        Destination
                                    </Label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                                            location_on
                                        </span>
                                        <Input
                                            type="text"
                                            defaultValue="Kyoto, Japan"
                                            className="h-14 rounded-2xl border-outline-variant/20 bg-surface-container-lowest py-4 pl-12 pr-4 font-medium text-on-surface focus-visible:border-primary focus-visible:ring-primary/10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                            Duration
                                        </Label>
                                        <Select defaultValue="3-days">
                                            <SelectTrigger className="h-14 rounded-2xl border-outline-variant/20 bg-surface-container-lowest px-4">
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3-days">3 Days</SelectItem>
                                                <SelectItem value="5-days">5 Days</SelectItem>
                                                <SelectItem value="7-days">7 Days</SelectItem>
                                                <SelectItem value="14-days">14 Days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                            Budget
                                        </Label>
                                        <Card className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest py-0 shadow-none">
                                            <CardContent className="px-4 py-4">
                                                <input
                                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary-container accent-primary"
                                                    type="range"
                                                    defaultValue={50}
                                                />
                                                <div className="mt-2 flex justify-between text-[10px] font-bold text-on-surface-variant">
                                                    <span>VALUE</span>
                                                    <span>LUXURY</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        Travel Style
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {travelStyles.map((style) => (
                                            <Button
                                                key={style.label}
                                                type="button"
                                                variant={style.selected ? "secondary" : "outline"}
                                                className={`h-auto rounded-full px-4 py-2 text-xs ${style.selected
                                                        ? "border border-primary bg-primary/5 font-bold text-primary hover:bg-primary/10"
                                                        : "border-outline-variant/30 font-semibold hover:border-primary hover:text-primary"
                                                    }`}
                                            >
                                                <span>{style.label}</span>
                                                {style.selected ? (
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        check
                                                    </span>
                                                ) : null}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        Companions
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {companions.map((companion) => (
                                            <Button
                                                key={companion.label}
                                                type="button"
                                                variant="outline"
                                                className={`h-auto flex-col rounded-2xl p-3 ${companion.selected
                                                        ? "border-2 border-primary bg-primary/5 text-primary hover:bg-primary/10"
                                                        : "border-outline-variant/30 hover:border-primary"
                                                    }`}
                                            >
                                                <span
                                                    className={`material-symbols-outlined ${companion.selected
                                                            ? "text-primary"
                                                            : "text-on-surface-variant"
                                                        }`}
                                                >
                                                    {companion.icon}
                                                </span>
                                                <span
                                                    className={`text-[10px] font-bold ${companion.selected ? "text-primary" : ""
                                                        }`}
                                                >
                                                    {companion.label}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Card className="group overflow-hidden rounded-3xl border-none bg-gradient-to-br from-secondary-container to-blue-100 py-0 shadow-none">
                                    <CardContent className="relative z-10 flex items-center justify-between p-5">
                                        <div>
                                            <p className="text-xs font-bold uppercase text-on-secondary-container/60">
                                                Expected Weather
                                            </p>
                                            <h3 className="font-headline text-2xl font-bold text-on-secondary-container">
                                                22°C{" "}
                                                <span className="text-sm font-medium">
                                                    Partly Cloudy
                                                </span>
                                            </h3>
                                            <p className="mt-1 text-[11px] italic text-on-secondary-container/80">
                                                Note: Rain-safe indoor alternatives stay reserved in the
                                                same district.
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-4xl text-on-secondary-container opacity-40 transition-transform group-hover:scale-110">
                                            partly_cloudy_day
                                        </span>
                                    </CardContent>
                                </Card>

                                <Button
                                    type="button"
                                    className="h-auto w-full rounded-2xl bg-gradient-to-r from-primary to-primary-container py-5 font-headline text-lg font-bold text-on-primary shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/20 active:scale-95"
                                >
                                    <span>Generate Plan with AI</span>
                                    <span className="material-symbols-outlined">
                                        auto_awesome
                                    </span>
                                </Button>
                            </form>
                        </div>
                    </section>

                    <section className="scrollbar-hide relative h-full flex-1 overflow-y-auto bg-surface p-8">
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
                                    <span className="material-symbols-outlined text-sm">
                                        share
                                    </span>
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

                        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
                            <div className="space-y-12">
                                {itineraryDays.map((day) => (
                                    <div
                                        key={day.day}
                                        className={`relative border-l-2 border-dashed border-outline-variant/30 pl-8 ${day.faded ? "opacity-50" : ""
                                            }`}
                                    >
                                        <div
                                            className={`absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-surface text-[10px] font-bold ${day.faded
                                                    ? "bg-outline-variant text-white"
                                                    : "bg-primary text-on-primary"
                                                }`}
                                        >
                                            {day.day}
                                        </div>

                                        <h3 className="mb-6 font-headline text-xl font-bold">
                                            {day.title}
                                        </h3>

                                        {day.activities.length ? (
                                            <div className="space-y-6">
                                                {day.activities.map((activity) => (
                                                    <Card
                                                        key={activity.title}
                                                        className="cursor-pointer rounded-2xl border-none bg-transparent py-0 shadow-none ring-0 transition-all hover:bg-surface-container-low"
                                                    >
                                                        <CardContent className="flex gap-4 p-4">
                                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                                                                <img
                                                                    alt={activity.title}
                                                                    className="h-full w-full object-cover"
                                                                    src={activity.image}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className={`mb-1 flex items-center gap-2 text-[10px] font-bold uppercase ${activity.accentClass}`}
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">
                                                                        {activity.icon}
                                                                    </span>
                                                                    {activity.time}
                                                                </div>
                                                                <CardTitle className="font-bold text-on-surface">
                                                                    {activity.title}
                                                                </CardTitle>
                                                                <CardDescription className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                                                                    {activity.description}
                                                                </CardDescription>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs">{day.summary}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-8">
                                <Card className="group relative rounded-[2rem] border-none bg-surface-container-lowest p-2 shadow-sm">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-slate-200">
                                        <img
                                            alt="Map"
                                            className="h-full w-full object-cover brightness-50 contrast-125 grayscale"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaFRqD0-nVWlSuoJZBa0I3JQv-RzGgZNK0odTsxNrz7bFk7awE_WVnyn6Lg2R4lCR-nb-vOT6QR9ToCBGE-OQ6CtX0Hp0WrCb-K-94JnwcyEUuk0n8obbFKR4TQr2I0iZM3ijU7v5TH6tOlOR5djPSy1-0-Tdm-rSna-mCI1q1rH-01fIu1qLG8tEmuDZro8JZ5Vo_cykpALnChxAhwFxBu6KQPxnDiU87oROUwFjTULA-v9qhMH76WN-qF8efvcDWtANOo5-nNiFF"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-primary/5" />
                                        <div className="absolute left-6 right-6 top-6 flex justify-between">
                                            <Card className="rounded-2xl border border-white bg-white/90 py-0 shadow-xl backdrop-blur-md">
                                                <CardContent className="p-4">
                                                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">
                                                        Total Route
                                                    </p>
                                                    <p className="text-sm font-bold">12.4 km Journey</p>
                                                </CardContent>
                                            </Card>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon-lg"
                                                className="rounded-full border-white bg-white/90 shadow-xl backdrop-blur-md"
                                            >
                                                <span className="material-symbols-outlined text-primary">
                                                    my_location
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="group relative aspect-video overflow-hidden rounded-[2rem] border-none py-0 shadow-none">
                                    <img
                                        alt="Landscape"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYCXC5i2Kl9Sl5OfqGcXSSyg4bRbhovYNMdJD9PFLOTNVFpPvb-AsUQBOcSdrOF_DXCJVR2kEurTrwS58qw0NFpRs5fjZKhZK-6JTGUW_B5YIDa-BTFeWD404uE3Ao-EBQj5rvlrfaCqkMGy537kgK8Z6y65pEA5G2eiaGAoIPdrYvjZNa0q3g-T6WJXLMdleRW7yfg7tvGhyhNT_Ks7nSC4J9T7asyJRa2rBuyjD65T6_E_Wp8zjhNVuC1yXRendZ5o0wu2oPQQbr"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <CardContent className="absolute bottom-6 left-6 p-0">
                                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
                                            Local Secret
                                        </p>
                                        <CardTitle className="text-xl font-bold text-white">
                                            The Sagano Scenic Railway
                                        </CardTitle>
                                        <CardDescription className="mt-1 text-[11px] italic text-white/80">
                                            Suggested: "The Sagano Scenic Railway is inserted as a
                                            low-stress connector between temple and food blocks."
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="h-20" />
                    </section>
                </main>
            </div>
        </div>
    );
}
