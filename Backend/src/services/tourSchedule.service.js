import TourSchedule from "../models/tourSchedule.model.js";
import Tour from "../models/tour.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";
import { findGuideScheduleConflicts } from "./guide.service.js";

const ensureTourOwner = async (tourId, userId) => {
    const tour = await Tour.findOne({
        _id: tourId,
        providerId: userId,
    });

    if (!tour) {
        throwError("Tour not found or forbidden", 404, "TOUR_NOT_FOUND");
    }

    return tour;
};

const ensureNotPastDepartureDate = (departureDate) => {
    if (!departureDate) return;

    const selectedDate = new Date(departureDate);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        throwError("Ngày khởi hành phải từ hôm nay trở đi", 400, "PAST_DEPARTURE_DATE");
    }
};

const ensureProviderGuide = async (guideId, providerId) => {
    if (!guideId) {
        throwError("Vui lòng chọn guide cho lịch khởi hành", 400, "GUIDE_REQUIRED");
    }

    const guide = await User.findOne({
        _id: guideId,
        role: "GUIDE",
        supervisorId: providerId,
        isActive: { $ne: false },
    }).select("_id fullName email");

    if (!guide) {
        throwError("Guide không tồn tại hoặc không thuộc provider này", 404, "GUIDE_NOT_FOUND");
    }

    return guide;
};

const ensureGuideAvailableForSchedule = async ({ providerId, guideId, tour, departureDate, excludeScheduleId }) => {
    const duplicateGuideSchedule = await TourSchedule.findOne({
        tourId: tour._id,
        leadGuideServiceId: guideId,
        status: { $ne: "CANCELLED" },
        ...(excludeScheduleId ? { _id: { $ne: excludeScheduleId } } : {}),
    }).select("_id");

    if (duplicateGuideSchedule) {
        throwError(
            "Guide này đã được chọn cho lịch khởi hành khác trong tour này",
            409,
            "GUIDE_ALREADY_ASSIGNED_TO_TOUR_SCHEDULE",
        );
    }

    const start = new Date(departureDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (Number(tour.numberOfDay) || 1) - 1);

    const conflicts = await findGuideScheduleConflicts({
        providerId,
        guideId,
        startDate: start,
        endDate: end,
        excludeScheduleId,
    });

    if (conflicts.length) {
        throwError("Guide đã có tour trong khoảng thời gian này", 409, "GUIDE_SCHEDULE_CONFLICT");
    }
};

export const getTourSchedulesService = async (tourId, userId) => {
    try {
        await ensureTourOwner(tourId, userId);

        return await TourSchedule.find({ tourId })
            .populate("leadGuideServiceId", "fullName email avatarUrl")
            .sort({ departureDate: 1 });
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_TOUR_SCHEDULE_ERROR");
    }
};

export const createTourScheduleService = async (tourId, userId, data) => {
    try {
        const tour = await ensureTourOwner(tourId, userId);
        ensureNotPastDepartureDate(data.departureDate);
        await ensureProviderGuide(data.leadGuideServiceId, userId);

        await ensureGuideAvailableForSchedule({
            providerId: userId,
            guideId: data.leadGuideServiceId,
            tour,
            departureDate: data.departureDate,
        });

        const normalizedData = {
            ...data,
            isPrivate: tour.bookingAccess === "TARGET_TRAVELER_ONLY" ? true : !!data.isPrivate,
        };

        const schedule = await TourSchedule.create({
            tourId,
            ...normalizedData,
        });

        return schedule;
    } catch (err) {
        throwError(err.message, err.status || 500, "CREATE_TOUR_SCHEDULE_ERROR");
    }
};

export const updateTourScheduleService = async (scheduleId, userId, data) => {
    const schedule = await TourSchedule.findById(scheduleId);

    if (!schedule) {
        throwError("Schedule not found", 404, "SCHEDULE_NOT_FOUND");
    }

    const tour = await ensureTourOwner(schedule.tourId, userId);
    const nextDepartureDate = data.departureDate || schedule.departureDate;
    const nextGuideId = data.leadGuideServiceId || schedule.leadGuideServiceId;

    ensureNotPastDepartureDate(nextDepartureDate);
    await ensureProviderGuide(nextGuideId, userId);

    await ensureGuideAvailableForSchedule({
        providerId: userId,
        guideId: nextGuideId,
        tour,
        departureDate: nextDepartureDate,
        excludeScheduleId: scheduleId,
    });

    const normalizedData = {
        ...data,
        isPrivate: tour.bookingAccess === "TARGET_TRAVELER_ONLY" ? true : !!data.isPrivate,
    };

    Object.assign(schedule, normalizedData);

    if (schedule.currentBooked >= schedule.maxSlots) {
        schedule.status = "FULL";
    } else {
        schedule.status = "PENDING";
    }

    await schedule.save();

    return schedule;
};

export const deleteTourScheduleService = async (scheduleId, userId) => {
    try {
        const schedule = await TourSchedule.findById(scheduleId);

        if (!schedule) {
            throwError("Schedule not found", 404, "SCHEDULE_NOT_FOUND");
        }

        await ensureTourOwner(schedule.tourId, userId);

        await schedule.deleteOne();

        return true;
    } catch (err) {
        throwError(err.message, err.status || 500, "DELETE_TOUR_SCHEDULE_ERROR");
    }
};
