import mongoose from "mongoose";
import dotenv from "dotenv";
import CampaignItem from "../models/campaignItem.model.js";
import Campaign from "../models/campaign.model.js";
import Product from "../models/product.model.js";
import { campaignItemSeedData } from "../data/campaignItem_seed_data.js";
dotenv.config();
const mongoUri = process.env.URL_MONGODB;
if (!mongoUri) {
    console.error("Missing URL_MONGODB env variable");
    process.exit(1);
}
async function seedCampaignItems() {
    try {
        console.log("=== Seeding Campaign Items ===");
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB successfully.\n");
        console.log("Clearing existing campaign items...");
        await CampaignItem.deleteMany({});
        console.log("Cleared successfully.\n");
        // Kiểm tra số lượng campaign và product tồn tại
        const campaignCount = await Campaign.countDocuments();
        const productCount = await Product.countDocuments();
        console.log(`Found ${campaignCount} campaigns and ${productCount} products in DB.\n`);
        if (campaignCount === 0 || productCount === 0) {
            console.warn("No campaigns or products found. Please seed campaigns and products first.");
            process.exit(1);
        }
        console.log(`Inserting ${campaignItemSeedData.length} campaign items...`);
        let successCount = 0;
        let skipCount = 0;
        for (const item of campaignItemSeedData) {
            const [campaign, product] = await Promise.all([
                Campaign.findById(item.campaignId),
                Product.findById(item.productId),
            ]);
            if (!campaign) {
                console.warn(`  ⚠ Skip: Campaign "${item.campaignId}" not found.`);
                skipCount++;
                continue;
            }
            if (!product) {
                console.warn(`  ⚠ Skip: Product "${item.productId}" not found.`);
                skipCount++;
                continue;
            }
            await CampaignItem.create(item);
            console.log(`  ✓ Added product "${product.name}" → campaign "${campaign.title}"`);
            successCount++;
        }
        console.log(`\nSeed completed!`);
        console.log(`  ✓ Inserted: ${successCount} items`);
        if (skipCount > 0) {
            console.log(`  ⚠ Skipped : ${skipCount} items (missing campaign or product)`);
        }
        process.exit(0);
    }
    catch (error) {
        console.error("Campaign item seeding failed:", error);
        process.exit(1);
    }
}
seedCampaignItems();
