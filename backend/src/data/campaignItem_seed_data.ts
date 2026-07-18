// campaignItem_seed_data.ts
// Liên kết sản phẩm với từng chiến dịch
// Campaign IDs (từ campaign_seed_data.ts):
//   c351 - Nông Sản Sạch OCOP         → sản phẩm 11171 → 11176
//   c352 - Trái Cây Miền Tây          → sản phẩm 11177 → 1117c
//   c353 - Mật Ong & Trà Thảo Mộc     → sản phẩm 1117d → 000000011182
//   c354 - Gạo Thơm Bản Địa           → sản phẩm 11183 → 11188
//   c355 - Đông Trùng Hạ Thảo         → sản phẩm 11189 → 00000001118e

export const campaignItemSeedData = [
  // ─── Campaign c351: Nông Sản Sạch OCOP (6 sản phẩm) ───
  {
    _id: "00000000-0000-4000-a000-000000cc0001",
    campaignId: "00000000-0000-4000-a000-00000000c351",
    productId: "00000000-0000-4000-a000-000000011171",
    order: 1,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0002",
    campaignId: "00000000-0000-4000-a000-00000000c351",
    productId: "00000000-0000-4000-a000-000000011172",
    order: 2,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0003",
    campaignId: "00000000-0000-4000-a000-00000000c351",
    productId: "00000000-0000-4000-a000-000000011173",
    order: 3,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0004",
    campaignId: "00000000-0000-4000-a000-00000000c351",
    productId: "00000000-0000-4000-a000-000000011174",
    order: 4,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0005",
    campaignId: "00000000-0000-4000-a000-00000000c351",
    productId: "00000000-0000-4000-a000-000000011175",
    order: 5,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0006",
    campaignId: "00000000-0000-4000-a000-00000000c351",
    productId: "00000000-0000-4000-a000-000000011176",
    order: 6,
    isFeatured: false,
  },

  // ─── Campaign c352: Đặc Sản Trái Cây Miền Tây (6 sản phẩm) ───
  {
    _id: "00000000-0000-4000-a000-000000cc0007",
    campaignId: "00000000-0000-4000-a000-00000000c352",
    productId: "00000000-0000-4000-a000-000000011177",
    order: 1,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0008",
    campaignId: "00000000-0000-4000-a000-00000000c352",
    productId: "00000000-0000-4000-a000-000000011178",
    order: 2,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0009",
    campaignId: "00000000-0000-4000-a000-00000000c352",
    productId: "00000000-0000-4000-a000-000000011179",
    order: 3,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc000a",
    campaignId: "00000000-0000-4000-a000-00000000c352",
    productId: "00000000-0000-4000-a000-00000001117a",
    order: 4,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc000b",
    campaignId: "00000000-0000-4000-a000-00000000c352",
    productId: "00000000-0000-4000-a000-00000001117b",
    order: 5,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc000c",
    campaignId: "00000000-0000-4000-a000-00000000c352",
    productId: "00000000-0000-4000-a000-00000001117c",
    order: 6,
    isFeatured: false,
  },

  // ─── Campaign c353: Mật Ong Rừng & Trà Thảo Mộc (6 sản phẩm) ───
  {
    _id: "00000000-0000-4000-a000-000000cc000d",
    campaignId: "00000000-0000-4000-a000-00000000c353",
    productId: "00000000-0000-4000-a000-00000001117d",
    order: 1,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc000e",
    campaignId: "00000000-0000-4000-a000-00000000c353",
    productId: "00000000-0000-4000-a000-00000001117e",
    order: 2,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc000f",
    campaignId: "00000000-0000-4000-a000-00000000c353",
    productId: "00000000-0000-4000-a000-00000001117f",
    order: 3,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0010",
    campaignId: "00000000-0000-4000-a000-00000000c353",
    productId: "00000000-0000-4000-a000-000000011180",
    order: 4,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0011",
    campaignId: "00000000-0000-4000-a000-00000000c353",
    productId: "00000000-0000-4000-a000-000000011181",
    order: 5,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0012",
    campaignId: "00000000-0000-4000-a000-00000000c353",
    productId: "00000000-0000-4000-a000-000000011182",
    order: 6,
    isFeatured: false,
  },

  // ─── Campaign c354: Gạo Thơm Bản Địa (6 sản phẩm) ───
  {
    _id: "00000000-0000-4000-a000-000000cc0013",
    campaignId: "00000000-0000-4000-a000-00000000c354",
    productId: "00000000-0000-4000-a000-000000011183",
    order: 1,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0014",
    campaignId: "00000000-0000-4000-a000-00000000c354",
    productId: "00000000-0000-4000-a000-000000011184",
    order: 2,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0015",
    campaignId: "00000000-0000-4000-a000-00000000c354",
    productId: "00000000-0000-4000-a000-000000011185",
    order: 3,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0016",
    campaignId: "00000000-0000-4000-a000-00000000c354",
    productId: "00000000-0000-4000-a000-000000011186",
    order: 4,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0017",
    campaignId: "00000000-0000-4000-a000-00000000c354",
    productId: "00000000-0000-4000-a000-000000011187",
    order: 5,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc0018",
    campaignId: "00000000-0000-4000-a000-00000000c354",
    productId: "00000000-0000-4000-a000-000000011188",
    order: 6,
    isFeatured: false,
  },

  // ─── Campaign c355: Đông Trùng Hạ Thảo & Nhân Sâm Quý (6 sản phẩm) ───
  {
    _id: "00000000-0000-4000-a000-000000cc0019",
    campaignId: "00000000-0000-4000-a000-00000000c355",
    productId: "00000000-0000-4000-a000-000000011189",
    order: 1,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc001a",
    campaignId: "00000000-0000-4000-a000-00000000c355",
    productId: "00000000-0000-4000-a000-00000001118a",
    order: 2,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc001b",
    campaignId: "00000000-0000-4000-a000-00000000c355",
    productId: "00000000-0000-4000-a000-00000001118b",
    order: 3,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc001c",
    campaignId: "00000000-0000-4000-a000-00000000c355",
    productId: "00000000-0000-4000-a000-00000001118c",
    order: 4,
    isFeatured: true,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc001d",
    campaignId: "00000000-0000-4000-a000-00000000c355",
    productId: "00000000-0000-4000-a000-00000001118d",
    order: 5,
    isFeatured: false,
  },
  {
    _id: "00000000-0000-4000-a000-000000cc001e",
    campaignId: "00000000-0000-4000-a000-00000000c355",
    productId: "00000000-0000-4000-a000-00000001118e",
    order: 6,
    isFeatured: false,
  },
];
