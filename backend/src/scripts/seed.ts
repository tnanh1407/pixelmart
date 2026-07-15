import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Store from "../models/store.model.js";
import Product from "../models/product.model.js";
import { storeSeedData } from "../data/store_seed_data.js";
import { productSeedData } from "../data/product_seed_data.js";
import { categorySeedData } from "../data/category_seed_data.js";
import { hashPassword } from "../utils/bcrypt.js";

dotenv.config();

// ==================== HELPERS ====================

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  const prefixes = ["090", "091", "092", "093", "094", "095", "096", "097", "098", "099"];
  const prefix = randomPick(prefixes);
  const suffix = String(Math.floor(1000000 + Math.random() * 9000000));
  return prefix + suffix;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ==================== DATA ====================

const firstNames = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Võ", "Đặng", "Bùi",
  "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Mai", "Đào", "Trương", "Lưu", "Cao",
];

const lastNames = [
  "Văn An", "Minh Tuấn", "Hải Nam", "Đình Phúc", "Hoàng Long", "Quốc Việt",
  "Thanh Hằng", "Thúy Hằng", "Ngọc Lan", "Phương Thảo", "Bảo Ngọc", "Kim Anh",
  "Đức Anh", "Quốc Bảo", "Xuân Nam", "Thuận Phát", "Ngọc Hân", "Mai Linh",
  "Thanh Tùng", "Hồng Nhung", "Minh Châu", "Phúc Lâm", "Gia Huy", "Tuệ Nhi",
  "Như Quỳnh", "Đan Trang", "Khánh Linh", "Thái Sơn", "Công Phượng", "Văn Hùng",
  "Phương Anh", "Minh Đức", "Thanh Bình", "Ngọc Ánh", "Hải Yến", "Bảo Châu",
  "Đình Bảo", "Gia Phúc", "Khánh Hoàng", "Nhật Linh",
];

const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "student.edu.vn"];

const avatars = [
  "https://i.pravatar.cc/150?img=1", "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3", "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5", "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7", "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9", "https://i.pravatar.cc/150?img=10",
  "https://i.pravatar.cc/150?img=11", "https://i.pravatar.cc/150?img=12",
];

// ==================== SEED FUNCTIONS ====================

async function seedUsers(): Promise<number> {
  console.log("\n Seeding Users...");

  await User.deleteMany({});
  console.log("   Cleared existing users");

  const users = [];
  const usedEmails = new Set<string>();
  const usedPhones = new Set<string>();

  const hashedPassword = await hashPassword("Password123!");

  for (let i = 0; i < 100; i++) {
    const firstName = randomPick(firstNames);
    const lastName = randomPick(lastNames);
    const name = `${firstName} ${lastName}`;
    const domain = randomPick(domains);
    const slug = generateSlug(lastName);

    let email = `${slug}${i + 1}@${domain}`;
    while (usedEmails.has(email)) {
      email = `${slug}${i + 1}${Math.floor(Math.random() * 100)}@${domain}`;
    }
    usedEmails.add(email);

    let phone = randomPhone();
    while (usedPhones.has(phone)) {
      phone = randomPhone();
    }
    usedPhones.add(phone);

    const gender = randomPick(["male", "female", "other"] as const);
    const role = i === 0 ? "admin" : i < 5 ? "admin" : "user";
    const provider = Math.random() > 0.3 ? "local" : "google";
    const avatar = Math.random() > 0.4 ? randomPick(avatars) : undefined;
    const isEmailVerified = Math.random() > 0.3;
    const isActive = Math.random() > 0.05;
    const createdAt = randomDate(new Date("2024-01-01"), new Date("2026-06-01"));

    users.push({
      name,
      email,
      password: provider === "local" ? hashedPassword : undefined,
      gender,
      role,
      phone,
      provider,
      googleId: provider === "google" ? `google_${i + 1}_${Math.random().toString(36).slice(2)}` : undefined,
      avatar,
      isEmailVerified,
      isActive,
      createdAt,
      updatedAt: createdAt,
    });
  }

  await User.insertMany(users);
  console.log(`   Seeded ${users.length} users`);

  return users.length;
}

