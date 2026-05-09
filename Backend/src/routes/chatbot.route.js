import express from "express";
import {
  addKbDocumentController,
  askChatbotController,
  ingestTourToKbController,
} from "../controllers/chatbot.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/ask", protect, askChatbotController);
router.post("/kb", protect, authorize("ADMIN", "PROVIDER"), addKbDocumentController);
router.post(
  "/kb/tours/:tourId",
  protect,
  authorize("ADMIN", "PROVIDER"),
  ingestTourToKbController,
);

export default router;
