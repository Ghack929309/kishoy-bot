import express from "express";
import {
  errorNotification,
  eventNotification,
} from "../controllers/notification.controller.js";
const router = express.Router();

router.post("/error-notification", errorNotification);
router.post("/event-notification", eventNotification);

export default router;
