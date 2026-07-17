import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Campaign from "../models/campaign.model.js";
import { campaignSeedData } from "../data/campaign_seed_data.js";

dotenv.config();

// Verify env config
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

    const campaignsToInsert = [];

    for (const template of campaignSeedData) {
      console.log(`Uploading image for campaign: "${template.title}"...`);
      try {
        const uploadResult = await cloudinary.uploader.upload(template.sourceUrl, {
          folder: "pixelmart/campaigns",
          resource_type: "image",
        });
        
        console.log(`Uploaded! Secure URL: ${uploadResult.secure_url}`);
        
        campaignsToInsert.push({
          title: template.title,
          shortDescription: template.shortDescription,
          content: template.content,
          image: uploadResult.secure_url,
          isActive: template.isActive,
          startDate: template.startDate ? new Date(template.startDate) : null,
          endDate: template.endDate ? new Date(template.endDate) : null,
          durationInDays: template.durationInDays || null,
          order: template.order,
          author: template.author,
          categoryName: template.categoryName,
          sapo: template.sapo,
          contentSections: template.contentSections,
          highlightsTitle: template.highlightsTitle,
          highlights: template.highlights,
          quote: template.quote,
          quoteAuthor: template.quoteAuthor,
        });
      } catch (uploadError) {
        console.error(`Failed to upload image for "${template.title}":`, uploadError);
      }
    }

    if (campaignsToInsert.length > 0) {
      console.log(`\nInserting ${campaignsToInsert.length} campaigns into the database...`);
      const inserted = await Campaign.insertMany(campaignsToInsert);
      console.log(`Successfully seeded ${inserted.length} campaigns!`);
    } else {
      console.log("No campaigns to insert.");
    }

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Campaign seeding failed:", error);
    process.exit(1);
  }
}

seedCampaigns();
