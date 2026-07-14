import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Store from "../models/store.model.js";
import Product from "../models/product.model.js";

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
      password: provider === "local" ? "Password123!" : undefined,
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

  const categoriesData = [
    { name: "Sản phẩm OCOP", slug: "san-pham-ocop", description: "Các sản phẩm nông sản thuộc chương trình OCOP", isActive: true },
    { name: "Thực phẩm bổ dưỡng", slug: "thuc-pham-bo-duong", description: "Các loại thực phẩm bổ dưỡng, tốt cho sức khỏe", isActive: true },
    { name: "Sức khỏe và làm đẹp", slug: "suc-khoe-va-lam-dep", description: "Các sản phẩm chăm sóc sức khỏe và làm đẹp tự nhiên", isActive: true },
    { name: "Thực phẩm và Đặc sản", slug: "thuc-pham-va-dac-san", description: "Đặc sản ẩm thực từ các vùng miền đất nước", isActive: true },
    { name: "Đồ uống", slug: "do-uong", description: "Các loại thức uống giải khát, trà, cà phê truyền thống", isActive: true }
  ];

  await Category.insertMany(categoriesData);
  console.log(`   Seeded ${categoriesData.length} categories`);

  return categoriesData.length;
}

async function seedStores(users: any[]): Promise<any[]> {
  console.log("\n Seeding Stores...");

  await Store.deleteMany({});
  console.log("   Cleared existing stores");

  // Select 20 vendors
  const vendors = users.slice(10, 30);
  const storeNames = [
    "Nông Sản Xanh Hà Nội", "Đặc Sản Tây Bắc", "Gạo Ngon Đồng Bằng", "Trái Cây Vườn Việt", "Trà & Cà Phê Cao Nguyên",
    "Rau Sạch Đà Lạt", "Hải Sản Khánh Hòa", "Mật Ong Rừng Cát Bà", "Đông Trùng Tam Đảo", "Gạo Lứt Năm Đấu",
    "Bưởi Đoan Hùng Farm", "Hợp Tác Xã Hữu Cơ", "Đặc Sản Cao Phong", "Hạt Dinh Dưỡng Tây Nguyên", "Nước Trái Cây Hữu Cơ",
    "Gia Vị Vùng Cao", "Nấm Sạch Việt Nam", "Dược Liệu Quý Sapa", "Thực Phẩm Sạch Việt", "Vườn Bách Hóa OCOP"
  ];

  const stores = [];
  for (let i = 0; i < 20; i++) {
    const name = storeNames[i];
    const vendor = vendors[i];

    // Update user role to vendor
    vendor.role = "vendor";
    await vendor.save();

    stores.push({
      name,
      slug: `${generateSlug(name)}-${i}`,
      logo: `https://picsum.photos/100/100?random=${i + 100}`,
      banner: `https://picsum.photos/800/400?random=${i + 200}`,
      description: `Cửa hàng ${name} chuyên cung cấp các mặt hàng nông sản, đặc sản sạch và chất lượng cao.`,
      ownerId: String(vendor._id),
      isVerified: true,
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

  const productTemplates = [
    { name: "Bưởi Đoan Hùng OCOP Phú Thọ", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png" },
    { name: "Bột Gạo Lứt Huyết Rồng OCOP", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(ocop).png" },
    { name: "Mật Ong Bạc Hà OCOP Hà Giang", categoryIndex: 0, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png" },
    { name: "Gạo Nếp Tú Lệ OCOP Yên Bái", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png" },
    { name: "Đông Trùng Hạ Thảo Tam Đảo Sấy Thăng Hoa", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png" },
    { name: "Mật Ong Đông Trùng Hạ Thảo", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png" },
    { name: "Tinh Bột Nghệ Hoàng Minh Châu", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png" },
    { name: "Yến Sào Khánh Hòa Thượng Hạng", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png" },
    { name: "Trà Dây Cao Cấp Sapa", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png" },
    { name: "Dầu Gội Bưởi Hữu Cơ", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png" },
    { name: "Tinh Dầu Sả Chanh Tự Nhiên", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png" },
    { name: "Xà Bông Thảo Dược Sinh Dược", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png" },
    { name: "Thịt Trâu Gác Bếp Tây Bắc", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png" },
    { name: "Măng Ớt Thác Bà Yên Bái", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png" },
    { name: "Khoai Lang Sấy Giòn 365 Fresh", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png" },
    { name: "Mỳ Chũ Bắc Giang Dương Kiên", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png" },
    { name: "Trà Cascara Đông - Phúc Sinh", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png" },
    { name: "Cà Phê Rang Xay K Black", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png" },
    { name: "Trà Atiso Đà Lạt Nguyên Chất", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png" },
    { name: "Nước Ép Trái Cây Hữu Cơ", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png" }
  ];

  const packSizes = ["Túi 500g", "Hộp 200g", "Thùng 5kg", "Lọ 250g", "Hũ 400g", "Gói 1kg"];

  const products = [];
  for (let i = 0; i < 200; i++) {
    const template = productTemplates[i % productTemplates.length];
    const category = categories[template.categoryIndex];
    const store = stores[i % stores.length];
    const pack = packSizes[i % packSizes.length];

    const name = `${template.name} (${pack} - Bản giới hạn #${i + 1})`;
    const price = Math.floor((Math.random() * 20 + 2)) * 10000;
    
    const hasDiscount = Math.random() > 0.75;
    const originalPrice = hasDiscount ? price + Math.floor((Math.random() * 5 + 1)) * 10000 : null;
    const discountPrice = hasDiscount ? price : null;

    const isOnFlashSale = i < 40;
    const flashSaleConfig = isOnFlashSale ? {
      price: price - Math.floor(price * 0.1),
      stock: Math.floor(Math.random() * 20) + 10,
      sold: Math.floor(Math.random() * 5),
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    } : undefined;

    products.push({
      name,
      slug: `${generateSlug(name)}-${i}`,
      description: `Sản phẩm ${name} được chọn lọc kỹ lưỡng, đảm bảo tiêu chuẩn vệ sinh an toàn thực phẩm. Thích hợp làm quà tặng hoặc sử dụng hàng ngày cho gia đình.`,
      price,
      discountPrice,
      quantity: Math.floor(Math.random() * 400) + 50,
      soldQuantity: Math.floor(Math.random() * 100) + 5,
      images: [template.image, `https://picsum.photos/400/400?random=${i}`],
      categoryId: String(category._id),
      storeId: String(store._id),
      flashSale: flashSaleConfig,
      isActive: true,
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
