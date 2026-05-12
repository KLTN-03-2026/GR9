export const formatDateISO = (date) => {
    if (!date) return "";

    if (typeof date === "string") {
        const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";

    const year = parsedDate.getUTCFullYear();
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (date, locale = "vi-VN") => {
    const isoDate = formatDateISO(date);
    if (!isoDate) return "";

    const [year, month, day] = isoDate.split("-").map(Number);
    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
};
