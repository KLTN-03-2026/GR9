import mongoose from "mongoose";
import Service from "../models/service.model.js";
import Tour from "../models/tour.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const existUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throwError("User not found", 404, "USER_NOT_FOUND");
  }
};

export const createTourService = async (payload, userId) => {
  try {
    await existUser(userId);
    const tour = await Tour.create({
      ...payload,
      providerId: userId,
    });
    return tour;
  } catch (err) {
    throwError(err.message, err.status || 500, "CREATE_TOUR_ERROR");
  }
};

export const updateTourService = async (tourId, payload, userId) => {
  try {
    console.log(tourId);
    await existUser(userId);
    delete payload.providerId;
    const tour = await Tour.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(tourId),
    providerId: new mongoose.Types.ObjectId(userId),
      },
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!tour) {
      throwError("Tour not found", 404, "TOUR_NOT_FOUND");
    }
    return tour;
  } catch (err) {
    throwError(err.message, err.status || 500, "UPDATE_TOUR_ERROR");
  }
};
export const deleteTourService = async (tourId, userId) => {
  try {
    await existUser(userId);
    const tour = await Tour.findOneAndDelete({
      _id: tourId,
      providerId: userId,
    });
    if (!tour) {
      throwError("Tour not found", 404, "TOUR_NOT_FOUND");
    }
    return tour;
  } catch (err) {
    throwError(err.message, err.status || 500, "DELETE_TOUR_ERROR");
  }
};
export const getTourService = async (tourId) => {
  try {
    const tour = await Tour.findById(tourId)
      .populate("providerId", "name email")
      .populate({
        path: "itineraries.activities.serviceId",
        select: "name price",
      });

    if (!tour) {
      throwError("Tour not found", 404, "TOUR_NOT_FOUND");
    }
    console.log(tour);
    return tour;
  } catch (err) {
    throwError(err.message, err.status || 500, "GET_TOUR_ERROR");
  }
};
export const getAllTourService = async () => {
  try {
    const tours = await Tour.find()
      .populate("providerId", "name email")
      .populate({
        path: "itineraries",
        populate: {
          path: "activities",
          populate: {
            path: "serviceId",
          },
        },
      });

    return tours;
  } catch (err) {
    throwError(err.message, err.status || 500, "GET_ALL_TOUR_ERROR");
  }
};
