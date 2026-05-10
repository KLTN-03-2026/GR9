import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

const migrateLeadGuideField = async () => {
  if (!MONGO_URL) {
    throw new Error("Missing MONGO_URL or MONGO_URI in environment");
  }

  await mongoose.connect(MONGO_URL, {
    serverSelectionTimeoutMS: 10000,
  });

  const tours = mongoose.connection.collection("tours");
  const tourSchedules = mongoose.connection.collection("tourschedules");
  const legacyTours = await tours
    .find({
      $or: [
        { leadGuideServiceId: { $exists: true, $ne: null } },
        { leadDuideServiceId: { $exists: true, $ne: null } },
      ],
    })
    .toArray();

  let movedToSingleScheduleCount = 0;

  for (const tour of legacyTours) {
    const guideId = tour.leadGuideServiceId || tour.leadDuideServiceId;
    const schedules = await tourSchedules.find({ tourId: tour._id }).toArray();

    if (guideId && schedules.length === 1 && !schedules[0].leadGuideServiceId) {
      await tourSchedules.updateOne(
        { _id: schedules[0]._id },
        { $set: { leadGuideServiceId: guideId } },
      );
      movedToSingleScheduleCount += 1;
    }

    await tours.updateOne(
      { _id: tour._id },
      { $unset: { leadGuideServiceId: "", leadDuideServiceId: "" } },
    );
  }

  console.log(
    `Lead guide migration completed. Moved to single schedules: ${movedToSingleScheduleCount}, cleaned tours: ${legacyTours.length}`,
  );

  await mongoose.disconnect();
};

migrateLeadGuideField().catch(async (error) => {
  console.error("Lead guide migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
