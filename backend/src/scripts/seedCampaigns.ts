import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Campaign from "../models/campaign.model.js";
import { campaignSeedData } from "../data/campaign_seed_data.js";

dotenv.config();

const mongoUri = process.env.URL_MONGODB;
if (!mongoUri) {
  console.error("Missing URL_MONGODB env variable");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function seedCampaigns() {
  try {
    console.log("=== Seeding Campaigns ===");
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri as string);
    console.log("Connected to MongoDB successfully.\n");

    console.log("Clearing existing campaigns...");
    await Campaign.deleteMany({});
    console.log("Cleared successfully.\n");

    console.log(`Inserting ${campaignSeedData.length} campaigns into the database...`);
    const inserted = await Campaign.insertMany(campaignSeedData);
    console.log(`Successfully seeded ${inserted.length} campaigns!`);

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Campaign seeding failed:", error);
    process.exit(1);
  }
}

seedCampaigns();
