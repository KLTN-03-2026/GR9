import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";
import { ensureProvider } from "../middlewares/authorizeProvider.js";
import Tour from "../models/tour.model.js";
import TourSchedule from "../models/tourSchedule.model.js";
import Booking from "../models/booking.model.js";
import { sendMail } from "../config/mailer.js";

const generateRandomPassword = (length = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{8,15}$/;
const allowedGenders = ["MALE", "FEMALE", "OTHER"];

const validateGuidePayload = (guideData = {}) => {
    if (!String(guideData.fullName || "").trim()) {
        throwError("Vui lòng nhập tên guide", 400, "GUIDE_NAME_REQUIRED");
    }

    if (String(guideData.fullName || "").trim().length < 3) {
        throwError("Tên guide phải có ít nhất 3 ký tự", 400, "GUIDE_NAME_TOO_SHORT");
    }

    if (!EMAIL_PATTERN.test(String(guideData.email || "").trim())) {
        throwError("Email guide không hợp lệ", 400, "GUIDE_EMAIL_INVALID");
    }

    if (!PHONE_PATTERN.test(String(guideData.phone || "").trim())) {
        throwError("Số điện thoại guide không hợp lệ", 400, "GUIDE_PHONE_INVALID");
    }

    if (!String(guideData.specialty || "").trim()) {
        throwError("Vui lòng nhập chuyên môn của guide", 400, "GUIDE_SPECIALTY_REQUIRED");
    }

    if (guideData.gender && !allowedGenders.includes(guideData.gender)) {
        throwError("Giới tính guide không hợp lệ", 400, "GUIDE_GENDER_INVALID");
    }
};

const sendGuidePasswordMail = async (guide, password) => {
    await sendMail({
        to: guide.email,
        subject: "Tai khoan guide Travel_AI cua ban",
        text: [
            `Xin chao ${guide.fullName || "guide"},`,
            "",
            "Provider da tao tai khoan guide cho ban tren Travel_AI.",
            `Email dang nhap: ${guide.email}`,
            `Mat khau tam thoi: ${password}`,
            "",
            "Vui long dang nhap bang trang guide va doi mat khau trong lan dau su dung.",
            "Travel_AI",
        ].join("\n"),
        html: `
            <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
                <div style="max-width: 560px; margin: 0 auto; border: 1px solid #d1fae5; border-radius: 18px; overflow: hidden;">
                    <div style="background: #0f766e; color: #ffffff; padding: 22px 26px;">
                        <h2 style="margin: 0; font-size: 22px;">Tai khoan guide Travel_AI</h2>
                        <p style="margin: 8px 0 0; opacity: 0.9;">Guide Portal</p>
                    </div>
                    <div style="padding: 24px 26px;">
                        <p>Xin chao <strong>${guide.fullName || "guide"}</strong>,</p>
                        <p>Provider da tao tai khoan guide cho ban. Duoi day la thong tin dang nhap tam thoi:</p>
                        <div style="margin: 18px 0; padding: 16px; border-radius: 14px; background: #f0fdfa;">
                            <p style="margin: 0 0 8px;"><strong>Email dang nhap:</strong> ${guide.email}</p>
                            <p style="margin: 0;"><strong>Mat khau tam thoi:</strong> ${password}</p>
                        </div>
                        <p>Vui long dang nhap bang trang guide va doi mat khau trong lan dau su dung.</p>
                    </div>
                </div>
            </div>
        `,
    });
};

const addDays = (date, days) =>
    new Date(date.getTime() + Math.max(Number(days) || 0, 0) * 86400000);

const normalizeDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date;
};

const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
    aStart <= bEnd && bStart <= aEnd;

const getRangeFromStartAndDays = (startValue, numberOfDay = 1) => {
    const start = normalizeDate(startValue);
    if (!start) return null;
    const end = addDays(start, (Number(numberOfDay) || 1) - 1);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

export const findGuideScheduleConflicts = async ({
    providerId,
    guideId,
    startDate,
    endDate,
    excludeTourId = null,
    excludeScheduleId = null,
}) => {
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);
    if (!guideId || !start || !end) return [];
    end.setHours(23, 59, 59, 999);

    const conflicts = [];
    const directSchedules = await TourSchedule.find({
        leadGuideServiceId: guideId,
        status: { $ne: "CANCELLED" },
        ...(excludeScheduleId ? { _id: { $ne: excludeScheduleId } } : {}),
    })
        .populate({
            path: "tourId",
            match: {
                providerId,
                ...(excludeTourId ? { _id: { $ne: excludeTourId } } : {}),
            },
            select: "_id name numberOfDay location",
        })
        .lean();

    directSchedules
        .filter((schedule) => schedule.tourId)
        .forEach((schedule) => {
            const tour = schedule.tourId;
            const range = getRangeFromStartAndDays(schedule.departureDate, tour?.numberOfDay);
            if (range && rangesOverlap(start, end, range.start, range.end)) {
                conflicts.push({
                    type: "SCHEDULE",
                    tourId: String(tour._id),
                    scheduleId: String(schedule._id),
                    tourName: tour?.name || "Assigned tour",
                    location: tour?.location || "",
                    startDate: range.start,
                    endDate: range.end,
                });
            }
        });

    return conflicts;
};

