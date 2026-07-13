FROM node:22-alpine AS builder

# đặt thư mục app làm việc trong container
WORKDIR /app

# lệnh này copy file
COPY package*.json ./ 

# cài tất cả dependancies
RUN npm ci 
# ci khác với npm i - có thể update , ci cập nhật đúng

# copy toàn bộ project vào dự án
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# chỉ cài dependies không cài devDêpndiens
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# khai báo sử dụng cổng 5000
EXPOSE 5000

CMD ["node", "dist/server.js"]
