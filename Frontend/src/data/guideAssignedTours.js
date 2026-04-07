/** Demo dataset for guide assigned tours & detail ops (shared workspace). */

const IMG = {
  hero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA0IqWtySVs7eyZ6ir_HRlgmbP7MrsBGF9r7ZaX_9wExLAxLPBtCO7W9aYS1oGj2j6b4QDVFBQUIq6R1Md18tRbGhqxtXousii7q2SmbH6q0zOlE99xQ9kptRKq7m7MmS5O-4_0CaqC8MS01yGzqJ9GjPdj_A5xNXALzt7j9X_ZJs4ng9ACIaip0Kv1nG0jKDkVgtBgMq1HN5ytqyoNc-zgKonvBJrTh2fFK-I9c6BUAzdGvUJryBV868JbUcMXQ1M4TZ2Fpkj-JUoq",
  card:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
};

const avatar = {
  alex: "https://lh3.googleusercontent.com/aida-public/AB6AXuCC_zlc7Pc3ATNIDM5wW1KXIsuJRmZwzesQsSG_FA6az9HLNjfQQHqyre0AqMUwETzJLFTPfUq9QKkmg3U5Uo_KTE6Nad6zLSpfkrX0wfC5RLzWmi_EB9WhqI3YaKCUzKwa2jfH6wk9yrfe0ijt7WWg_03crFx60sEP7yS7O_xcGOmd1DSZy4BSiiqXfZmyx80ZG9I4CAgsUSGKTGfbEqCNPEw-16CU8CZqefn8pw6tAFqoK7dD3jSHGRVTrVTL6ghH3Ez-8NTVgLuC",
  mia: "https://lh3.googleusercontent.com/aida-public/AB6AXuDx_YrV98skFMZO011p-nMRKeJKDXpbftiN-Zh9tO1zlfOk_znKM61xgfEd9tWLybD9sYwWeWlpl525T1oNvfH11WZ3iZ605VJ7WkhAU5-MN5YnF-kASxthuHmGyRz9emOMyZTg0j8ZlvPlTgUdbLUeU2httbGbpDhw1kqdt11jCRMjO9pgyuSyqYFuJa727YrWEDQNAZEoEOUEMA_qt-M1cuG9DqOnn0Rk940-comU5leQhTB9U32fX26TBUbwkQqgs65o33SwxB9e",
  marcus:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFh3tgNtojKN3KV0ilWZk2rIobYX6kIELbau1C-uCVw-c4fevQpyh-Z6uSLU6wu0JbaPA6a-9eHi8qekfsGCNBoRoNZWGjxCOvsTZGYdFS-DWhikNq0z8Ayea5n2oqztXiR54FedHoyMoTlkFr7a6rtwBcZY3B6TbqivnN2Eqq2vdFPRdWqKDaGVBxXPbKMDLj2ymnKznsKcJmR2VBPsoTYEGcSoIkl9S1zMmEMcQhxg2M65-GYUclFaxx17TJGF7gpelGfTmPCVx7",
  jamie:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFh3tgNtojKN3KV0ilWZk2rIobYX6kIELbau1C-uCVw-c4fevQpyh-Z6uSLU6wu0JbaPA6a-9eHi8qekfsGCNBoRoNZWGjxCOvsTZGYdFS-DWhikNq0z8Ayea5n2oqztXiR54FedHoyMoTlkFr7a6rtwBcZY3B6TbqivnN2Eqq2vdFPRdWqKDaGVBxXPbKMDLj2ymnKznsKcJmR2VBPsoTYEGcSoIkl9S1zMmEMcQhxg2M65-GYUclFaxx17TJGF7gpelGfTmPCVx7",
};

