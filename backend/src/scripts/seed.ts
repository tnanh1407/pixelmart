import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { hashPassword } from "../utils/bcrypt.js";

import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import FlashSale from "../models/flashSale.model.js";
import FlashSaleItem from "../models/flashSaleItem.model.js";
import Campaign from "../models/campaign.model.js";
import CampaignItem from "../models/campaignItem.model.js";
import Cart from "../models/cart.model.js";
import Voucher from "../models/voucher.model.js";
import VoucherUsage from "../models/voucherUsage.model.js";
import Order from "../models/order.model.js";
import PaymentTransaction from "../models/paymentTransaction.model.js";
import ReturnRequest from "../models/returnRequest.model.js";
import Review from "../models/review.model.js";
import Notification from "../models/notification.model.js";

import { userSeedData } from "../data/user_seed_data.js";
import { categorySeedData } from "../data/category_seed_data.js";
import { productSeedData } from "../data/product_seed_data.js";
import { flashSaleSeedData } from "../data/flashSale_seed_data.js";
import { flashSaleItemSeedData } from "../data/flashSaleItem_seed_data.js";
import { campaignSeedData } from "../data/campaign_seed_data.js";
import { campaignItemSeedData } from "../data/campaignItem_seed_data.js";
import { cartSeedData } from "../data/cart_seed_data.js";
import { voucherSeedData } from "../data/voucher_seed_data.js";
import { voucherUsageSeedData } from "../data/voucherUsage_seed_data.js";
import { orderSeedData } from "../data/order_seed_data.js";
import { paymentTransactionSeedData } from "../data/paymentTransaction_seed_data.js";
import { returnRequestSeedData } from "../data/returnRequest_seed_data.js";
import { reviewSeedData } from "../data/review_seed_data.js";
import { notificationSeedData } from "../data/notification_seed_data.js";

dotenv.config();

const args = process.argv.slice(2);
const SKIP_CLOUDINARY = args.includes("--skip-cloudinary");
const DRY_RUN = args.includes("--dry-run");
const RESET = !args.includes("--no-reset");

const mongoUri = process.env.URL_MONGODB;
if (!mongoUri) { console.error("Missing URL_MONGODB env variable"); process.exit(1); }

if (!SKIP_CLOUDINARY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const imageCache = new Map<string, string>();

async function uploadToCloudinary(url: string, folder: string, publicId?: string): Promise<string> {
  if (!url || SKIP_CLOUDINARY) return url;
  if (imageCache.has(url)) return imageCache.get(url)!;

  try {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      resource_type: "image",
      public_id: publicId,
      overwrite: !!publicId,
    });
    imageCache.set(url, result.secure_url);
    return result.secure_url;
  } catch (err: any) {
    console.log(`  Upload failed: ${url} -> ${err?.message?.slice(0, 80)}`);
    return url;
  }
}

async function processSeedImages(
  name: string,
  data: any[],
  options: {
    stringFields?: string[];
    arrayFields?: string[];
    idField?: string;
    folderFn?: (item: any) => string;
  }
): Promise<any[]> {
  if (SKIP_CLOUDINARY || data.length === 0) return data;

  console.log(`  ${name}: uploading images...`);
  const processed = [];

  for (let i = 0; i < data.length; i++) {
    const item = { ...data[i] };
    const itemId = options.idField ? item[options.idField] : (item._id || `item-${i}`);
    const folder = options.folderFn ? options.folderFn(item) : `pixelmart/${name.toLowerCase()}/${itemId}`;

    if (options.stringFields) {
      for (const field of options.stringFields) {
        if (item[field]) {
          const publicId = field;
          item[field] = await uploadToCloudinary(item[field], `${folder}/${field}`, publicId);
        }
      }
    }

    if (options.arrayFields) {
      for (const field of options.arrayFields) {
        if (item[field] && Array.isArray(item[field])) {
          const urls = [];
          for (let j = 0; j < item[field].length; j++) {
            const url = item[field][j];
            if (url) {
              urls.push(await uploadToCloudinary(url, `${folder}/${field}`, `${field}-${j}`));
            } else {
              urls.push(url);
            }
          }
          item[field] = urls;
        }
      }
    }

    processed.push(item);
    if ((i + 1) % 5 === 0 || i === data.length - 1) {
      process.stdout.write(`    ${i + 1}/${data.length}\r`);
    }
  }
  console.log(`    ${data.length} items processed`);
  return processed;
}

const allModels: any[] = [
  User, Category , Product,
  FlashSale, FlashSaleItem, Campaign, CampaignItem,
  Cart, Voucher, VoucherUsage, Order, PaymentTransaction,
  ReturnRequest, Review , Notification,
];

async function resetDatabase() {
  console.log("Clearing all collections...");
  for (const model of allModels) await model.deleteMany({});
  console.log("All collections cleared.\n");
}

