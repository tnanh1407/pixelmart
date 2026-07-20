

Enum voucher_status {
    active
    expired
    disabled
}

Enum gender {
  male
  female
  other
}

Enum user_role {
  user
  admin
}

Enum provider {
  local
  google
}

Enum payment_method {
  cod
  bank_transfer
  e_wallet
}

Enum payment_status {
  pending
  paid
  refunded
  failed
}

Enum payment_type {
  payment
  refund
}

Enum product_status {
  draft
  published
  archived
}

Enum order_status {
  pending
  confirmed
  processing
  shipping
  delivered
  cancelled
  returned
}

Enum flashsale_status {
  scheduled
  active
  ended
  cancelled
}

Enum campaign_type {
  promotion
  blog
}

Enum voucher_type {
  percentage
  fixed
}

Enum voucher_scope {
  platform
  store
}



Enum notification_type {
  order
  promotion
  system
  chat
  review
  vendor
  report_system
  report_shop
  report_review
  auth
}

Enum return_request_status {
  pending
  approved
  rejected
  shipped
  received
  refunded
  cancelled
}

Enum verification_token_type {
  "email-verification"
  "forgot-password"
}

Enum transaction_status {
  pending
  success
  failed
  refunded
}

// ==================== USERS & AUTH ====================

// Bảng user
Table users {
  _id varchar [pk, note: "UUID v4"]
  name varchar(255) [not null]
  email varchar(255) [not null, unique]
  password varchar(255)
  gender gender [default: "other"]
  role user_role [default: "user"]
  phone varchar(20)
  provider provider [default: "local"]
  googleId varchar(255)
  avatar varchar(500)
  isEmailVerified boolean [default: false]
  isActive boolean [default: true]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

// bảng xác thực token
Table verification_tokens {
  _id varchar [pk, note: "UUID v4"]
  userId varchar [ref: > users._id, not null]
  code varchar(6) [not null]
  type verification_token_type [not null]
  expiresAt timestamp [not null]
  used boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

Table sessions {
  _id varchar [pk, note: "UUID v4"]
  userId varchar [ref: > users._id, not null]
  refreshToken varchar(500) [not null]
  isRevoked boolean [default: false]
  expiresAt timestamp [not null]
  lastActiveAt timestamp
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

// ==================== ADDRESS DIVISIONS ====================

Table provinces {
  _id varchar [pk, note: "UUID v4"]
  code varchar(20) [unique, not null]
  name varchar(255) [not null]
  nameEn varchar(255)
  fullName varchar(255)
  fullNameEn varchar(255)
  codeName varchar(255)
}

Table districts {
  _id varchar [pk, note: "UUID v4"]
  code varchar(20) [unique, not null]
  name varchar(255) [not null]
  nameEn varchar(255)
  fullName varchar(255)
  fullNameEn varchar(255)
  codeName varchar(255)
  provinceCode varchar(20) [ref: > provinces.code, not null]
}

Table wards {
  _id varchar [pk, note: "UUID v4"]
  code varchar(20) [unique, not null]
  name varchar(255) [not null]
  nameEn varchar(255)
  fullName varchar(255)
  fullNameEn varchar(255)
  codeName varchar(255)
  districtCode varchar(20) [ref: > districts.code, not null]
}


// ==================== STORES ====================

Table stores {
  _id varchar [pk, note: "UUID v4"]
  name varchar(255) [not null]
  slug varchar(255) [unique, not null]
  logo varchar(500)
  description text
  ownerId varchar [ref: > users._id, unique, not null]
  phone varchar(20)
  email varchar(255)
  street varchar(255)
  provinceCode varchar(20) [ref: > provinces.code]
  districtCode varchar(20) [ref: > districts.code]
  wardCode varchar(20) [ref: > wards.code]
  policies json
  isVerified boolean [default: false]
  isActive boolean [default: true]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp

}

Table store_follows {
  _id varchar [pk, note: "UUID v4"]
  userId varchar [ref: > users._id, not null]
  storeId varchar [ref: > stores._id, not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp

  indexes {
    (userId, storeId) [unique]
  }
}

// ==================== CATEGORIES ====================

Table categories {
  _id varchar [pk, note: "UUID v4"]
  name varchar(255) [not null]
  slug varchar(255) [unique, not null]
  description text
  image varchar(500)
  isActive boolean [default: true]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

// ==================== PRODUCTS ====================

Table products {
  _id varchar [pk, note: "UUID v4"]
  name varchar(500) [not null]
  slug varchar(500) [unique, not null]
  sku varchar(100)
  description text
  price decimal(15,2) [not null]
  discountPrice decimal(15,2)
  stock int [default: 0]
  images json
  categoryId varchar [ref: > categories._id, not null]
  storeId varchar [ref: > stores._id, not null]
  specifications json // thông số kĩ thuật
  viewCount int [default: 0]
  soldCount int [default: 0]
  status product_status [default: "draft"]
  isDeleted boolean [default: false]
  deletedAt timestamp
  publishedAt timestamp
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

// ==================== CART ====================

Table carts {
  _id varchar [pk, note: "UUID v4"]
  userId varchar [ref: > users._id, not null]
  productId varchar [ref: > products._id, not null]
  quantity int [not null, default: 1]
  selected boolean [default: true]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

// ==================== ORDERS & PAYMENTS ====================

Table orders {
  _id varchar [pk, note: "UUID v4"]
  userId varchar [ref: > users._id, not null]
  storeId varchar [ref: > stores._id, not null]
  orderCode varchar(50) [unique, not null]
  status order_status [default: "pending"]
  items json [not null, note: "embedded array of order items"]
  receiverName varchar(255)
  receiverPhone varchar(20)
  provinceName varchar(255)
  districtName varchar(255)
  wardName varchar(255)
  streetAddress varchar(500)
  shippingFee decimal(15,2) [default: 0]
  subtotal decimal(15,2) [not null]
  discountAmount decimal(15,2) [default: 0]
  totalAmount decimal(15,2) [not null]
  voucherId varchar [ref: > vouchers._id]
  voucherCode varchar(50)
  paymentMethod payment_method [default: "cod"]
  paymentStatus payment_status [default: "pending"]
  transactionId varchar [ref: > payment_transactions._id]
  noteOrder text
  cancelReason text
  confirmedAt timestamp
  shippedAt timestamp
  deliveredAt timestamp
  cancelledAt timestamp
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

Table payment_transactions {
  _id varchar [pk, note: "UUID v4"]
  orderId varchar [ref: > orders._id, not null]
  userId varchar [ref: > users._id, not null]
  amount decimal(15,2) [not null]
  method payment_method [not null]
  type payment_type [default: "payment"]
  gateway varchar(50)
  gatewayTransactionId varchar(255)
  status transaction_status [default: "pending"]
  gatewayResponse json
  createdAt timestamp [default: `now()`]
  updatedAt timestamp

}

Table return_requests {
  _id varchar [pk, note: "UUID v4"]
  orderId varchar [ref: > orders._id, not null]
  userId varchar [ref: > users._id, not null]
  storeId varchar [ref: > stores._id, not null]
  reason varchar(500) [not null]
  description text
  status return_request_status [default: "pending"]
  refundAmount decimal(15,2)
  images json
  rejectedReason text
  approvedBy varchar [ref: > users._id]
  timeline json [note: "embedded array of status changes"]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

// ==================== REVIEWS ====================

Table reviews {
  _id varchar [pk, note: "UUID v4"]
  userId varchar [ref: > users._id, not null]
  productId varchar [ref: > products._id, not null]
  orderId varchar [ref: > orders._id , not null]
  rating int [not null, note: "1-5"]
  title varchar(255)
  comment text
  images json
  isActive boolean [default: true]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

// ==================== FLASH SALES ====================

Table flash_sales {
  _id varchar [pk, note: "UUID v4"]
  name varchar(255) [not null]
  description text
  startDate timestamp [not null]
  endDate timestamp [not null]
  status flashsale_status [default: "scheduled"]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp

  indexes {
    (startDate, endDate)
    (status, startDate)
  }
}

Table flash_sale_items {
  _id varchar [pk, note: "UUID v4"]
  flashSaleId varchar [ref: > flash_sales._id, not null]
  productId varchar [ref: > products._id, not null]
  flashPrice decimal(15,2) [not null]
  flashStock int [not null]
  flashSold int [default: 0]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp

  indexes {
    (flashSaleId, productId) [unique]
  }
}

// ==================== CAMPAIGNS ====================

Table campaigns {
  _id varchar [pk, note: "UUID v4"]
  title varchar(500) [not null]
  slug varchar(500) [unique, not null]
  type campaign_type [default: "promotion"]
  shortDescription text
  content text
  isActive boolean [default: true]
  startDate timestamp
  endDate timestamp
  durationInDays int
  authorId varchar [ref: > users._id]  
  sapo text
  contentSections json
  highlightsTitle varchar(500)
  highlights json
  quote text
  quoteAuthor varchar(255)
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

Table campaign_items {
  _id varchar [pk, note: "UUID v4"]
  campaignId varchar [ref: > campaigns._id, not null]
  productId varchar [ref: > products._id, not null]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp

}

// ==================== VOUCHERS ====================

Table vouchers {
  _id varchar [pk, note: "UUID v4"]
  code varchar(50) [unique, not null]
  name varchar(255) [not null]
  description text
  type voucher_type [not null]
  value decimal(15,2) [not null]
  minOrderValue decimal(15,2) [default: 0]
  maxDiscount decimal(15,2)
  scope voucher_scope [default: "platform"]
  storeId varchar [ref: > stores._id]
  usageLimit int [not null]
  usedCount int [default: 0]
  startDate timestamp [not null]
  endDate timestamp [not null]
  status voucher_status [default: "active", note: "active/expired/disabled"]
  isActive boolean [default: true]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

Table voucher_usages {
  _id varchar [pk, note: "UUID v4"]
  voucherId varchar [ref: > vouchers._id, not null]
  userId varchar [ref: > users._id, not null]
  orderId varchar [ref: > orders._id, unique]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}


// ==================== NOTIFICATIONS ====================

Table notifications {
  _id varchar [pk, note: "UUID v4"]
  userId varchar [ref: > users._id, not null]
  senderId varchar [ref: > users._id]
  type notification_type [not null]
  title varchar(255) [not null]
  message text
  isRead boolean [default: false]
  metadata json
  isDeleted boolean [default: false]
  createdAt timestamp [default: `now()`]
  updatedAt timestamp
}

