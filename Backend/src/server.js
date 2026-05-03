import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import providerRoute from "./routes/provider.route.js";
import guideRoute from "./routes/guide.route.js";
import tourRouter from "./routes/tour.route.js";
import serviceRoute from "./routes/service.route.js";
import aiRoute from "./routes/ai.route.js";
import locationRoute from "./routes/location.route.js";
import imageRoute from "./routes/image.route.js";
import tourScheduleRoute from "./routes/tourSchedule.route.js";
import travelerDashboardRoute from "./routes/travelerDashboard.route.js";
import guestRouter from "./routes/guest.route.js";
import bookingRouter from "./routes/booking.route.js";
dotenv.config();

connectDB();

const app = express();

app.use(
    cors({
        origin: [process.env.URL_FE || process.env.FRONTEND_APP_URL || "http://localhost:5173"],
        credentials: true,
        methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/provider", providerRoute);
app.use("/api/guide", guideRoute);
app.use("/api/tours", tourRouter);
app.use("/api/tours", tourScheduleRoute);
app.use("/api/services", serviceRoute);
app.use("/api/ai", aiRoute);
app.use("/api/location", locationRoute);
app.use("/api/images", imageRoute);
app.use("/api/traveler", travelerDashboardRoute);
app.use("/api/guest", guestRouter);
app.use("/api/booking", bookingRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
