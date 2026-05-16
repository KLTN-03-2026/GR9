import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  FileWarning,
  Footprints,
  Globe2,
  MapPin,
  MoreHorizontal,
  PlayCircle,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/shared/page-hero";
import { useI18n } from "@/i18n/I18nProvider";
import { getGuideAssignedTours, getGuideDashboard } from "@/services/api/guide";

const buildGuideDashboardCopy = (language) =>
  language === "vi"
    ? {
        title: "Bảng điều khiển Guide",
        metaDescription:
          "Bảng điều khiển guide của SmartTravel với tour được phân công, thao tác ca trực, vận hành tour trực tiếp và báo cáo sự cố.",
        loadError: "Không thể tải bảng điều khiển guide.",
        heroEyebrow: "Tổng quan ca trực",
        welcomeBack: "Chào mừng trở lại,",
        guide: "Guide",
        description:
          "Theo dõi phân công hôm nay, mở tour đang chạy và xử lý vận hành thực địa trong một màn hình gọn hơn.",
        assignedToday: "Đang phụ trách hôm nay",
        upcomingTours: "Tour sắp tới",
        ongoingTours: "Tour đang diễn ra",
        pendingReports: "Báo cáo chờ xử lý",
        viewAssignedTours: "Xem tour được phân công",
        startOngoingTour: "Mở tour đang diễn ra",
        submitIncidentReport: "Gửi báo cáo sự cố",
        incidentComingSoon: "Tính năng báo cáo sự cố sẽ được nối tiếp theo.",
        toursAssigned: "tour được phân công",
        scheduleView: "Xem lịch",
        startShift: "Bắt đầu ca",
        quickOperations: "Thao tác nhanh",
        todaysAssignedTours: "Tour được phân công hôm nay",
        viewFullCalendar: "Xem toàn bộ lịch",
        morningDeparture: "Khởi hành buổi sáng",
        eveningExperience: "Trải nghiệm buổi tối",
        confirmed: "Đã xác nhận",
        pendingStart: "Chờ bắt đầu",
        noSchedule: "Chưa có lịch",
        guests: "khách",
        language: "Ngôn ngữ",
        openLiveTracking: "Mở live tracking",
        reviewTour: "Xem tour",
        time: "Thời gian",
        passengers: "Hành khách",
        unknownLocation: "Chưa rõ địa điểm",
        emptyTitle: "Chưa có tour nào trong ca trực này",
        emptyDescription:
          "Khi hệ thống phân công tour mới, bạn sẽ thấy lịch trình và thao tác nhanh xuất hiện ngay tại đây.",
      }
    : {
        title: "Guide Dashboard",
        metaDescription:
          "SmartTravel guide dashboard with assigned tours, shift actions, live operations, and incident reporting.",
        loadError: "Cannot load the guide dashboard.",
        heroEyebrow: "Shift overview",
        welcomeBack: "Welcome back,",
        guide: "Guide",
        description:
          "Track today's assignments, launch live tours, and manage field operations from one cleaner screen.",
        assignedToday: "Handling today",
        upcomingTours: "Upcoming tours",
        ongoingTours: "Ongoing tours",
        pendingReports: "Pending reports",
        viewAssignedTours: "View assigned tours",
        startOngoingTour: "Open ongoing tour",
        submitIncidentReport: "Submit incident report",
        incidentComingSoon: "Incident reporting will arrive in the next update.",
        toursAssigned: "assigned tours",
        scheduleView: "View schedule",
        startShift: "Start shift",
        quickOperations: "Quick actions",
        todaysAssignedTours: "Today's assigned tours",
        viewFullCalendar: "View full calendar",
        morningDeparture: "Morning departure",
        eveningExperience: "Evening experience",
        confirmed: "Confirmed",
        pendingStart: "Pending start",
        noSchedule: "No schedule yet",
        guests: "guests",
        language: "Language",
        openLiveTracking: "Open live tracking",
        reviewTour: "Review tour",
        time: "Time",
        passengers: "Passengers",
        unknownLocation: "Unknown location",
        emptyTitle: "No tours are assigned to this shift yet",
        emptyDescription:
          "As soon as new tours are assigned, their timeline and quick actions will appear here.",
      };

