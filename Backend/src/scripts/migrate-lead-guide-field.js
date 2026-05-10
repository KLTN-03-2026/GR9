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
  const legacyTours = await tours
    .find({
      leadDuideServiceId: { $exists: true, $ne: null },
      $or: [
        { leadGuideServiceId: { $exists: false } },
        { leadGuideServiceId: null },
      ],
    })
    .toArray();

  let copiedCount = 0;

  for (const tour of legacyTours) {
    await tours.updateOne(
      { _id: tour._id },
      {
        $set: { leadGuideServiceId: tour.leadDuideServiceId },
        $unset: { leadDuideServiceId: "" },
      },
    );
    copiedCount += 1;
  }

  const cleanupResult = await tours.updateMany(
    { leadDuideServiceId: { $exists: true } },
    { $unset: { leadDuideServiceId: "" } },
  );

  console.log(
    `Lead guide migration completed. Copied: ${copiedCount}, cleaned legacy field: ${cleanupResult.modifiedCount}`,
  );

  await mongoose.disconnect();
};

migrateLeadGuideField().catch(async (error) => {
  console.error("Lead guide migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
