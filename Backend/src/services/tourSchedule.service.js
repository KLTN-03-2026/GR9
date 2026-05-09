import TourSchedule from "../models/tourSchedule.model.js";
import Tour from "../models/tour.model.js";
import { throwError } from "../utils/throwError.js";

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

export const getTourSchedulesService = async (tourId, userId) => {
    try {
        await ensureTourOwner(tourId, userId);

        return await TourSchedule.find({ tourId }).sort({ departureDate: 1 });
    } catch (err) {
        throwError(err.message, err.status || 500, "GET_TOUR_SCHEDULE_ERROR");
    }
};

export const createTourScheduleService = async (tourId, userId, data) => {
    try {
        await ensureTourOwner(tourId, userId);

        const schedule = await TourSchedule.create({
            tourId,
            ...data,
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

    await ensureTourOwner(schedule.tourId, userId);

    Object.assign(schedule, data);

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