export default function GuideDashboardHome() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const [stats, setStats] = useState(null);
  const [assignedTours, setAssignedTours] = useState([]);
  const copy = useMemo(() => buildGuideDashboardCopy(language), [language]);

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";

    document.title = `${copy.title} | SmartTravel`;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute("content", copy.metaDescription);

    Promise.all([getGuideDashboard(), getGuideAssignedTours()])
      .then(([dashboardResponse, toursResponse]) => {
        setStats(dashboardResponse.data.data?.guideStats || null);
        setAssignedTours(toursResponse.data.data || []);
      })
      .catch((error) =>
        toast.error(error?.response?.data?.message || copy.loadError),
      );

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, [copy]);

  const summaryCards = useMemo(() => {
    const upcomingTours = assignedTours.filter((tour) => tour.status === "scheduled").length;
    const ongoingTours = assignedTours.filter((tour) => tour.status === "ongoing").length;

    return [
      {
        label: copy.assignedToday,
        value: String(ongoingTours || 0).padStart(2, "0"),
        icon: ClipboardCheck,
        iconClass: "text-[#0b8c87]",
        iconBg: "bg-[#0b8c87]/10",
      },
      {
        label: copy.upcomingTours,
        value: String(upcomingTours || 0).padStart(2, "0"),
        icon: CalendarDays,
        iconClass: "text-[#9f7d52]",
        iconBg: "bg-[#f6eee1]",
      },
      {
        label: copy.ongoingTours,
        value: String(ongoingTours || 0).padStart(2, "0"),
        icon: Footprints,
        iconClass: "text-[#20494b]",
        iconBg: "bg-[#dfeeed]",
      },
      {
        label: copy.pendingReports,
        value: "00",
        icon: AlertTriangle,
        iconClass: "text-[#c7753d]",
        iconBg: "bg-[#fff1e7]",
      },
    ];
  }, [assignedTours, copy]);

  const quickActions = [
    {
      title: copy.viewAssignedTours,
      icon: Globe2,
      iconWrap: "bg-[#f3ece0] text-[#9f7d52]",
      onClick: () => navigate("/guide/assigned-tours"),
    },
    {
      title: copy.startOngoingTour,
      icon: PlayCircle,
      iconWrap: "bg-[#0b8c87]/10 text-[#0b8c87]",
      onClick: () => navigate("/guide/live-tour-tracking"),
    },
    {
      title: copy.submitIncidentReport,
      icon: FileWarning,
      iconWrap: "bg-[#fff1e7] text-[#c7753d]",
      onClick: () => toast(copy.incidentComingSoon),
    },
  ];

  const dashboardTours = useMemo(
    () =>
      assignedTours.slice(0, 2).map((tour, index) => ({
        id: tour.code || tour.id,
        title: tour.title,
        location: tour.locationShortLabel || copy.unknownLocation,
        shift: index === 0 ? copy.morningDeparture : copy.eveningExperience,
        shiftClass:
          index === 0
            ? "bg-[#fff1e7] text-[#a5662f]"
            : "bg-[#e6f3f1] text-[#165f5a]",
        status: tour.status === "ongoing" ? copy.confirmed : copy.pendingStart,
        statusClass:
          tour.status === "ongoing"
            ? "bg-[#e5f5f1] text-[#0b8c87]"
            : "bg-[#f6eee1] text-[#8e6b3f]",
        dotClass: tour.status === "ongoing" ? "bg-[#0b8c87]" : "bg-[#9f7d52]",
        time: tour.dateRangeLabel || copy.noSchedule,
        passengers: `${tour.passengerCount || 0} ${copy.guests}`,
        detailLabel: copy.language,
        detailValue: (stats?.languages || []).join(", ") || "VI",
        primaryAction:
          tour.status === "ongoing" ? copy.openLiveTracking : copy.reviewTour,
        primaryVariant: tour.status === "ongoing" ? "default" : "outline",
        image:
          tour.cardImage ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBuYXQ7VscEn13MSHD2eAetw1Ldn755zK2Coe8SPq3oeMonKp1NQKC6qdDCT23tfsLKrqQJYxJ-xF7wEgUrmc97b7qbOqsMGtQ_h9dPwmkJ8nNdQKcxuvwMkQsc6nUBxDVBiomDYDQ09blyfOejw3t0atY_Bw31IMtIUsT31TkGW44ssw6FRA-RpmHbSwniYVN3brxwnIc7YRT97nIg9hpRBDv1vdtMI46nEJ6n_rODByA9epUYl8mNaiWNf-OtjCcoS6gRH7zP9pHs",
        bookingId: tour.bookingId,
      })),
    [assignedTours, stats, copy],
  );

  return (
    <main className="min-h-screen bg-[#f6f1e7] px-4 py-8 text-[#213033] md:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 pb-12 pt-14">
        <PageHero
          eyebrow={copy.heroEyebrow}
          heading={
            <>
              {copy.welcomeBack}{" "}
              <span className="rounded-xl bg-[#0b8c87]/8 px-2 py-1 italic text-[#0b8c87]">
                {copy.guide}
              </span>
            </>
          }
          description={copy.description}
          meta={
            <p className="flex items-center gap-2 text-[#666a65]">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#0b8c87]" />
              {assignedTours.length} {copy.toursAssigned}
            </p>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-[#324347] hover:bg-[#f8f4ec]"
                asChild
              >
                <Link to="/guide/assigned-tours">{copy.scheduleView}</Link>
              </Button>
              <Button
                className="h-11 rounded-full bg-[#0b8c87] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(11,140,135,0.18)] hover:bg-[#09726e]"
                asChild
              >
                <Link to="/guide/live-tour-tracking">{copy.startShift}</Link>
              </Button>
            </div>
          }
        />

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <Card
                key={card.label}
                className="rounded-[1.75rem] border border-[#e8ded0] bg-white/92 py-0 shadow-[0_20px_50px_rgba(38,33,28,0.06)]"
              >
                <CardContent className="flex h-full min-h-[10rem] flex-col justify-between p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#8b857c]">
                    {card.label}
                  </span>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-black tracking-tight text-[#243437]">
                      {card.value}
                    </span>
                    <div className={`rounded-[16px] p-3 ${card.iconBg}`}>
                      <Icon className={`size-5 ${card.iconClass}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-bold text-[#243437]">
            {copy.quickOperations}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.onClick}
                  className="group flex items-center gap-4 rounded-[1.75rem] border border-[#e8ded0] bg-white/90 p-5 text-left shadow-[0_18px_45px_rgba(38,33,28,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(38,33,28,0.08)]"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${action.iconWrap}`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="font-semibold text-[#445154]">
                    {action.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2rem] leading-tight tracking-[-0.03em] text-[#243437]">
              {copy.todaysAssignedTours}
            </h2>
            <Button
              variant="link"
              className="h-auto px-0 font-semibold text-[#0b8c87]"
              asChild
            >
              <Link to="/guide/assigned-tours">{copy.viewFullCalendar}</Link>
            </Button>
          </div>

          {dashboardTours.length ? (
            <div className="space-y-6">
              {dashboardTours.map((tour) => (
                <Card
                  key={tour.id}
                  className="group overflow-hidden rounded-[2rem] border border-[#e8ded0] bg-white/92 py-0 shadow-[0_24px_70px_rgba(38,33,28,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(38,33,28,0.12)]"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="h-52 w-full overflow-hidden md:h-auto md:w-72">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <CardContent className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <Badge
                              className={`mb-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${tour.shiftClass}`}
                            >
                              {tour.shift}
                            </Badge>
                            <h3 className="text-xl font-bold text-[#243437]">
                              {tour.title}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-[#666a65]">
                              <span className="flex items-center gap-1">
                                <MapPin className="size-4" />
                                {tour.location}
                              </span>
                              <span className="font-mono font-semibold text-[#445154]">
                                {tour.id}
                              </span>
                            </div>
                          </div>

                          <div className="text-left md:text-right">
                            <span
                              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold ${tour.statusClass}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${tour.dotClass}`} />
                              {tour.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 border-t border-[#ece3d7] py-4 sm:grid-cols-3 sm:gap-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b857c]">
                              {copy.time}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-semibold text-[#324347]">
                              <Clock3 className="size-4 text-[#8b857c]" />
                              {tour.time}
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b857c]">
                              {copy.passengers}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-semibold text-[#324347]">
                              <Users className="size-4 text-[#8b857c]" />
                              {tour.passengers}
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b857c]">
                              {tour.detailLabel}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-semibold text-[#324347]">
                              <UtensilsCrossed className="size-4 text-[#8b857c]" />
                              {tour.detailValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          variant={tour.primaryVariant}
                          className={
                            tour.primaryVariant === "outline"
                              ? "h-11 flex-1 rounded-full border border-[#d8cab6] bg-white font-bold text-[#324347] hover:bg-[#f8f4ec]"
                              : "h-11 flex-1 rounded-full bg-[#0b8c87] font-bold text-white hover:bg-[#09726e]"
                          }
                          asChild
                        >
                          <Link to={`/guide/live-tour-tracking?bookingId=${tour.bookingId}`}>
                            {tour.primaryAction}
                          </Link>
                        </Button>

                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-11 w-11 rounded-full border border-[#e8ded0] bg-[#fbf8f2] text-[#556063] hover:bg-[#f3eee5]"
                        >
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-[2rem] border border-[#e8ded0] bg-white/92 py-0 shadow-[0_24px_70px_rgba(38,33,28,0.08)]">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-[#243437]">
                  {copy.emptyTitle}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#666a65]">
                  {copy.emptyDescription}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
