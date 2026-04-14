import mongoose from "mongoose";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import { throwError } from "../utils/throwError.js";

const allowCreateRoles = ["PROVIDER", "ADMIN", "USER"];

const checkUserExists = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throwError("User not found", 404, "USER_NOT_FOUND");
  }
  return user;
};

const buildOwnershipFilter = (serviceId, user) => {
  const filter = {
    _id: new mongoose.Types.ObjectId(serviceId),
  };

  if (user.role !== "ADMIN") {
    filter.providerId = new mongoose.Types.ObjectId(user._id);
  }

  return filter;
};

export const getServices = async (user) => {
  try {
    const filter = {};

    if (user.role !== "ADMIN") {
      filter.providerId = user._id;
    }

    return await Service.find(filter).sort({ createdAt: -1 });
  } catch (error) {
    throwError(error.message, error.status || 500, "GET_SERVICES_ERROR");
  }
};

export const createService = async (payload, user) => {
  try {
    const currentUser = await checkUserExists(user._id);

    if (!allowCreateRoles.includes(currentUser.role)) {
      throwError("Unauthorized to create service", 403, "UNAUTHORIZED");
    }

    const serviceData = {
      ...payload,
      providerId: currentUser._id,
    };

    return await Service.create(serviceData);
  } catch (error) {
    throwError(error.message, error.status || 500, "CREATE_SERVICE_ERROR");
  }
};

export const updateService = async (serviceId, payload, user) => {
  try {
    const filter = buildOwnershipFilter(serviceId, user);
    const updatePayload = { ...payload };
    delete updatePayload.providerId;

    const updatedService = await Service.findOneAndUpdate(
      filter,
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedService) {
      throwError("Service not found or unauthorized", 404, "SERVICE_NOT_FOUND");
    }

    return updatedService;
  } catch (error) {
    throwError(error.message, error.status || 500, "UPDATE_SERVICE_ERROR");
  }
};

export const deleteService = async (serviceId, user) => {
  try {
    const filter = buildOwnershipFilter(serviceId, user);
    const deletedService = await Service.findOneAndDelete(filter);

    if (!deletedService) {
      throwError("Service not found or unauthorized", 404, "SERVICE_NOT_FOUND");
    }

    return deletedService;
  } catch (error) {
    throwError(error.message, error.status || 500, "DELETE_SERVICE_ERROR");
  }
};
