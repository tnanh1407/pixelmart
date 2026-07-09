FROM node:22-alpine AS builder

# đặt thư mục app làm việc trong container
WORKDIR /app

# lệnh này copy file
COPY package*.json ./ 

# cài tất cả dependancies
RUN npm ci 

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
