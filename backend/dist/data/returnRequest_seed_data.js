export const returnRequestSeedData = [
    {
        _id: "rr000000-0000-4000-a000-00000000rr01",
        orderId: "o0000000-0000-4000-a000-00000000or03",
        userId: "u0000000-0000-4000-a000-00000000us02",
        storeId: "s0000000-0000-4000-a000-00000000st02",
        reason: "San pham bi loi dong goi",
        description: "Hop mien dong bi mop meo, 1 goi bi rach khi nhan hang. Yeu cau doi tra goi bi rach.",
        status: "approved",
        refundAmount: 160000,
        images: ["https://picsum.photos/400/400?random=900"],
        timeline: [
            { status: "pending", note: "Khach hang gui yeu cau tra hang", changedAt: new Date("2026-03-26") },
            { status: "approved", note: "Chap nhan yeu cau tra hang 1 goi mien bi rach", changedBy: "u0000000-0000-4000-a000-00000000us01", changedAt: new Date("2026-03-27") },
        ],
    },
    {
        _id: "rr000000-0000-4000-a000-00000000rr02",
        orderId: "o0000000-0000-4000-a000-00000000or01",
        userId: "u0000000-0000-4000-a000-00000000us01",
        storeId: "s0000000-0000-4000-a000-00000000st01",
        reason: "San pham khong dung mo ta",
        description: "Buoi nhan duoc nho hon so voi mo ta Hang A. Yeu cau hoan tien 1 phan.",
        status: "rejected",
        refundAmount: 0,
        rejectedReason: "San pham dung tieu chuan Hang A, size co the dao dong 10%",
        timeline: [
            { status: "pending", note: "Khach hang gui yeu cau tra hang", changedAt: new Date("2026-01-20") },
            { status: "rejected", note: "San pham dung chuan, khong chap nhan tra hang", changedBy: "u0000000-0000-4000-a000-00000000ad01", changedAt: new Date("2026-01-21") },
        ],
    },
];
