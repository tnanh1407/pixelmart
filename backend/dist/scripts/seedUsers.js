import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import { userSeedData } from "../data/user_seed_data.js";
dotenv.config();
async function seedUsers() {
    try {
        const mongoUri = process.env.URL_MONGODB;
        if (!mongoUri) {
            throw new Error("Missing URL_MONGODB env variable");
        }
        console.log("=== Seeding Users ===");
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected successfully.");
        const count = await User.countDocuments();
        if (count > 0) {
            console.log(`Database already has ${count} users. Deleting existing users before re-seeding...`);
            await User.deleteMany({});
        }
        console.log(`Inserting ${userSeedData.length} users...`);
        await User.insertMany(userSeedData);
        console.log(`Inserted ${userSeedData.length} users successfully.`);
        console.log("User seeding completed!");
        process.exit(0);
    }
    catch (error) {
        console.error("User seeding failed:", error);
        process.exit(1);
    }
}
seedUsers();
