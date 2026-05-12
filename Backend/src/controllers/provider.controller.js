import { success, error } from "../utils/response.js";
import {
  applyProvider,
  listProviderApplications,
  listProcessedProviderApplications,
  approveProvider,
  rejectProvider,
  getActiveProviderPolicy,
  uploadProviderPolicy,
} from "../services/provider.service.js";
import { getProviderAnalytics, getProviderDashboard } from "../services/dashboard.service.js";

export const getProviderDashboardController = async (req, res) => {
  try {
    const dashboard = await getProviderDashboard(req.user?._id || req.user?.id);
    return success(res, "Get provider dashboard successfully", dashboard, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const getProviderAnalyticsController = async (req, res) => {
  try {
    const analytics = await getProviderAnalytics(req.user?._id || req.user?.id);
    return success(res, "Get provider analytics successfully", analytics, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

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

export const listProcessedProviderApplicationsController = async (req, res) => {
  try {
    const providers = await listProcessedProviderApplications();
    return success(res, "Processed provider applications loaded", providers, 200);
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

export const getActiveProviderPolicyController = async (req, res) => {
  try {
    const policy = await getActiveProviderPolicy();
    return success(res, "Active provider policy loaded", policy, 200);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};

export const uploadProviderPolicyController = async (req, res) => {
  try {
    const policy = await uploadProviderPolicy(req.body, req.file, req.user?._id);
    return success(res, "Provider policy uploaded", policy, 201);
  } catch (err) {
    return error(res, err.message, err.status, err.errorCode);
  }
};
