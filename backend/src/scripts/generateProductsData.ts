import * as fs from "fs";
import * as path from "path";

const baseProducts = [
  // Category 0: Sản phẩm OCOP (san-pham-ocop)
  { name: "Bưởi Đoan Hùng OCOP Phú Thọ", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png", storeIndex: 10 },
  { name: "Gạo Nếp Tú Lệ OCOP Yên Bái", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png", storeIndex: 2 },
  { name: "Miến Dong Phia Đén OCOP Cao Bằng", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(ocop).png", storeIndex: 0 },
  { name: "Chè Tân Cương OCOP Thái Nguyên", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(ocop).png", storeIndex: 4 },
  { name: "Mật Ong Bạc Hà OCOP Hà Giang", categoryIndex: 0, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 7 },
  { name: "Hồng Sấy Treo OCOP Đà Lạt", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png", storeIndex: 3 },
  { name: "Tỏi Đen Lý Sơn OCOP Quảng Ngãi", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(ocop).png", storeIndex: 9 },
  { name: "Nước Mắm Sa Châu OCOP Nam Định", categoryIndex: 0, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 6 },
  { name: "Hạt Điều Rang Muối OCOP Bình Phước", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png", storeIndex: 11 },
  { name: "Bột Rau Má Sấy Lạnh OCOP Thanh Hóa", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png", storeIndex: 0 },
  { name: "Cam Cao Phong Lòng Vàng OCOP", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png", storeIndex: 3 },
  { name: "Bột Gạo Lứt Huyết Rồng OCOP", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(ocop).png", storeIndex: 9 },

  // Category 1: Thực phẩm bổ dưỡng (thuc-pham-bo-duong)
  { name: "Đông Trùng Hạ Thảo Tam Đảo Sấy Thăng Hoa", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 8 },
  { name: "Yến Sào Khánh Hòa Thượng Hạng", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 6 },
  { name: "Sâm Ngọc Linh Kon Tum Sấy Khô", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 1 },
  { name: "Tinh Chất Nghệ Hoàng Minh Châu", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 8 },
  { name: "Tỏi Đen Cô Đơn Phan Rang", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 9 },
  { name: "Cao Xương Ngựa Bạch Bắc Giang", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 1 },
  { name: "Nước Cốt Nhân Sâm Hữu Cơ", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 11 },
  { name: "Mật Ong Đông Trùng Hạ Thảo Tam Đảo", categoryIndex: 1, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816160476256.png", storeIndex: 8 },

  // Category 2: Sức khỏe và làm đẹp (suc-khoe-va-lam-dep)
  { name: "Trà Dây Cao Cấp Sapa", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 4 },
  { name: "Dầu Gội Bưởi Hữu Cơ Bến Tre", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 11 },
  { name: "Tinh Dầu Sả Chanh Tự Nhiên Tây Ninh", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 11 },
  { name: "Xà Bông Thảo Dược Sinh Dược", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 11 },
  { name: "Bột Trà Xanh Matcha Thái Nguyên", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 4 },
  { name: "Dầu Dừa Ép Lạnh Tinh Khiết Bến Tre", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 11 },
  { name: "Trà Hoa Cúc Vàng Sấy Lạnh Sapa", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 4 },
  { name: "Muối Tắm Thảo Dược Cổ Truyền", categoryIndex: 2, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816175780973.png", storeIndex: 11 },

  // Category 3: Thực phẩm và Đặc sản (thuc-pham-va-dac-san)
  { name: "Thịt Trâu Gác Bếp Sơn La", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 1 },
  { name: "Măng Ớt Thác Bà Yên Bái", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 1 },
  { name: "Khoai Lang Sấy Giòn Đà Lạt", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 5 },
  { name: "Mỳ Chũ Bắc Giang Sạch", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 2 },
  { name: "Lạp Sườn Gác Bếp Cao Bằng", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 1 },
  { name: "Hạt Mắc Khén Tây Bắc Thơm Ngon", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 1 },
  { name: "Bánh Tráng Tân An Long An", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 2 },
  { name: "Khô Bò Sợi Vắt Chanh Tây Nguyên", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 1 },
  { name: "Giò Bê Nam Đàn Sạch", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 1 },
  { name: "Nấm Hương Khô Tây Bắc", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 0 },
  { name: "Mộc Nhĩ Đen Cát Lâm", categoryIndex: 3, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102409274627225.png", storeIndex: 0 },

  // Category 4: Đồ uống (do-uong)
  { name: "Trà Cascara Đông Sơn", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png", storeIndex: 4 },
  { name: "Cà Phê Rang Xay Nguyên Chất Buôn Ma Thuột", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png", storeIndex: 4 },
  { name: "Trà Atiso Đà Lạt Thượng Hạng", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png", storeIndex: 4 },
  { name: "Nước Ép Trái Sơ Ri Gò Công Hữu Cơ", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png", storeIndex: 3 },
  { name: "Cà Phê Hòa Tan 3in1 Cao Nguyên", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png", storeIndex: 4 },
  { name: "Trà Sen Cung Đình Huế Sạch", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png", storeIndex: 4 },
  { name: "Rượu Mơ Yên Tử Truyền Thống", categoryIndex: 4, image: "https://gateway.vnpost.vn/prod/minio/nsbd/nongsan/home/common/s3_2024102816170139012.png", storeIndex: 4 },
  { name: "Nấm Bào Ngư Xám Tươi", categoryIndex: 0, image: "https://nongsan.buudien.vn/static/buudien/images/category%20(1).png", storeIndex: 5 }
];

const packSizes = [
  "Túi 500g",
  "Hộp 200g",
  "Thùng 5kg",
  "Lọ 250g",
  "Hũ 400g",
  "Gói 1kg",
  "Chai 500ml",
  "Hộp 10 gói"
];

function generateProducts() {
  const products = [];
  
  // Downsized to exactly 30 products
  for (let i = 0; i < 30; i++) {
    const base = baseProducts[i % baseProducts.length];
    const size = packSizes[i % packSizes.length];
    
    // Read storeIndex directly from base product template to align with the 12 specialized stores
    const storeIndex = base.storeIndex;
    
    const name = `${base.name} (${size} - Hạng A #${i + 1})`;
    
    // Set a realistic price range based on category index
    let price = 50000;
    if (base.categoryIndex === 0) { // OCOP
      price = (6 + (i % 15)) * 20000;
    } else if (base.categoryIndex === 1) { // Thực phẩm bổ dưỡng
      price = (20 + (i % 30)) * 50000; // 1M - 2.5M
    } else if (base.categoryIndex === 2) { // Sức khỏe làm đẹp
      price = (8 + (i % 10)) * 15000; 
    } else if (base.categoryIndex === 3) { // Đặc sản
      price = (12 + (i % 18)) * 25000;
    } else { // Đồ uống
      price = (5 + (i % 8)) * 18000;
    }

    const hasDiscount = i % 4 === 0;
    const discountPrice = hasDiscount ? Math.floor(price * 0.85 / 1000) * 1000 : null;
    const originalPrice = hasDiscount ? price : null;
    const finalPrice = hasDiscount ? (discountPrice || price) : price;

    // Flash sale for the first 8 products (out of 30 total)
    const isFlashSale = i < 8;
    const flashSaleConfig = isFlashSale ? {
      price: Math.floor(finalPrice * 0.9 / 1000) * 1000,
      stock: 10 + (i % 15),
      sold: i % 5,
      startDateOffset: -86400000, // Started 1 day ago
      endDateOffset: 604800000     // Ends in 7 days
    } : null;

    products.push({
      name,
      categoryIndex: base.categoryIndex,
      storeIndex,
      description: `Sản phẩm đặc sản ${name} đạt các tiêu chuẩn VietGAP/OCOP nghiêm ngặt, đảm bảo vệ sinh an toàn thực phẩm. Thích hợp sử dụng bồi bổ cơ thể mỗi ngày hoặc làm quà tặng cao cấp ý nghĩa cho gia đình và đối tác.`,
      price: originalPrice || price,
      discountPrice,
      quantity: 100 + (i % 250),
      soldQuantity: 10 + (i % 90),
      images: [
        base.image,
        `https://picsum.photos/400/400?random=${i + 500}`
      ],
      flashSale: flashSaleConfig,
      isActive: true
    });
  }

  // Write file output
  const outputPath = path.resolve("src/data/product_seed_data.ts");
  const codeContent = `export const productSeedData = ${JSON.stringify(products, null, 2)};\n`;
  
  fs.writeFileSync(outputPath, codeContent);
  console.log(`Successfully generated ${products.length} products to product_seed_data.ts`);
}

generateProducts();