async function clearCloudinary() {
  if (SKIP_CLOUDINARY) return;

  console.log("Clearing Cloudinary images...");

  const prefixes = [
    "pixelmart/users",
    "pixelmart/products",
    "pixelmart/stores",
    "pixelmart/categories",
    "pixelmart/campaigns",
    "pixelmart/reviews",
    "pixelmart/returns",
  ];

  let totalDeleted = 0;

  for (const prefix of prefixes) {
    try {
      const result = await cloudinary.api.delete_resources_by_prefix(prefix, {
        resource_type: "image",
      });
      const count = Object.keys(result.deleted || {}).length;
      totalDeleted += count;
      if (count > 0) console.log(`  ${prefix}: deleted ${count} images`);
    } catch (err: any) {
      if (err?.http_code !== 404) {
        console.log(`  ${prefix}: ${err?.message?.slice(0, 80)}`);
      }
    }
  }

  imageCache.clear();

  if (totalDeleted > 0) {
    console.log(`  Total deleted: ${totalDeleted} images\n`);
  } else {
    console.log(`  (no images found)\n`);
  }
}

async function seedCollection(name: string, model: any, data: any[]) {
  if (!data || data.length === 0) { console.log(`  ${name}: no data`); return []; }
  if (DRY_RUN) { console.log(`  ${name}: ${data.length} records (dry-run)`); return []; }
  const result = await model.insertMany(data);
  console.log(`  ${name}: ${result.length} records`);
  return result;
}

async function seed() {
  const startTime = Date.now();
  console.log("==========================================");
  console.log("     PixelMart - Database Seed        ");
  console.log("==========================================\n");

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(mongoUri as string);
  console.log(`Connected to: ${mongoose.connection.host}\n`);

  if (RESET) {
    await resetDatabase();
    await clearCloudinary();
  }

  console.log("--- Tier 1: Users & Auth ---");

  const usersToInsert = [];
  for (let i = 0; i < userSeedData.length; i++) {
    const data = userSeedData[i] as any;
    const userId = data._id || uuidv4();

    let avatarUrl = null;
    if (!SKIP_CLOUDINARY && data.avatar) {
      avatarUrl = await uploadToCloudinary(data.avatar, `pixelmart/users/${userId}/avatar`, "avatar");
      if (avatarUrl) process.stdout.write(`  ${i + 1}/${userSeedData.length} ${data.name}\r`);
    }

    let hashedPassword: string | undefined;
    if (data.password) hashedPassword = await hashPassword(data.password);

    const doc: any = {
      _id: userId, name: data.name, email: data.email,
      gender: data.gender,
      role: data.role, phone: data.phone,
      provider: data.provider, avatar: avatarUrl,
      isEmailVerified: data.isEmailVerified,
      isActive: data.isActive,
    };

    if (data.provider === "google") {
      doc.googleId = `google_${i + 1}_${Math.random().toString(36).slice(2)}`;
    } else {
      doc.password = hashedPassword || await hashPassword("Password123!");
    }

    usersToInsert.push(doc);
  }

  const insertedUsers = await seedCollection("Users", User, usersToInsert);
  const roleCounts: Record<string, number> = { admin: 0, user: 0 };
  insertedUsers.forEach((u: any) => { if (u.role in roleCounts) roleCounts[u.role]++; });
  console.log(`      admin=${roleCounts.admin} user=${roleCounts.user}`);

  console.log("\n--- Tier 2: Core Entities ---");

  const catData = await processSeedImages("Categories", [...categorySeedData], {
    stringFields: ["image"],
    idField: "_id",
    folderFn: (item: any) => `pixelmart/categories/${item._id}`,
  });
  await seedCollection("Categories", Category, catData);

  const prodData = await processSeedImages("Products", [...productSeedData], {
    stringFields: [],
    arrayFields: ["images"],
    idField: "_id",
    folderFn: (item: any) => `pixelmart/products/${item._id}`,
  });
  await seedCollection("Products", Product, prodData);

  console.log("\n--- Tier 3: Marketing ---");
  await seedCollection("FlashSales", FlashSale, flashSaleSeedData);
  await seedCollection("FlashSaleItems", FlashSaleItem, flashSaleItemSeedData);
  await seedCollection("Campaigns", Campaign, campaignSeedData);
  await seedCollection("CampaignItems", CampaignItem, campaignItemSeedData);
  await seedCollection("Vouchers", Voucher, voucherSeedData);

  console.log("\n--- Tier 4: User Data ---");
  await seedCollection("Carts", Cart, cartSeedData);
  await seedCollection("Orders", Order, orderSeedData);
  await seedCollection("PaymentTransactions", PaymentTransaction, paymentTransactionSeedData);
  await seedCollection("VoucherUsages", VoucherUsage, voucherUsageSeedData);

  const returnData = await processSeedImages("ReturnRequests", [...returnRequestSeedData], {
    arrayFields: ["images"],
    idField: "_id",
    folderFn: (item: any) => `pixelmart/returns/${item._id}`,
  });
  await seedCollection("ReturnRequests", ReturnRequest, returnData);

  const revData = await processSeedImages("Reviews", [...reviewSeedData], {
    arrayFields: ["images"],
    idField: "_id",
    folderFn: (item: any) => `pixelmart/reviews/${item._id}`,
  });
  await seedCollection("Reviews", Review, revData);

  console.log("\n--- Tier 5: Communication ---");
  await seedCollection("Notifications", Notification, notificationSeedData);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n==========================================`);
  console.log(`   Seed completed in ${elapsed}s                  `);
  console.log(`==========================================`);

  if (!SKIP_CLOUDINARY) {
    console.log(`\nAll images uploaded to Cloudinary (cache: ${imageCache.size} unique URLs)`);
  }

  console.log("\nAccounts for testing:");
  console.log("  Admin:   admin1@gmail.com  / Password123!");
  console.log("  User:    user1@gmail.com   / Password123!");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