export const createGuide = async (providerId, guideData) => {
    await ensureProvider(providerId);
    validateGuidePayload(guideData);

    const existingGuide = await User.findOne({ email: guideData.email });

    if (existingGuide) {
        throw throwError("Email đã tồn tại", 400, "EMAIL_ALREADY_EXISTS");
    }
    
    return await User.create({
        ...guideData,
        role: "GUIDE",
        supervisorId: providerId,
        password: null,
        authType: "LOCAL",
        firstJoin: true,
        accountStatus: guideData.isActive === false ? "PENDING" : "ACTIVE",
    });
};

export const getGuides = async (providerId) => {
    await ensureProvider(providerId);

    const guides = await User.find({
        role: "GUIDE",
        supervisorId: providerId,
    }).lean();

    const schedules = await TourSchedule.find({
        leadGuideServiceId: { $in: guides.map((guide) => guide._id) },
        status: { $ne: "CANCELLED" },
    })
        .populate({
            path: "tourId",
            match: { providerId },
            select: "_id name",
        })
        .select("_id tourId leadGuideServiceId")
        .lean();

    const providerSchedules = schedules.filter((schedule) => schedule.tourId);
    const activeBookings = await Booking.find({
        tourScheduleId: { $in: providerSchedules.map((schedule) => schedule._id) },
        payment: "PAID",
        status: { $nin: ["CANCELLED", "REFUNDED", "COMPLETED"] },
    }).select("_id tourScheduleId orderCode").lean();
    const scheduleById = new Map(providerSchedules.map((schedule) => [String(schedule._id), schedule]));
    const statsByGuide = new Map();

    providerSchedules.forEach((schedule) => {
        const guideKey = String(schedule.leadGuideServiceId);
        const stats = statsByGuide.get(guideKey) || {
            assignedTourCount: 0,
            activeBookingCount: 0,
            bookingTitle: "No active booking",
            bookingCode: "-",
            status: "NOT_STARTED",
        };
        stats.assignedTourCount += 1;
        statsByGuide.set(guideKey, stats);
    });

    activeBookings.forEach((booking) => {
        const schedule = scheduleById.get(String(booking.tourScheduleId));
        if (!schedule) return;
        const guideKey = String(schedule.leadGuideServiceId);
        const stats = statsByGuide.get(guideKey) || {
            assignedTourCount: 0,
            activeBookingCount: 0,
            bookingTitle: "No active booking",
            bookingCode: "-",
            status: "NOT_STARTED",
        };
        stats.activeBookingCount += 1;
        stats.bookingTitle = schedule.tourId?.name || "Assigned booking";
        stats.bookingCode = booking.orderCode ? `#${booking.orderCode}` : `#${String(booking._id).slice(-6)}`;
        stats.status = "ON_GOING";
        statsByGuide.set(guideKey, stats);
    });

    return guides.map((guide) => {
        const hasPassword = Boolean(guide.password);
        delete guide.password;

        return {
            ...guide,
            hasPassword,
            ...(statsByGuide.get(String(guide._id)) || {
            assignedTourCount: 0,
            activeBookingCount: 0,
            bookingTitle: "No active booking",
            bookingCode: "-",
            status: "NOT_STARTED",
            }),
        };
    });
};

export const sendGuidePassword = async (providerId, guideId) => {
    await ensureProvider(providerId);

    const guide = await User.findOne({
        _id: guideId,
        role: "GUIDE",
        supervisorId: providerId,
    });

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    if (!guide.email) {
        throw throwError("Guide chưa có email để gửi mật khẩu", 400, "GUIDE_EMAIL_REQUIRED");
    }

    const temporaryPassword = generateRandomPassword(10);
    guide.password = temporaryPassword;
    guide.authType = "LOCAL";
    guide.isActive = true;
    guide.accountStatus = "ACTIVE";
    guide.firstJoin = true;
    guide.emailVerifiedAt = new Date();
    await guide.save();

    try {
        await sendGuidePasswordMail(guide, temporaryPassword);
    } catch (mailError) {
        guide.password = null;
        guide.firstJoin = true;
        await guide.save();

        throw throwError(
            `Không gửi được email mật khẩu guide: ${mailError.message}`,
            500,
            "GUIDE_PASSWORD_MAIL_FAILED",
        );
    }

    return {
        guideId: guide._id,
        email: guide.email,
        message: "Đã gửi mật khẩu tạm thời cho guide qua email",
    };
};

