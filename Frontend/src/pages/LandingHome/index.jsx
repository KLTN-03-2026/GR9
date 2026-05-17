import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CalendarRange,
  Check,
  ChevronRight,
  Compass,
  Menu,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
} from "lucide-react";

import bayHero from "@/assets/redesign/bay-hero.png";
import halongTerraceDusk from "@/assets/redesign/halong-terrace-dusk.png";
import hoiAnLanternRain from "@/assets/redesign/hoi-an-lantern-rain-v2.png";
import hueImperialDusk from "@/assets/redesign/hue-imperial-dusk.png";
import sapaMistTerraces from "@/assets/redesign/sapa-mist-terraces-v2.png";
import ChatBotWidget from "@/pages/Traveler/ChatBot/ChatBotWidget";
import { landingChatbotProps } from "@/pages/Traveler/ChatBot/chatbot.data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BrandLogo from "@/components/shared/brand-logo";
import LanguageToggle from "@/components/shared/language-toggle";
import ThemeModeToggle from "@/components/shared/theme-mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AuthContext from "@/context/authContext";
import { useI18n } from "@/i18n/I18nProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({ className = "", children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const buildCopy = (language) =>
  language === "vi"
    ? {
        nav: [
          { label: "Điểm đến", id: "destinations" },
          { label: "Trải nghiệm", id: "experiences" },
          { label: "Lưu trú", id: "stays" },
          { label: "Hành trình đẹp", id: "stories" },
          { label: "Về chúng tôi", id: "about" },
        ],
        loginCta: "Đăng nhập",
        partnerCta: "Dành cho đối tác",
        hero: {
          eyebrow: "Nền tảng du lịch AI cao cấp",
          title: [
            "Hành trình Việt Nam",
            "được thiết kế riêng bởi AI",
            "dành riêng cho bạn",
          ],
          description:
            "SmartTravel kết hợp gu thẩm mỹ du lịch, trí tuệ nhân tạo và hiểu biết bản địa để tạo nên những chuyến đi có nhịp đi riêng, đẹp ngay từ khâu lên kế hoạch.",
          prompt: "Bạn muốn khám phá Việt Nam theo nhịp nào?",
          primary: "Tạo hành trình với AI",
          stats: [
            { value: "10.000+", label: "lịch trình cá nhân hóa" },
            { value: "98%", label: "khách quay lại" },
            { value: "200+", label: "đối tác bản địa" },
          ],
          cardLabel: "Hành trình gợi ý",
          cardTitle: "Di sản miền Trung",
          cardMeta: "7 ngày 6 đêm",
          cardRoute: "Đà Nẵng - Hội An - Huế - Quy Nhơn",
          cardTags: ["Lưu trú đẹp", "Ăn ngon", "Đi thong thả"],
          memoLabel: "Góc nghỉ yên tĩnh",
          memoMeta: "Hoàng hôn trên vịnh",
          brandsLabel: "Tinh hoa Việt Nam được tuyển chọn bởi",
          brands: [
            "Heritage Line",
            "Sofitel Legend",
            "Anantara",
            "InterContinental",
            "Vietnam Airlines",
          ],
        },
        planner: {
          eyebrow: "Lịch trình cao cấp",
          title:
            "AI không chỉ gợi ý điểm đến, mà còn dựng nhịp cảm xúc của cả chuyến đi.",
          description:
            "Bạn nhập sở thích, ngân sách và thói quen. SmartTravel lên khung hành trình, chọn điểm dừng đẹp và gợi cho cả chuyến đi luôn cân bằng, không bị quá tải.",
          cta: "Tìm hiểu cách hoạt động",
          points: [
            "Nhịp sở thích và phong cách du lịch được hiểu ngay từ đầu.",
            "AI gợi ý hành trình phù hợp với bạn thay vì dồn quá nhiều lựa chọn.",
            "Điểm đến, lưu trú và trải nghiệm được chọn theo cùng một tinh thần thẩm mỹ.",
            "Đội ngũ địa phương tinh chỉnh để kế hoạch có thể đi thực tế và linh hoạt.",
          ],
        },
        destinations: {
          eyebrow: "Điểm đến tuyển chọn",
          title:
            "Ba sắc thái Việt Nam cho những người không muốn đi theo lối mòn.",
          items: [
            {
              title: "Vịnh Hạ Long",
              accent: "Thiên nhiên tĩnh lặng",
              description:
                "Mặt nước xanh ngọc, đá vôi và những buổi sớm yên tĩnh trên boong tàu.",
              image: bayHero,
            },
            {
              title: "Hội An sau cơn mưa",
              accent: "Văn hóa & ẩm thực",
              description:
                "Đèn lồng, mặt phố ẩm và cảm giác bữa tối kéo dài thật lâu.",
              image: hoiAnLanternRain,
            },
            {
              title: "Sapa tầng mây",
              accent: "Núi rừng & bản sắc",
              description:
                "Ruộng bậc thang, sương mỏng và nhịp thở chậm của vùng cao.",
              image: sapaMistTerraces,
            },
          ],
          cta: "Khám phá bộ sưu tập",
        },
        story: {
          eyebrow: "Văn hóa & con người",
          title: "Mỗi hành trình là một cuộc gặp gỡ chân thật.",
          description:
            "Chúng tôi tin du lịch đẹp bắt đầu từ sự tôn trọng. Tôn trọng vùng bản địa, thiên nhiên và nhịp sống của mỗi vùng đất.",
          bullets: [
            {
              title: "Trải nghiệm bản địa đích thực",
              description:
                "Kết nối với cộng đồng địa phương qua những câu chuyện thật.",
            },
            {
              title: "Du lịch có trách nhiệm",
              description:
                "Lựa chọn đối tác chia sẻ cùng giá trị bền vững lâu dài.",
            },
            {
              title: "Tính tỉ mỉ trong chi tiết",
              description:
                "Dịch vụ được chọn lọc để bạn cảm thấy an tâm và thoải mái.",
            },
          ],
          cta: "Về triết lý du lịch của chúng tôi",
        },
        testimonials: {
          eyebrow: "Khách hàng nói về chúng tôi",
          title:
            "Một chuyến đi đẹp không cần quá ồn ào, chỉ cần được chăm chút đủ sâu.",
          items: [
            {
              quote:
                "Hành trình được thiết kế quá tinh tế, đúng những gì gia đình tôi tìm kiếm, không phô trương mà rất đáng nhớ.",
              author: "Minh Anh",
              meta: "Hà Nội",
            },
            {
              quote:
                "SmartTravel hiểu gu của tôi hơn cả chính mình. Mỗi điểm dừng đều đẹp và rất “đúng mood”.",
              author: "Quang Huy",
              meta: "TP. Hồ Chí Minh",
            },
            {
              quote:
                "Dịch vụ sang nhưng vẫn giữ được chất Việt. Tôi sẽ đi tiếp cùng SmartTravel trong những hành trình sau.",
              author: "Julie Martin",
              meta: "Paris, France",
            },
          ],
        },
        journeys: {
          eyebrow: "Cảm hứng hành trình",
          title: "Gợi ý hành trình theo phong cách của bạn.",
          filters: [
            { id: "couple", label: "Cặp đôi" },
            { id: "family", label: "Gia đình" },
            { id: "friends", label: "Nhóm bạn" },
            { id: "work", label: "Doanh nghiệp" },
          ],
          groups: {
            couple: [
              {
                title: "Lãng mạn miền Trung",
                days: "5 ngày 4 đêm",
                route: "Đà Nẵng - Hội An - Huế",
                image: halongTerraceDusk,
              },
              {
                title: "Nghỉ dưỡng biển xanh",
                days: "6 ngày 5 đêm",
                route: "Nha Trang - Phú Quốc",
                image: bayHero,
              },
              {
                title: "Sắc xanh Tây Bắc",
                days: "6 ngày 5 đêm",
                route: "Sapa - Mù Cang Chải",
                image: sapaMistTerraces,
              },
              {
                title: "Mekong chậm rãi",
                days: "4 ngày 3 đêm",
                route: "Cần Thơ - Bến Tre - Cà Mau",
                image: hoiAnLanternRain,
              },
            ],
            family: [
              {
                title: "Vui hè trên vịnh",
                days: "4 ngày 3 đêm",
                route: "Hạ Long - Lan Hạ",
                image: bayHero,
              },
              {
                title: "Di sản cho cả nhà",
                days: "5 ngày 4 đêm",
                route: "Huế - Hội An - Đà Nẵng",
                image: hueImperialDusk,
              },
              {
                title: "Bản làng mùa xanh",
                days: "5 ngày 4 đêm",
                route: "Sapa - Bắc Hà",
                image: sapaMistTerraces,
              },
              {
                title: "Cuối tuần phố cổ",
                days: "3 ngày 2 đêm",
                route: "Hội An - Cù Lao Chàm",
                image: hoiAnLanternRain,
              },
            ],
            friends: [
              {
                title: "Đêm đèn lồng và rooftop",
                days: "4 ngày 3 đêm",
                route: "Hội An - Đà Nẵng",
                image: hoiAnLanternRain,
              },
              {
                title: "Roadtrip đèo mây",
                days: "6 ngày 5 đêm",
                route: "Huế - Hải Vân - Hội An",
                image: hueImperialDusk,
              },
              {
                title: "Chạm mây Tây Bắc",
                days: "5 ngày 4 đêm",
                route: "Sapa - Y Tý",
                image: sapaMistTerraces,
              },
              {
                title: "Du thuyền & chill",
                days: "3 ngày 2 đêm",
                route: "Hạ Long - Bãi Tử Long",
                image: halongTerraceDusk,
              },
            ],
            work: [
              {
                title: "Executive retreat bên vịnh",
                days: "3 ngày 2 đêm",
                route: "Hạ Long - Quảng Ninh",
                image: halongTerraceDusk,
              },
              {
                title: "Strategy offsite miền Trung",
                days: "4 ngày 3 đêm",
                route: "Đà Nẵng - Hội An",
                image: hoiAnLanternRain,
              },
              {
                title: "Leadership journey Huế",
                days: "4 ngày 3 đêm",
                route: "Huế - Lăng Cô",
                image: hueImperialDusk,
              },
              {
                title: "Mindful summit vùng cao",
                days: "5 ngày 4 đêm",
                route: "Sapa - Fansipan",
                image: sapaMistTerraces,
              },
            ],
          },
          cta: "Xem chi tiết",
        },
        footer: {
          title: "Bạn đã sẵn sàng cho hành trình của riêng mình?",
          description:
            "Hãy để AI và đội ngũ bản địa của chúng tôi thiết kế hành trình đẹp nhất dành riêng cho bạn.",
          primary: "Tạo hành trình với AI",
          secondary: "Nhận cảm hứng qua email",
          brandDescription:
            "SmartTravel kết hợp trí tuệ du lịch và bản địa để làm nên những hành trình thanh lịch, đúng gu và đáng nhớ.",
          headings: {
            discover: "Khám phá",
            company: "Về chúng tôi",
            help: "Hỗ trợ",
          },
          footerNav: {
            discover: ["Điểm đến", "Trải nghiệm", "Lưu trú", "Hành trình đẹp"],
            company: ["Giới thiệu", "Triết lý du lịch", "Đội ngũ", "Tin tức"],
            help: ["Câu hỏi thường gặp", "Chính sách", "Điều khoản sử dụng", "Liên hệ"],
          },
        },
      }
    : {
        nav: [
          { label: "Destinations", id: "destinations" },
          { label: "Experiences", id: "experiences" },
          { label: "Stays", id: "stays" },
          { label: "Beautiful journeys", id: "stories" },
          { label: "About us", id: "about" },
        ],
        loginCta: "Log in",
        partnerCta: "For partners",
        hero: {
          eyebrow: "Luxury AI travel platform",
          title: [
            "Vietnam journeys",
            "designed by AI",
            "for you alone",
          ],
          description:
            "SmartTravel combines travel taste, local knowledge, and AI planning to shape journeys that feel cinematic, balanced, and deeply personal.",
          prompt: "How would you like to explore Vietnam?",
          primary: "Create with AI",
          stats: [
            { value: "10,000+", label: "personalized itineraries" },
            { value: "98%", label: "returning guests" },
            { value: "200+", label: "local partners" },
          ],
          cardLabel: "Suggested itinerary",
          cardTitle: "Central heritage route",
          cardMeta: "7 days 6 nights",
          cardRoute: "Da Nang - Hoi An - Hue - Quy Nhon",
          cardTags: ["Beautiful stays", "Great dining", "Slow pacing"],
          memoLabel: "Quiet retreat",
          memoMeta: "Sunset over the bay",
          brandsLabel: "Trusted by a curated network of",
          brands: [
            "Heritage Line",
            "Sofitel Legend",
            "Anantara",
            "InterContinental",
            "Vietnam Airlines",
          ],
        },
        planner: {
          eyebrow: "Premium itinerary design",
          title:
            "AI does more than suggest places. It shapes the emotional rhythm of the whole trip.",
          description:
            "You share your taste, budget, and habits. SmartTravel drafts the route, selects the right pauses, and keeps every day elegant instead of overcrowded.",
          cta: "See how it works",
          points: [
            "Your travel taste and preferred pacing are understood from the start.",
            "AI narrows the route to what actually fits you instead of flooding you with options.",
            "Destinations, stays, and experiences are chosen with one aesthetic language in mind.",
            "Local experts refine the plan so it is beautiful in theory and realistic in practice.",
          ],
        },
        destinations: {
          eyebrow: "Curated destinations",
          title:
            "Three shades of Vietnam for travelers who do not want the obvious route.",
          items: [
            {
              title: "Ha Long Bay",
              accent: "Quiet nature",
              description:
                "Emerald water, limestone silhouettes, and unusually calm mornings on deck.",
              image: bayHero,
            },
            {
              title: "Hoi An after rain",
              accent: "Culture & dining",
              description:
                "Lanterns, wet stone streets, and dinners that stretch beautifully into the night.",
              image: hoiAnLanternRain,
            },
            {
              title: "Sapa in the clouds",
              accent: "Highland identity",
              description:
                "Terraced hills, soft mist, and the slower breathing rhythm of the mountains.",
              image: sapaMistTerraces,
            },
          ],
          cta: "Discover the collection",
        },
        story: {
          eyebrow: "Culture & people",
          title: "Every journey should feel like a real encounter.",
          description:
            "We believe beautiful travel begins with respect: respect for place, for local culture, and for the natural rhythm of each region.",
          bullets: [
            {
              title: "Authentic local experiences",
              description:
                "Meet local communities through experiences built from real stories.",
            },
            {
              title: "Responsible travel choices",
              description:
                "We prefer partners who share a long-term sustainable mindset.",
            },
            {
              title: "Attention in the details",
              description:
                "Every service is selected so you feel cared for rather than managed.",
            },
          ],
          cta: "Read our travel philosophy",
        },
        testimonials: {
          eyebrow: "What guests say",
          title:
            "A beautiful trip does not have to be loud. It just needs to be shaped with care.",
          items: [
            {
              quote:
                "The journey was designed with unusual sensitivity. It felt exactly right for what our family wanted.",
              author: "Minh Anh",
              meta: "Hanoi",
            },
            {
              quote:
                "SmartTravel understood my taste better than I expected. Every stop felt precise and deeply atmospheric.",
              author: "Quang Huy",
              meta: "Ho Chi Minh City",
            },
            {
              quote:
                "The service stayed luxurious while still feeling rooted in Vietnam. I would travel with them again.",
              author: "Julie Martin",
              meta: "Paris, France",
            },
          ],
        },
        journeys: {
          eyebrow: "Journey inspiration",
          title: "Suggested routes by travel style.",
          filters: [
            { id: "couple", label: "Couples" },
            { id: "family", label: "Families" },
            { id: "friends", label: "Friends" },
            { id: "work", label: "Corporate" },
          ],
          groups: {
            couple: [
              {
                title: "Romantic central coast",
                days: "5 days 4 nights",
                route: "Da Nang - Hoi An - Hue",
                image: halongTerraceDusk,
              },
              {
                title: "Blue sea retreat",
                days: "6 days 5 nights",
                route: "Nha Trang - Phu Quoc",
                image: bayHero,
              },
              {
                title: "Northern green tones",
                days: "6 days 5 nights",
                route: "Sapa - Mu Cang Chai",
                image: sapaMistTerraces,
              },
              {
                title: "Slow Mekong",
                days: "4 days 3 nights",
                route: "Can Tho - Ben Tre - Ca Mau",
                image: hoiAnLanternRain,
              },
            ],
            family: [
              {
                title: "Summer on the bay",
                days: "4 days 3 nights",
                route: "Ha Long - Lan Ha",
                image: bayHero,
              },
              {
                title: "Heritage for all ages",
                days: "5 days 4 nights",
                route: "Hue - Hoi An - Da Nang",
                image: hueImperialDusk,
              },
              {
                title: "Village greens",
                days: "5 days 4 nights",
                route: "Sapa - Bac Ha",
                image: sapaMistTerraces,
              },
              {
                title: "Old town weekend",
                days: "3 days 2 nights",
                route: "Hoi An - Cu Lao Cham",
                image: hoiAnLanternRain,
              },
            ],
            friends: [
              {
                title: "Lantern nights & rooftops",
                days: "4 days 3 nights",
                route: "Hoi An - Da Nang",
                image: hoiAnLanternRain,
              },
              {
                title: "Cloud pass roadtrip",
                days: "6 days 5 nights",
                route: "Hue - Hai Van - Hoi An",
                image: hueImperialDusk,
              },
              {
                title: "Touch the clouds",
                days: "5 days 4 nights",
                route: "Sapa - Y Ty",
                image: sapaMistTerraces,
              },
              {
                title: "Cruise and exhale",
                days: "3 days 2 nights",
                route: "Ha Long - Bai Tu Long",
                image: halongTerraceDusk,
              },
            ],
            work: [
              {
                title: "Executive bay retreat",
                days: "3 days 2 nights",
                route: "Ha Long - Quang Ninh",
                image: halongTerraceDusk,
              },
              {
                title: "Central strategy offsite",
                days: "4 days 3 nights",
                route: "Da Nang - Hoi An",
                image: hoiAnLanternRain,
              },
              {
                title: "Leadership journey in Hue",
                days: "4 days 3 nights",
                route: "Hue - Lang Co",
                image: hueImperialDusk,
              },
              {
                title: "Mindful mountain summit",
                days: "5 days 4 nights",
                route: "Sapa - Fansipan",
                image: sapaMistTerraces,
              },
            ],
          },
          cta: "View details",
        },
        footer: {
          title: "Ready for a journey that feels truly your own?",
          description:
            "Let AI and our local curators shape the most beautiful version of your next trip.",
          primary: "Create with AI",
          secondary: "Get travel inspiration by email",
          brandDescription:
            "SmartTravel blends travel intelligence and local curation to create journeys that feel elegant, intentional, and memorable.",
          headings: {
            discover: "Discover",
            company: "Company",
            help: "Support",
          },
          footerNav: {
            discover: ["Destinations", "Experiences", "Stays", "Beautiful journeys"],
            company: ["About", "Travel philosophy", "Team", "Journal"],
            help: ["FAQ", "Policies", "Terms", "Contact"],
          },
        },
      };

