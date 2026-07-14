import mongoose from "mongoose";
import dotenv from "dotenv";
import { Province, District, Ward } from "../models/address-division.model.js";

dotenv.config();

async function seedAddresses() {
  try {
    const mongoUri = process.env.URL_MONGODB;
    if (!mongoUri) {
      throw new Error("Missing URL_MONGODB env variable");
    }

    console.log("=== Seeding Vietnamese Provinces Database ===");
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Check if provinces already exist
    const count = await Province.countDocuments();
    if (count > 0) {
      console.log("Database already contains address division data. Skipping seed.");
      process.exit(0);
    }

    console.log("Fetching administrative units from Open API...");
    const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
    if (!response.ok) {
      throw new Error(`Failed to fetch address data: ${response.statusText}`);
    }
    const rawProvinces = (await response.json()) as any[];

    console.log(`Fetched ${rawProvinces.length} provinces. Processing and saving to DB...`);

    // Let's clear any partial records
    await Province.deleteMany({});
    await District.deleteMany({});
    await Ward.deleteMany({});

    const provincesToInsert: any[] = [];
    const districtsToInsert: any[] = [];
    const wardsToInsert: any[] = [];

    for (const p of rawProvinces) {
      provincesToInsert.push({
        code: String(p.code),
        name: p.name,
        fullName: p.name,
        codeName: p.codename,
      });

      for (const d of p.districts) {
        districtsToInsert.push({
          code: String(d.code),
          name: d.name,
          fullName: d.name,
          codeName: d.codename,
          provinceCode: String(p.code),
        });

        for (const w of d.wards) {
          wardsToInsert.push({
            code: String(w.code),
            name: w.name,
            fullName: w.name,
            codeName: w.codename,
            districtCode: String(d.code),
          });
        }
      }
    }

    console.log("Saving provinces...");
    await Province.insertMany(provincesToInsert);
    console.log(`Saved ${provincesToInsert.length} provinces.`);

    console.log("Saving districts...");
    await District.insertMany(districtsToInsert);
    console.log(`Saved ${districtsToInsert.length} districts.`);

    console.log("Saving wards (this may take a few seconds)...");
    // Wards dataset is large (~10k items), so we chunk insert to avoid payload limitations
    const chunkSize = 2000;
    for (let i = 0; i < wardsToInsert.length; i += chunkSize) {
      const chunk = wardsToInsert.slice(i, i + chunkSize);
      await Ward.insertMany(chunk);
    }
    console.log(`Saved ${wardsToInsert.length} wards.`);

    console.log("Address seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Address seeding failed:", error);
    process.exit(1);
  }
}

seedAddresses();
