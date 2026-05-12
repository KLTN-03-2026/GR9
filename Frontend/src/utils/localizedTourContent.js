const exactTourDescriptions = {
  "Tour van hoa Hue voi Dai Noi, lang tam va am thuc dac trung co do.":
    "Explore Hue's Imperial City, royal tombs, and signature cuisine from the former capital.",
  "Kham pha Sai Gon hien dai va dia dao Cu Chi trong lich trinh ngan ngay.":
    "Discover modern Saigon and the Cu Chi Tunnels in a compact short-stay itinerary.",
  "Kham pha pho co Ha Noi, am thuc duong pho va cac diem van hoa noi bat.":
    "Explore Hanoi's Old Quarter, street food, and standout cultural landmarks.",
  "Trai nghiem Da Lat voi thac nuoc, nong trai cafe va khong gian cao nguyen.":
    "Experience Da Lat through waterfalls, coffee farms, and highland scenery.",
  "Nghi duong bien Phu Quoc voi dao, snorkeling va lich trinh resort.":
    "Relax in Phu Quoc with island hopping, snorkeling, and a resort-style itinerary.",
  "Tour hang dong Phong Nha voi canh quan song nui va trai nghiem thien nhien.":
    "Explore Phong Nha caves, river landscapes, and nature-focused experiences.",
};

const exactItineraryDescriptions = {
  "Den Da Nang, nhan phong va thuong thuc am thuc dia phuong.":
    "Arrive in Da Nang, check in, and enjoy local cuisine.",
  "Tham quan Ba Na Hills va Cau Vang.":
    "Visit Ba Na Hills and the Golden Bridge.",
  "Kham pha Hoi An truoc khi ket thuc tour.":
    "Explore Hoi An before wrapping up the tour.",
  "Tham quan Van Mieu, Hoan Kiem va thuong thuc am thuc pho co.":
    "Visit the Temple of Literature, Hoan Kiem, and enjoy Old Quarter cuisine.",
  "Tu do dao pho co va di chuyen ra san bay.":
    "Enjoy free time in the Old Quarter before transferring to the airport.",
};

const romanizedVietnamesePattern =
  /\b(kham|pha|tham|quan|am thuc|lich trinh|ngan ngay|van hoa|pho co|dia dao|ket hop|voi|he thong|dich vu|lich|khoi hanh|da dang|den|nhan phong|thuong thuc|nghi duong|tu do|ket thuc|hanh trinh|dia phuong)\b/i;

const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();

function shouldTranslate(value) {
  const text = normalize(value);
  return Boolean(text) && romanizedVietnamesePattern.test(text);
}

function destinationLabel(tour = {}) {
  return tour.location || tour.name || "this destination";
}

export function localizeTourDescription(description, language, tour = {}) {
  const text = normalize(description);
  if (language !== "en" || !text) return text;

  if (exactTourDescriptions[text]) return exactTourDescriptions[text];

  const bulkMatch = text.match(/^Tour (.+?) \d+ ket hop (.+) voi he thong service day du va lich khoi hanh da dang\.$/i);
  if (bulkMatch) {
    return `Explore ${bulkMatch[1]} with ${bulkMatch[2]}, complete services, and flexible departure schedules.`;
  }

  if (shouldTranslate(text)) {
    return `Explore ${destinationLabel(tour)} with a curated itinerary, local highlights, and full travel services.`;
  }

  return text;
}

export function localizeItineraryDescription(description, language, tour = {}) {
  const text = normalize(description);
  if (language !== "en" || !text) return text;

  if (exactItineraryDescriptions[text]) return exactItineraryDescriptions[text];

  const arrivalMatch = text.match(/^Den (.+?), nhan phong/i);
  if (arrivalMatch) return `Arrive in ${arrivalMatch[1]}, check in, and settle into the itinerary.`;

  const exploreMatch = text.match(/^Kham pha (.+?) va/i);
  if (exploreMatch) return `Explore ${exploreMatch[1]} and nearby highlights.`;

  if (shouldTranslate(text)) {
    return `Enjoy a curated day in ${destinationLabel(tour)} with local experiences and planned services.`;
  }

  return text;
}