export const getAvailableGuides = async (
    providerId,
    { startDate, endDate, tourId, excludeTourId, excludeScheduleId, onlyAvailable = false },
) => {
    await ensureProvider(providerId);
    const guides = await getGuides(providerId);
    let scheduleRanges = [];
    const tour = tourId
        ? await Tour.findOne({ _id: tourId, providerId }).select("_id numberOfDay")
        : null;

    if (tourId && !tour) {
        throwError("Tour not found or forbidden", 404, "TOUR_NOT_FOUND");
    }

    const usedGuideIdsInTour = tourId
        ? new Set(
              (
                  await TourSchedule.find({
                      tourId,
                      status: { $ne: "CANCELLED" },
                      leadGuideServiceId: { $ne: null },
                      ...(excludeScheduleId ? { _id: { $ne: excludeScheduleId } } : {}),
                  })
                      .select("leadGuideServiceId")
                      .lean()
              ).map((schedule) => String(schedule.leadGuideServiceId)),
          )
        : new Set();

    if (tourId && startDate && !endDate) {
        const range = getRangeFromStartAndDays(startDate, tour.numberOfDay);
        if (range) scheduleRanges = [{ startDate: range.start, endDate: range.end }];
    } else if (tourId && (!startDate || !endDate)) {
        const schedules = await TourSchedule.find({
            tourId,
            status: { $ne: "CANCELLED" },
        }).lean();

        scheduleRanges = schedules
            .filter((schedule) => !excludeScheduleId || String(schedule._id) !== String(excludeScheduleId))
            .map((schedule) => {
                const range = getRangeFromStartAndDays(schedule.departureDate, tour.numberOfDay);
                return range
                    ? {
                          startDate: range.start,
                          endDate: range.end,
                      }
                    : null;
            })
            .filter(Boolean);
    } else if (startDate && endDate) {
        scheduleRanges = [{ startDate, endDate }];
    }

    const data = await Promise.all(
        guides.map(async (guide) => {
            const conflictGroups = await Promise.all(
                scheduleRanges.map((range) =>
                    findGuideScheduleConflicts({
                        providerId,
                        guideId: guide._id,
                        startDate: range.startDate,
                        endDate: range.endDate,
                        excludeTourId,
                        excludeScheduleId,
                    }),
                ),
            );
            const conflicts = conflictGroups.flat();
            const alreadyUsedInTour = usedGuideIdsInTour.has(String(guide._id));

            return {
                ...guide,
                isAvailable: conflicts.length === 0 && !alreadyUsedInTour,
                conflicts,
                unavailableReason: alreadyUsedInTour
                    ? "Guide này đã được chọn cho lịch khởi hành khác trong tour này"
                    : conflicts[0]?.tourName
                      ? `Guide đang bận với ${conflicts[0].tourName}`
                      : null,
            };
        }),
    );

    return onlyAvailable ? data.filter((guide) => guide.isAvailable) : data;
};

export const getGuideById = async (id) => {
    const guide = await User.findById(id);

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    return guide;
};

export const deleteGuide = async (providerId, guideId) => {
    await ensureProvider(providerId);

    const guide = await User.findOne({
        _id: guideId,
        supervisorId: providerId,
    });

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    return await User.findByIdAndDelete(guideId);
};

export const updateGuide = async (providerId, guideId, guideData) => {
    await ensureProvider(providerId);
    validateGuidePayload(guideData);

    const guide = await User.findOne({
        _id: guideId,
        supervisorId: providerId,
    });

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    return await User.findByIdAndUpdate(guideId, guideData, {
        new: true,
    });
};

export const uploadGuideAvatar = async (providerId, guideId, imageUrl) => {
    await ensureProvider(providerId);

    const guide = await User.findOneAndUpdate(
        {
            _id: guideId,
            role: "GUIDE",
            supervisorId: providerId,
        },
        { avatarUrl: imageUrl },
        {
            new: true,
            runValidators: true,
        },
    );

    if (!guide) {
        throw throwError("Không tìm thấy guide", 404, "GUIDE_NOT_FOUND");
    }

    return guide;
};
