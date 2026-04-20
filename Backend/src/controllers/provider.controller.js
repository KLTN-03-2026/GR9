import { success, error } from "../utils/response.js";
import {
  applyProvider,
  listProviderApplications,
  approveProvider,
  rejectProvider,
} from "../services/provider.service.js";

export const applyProviderController = async (req, res) => {
  try {
    const result = await applyProvider(req.body, req.file, req);
    return success(res, result.message, result, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const listProviderApplicationsController = async (req, res) => {
  try {
    const providers = await listProviderApplications();
    return success(res, "Pending provider applications loaded", providers, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const approveProviderController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await approveProvider(id);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const rejectProviderController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await rejectProvider(id);
    return success(res, result.message, result, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
