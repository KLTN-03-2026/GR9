import {
  addKbDocumentService,
  deleteKbDocumentService,
  getKbDocumentByIdService,
  getKbDocumentsService,
  updateKbDocumentService,
} from "../services/kb.service.js";
import { error, success } from "../utils/response.js";

export const getKbDocumentsController = async (req, res) => {
  try {
    const result = await getKbDocumentsService(req.query);
    return success(res, "Knowledge base loaded successfully", result, 200);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};

export const getKbDocumentByIdController = async (req, res) => {
  try {
    const document = await getKbDocumentByIdService(req.params.id);
    return success(res, "Knowledge base document loaded successfully", document, 200);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};

export const createKbDocumentController = async (req, res) => {
  try {
    const document = await addKbDocumentService({
      ...req.body,
      metadata: {
        ...(req.body?.metadata || {}),
        authorName: req.user?.fullName || req.user?.email || "System Admin",
        authorId: String(req.user?._id || req.user?.id || ""),
      },
    });
    return success(res, "Knowledge base document created successfully", document, 201);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};

export const updateKbDocumentController = async (req, res) => {
  try {
    const document = await updateKbDocumentService(req.params.id, {
      ...req.body,
      metadata: {
        ...(req.body?.metadata || {}),
        authorName: req.user?.fullName || req.user?.email || "System Admin",
        authorId: String(req.user?._id || req.user?.id || ""),
      },
    });
    return success(res, "Knowledge base document updated successfully", document, 200);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};

export const deleteKbDocumentController = async (req, res) => {
  try {
    const result = await deleteKbDocumentService(req.params.id);
    return success(res, "Knowledge base document deleted successfully", result, 200);
  } catch (err) {
    return error(res, err.message, err.status || 500, err.errorCode);
  }
};
