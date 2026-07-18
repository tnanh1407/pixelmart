export const notificationSeedData = [
  // ===== Order Notifications =====
  {
    userId: "00000000-0000-4000-a000-000000007531",
    type: "order",
    title: "Đơn hàng #DH001 đã được xác nhận",
    message: "Đơn hàng #DH001 của bạn đã được xác nhận và đang được chuẩn bị. Dự kiến giao hàng vào ngày 20/07/2026.",
    link: "/orders/DH001",
    metadata: { orderId: "DH001", status: "confirmed" },
  },
  {
    userId: "00000000-0000-4000-a000-000000007531",
    type: "order",
    title: "Đơn hàng #DH002 đang được giao",
    message: "Đơn hàng #DH002 đang trên đường giao đến bạn. Shipper: Nguyễn Văn A - 0912.345.678",
    link: "/orders/DH002",
    isRead: true,
    metadata: { orderId: "DH002", status: "shipping" },
  },
  {
    userId: "00000000-0000-4000-a000-000000007532",
    type: "order",
    title: "Đơn hàng #DH003 đã giao thành công",
    message: "Đơn hàng #DH003 đã được giao thành công. Cảm ơn bạn đã mua sắm tại PixelMart! Hãy đánh giá sản phẩm nhé.",
    link: "/orders/DH003/review",
    metadata: { orderId: "DH003", status: "delivered" },
  },
  {
    userId: "00000000-0000-4000-a000-000000007533",
    type: "order",
    title: "Đơn hàng #DH004 đã bị hủy",
    message: "Đơn hàng #DH004 đã bị hủy theo yêu cầu. Số tiền 250.000đ sẽ được hoàn lại trong 3-5 ngày làm việc.",
    link: "/orders/DH004",
    isRead: true,
    metadata: { orderId: "DH004", status: "cancelled", refundAmount: 250000 },
  },

  // ===== Promotion Notifications =====
  {
    userId: "00000000-0000-4000-a000-000000007531",
    type: "promotion",
    title: "Flash Sale Summer 2026 đã bắt đầu!",
    message: "Săn ngay hàng ngàn sản phẩm OCOP chất lượng cao với giá sốc chỉ từ 17/07 đến 24/07/2026. Giảm đến 50%!",
    link: "/flash-sale/summer-2026",
  },
  {
    userId: "00000000-0000-4000-a000-000000007532",
    type: "promotion",
    title: "Mã giảm giá BIGSALE20 đã được thêm vào tài khoản của bạn",
    message: "Bạn nhận được mã BIGSALE20 - Giảm 20% tối đa 100K cho đơn hàng từ 500K. Áp dụng đến hết 31/07/2026.",
    link: "/vouchers",
    metadata: { voucherCode: "BIGSALE20" },
  },
  {
    userId: "00000000-0000-4000-a000-000000007534",
    type: "promotion",
    title: "Ưu đãi đặc biệt: Miễn phí vận chuyển",
    message: "Từ nay đến hết tháng 7, miễn phí vận chuyển cho mọi đơn hàng từ 200.000đ. Nhanh tay mua sắm thôi!",
    link: "/promotions",
  },

  // ===== System Notifications =====
  {
    userId: "00000000-0000-4000-a000-000000007531",
    type: "system",
    title: "Cập nhật điều khoản sử dụng",
    message: "PixelMart đã cập nhật Điều khoản sử dụng và Chính sách bảo mật. Vui lòng đọc và xác nhận để tiếp tục sử dụng dịch vụ.",
    link: "/terms",
    isRead: true,
  },
  {
    userId: "00000000-0000-4000-a000-000000007532",
    type: "system",
    title: "Xác thực tài khoản thành công",
    message: "Tài khoản của bạn đã được xác thực email thành công. Bạn có thể sử dụng đầy đủ các tính năng của PixelMart.",
    isRead: true,
  },
  {
    userId: "00000000-0000-4000-a000-000000007533",
    type: "system",
    title: "Bảo trì hệ thống định kỳ",
    message: "Hệ thống PixelMart sẽ bảo trì từ 02:00 - 04:00 ngày 20/07/2026. Một số dịch vụ có thể tạm thời gián đoạn.",
    link: "/system-status",
  },

  // ===== Vendor Notifications =====
  {
    userId: "00000000-0000-4000-a000-000000004e21",
    senderId: "00000000-0000-4000-a000-000000002711",
    type: "vendor",
    title: "Tài khoản người bán đã được duyệt",
    message: "Chúc mừng! Tài khoản người bán của bạn đã được phê duyệt. Bạn có thể bắt đầu đăng bán sản phẩm ngay bây giờ.",
    link: "/seller/dashboard",
    isRead: true,
    metadata: { vendorId: "00000000-0000-4000-a000-00000000b001" },
  },
  {
    userId: "00000000-0000-4000-a000-000000004e22",
    senderId: "00000000-0000-4000-a000-000000002712",
    type: "vendor",
    title: "Tài khoản người bán đã được duyệt",
    message: "Chúc mừng! Tài khoản người bán của bạn đã được phê duyệt. Bạn có thể bắt đầu đăng bán sản phẩm ngay bây giờ.",
    link: "/seller/dashboard",
    isRead: true,
    metadata: { vendorId: "00000000-0000-4000-a000-00000000b002" },
  },
  {
    userId: "00000000-0000-4000-a000-000000004e35",
    senderId: "00000000-0000-4000-a000-000000002711",
    type: "vendor",
    title: "Yêu cầu bổ sung giấy tờ",
    message: "Hồ sơ đăng ký người bán của bạn cần bổ sung giấy chứng nhận vệ sinh an toàn thực phẩm. Vui lòng cập nhật trong mục Quản lý hồ sơ.",
    link: "/seller/profile",
  },

  // ===== Review Notifications =====
  {
    userId: "00000000-0000-4000-a000-000000007531",
    type: "review",
    title: "Đánh giá của bạn đã được duyệt",
    message: "Cảm ơn bạn đã đánh giá sản phẩm 'Bưởi Đoan Hùng OCOP'. Đánh giá của bạn sẽ giúp ích cho cộng đồng mua sắm!",
    link: "/products/buoi-doan-hung-ocop-phu-tho",
    isRead: true,
  },
  {
    userId: "00000000-0000-4000-a000-000000004e21",
    type: "review",
    title: "Cửa hàng của bạn có đánh giá mới",
    message: "Khách hàng Trần Thị Hoa vừa đánh giá 5 sao cho sản phẩm 'Bưởi Đoan Hùng OCOP' tại cửa hàng của bạn.",
    link: "/seller/products/buoi-doan-hung-ocop-phu-tho",
    metadata: { rating: 5, productId: "00000000-0000-4000-a000-000000011171" },
  },

  // ===== Chat Notifications =====
  {
    userId: "00000000-0000-4000-a000-000000007531",
    senderId: "00000000-0000-4000-a000-000000004e21",
    type: "chat",
    title: "Nông Sản Xanh Hà Nội đã trả lời",
    message: "Chào bạn, sản phẩm Bưởi Đoan Hùng hiện đang có chương trình giảm giá 15% khi mua từ 2 túi trở lên. Bạn có muốn đặt thêm không ạ?",
    link: "/chat/store-abc123",
  },
  {
    userId: "00000000-0000-4000-a000-000000004e21",
    senderId: "00000000-0000-4000-a000-000000007531",
    type: "chat",
    title: "Nguyễn Văn Nam đã nhắn tin",
    message: "Cho mình hỏi bưởi Đoan Hùng có ship được về Hà Nội trong ngày không shop?",
    link: "/seller/chat/user-7531",
  },
];
