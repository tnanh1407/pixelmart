import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Banner from "../models/banner.model.js";
import { bannerSeedData } from "../data/banner_seed_data.js";

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

async function seedBanners() {
  try {
    console.log("=== Seeding Banners ===");
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri as string);
    console.log("Connected to MongoDB successfully.\n");

    console.log("Clearing existing banners...");
    await Banner.deleteMany({});
    console.log("Cleared successfully.\n");

    const bannersToInsert = [];

    for (const template of bannerSeedData) {
      console.log(`Uploading image for banner: "${template.title}"...`);
      try {
        const uploadResult = await cloudinary.uploader.upload(template.sourceUrl, {
          folder: "pixelmart/banners",
          resource_type: "image",
        });
        
        console.log(`Uploaded! Secure URL: ${uploadResult.secure_url}`);
        
        bannersToInsert.push({
          title: template.title,
          shortDescription: template.shortDescription,
          image: uploadResult.secure_url,
          link: template.link,
          position: template.position,
          isActive: true,
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

    if (bannersToInsert.length > 0) {
      console.log(`\nInserting ${bannersToInsert.length} banners into the database...`);
      const inserted = await Banner.insertMany(bannersToInsert);
      console.log(`Successfully seeded ${inserted.length} banners!`);
    } else {
      console.log("No banners to insert.");
    }

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Banner seeding failed:", error);
    process.exit(1);
  }
}

seedBanners();
