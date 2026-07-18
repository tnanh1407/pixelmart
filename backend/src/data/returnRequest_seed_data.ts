export const returnRequestSeedData = [
  {
    _id: "00000000-0000-4000-a000-00000000rr01",
    orderId: "00000000-0000-4000-a000-00000000o003",
    userId: "00000000-0000-4000-a000-000000007532",
    storeId: "00000000-0000-4000-a000-000000009c43",
    reason: "Sản phẩm bị lỗi đóng gói",
    description: "Hộp miến dong bị móp méo, 1 gói bị rách khi nhận hàng. Yêu cầu đổi trả gói bị rách.",
    status: "approved",
    refundAmount: 160000,
    images: ["https://nongsan.buudien.vn/static/buudien/images/category%20(ocop).png"],
    timeline: [
      { status: "pending", note: "Khách hàng gửi yêu cầu trả hàng", changedAt: new Date("2026-03-26") },
      { status: "approved", note: "Chấp nhận yêu cầu trả hàng 1 gói miến bị rách", changedBy: "00000000-0000-4000-a000-000000004e23", changedAt: new Date("2026-03-27") },
    ],
  },
  {
    _id: "00000000-0000-4000-a000-00000000rr02",
    orderId: "00000000-0000-4000-a000-00000000o001",
    userId: "00000000-0000-4000-a000-000000007531",
    storeId: "00000000-0000-4000-a000-000000009c4b",
    reason: "Sản phẩm không đúng mô tả",
    description: "Bưởi nhận được nhỏ hơn so với mô tả Hạng A #1. Yêu cầu hoàn tiền 1 phần.",
    status: "rejected",
    refundAmount: 0,
    rejectedReason: "Sản phẩm đúng tiêu chuẩn Hạng A, size có thể dao động 10%",
    timeline: [
      { status: "pending", note: "Khách hàng gửi yêu cầu trả hàng", changedAt: new Date("2026-01-20") },
      { status: "rejected", note: "Sản phẩm đúng chuẩn, không chấp nhận trả hàng", changedBy: "00000000-0000-4000-a000-000000002711", changedAt: new Date("2026-01-21") },
    ],
  },
];