export default function LandingHome() {
  const { user } = useContext(AuthContext);
  const { language } = useI18n();
  const copy = useMemo(() => buildCopy(language), [language]);
  const [activeJourney, setActiveJourney] = useState(copy.journeys.filters[0].id);
  const [activeNav, setActiveNav] = useState(copy.nav[0].id);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const testimonialRef = useRef(null);
  const loginLabel = language === "vi" ? "Đăng nhập" : "Log in";
  const startLabel = language === "vi" ? "Bắt đầu" : "Start";
  const partnerPrimaryLabel =
    language === "vi" ? "Trở thành đối tác" : "Become a partner";
  const currentRole = String(user?.user?.role || "").toUpperCase();
  const isTraveler = currentRole === "TRAVELER";
  const isStaffRole = ["ADMIN", "PROVIDER", "GUIDE"].includes(currentRole);
  const userDashboardPath =
    currentRole === "ADMIN"
      ? "/admin"
      : currentRole === "PROVIDER"
        ? "/provider"
        : currentRole === "GUIDE"
          ? "/guide"
          : "/traveler";
  const travelerAvatarFallback =
    String(user?.user?.fullName || "T")
      .trim()
      .charAt(0)
      .toUpperCase() || "T";
  const dashboardButtonLabel =
    language === "vi"
      ? currentRole === "ADMIN"
        ? "Về Admin Dashboard"
        : currentRole === "PROVIDER"
          ? "Về Provider Dashboard"
          : "Về Guide Dashboard"
      : currentRole === "ADMIN"
        ? "Go to Admin Dashboard"
        : currentRole === "PROVIDER"
          ? "Go to Provider Dashboard"
          : "Go to Guide Dashboard";
  const travelerProfileLabel = language === "vi" ? "Hồ sơ của tôi" : "My profile";
  const travelerWorkspaceLabel = language === "vi" ? "Về Traveler Dashboard" : "Go to Traveler Dashboard";

  const { scrollY } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: testimonialProgress } = useScroll({
    target: testimonialRef,
    offset: ["start end", "end start"],
  });

  const heroImageY = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroCardsY = useTransform(heroProgress, [0, 1], [0, -28]);
  const storyImageY = useTransform(storyProgress, [0, 1], [30, -34]);
  const testimonialImageY = useTransform(testimonialProgress, [0, 1], [45, -55]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextValue = latest > 36;
    setHeaderScrolled((current) => (current === nextValue ? current : nextValue));
  });

  useEffect(() => {
    const sections = copy.nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveNav(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-22% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.55],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [copy.nav]);

  const scrollToSection = (sectionId) => {
    setActiveNav(sectionId);
    setMobileMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const journeyCards = copy.journeys.groups[activeJourney];

  return (
    <div className="min-h-screen bg-[#f7f3ec] text-[#172022] dark:bg-[#0d1415] dark:text-[#f4efe8]">
      <ChatBotWidget {...landingChatbotProps} />

      <motion.header
        animate={{
          y: headerScrolled ? 0 : 4,
          scale: headerScrolled ? 0.985 : 1,
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-3 z-50 px-4 sm:top-4 sm:px-6 lg:px-8"
      >
        <div
          className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 rounded-[20px] border border-[#dfd7cb] bg-white/86 px-3 py-2.5 text-[#213033] shadow-[0_20px_48px_rgba(22,30,31,0.08)] backdrop-blur-2xl transition-colors dark:border-white/14 dark:bg-[#12191b]/88 dark:text-white sm:gap-5 sm:px-5 sm:py-3"
        >
          <Link to="/" className="shrink-0">
            <>
              <div className="sm:hidden">
                <BrandLogo showText={false} iconClassName="size-8" />
              </div>
              <div className="hidden sm:block">
                <BrandLogo
                  className="gap-2.5"
                  iconClassName="size-9"
                  showTagline
                />
              </div>
            </>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {copy.nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`rounded-[12px] border px-3.5 py-2 text-sm font-medium transition ${
                  activeNav === item.id
                    ? "border-[#d5c3a8] bg-white text-[#0d5c59] shadow-sm dark:border-[#c6b08b]/40 dark:bg-white/8 dark:text-white"
                    : "border-transparent text-[#314446] hover:bg-[#0d5c59]/8 hover:text-[#0d5c59] dark:text-white/70 dark:hover:bg-white/8 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeModeToggle className="!h-9 !w-[66px] !border-[#d9ddd7] !bg-white !shadow-none hover:!bg-[#f5f4ef] dark:!border-white/14 dark:!bg-[#1a2426] dark:hover:!bg-[#223033] sm:!h-10 sm:!w-[74px]" />
            <LanguageToggle
              className="hidden !h-9 !rounded-full !border-[#d9ddd7] !bg-white !px-3 !text-[#213033] hover:!bg-[#f5f4ef] dark:!border-white/14 dark:!bg-[#1a2426] dark:!text-white dark:hover:!bg-[#223033] sm:!h-10 sm:!px-3.5 md:!inline-flex"
            />
            <Link
              to="/login"
              className={`hidden items-center rounded-full border border-[#d8cdbd] bg-white px-4 py-2.5 text-sm font-semibold text-[#324347] transition hover:bg-[#f8f4ec] dark:border-white/14 dark:bg-[#1a2426] dark:text-white/84 dark:hover:bg-[#223033] xl:inline-flex ${isTraveler || isStaffRole ? "!hidden" : ""}`}
            >
              {loginLabel}
            </Link>
            <Link
              to="/signup"
              className={`hidden items-center rounded-full bg-[#efe6d8] px-4 py-2.5 text-sm font-semibold text-[#324347] transition hover:bg-[#e6dbc9] dark:bg-white/10 dark:text-white dark:hover:bg-white/14 xl:inline-flex ${isTraveler || isStaffRole ? "!hidden" : ""}`}
            >
              {startLabel}
            </Link>
            {isTraveler ? (
              <Link
                to="/traveler/profile"
                className="hidden items-center xl:inline-flex"
                aria-label={travelerProfileLabel}
              >
                <Avatar className="size-11 rounded-full border border-[#d8cdbd] shadow-sm dark:border-white/14">
                  <AvatarImage src={user?.user?.avatarUrl} />
                  <AvatarFallback className="bg-[#efe6d8] text-[#324347] dark:bg-white/10 dark:text-white">
                    {travelerAvatarFallback}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : null}
            {isStaffRole ? (
              <Link
                to={userDashboardPath}
                className="hidden items-center rounded-full bg-[#0d5c59] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f3d] dark:bg-[#0f7a74] dark:hover:bg-[#0c615d] xl:inline-flex"
              >
                {dashboardButtonLabel}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d9ddd7] bg-white text-[#213033] transition hover:bg-[#f5f4ef] dark:border-white/14 dark:bg-[#1a2426] dark:text-white dark:hover:bg-[#223033] xl:hidden"
              aria-label={language === "vi" ? "Mở menu điều hướng" : "Open navigation menu"}
            >
              <Menu className="size-4.5" />
            </button>
          </div>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent
            side="right"
            className="w-full border-l border-[#dfd7cb] bg-[#fbf8f2] p-0 text-[#213033] dark:border-white/14 dark:bg-[#12191b] dark:text-white sm:max-w-sm"
          >
            <SheetHeader className="border-b border-[#e8dfd3] px-5 py-5 text-left dark:border-white/10">
              <div className="flex items-center justify-between gap-3 pr-10">
                <BrandLogo className="gap-2" iconClassName="size-8" />
              </div>
              <SheetTitle className="pt-2 text-base font-semibold">
                {language === "vi" ? "Điều hướng SmartTravel" : "SmartTravel navigation"}
              </SheetTitle>
              <SheetDescription className="text-sm text-[#5f7274] dark:text-white/62">
                {language === "vi"
                  ? "Khám phá các điểm đến, câu chuyện và bắt đầu hành trình AI của bạn."
                  : "Explore destinations, stories, and start your AI-planned journey."}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col overflow-y-auto px-5 py-5">
              <div className="mb-5 flex items-center gap-3">
                <ThemeModeToggle className="!h-10 !w-[74px] !border-[#d9ddd7] !bg-white !shadow-none hover:!bg-[#f5f4ef] dark:!border-white/14 dark:!bg-[#1a2426] dark:hover:!bg-[#223033]" />
                <LanguageToggle className="!h-10 !rounded-full !border-[#d9ddd7] !bg-white !px-3.5 !text-[#213033] hover:!bg-[#f5f4ef] dark:!border-white/14 dark:!bg-[#1a2426] dark:!text-white dark:hover:!bg-[#223033]" />
              </div>

              <nav className="grid gap-2">
                {copy.nav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      activeNav === item.id
                        ? "border-[#d5c3a8] bg-white text-[#0d5c59] shadow-sm dark:border-[#c6b08b]/40 dark:bg-white/8 dark:text-white"
                        : "border-[#e8dfd3] bg-white/72 text-[#314446] hover:border-[#d5c3a8] hover:text-[#0d5c59] dark:border-white/10 dark:bg-white/4 dark:text-white/76 dark:hover:bg-white/8 dark:hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="size-4 opacity-70" />
                  </button>
                ))}
              </nav>

              <div className="mt-6 grid gap-3">
                {isTraveler ? (
                  <>
                    <div className="flex items-center gap-3 rounded-[22px] border border-[#e8dfd3] bg-white/72 px-4 py-3 dark:border-white/10 dark:bg-white/4">
                      <Avatar className="size-11 rounded-full border border-[#d8cdbd] shadow-sm dark:border-white/14">
                        <AvatarImage src={user?.user?.avatarUrl} />
                        <AvatarFallback className="bg-[#efe6d8] text-[#324347] dark:bg-white/10 dark:text-white">
                          {travelerAvatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#213033] dark:text-white">
                          {user?.user?.fullName || "Traveler"}
                        </p>
                        <p className="truncate text-xs text-[#5f7274] dark:text-white/62">
                          {user?.user?.email || ""}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/traveler/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#d8cdbd] bg-white px-4 py-2.5 text-sm font-semibold text-[#324347] transition hover:bg-[#f8f4ec] dark:border-white/14 dark:bg-[#1a2426] dark:text-white/84 dark:hover:bg-[#223033]"
                    >
                      {travelerProfileLabel}
                    </Link>
                    <Link
                      to="/traveler"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0d5c59] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f3d] dark:bg-[#0f7a74] dark:hover:bg-[#0c615d]"
                    >
                      {travelerWorkspaceLabel}
                    </Link>
                  </>
                ) : isStaffRole ? (
                  <Link
                    to={userDashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0d5c59] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f3d] dark:bg-[#0f7a74] dark:hover:bg-[#0c615d]"
                  >
                    {dashboardButtonLabel}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#d8cdbd] bg-white px-4 py-2.5 text-sm font-semibold text-[#324347] transition hover:bg-[#f8f4ec] dark:border-white/14 dark:bg-[#1a2426] dark:text-white/84 dark:hover:bg-[#223033]"
                    >
                      {loginLabel}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#efe6d8] px-4 py-2.5 text-sm font-semibold text-[#324347] transition hover:bg-[#e6dbc9] dark:bg-white/10 dark:text-white dark:hover:bg-white/14"
                    >
                      {startLabel}
                    </Link>
                    <Link
                      to="/apply-provider"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0d5c59] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f3d] dark:bg-[#0f7a74] dark:hover:bg-[#0c615d]"
                    >
                      {partnerPrimaryLabel}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.header>

      <main className="overflow-hidden">
        <section ref={heroRef} className="relative min-h-[1080px] overflow-hidden">
          <motion.div style={{ y: heroImageY }} className="absolute inset-0">
            <img
              src={bayHero}
              alt="Ha Long Bay"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,243,236,0.98)_0%,rgba(247,243,236,0.91)_24%,rgba(247,243,236,0.48)_49%,rgba(247,243,236,0.05)_72%,rgba(13,20,21,0.08)_100%)] dark:bg-[linear-gradient(90deg,rgba(13,20,21,0.98)_0%,rgba(13,20,21,0.9)_26%,rgba(13,20,21,0.46)_52%,rgba(13,20,21,0.12)_72%,rgba(13,20,21,0.26)_100%)]" />
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(circle_at_12%_18%,rgba(255,248,238,0.96),transparent_34%),radial-gradient(circle_at_52%_18%,rgba(254,241,220,0.45),transparent_24%)] dark:bg-[radial-gradient(circle_at_12%_18%,rgba(22,30,31,0.92),transparent_32%),radial-gradient(circle_at_52%_18%,rgba(18,36,37,0.48),transparent_24%)]" />

          <div className="relative z-10 mx-auto flex min-h-[1080px] max-w-[1400px] flex-col px-4 pb-14 pt-26 sm:px-6 sm:pt-28 lg:px-8">
            <div className="relative flex flex-1 items-end pt-12">
              <div className="grid w-full gap-10 xl:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
                <Reveal className="relative z-20 max-w-[760px] pb-8 xl:pb-20">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9c7a54] dark:text-[#ceb589]">
                    {copy.hero.eyebrow}
                  </p>
                  <h1 className="mt-7 max-w-[340px] [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.45rem] leading-[0.96] tracking-[-0.05em] text-[#161616] dark:text-[#fcf7f0] sm:max-w-[760px] sm:text-[3.4rem] lg:max-w-[960px] lg:text-[4.05rem] xl:max-w-none xl:text-[4.55rem]">
                    <span className="block">{copy.hero.title[0]}</span>
                    <span className="mt-1 block lg:whitespace-nowrap text-[#0d5c59] dark:text-[#88ddd4]">
                      {copy.hero.title[1]}
                    </span>
                    <span className="mt-1 block lg:whitespace-nowrap">{copy.hero.title[2]}</span>
                  </h1>

                  <p className="mt-6 max-w-[470px] text-[0.98rem] leading-8 text-[#536365] dark:text-[#d8cfc4]/78">
                    {copy.hero.description}
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex min-h-[62px] flex-1 items-center gap-3 rounded-[16px] border border-white/55 bg-white/80 px-4 py-3 shadow-[0_14px_36px_rgba(22,30,31,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#f2e4cf] text-[#9c7a54] dark:bg-[#3d3224] dark:text-[#f0d4a3]">
                        <Sparkles className="size-4" />
                      </div>
                      <p className="text-sm text-[#4d5c5d] dark:text-[#ddd3c7]/80">
                        {copy.hero.prompt}
                      </p>
                    </div>
                    <Link
                      to="/apply-provider"
                      className="inline-flex min-h-[62px] items-center justify-center rounded-[16px] bg-[#0d5c59] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(13,92,89,0.2)] transition hover:-translate-y-0.5 hover:bg-[#084643]"
                    >
                      {partnerPrimaryLabel}
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </div>

                  <div className="mt-8 grid max-w-[520px] gap-4 border-t border-[#e8ddcf] pt-5 dark:border-white/10 sm:grid-cols-3">
                    {copy.hero.stats.map((item) => (
                      <div key={item.label}>
                        <p className="text-[1.45rem] leading-none [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[#151514] dark:text-[#fcf7f0]">
                          {item.value}
                        </p>
                        <p className="mt-1.5 text-sm leading-6 text-[#5d6b6d] dark:text-[#d8cfc4]/72">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <div className="relative hidden xl:block">
                  <motion.div
                    style={{ y: heroCardsY }}
                    className="pointer-events-none absolute right-[8%] top-[7%] z-20 w-[250px] rounded-[18px] border border-white/48 bg-white/78 p-3 shadow-[0_24px_64px_rgba(22,30,31,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141c1f]/88"
                  >
                    <img
                      src={halongTerraceDusk}
                      alt={copy.hero.memoLabel}
                      className="h-40 w-full rounded-[14px] object-cover"
                    />
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c7a54] dark:text-[#ceb589]">
                      {copy.hero.memoLabel}
                    </p>
                    <p className="mt-1 text-sm text-[#5c6b6d] dark:text-white/72">{copy.hero.memoMeta}</p>
                  </motion.div>

                  <motion.div
                    style={{ y: heroCardsY }}
                    className="pointer-events-none absolute left-[4%] top-[30%] z-30 w-[395px] rounded-[22px] border border-white/58 bg-white/86 p-5 shadow-[0_30px_76px_rgba(22,30,31,0.16)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#141c1f]/90"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9c7a54] dark:text-[#ceb589]">
                      {copy.hero.cardLabel}
                    </p>
                    <h2 className="mt-3 text-[2.1rem] leading-none [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[#161615] dark:text-[#fcf7f0]">
                      {copy.hero.cardTitle}
                    </h2>
                    <div className="mt-4 flex items-center gap-2 text-sm text-[#5d6b6d] dark:text-white/68">
                      <CalendarRange className="size-4 text-[#0d5c59] dark:text-[#88ddd4]" />
                      {copy.hero.cardMeta}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#536365] dark:text-white/76">
                      {copy.hero.cardRoute}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {copy.hero.cardTags.map((item) => (
                        <span
                          key={item}
                          className="rounded-[12px] bg-[#f3ede4] px-3 py-1.5 text-xs font-medium text-[#556365] dark:bg-white/10 dark:text-white/78"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <Reveal className="mt-8 border-t border-white/36 pt-6 dark:border-white/10">
              <div className="grid gap-6 xl:grid-cols-[320px_1fr] xl:items-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9c7a54] dark:text-[#ceb589]">
                  {copy.hero.brandsLabel}
                </p>
                <div className="grid gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#748182] dark:text-[#bba789] sm:grid-cols-3 lg:grid-cols-5">
                  {copy.hero.brands.map((brand) => (
                    <span key={brand} className="opacity-88">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="experiences"
          className="mx-auto max-w-[1380px] px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal className="max-w-[550px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9c7a54] dark:text-[#ceb589]">
                {copy.planner.eyebrow}
              </p>
              <h2 className="mt-4 [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.35rem] leading-[1.03] tracking-[-0.04em] dark:text-[#fcf7f0] sm:text-[3.1rem]">
                {copy.planner.title}
              </h2>
              <p className="mt-5 max-w-[500px] text-[0.98rem] leading-8 text-[#526263] dark:text-[#d8cfc4]/76">
                {copy.planner.description}
              </p>
              <Link
                to="/signup"
                className="mt-6 inline-flex items-center text-sm font-semibold text-[#0d5c59] transition hover:text-[#083f3d] dark:text-[#88ddd4]"
              >
                {copy.planner.cta}
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Reveal>

            <Reveal className="grid gap-3">
              {copy.planner.points.map((item, index) => (
                <div
                  key={item}
                  className="grid gap-3 border-b border-[#e7ddd1] pb-4 last:border-b-0 last:pb-0 dark:border-white/10 md:grid-cols-[36px_1fr]"
                >
                  <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#0d5c59] text-white">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm leading-7 text-[#4f5f61] dark:text-[#d9d0c4]/74">
                      {item}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#8e7449] dark:text-[#c9b086]">
                      0{index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section
          id="destinations"
          className="mx-auto max-w-[1380px] px-4 pb-22 sm:px-6 lg:px-8"
        >
          <Reveal className="max-w-[760px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9c7a54] dark:text-[#ceb589]">
              {copy.destinations.eyebrow}
            </p>
            <h2 className="mt-4 [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.35rem] leading-[1.04] tracking-[-0.04em] dark:text-[#fcf7f0] sm:text-[3rem]">
              {copy.destinations.title}
            </h2>
          </Reveal>

          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
            {copy.destinations.items.map((item, index) => (
              <Reveal key={item.title}>
                <article
                  className={`group flex h-full flex-col overflow-hidden border border-white/55 bg-white/80 shadow-[0_24px_60px_rgba(22,30,31,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 ${
                    index === 0
                      ? "rounded-[24px]"
                      : "rounded-[20px]"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[350px]"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c7a54] dark:text-[#ceb589]">
                      {item.accent}
                    </p>
                    <h3 className="mt-3 text-[1.9rem] leading-none [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] dark:text-[#fcf7f0]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#536365] dark:text-[#d8cfc4]/72">
                      {item.description}
                    </p>
                    <Link
                      to="/signup"
                      className="mt-auto pt-4 inline-flex items-center text-sm font-semibold text-[#0d5c59] transition hover:text-[#083f3d] dark:text-[#88ddd4]"
                    >
                      {copy.destinations.cta}
                      <ChevronRight className="ml-1 size-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          id="stays"
          ref={storyRef}
          className="mx-auto max-w-[1380px] px-4 pb-22 sm:px-6 lg:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <div className="relative h-[560px] overflow-hidden rounded-[28px] border border-white/45 shadow-[0_30px_70px_rgba(22,30,31,0.12)]">
                <motion.img
                  src={hueImperialDusk}
                  alt={copy.story.title}
                  style={{ y: storyImageY }}
                  className="absolute inset-0 h-[118%] w-full max-w-none object-cover"
                />
              </div>
            </Reveal>

            <Reveal className="max-w-[520px] lg:pl-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9c7a54] dark:text-[#ceb589]">
                {copy.story.eyebrow}
              </p>
              <h2 className="mt-4 [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.35rem] leading-[1.03] tracking-[-0.04em] dark:text-[#fcf7f0] sm:text-[3rem]">
                {copy.story.title}
              </h2>
              <p className="mt-4 text-[0.98rem] leading-8 text-[#526263] dark:text-[#d8cfc4]/76">
                {copy.story.description}
              </p>

              <div className="mt-8 grid gap-4">
                {copy.story.bullets.map((item, index) => {
                  const icons = [MapPinned, Trees, ShieldCheck];
                  const Icon = icons[index] || Compass;
                  return (
                    <div key={item.title} className="grid gap-2 border-t border-[#e8ddcf] pt-4 first:border-t-0 first:pt-0 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-[14px] bg-[#f1e7d7] text-[#8f7246] dark:bg-white/8 dark:text-[#e8d6b6]">
                          <Icon className="size-4" />
                        </div>
                        <h3 className="text-base font-semibold dark:text-[#fcf7f0]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="pl-[52px] text-sm leading-7 text-[#536365] dark:text-[#d8cfc4]/72">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/signup"
                className="mt-7 inline-flex items-center text-sm font-semibold text-[#0d5c59] transition hover:text-[#083f3d] dark:text-[#88ddd4]"
              >
                {copy.story.cta}
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section
          id="about"
          ref={testimonialRef}
          className="relative overflow-hidden bg-[#123638] py-18 text-white sm:py-22"
        >
          <motion.img
            src={halongTerraceDusk}
            alt=""
            style={{ y: testimonialImageY }}
            className="absolute inset-0 h-[120%] w-full object-cover opacity-46"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,38,41,0.72)_0%,rgba(10,38,41,0.66)_100%)]" />

          <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-[680px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/58">
                {copy.testimonials.eyebrow}
              </p>
              <h2 className="mt-4 [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.35rem] leading-[1.04] tracking-[-0.04em] text-white sm:text-[3rem]">
                {copy.testimonials.title}
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {copy.testimonials.items.map((item) => (
                <Reveal key={item.author}>
                  <article className="border-t border-white/16 pt-5">
                    <div className="flex items-center gap-1 text-[#f4d598]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="size-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-8 text-white/82">“{item.quote}”</p>
                    <div className="mt-5 text-sm">
                      <p className="font-semibold text-white">{item.author}</p>
                      <p className="mt-1 text-white/56">{item.meta}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="stories"
          className="mx-auto max-w-[1380px] px-4 py-22 sm:px-6 lg:px-8"
        >
          <Reveal className="max-w-[720px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9c7a54] dark:text-[#ceb589]">
              {copy.journeys.eyebrow}
            </p>
            <h2 className="mt-4 [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.35rem] leading-[1.04] tracking-[-0.04em] dark:text-[#fcf7f0] sm:text-[3rem]">
              {copy.journeys.title}
            </h2>
          </Reveal>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {copy.journeys.filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveJourney(filter.id)}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  activeJourney === filter.id
                    ? "rounded-full bg-[#0d5c59] text-white shadow-[0_14px_28px_rgba(13,92,89,0.18)]"
                    : "rounded-[14px] text-[#607071] hover:bg-white hover:text-[#0d5c59] dark:text-[#d8cfc4]/74 dark:hover:bg-white/6 dark:hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {journeyCards.map((item) => (
              <Reveal key={`${activeJourney}-${item.title}`}>
                <article className="group overflow-hidden rounded-[20px] border border-white/55 bg-white/80 shadow-[0_20px_50px_rgba(22,30,31,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-[230px] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#9c7a54] dark:text-[#ceb589]">
                      {item.days}
                    </p>
                    <h3 className="mt-3 text-[1.35rem] leading-tight [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] dark:text-[#fcf7f0]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[#566769] dark:text-[#d8cfc4]/72">
                      {item.route}
                    </p>
                    <Link
                      to="/signup"
                      className="mt-4 inline-flex items-center text-sm font-semibold text-[#0d5c59] transition hover:text-[#083f3d] dark:text-[#88ddd4]"
                    >
                      {copy.journeys.cta}
                      <ChevronRight className="ml-1 size-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden">
          <img
            src={halongTerraceDusk}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,42,44,0.4)_0%,rgba(17,42,44,0.58)_100%)]" />

          <div className="relative z-10 mx-auto max-w-[1380px] px-4 py-18 text-white sm:px-6 sm:py-22 lg:px-8">
            <Reveal className="max-w-[680px]">
              <h2 className="text-center [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.35rem] leading-[1.04] tracking-[-0.04em] text-white sm:text-[3rem] lg:text-left">
                {copy.footer.title}
              </h2>
              <p className="mx-auto mt-4 max-w-[560px] text-center text-[0.98rem] leading-8 text-white/88 lg:mx-0 lg:text-left">
                {copy.footer.description}
              </p>
            </Reveal>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/apply-provider"
                className="inline-flex min-h-[58px] items-center justify-center rounded-[16px] bg-[#0d8a84] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0a6d69]"
              >
                {partnerPrimaryLabel}
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <button
                type="button"
                className="inline-flex min-h-[58px] items-center justify-between rounded-[16px] border border-white/28 bg-white/12 px-5 py-3 text-left text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/18 sm:min-w-[290px]"
              >
                <span>{copy.footer.secondary}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="mt-16 grid gap-10 border-t border-white/20 pt-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
              <div className="max-w-[280px]">
                <BrandLogo light className="gap-2.5" iconClassName="size-9" showTagline />
                <p className="mt-4 text-sm leading-7 text-white/82">
                  {copy.footer.brandDescription}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{copy.footer.headings.discover}</p>
                <div className="mt-4 grid gap-2.5 text-sm text-white/82">
                  {copy.footer.footerNav.discover.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{copy.footer.headings.company}</p>
                <div className="mt-4 grid gap-2.5 text-sm text-white/82">
                  {copy.footer.footerNav.company.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">{copy.footer.headings.help}</p>
                <div className="mt-4 grid gap-2.5 text-sm text-white/82">
                  {copy.footer.footerNav.help.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