export const GUIDE_ASSIGNED_TOURS = [
  {
    id: "da-nang-coastal",
    code: "VGR-240330-DN",
    title: "Da Nang 3D2N: Coastal Elegance",
    status: "ongoing",
    listRole: "hero",
    region: "vietnam",
    heroImage: IMG.hero,
    cardImage: IMG.hero,
    pickup: "Da Nang, Vietnam",
    locationShortLabel: "Da Nang, Vietnam",
    guideName: "Tran Thi Mai Chau",
    passengerCount: 4,
    dateRangeLabel: "Apr 2 - Apr 5, 2026",
    startDate: "2026-04-02",
    endDate: "2026-04-05",
    passengers: [
      {
        id: "p1",
        name: "Alex Rivera",
        age: 31,
        avatar: avatar.alex,
        tags: [{ label: "Standard", className: "bg-secondary-container text-on-secondary-container" }],
      },
      {
        id: "p2",
        name: "Mia Lopez",
        age: 29,
        avatar: avatar.mia,
        tags: [{ label: "Vegetarian", className: "bg-tertiary-fixed text-on-tertiary-fixed" }],
      },
      {
        id: "p3",
        name: "Marcus Wright",
        age: 42,
        avatar: avatar.marcus,
        tags: [{ label: "Nut-free", className: "bg-tertiary-fixed text-on-tertiary-fixed" }],
      },
      {
        id: "p4",
        name: "Jamie Clark",
        age: 35,
        avatar: avatar.jamie,
        tags: [{ label: "Standard", className: "bg-secondary-container text-on-secondary-container" }],
      },
    ],
    services: [
      { id: "s1", type: "Transport", title: "Private van — Days 1–3", detail: "Plate 43A-712xx · Driver Mr. Hùng" },
      { id: "s2", type: "Meals", title: "Breakfast vouchers", detail: "Riverside Bistro · 07:00–10:00" },
      { id: "s3", type: "Experience", title: "Marble Mountains trek", detail: "Gear + water provided at pickup" },
    ],
    updates: [
      { id: "u1", time: "08:42", day: "Apr 3", body: "Group cleared hotel pickup on time.", author: "You" },
      { id: "u2", time: "11:05", day: "Apr 3", body: "Workshop host confirmed 12 seats.", author: "Hub" },
    ],
    issues: [
      { id: "i1", title: "Vegetarian lunch label", status: "resolved", detail: "Kitchen confirmed separate prep line." },
    ],
    itineraryDays: [
      {
        id: "d2",
        title: "Day 2: Coastal Gems & Local Flavor",
        dateLabel: "Thursday, Apr 3, 2026",
        activities: [
          {
            id: "a1",
            time: "08:30",
            title: "Marble Mountains Spiritual Hike",
            status: "completed",
            statusClass: "bg-teal-50 text-teal-700",
            note: "All guests checked in and completed the cave trail safely.",
            dotClass: "bg-primary",
            cardClass:
              "rounded-3xl p-6 bg-white shadow-[0_20px_40px_rgba(25,28,30,0.04)] border border-outline-variant/5",
            notes: "Trail B used — stairs slippery after rain; guided slower pace for two guests.",
          },
          {
            id: "a2",
            time: "11:00",
            title: "Local Artisan Stone Carving Workshop",
            status: "ongoing",
            statusClass: "bg-orange-50 text-orange-700",
            note: "Guide is coordinating the hands-on session with local craftsmen.",
            dotClass: "bg-primary ring-4 ring-primary-fixed",
            cardClass:
              "rounded-3xl p-6 bg-white shadow-[0_20px_40px_rgba(25,28,30,0.06)] border-2 border-primary/10",
            notes: "Bring dust masks; photos OK in main hall only.",
          },
          {
            id: "a3",
            time: "13:00",
            title: "Lunch: Mi Quang Specialty House",
            status: "upcoming",
            statusClass: "bg-slate-100 text-slate-500",
            note: "Vegetarian and nut-free portions have been pre-ordered.",
            dotClass: "bg-slate-200",
            cardClass: "rounded-3xl p-6 bg-white/50 border border-dashed border-outline-variant/40",
            notes: "Table 4 reserved under Voyager / Chau.",
          },
          {
            id: "a4",
            time: "18:00",
            title: "Dragon Bridge riverside walk",
            status: "upcoming",
            statusClass: "bg-slate-100 text-slate-500",
            note: "Han River waterfront",
            dotClass: "bg-slate-200",
            cardClass: "rounded-3xl p-6 bg-white/50 border border-dashed border-outline-variant/40",
            notes: "Fire show Fri/Sat only — brief guests if asked.",
          },
        ],
      },
    ],
  },
  {
    id: "azure-horizon",
    code: "VGR-260612-AZ",
    title: "Azure Horizon Expedition",
    status: "scheduled",
    listRole: "sidebar",
    region: "greece",
    heroImage: IMG.card,
    cardImage: IMG.card,
    pickup: "Santorini, Greece",
    locationShortLabel: "Santorini, Greece",
    guideName: "You",
    passengerCount: 4,
    dateRangeLabel: "Jun 12 - Jun 18, 2026",
    startDate: "2026-06-12",
    endDate: "2026-06-18",
    passengers: [],
    services: [],
    updates: [],
    issues: [],
    itineraryDays: [
      {
        id: "az1",
        title: "Day 1: Arrival & caldera",
        dateLabel: "Friday, Jun 12, 2026",
        activities: [
          {
            id: "aza1",
            time: "14:00",
            title: "Hotel check-in & safety briefing",
            status: "upcoming",
            statusClass: "bg-slate-100 text-slate-500",
            note: "Meet at Athinios port shuttle bay.",
            dotClass: "bg-slate-200",
            cardClass: "rounded-3xl p-6 bg-white/50 border border-dashed border-outline-variant/40",
            notes: "Passports collected at hub for speedboat manifest.",
          },
        ],
      },
    ],
  },
  {
    id: "emerald-waters",
    code: "VGR-260110-HL",
    title: "Emerald Waters & Ancient Karsts",
    status: "completed",
    listRole: "later",
    region: "vietnam",
    heroImage: IMG.card,
    cardImage: IMG.card,
    pickup: "Ha Long, Vietnam",
    locationShortLabel: "Ha Long, Vietnam",
    guideName: "You",
    passengerCount: 2,
    dateRangeLabel: "Jan 10, 2026",
    startDate: "2026-01-10",
    endDate: "2026-01-10",
    passengers: [
      { id: "e1", name: "Alex Rivera", age: 31, avatar: avatar.alex, tags: [] },
      { id: "e2", name: "Jamie Clark", age: 35, avatar: avatar.jamie, tags: [] },
    ],
    services: [],
    updates: [{ id: "eu1", time: "17:00", day: "Jan 10", body: "Tour closed — feedback link sent.", author: "Hub" }],
    issues: [],
    itineraryDays: [],
  },
];

export function getTourById(id) {
  return GUIDE_ASSIGNED_TOURS.find((t) => t.id === id) ?? null;
}

function parseIso(d) {
  const x = new Date(`${d}T12:00:00`);
  return Number.isNaN(x.getTime()) ? null : x;
}

/** @param {Date} [now] */
export function isTourActiveOnDate(tour, now = new Date()) {
  const s = parseIso(tour.startDate);
  const e = parseIso(tour.endDate);
  if (!s || !e) return false;
  const start = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
  const end = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return t0 >= start && t0 <= end;
}

export function filterToursBySegment(tours, segment, now = new Date()) {
  if (segment === "all") return tours;
  if (segment === "today") return tours.filter((t) => isTourActiveOnDate(t, now));
  if (segment === "upcoming")
    return tours.filter((t) => {
      const s = parseIso(t.startDate);
      if (!s) return false;
      const start = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
      const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      return t0 < start && t.status !== "completed";
    });
  if (segment === "ongoing") return tours.filter((t) => t.status === "ongoing");
  if (segment === "completed") return tours.filter((t) => t.status === "completed");
  return tours;
}