async function seedCategories(): Promise<number> {
  console.log("\n Seeding Categories...");

  await Category.deleteMany({});
  console.log("   Cleared existing categories");

  const seeded = await Category.insertMany(categorySeedData);
  console.log(`   Seeded ${seeded.length} categories`);

  return seeded.length;
}

async function seedStores(users: any[]): Promise<any[]> {
  console.log("\n Seeding Stores...");

  await Store.deleteMany({});
  console.log("   Cleared existing stores");

  // Select 20 vendors
  const vendors = users.slice(10, 30);
  const stores = [];

  for (let i = 0; i < storeSeedData.length; i++) {
    const data = storeSeedData[i];
    const vendor = vendors[i % vendors.length];

    // Update user role to vendor
    vendor.role = "vendor";
    await vendor.save();

    stores.push({
      name: data.name,
      slug: `${generateSlug(data.name)}-${i}`,
      logo: data.logo,
      banner: data.banner,
      description: data.description,
      ownerId: String(vendor._id),
      isVerified: data.isVerified,
      isActive: true
    });
  }

  const seededStores = await Store.insertMany(stores);
  console.log(`   Seeded ${seededStores.length} stores`);
  return seededStores;
}

async function seedProducts(categories: any[], stores: any[]): Promise<number> {
  console.log("\n Seeding Products...");

  await Product.deleteMany({});
  console.log("   Cleared existing products");

  const products = [];
  
  for (let i = 0; i < productSeedData.length; i++) {
    const data = productSeedData[i];
    const category = categories[data.categoryIndex];
    const store = stores[data.storeIndex % stores.length];

    // Set flash sale if defined
    let flashSaleConfig = undefined;
    if (data.flashSale) {
      flashSaleConfig = {
        price: data.flashSale.price,
        stock: data.flashSale.stock,
        sold: data.flashSale.sold,
        startDate: new Date(Date.now() + data.flashSale.startDateOffset),
        endDate: new Date(Date.now() + data.flashSale.endDateOffset)
      };
    }

    products.push({
      name: data.name,
      slug: `${generateSlug(data.name)}-${i}`,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice || undefined,
      quantity: data.quantity,
      soldQuantity: data.soldQuantity,
      images: data.images,
      categoryId: String(category._id),
      storeId: String(store._id),
      isFeatured: i % 8 === 0,
      flashSale: flashSaleConfig,
      isActive: data.isActive,
      createdAt: randomDate(new Date("2025-01-01"), new Date("2026-06-01"))
    });
  }

  const seededProducts = await Product.insertMany(products);
  console.log(`   Seeded ${seededProducts.length} products`);
  return seededProducts.length;
}

// ==================== MAIN ====================

async function seed() {
  try {
    const mongoUri = process.env.URL_MONGODB;
    if (!mongoUri) {
      throw new Error("Missing URL_MONGODB env variable");
    }

    console.log("=== Database Seed ===");
    console.log(`Connecting to MongoDB...`);

    await mongoose.connect(mongoUri);
    console.log("Connected successfully\n");

    const totalUsers = await seedUsers();
    const seededUsers = await User.find({});
    
    const seededStores = await seedStores(seededUsers);
    
    const totalCategories = await seedCategories();
    const seededCategories = await Category.find({});
    
    const totalProducts = await seedProducts(seededCategories, seededStores);

    console.log("\n=== Summary ===");
    console.log(`  Users:      ${totalUsers}`);
    console.log(`  Stores:     ${seededStores.length}`);
    console.log(`  Categories: ${totalCategories}`);
    console.log(`  Products:   ${totalProducts}`);

    console.log("\n--- Sample Accounts ---");
    console.log("  Admin:  admin1@gmail.com / Password123!");
    console.log("  User:   user1@gmail.com / Password123!");
    console.log("  (All local provider accounts use password: Password123!)");

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\nSeed failed:", error);
    process.exit(1);
  }
}

seed();
