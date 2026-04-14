import Service from "../models/service.model.js";
import { success, error } from "../utils/response.js";

const isProviderOrAdmin = (user) =>
  ["PROVIDER", "ADMIN", "USER"].includes(user.role);

const verifyOwnership = (service, user) => {
  if (user.role === "ADMIN") return true;
  return service.providerId?.toString() === user._id.toString();
};

export const getServices = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== "ADMIN") {
      filter.providerId = req.user._id;
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });
    return success(res, "Services loaded successfully", services, 200);
  } catch (err) {
    return error(res, err.message || "Failed to load services", 500);
  }
};

export const createService = async (req, res) => {
  try {
    if (!isProviderOrAdmin(req.user)) {
      return error(res, "Unauthorized to create service", 403, "UNAUTHORIZED");
    }

    const serviceData = {
      ...req.body,
      providerId: req.user._id,
    };

    const service = await Service.create(serviceData);
    return success(res, "Service created successfully", service, 201);
  } catch (err) {
    return error(res, err.message || "Failed to create service", 500);
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return error(res, "Service not found", 404, "NOT_FOUND");
    }

    if (!verifyOwnership(service, req.user)) {
      return error(
        res,
        "Unauthorized to update this service",
        403,
        "UNAUTHORIZED",
      );
    }

    const updatePayload = { ...req.body };
    delete updatePayload.providerId;

    Object.assign(service, updatePayload);
    const updatedService = await service.save();

    return success(res, "Service updated successfully", updatedService, 200);
  } catch (err) {
    return error(res, err.message || "Failed to update service", 500);
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return error(res, "Service not found", 404, "NOT_FOUND");
    }

    if (!verifyOwnership(service, req.user)) {
      return error(
        res,
        "Unauthorized to delete this service",
        403,
        "UNAUTHORIZED",
      );
    }

    await Service.findByIdAndDelete(id);
    return success(res, "Service deleted successfully", null, 200);
  } catch (err) {
    return error(res, err.message || "Failed to delete service", 500);
  }
};
