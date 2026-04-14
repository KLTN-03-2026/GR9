import { success, error } from "../utils/response.js";
import {
  getServices as getServicesService,
  createService as createServiceService,
  updateService as updateServiceService,
  deleteService as deleteServiceService,
} from "../services/service.service.js";

export const getServices = async (req, res) => {
  try {
    const services = await getServicesService(req.user);
    return success(res, "Services loaded successfully", services, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Failed to load services",
      err.status || 500,
      err.errorCode,
    );
  }
};

export const createService = async (req, res) => {
  try {
    const service = await createServiceService(req.body, req.user);
    return success(res, "Service created successfully", service, 201);
  } catch (err) {
    return error(
      res,
      err.message || "Failed to create service",
      err.status || 500,
      err.errorCode,
    );
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await updateServiceService(id, req.body, req.user);
    return success(res, "Service updated successfully", updatedService, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Failed to update service",
      err.status || 500,
      err.errorCode,
    );
  }
};

export const deleteService = async (req, res) => {
  try {
    await deleteServiceService(req.params.id, req.user);
    return success(res, "Service deleted successfully", null, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Failed to delete service",
      err.status || 500,
      err.errorCode,
    );
  }
};
