# 📋 Tổng hợp các lệnh hữu ích

## 🐳 Docker Commands

### Quản lý containers
```bash
# Khởi động containers
npm run docker:up
# hoặc
docker-compose up -d

# Dừng containers
npm run docker:down
# hoặc
docker-compose down

# Khởi động lại containers
npm run docker:restart
# hoặc
docker-compose restart

# Xem logs PostgreSQL
npm run docker:logs
# hoặc
docker-compose logs -f postgres

# Xem tất cả containers đang chạy
docker ps

# Xem tất cả containers (kể cả đã dừng)
docker ps -a
```

### Kết nối vào container
```bash
# Vào PostgreSQL shell
docker exec -it blogmodapk_postgres psql -U blog_user -d blog_nextjs

# Vào bash của container
docker exec -it blogmodapk_postgres bash
```

### Dọn dẹp
```bash
# Xóa containers và volumes (MẤT HẾT DỮ LIỆU!)
docker-compose down -v

# Xóa tất cả containers đã dừng
docker container prune

# Xóa tất cả images không dùng
docker image prune -a
```

## 🗄️ Database Commands

### Prisma
```bash
# Generate Prisma Client
npm run prisma:generate
# hoặc
npx prisma generate

# Push schema lên database (không tạo migration)
npm run db:push
# hoặc
npx prisma db push

# Tạo migration
npm run prisma:migrate
# hoặc
npx prisma migrate dev --name ten_migration

# Reset database (XÓA HẾT DỮ LIỆU và seed lại)
npm run db:reset
# hoặc
npx prisma migrate reset

# Mở Prisma Studio (GUI để xem/sửa data)
npm run prisma:studio
# hoặc
npx prisma studio
```

### Seed data
```bash
# Seed dữ liệu mẫu
npm run prisma:seed
# hoặc
npx prisma db seed
```

## 🚀 Development

### Next.js
```bash
# Khởi động dev server
npm run dev

# Build production
npm run build

# Chạy production server
npm run start

# Lint code
npm run lint
```

## 🔍 Kiểm tra & Debug

### Kiểm tra kết nối database
```bash
# Thử kết nối
npx prisma db pull

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

### Xem database
```bash
# Mở Prisma Studio
npx prisma studio

# Hoặc dùng pgAdmin
# Truy cập: http://localhost:5050
```

## 📦 Package Management

```bash
# Cài đặt dependencies
npm install

# Cài thêm package
npm install package-name

# Cài dev dependency
npm install -D package-name

# Gỡ package
npm uninstall package-name

# Cập nhật packages
npm update
```

## 🔧 Setup nhanh (Lần đầu)

### Windows
```bash
# Chạy script tự động
./setup-database.bat
```

### Manual
```bash
# 1. Khởi động Docker
npm run docker:up

# 2. Đợi 5 giây

# 3. Setup database
npm run db:push

# 4. Seed data
npm run prisma:seed

# 5. Khởi động dev server
npm run dev
```

## 🔄 Workflow hàng ngày

### Sáng đến làm việc
```bash
# 1. Bật Docker Desktop (nếu chưa tự động khởi động)

# 2. Khởi động containers
npm run docker:up

# 3. Khởi động dev server
npm run dev
```

### Tối về nhà
```bash
# Dừng containers (không bắt buộc)
npm run docker:down
```

### Khi pull code mới
```bash
# 1. Cài packages mới (nếu có)
npm install

# 2. Cập nhật database schema
npm run db:push

# 3. Khởi động lại dev server
npm run dev
```

## 🆘 Troubleshooting

### Reset hoàn toàn database
```bash
# 1. Dừng và xóa containers + volumes
docker-compose down -v

# 2. Khởi động lại
docker-compose up -d

# 3. Đợi 5 giây

# 4. Tạo lại schema
npx prisma db push

# 5. Seed lại data
npm run prisma:seed
```

### Xóa cache Next.js
```bash
# Windows
rmdir /s /q .next

# Linux/Mac
rm -rf .next

# Sau đó khởi động lại
npm run dev
```

### Xóa node_modules và cài lại
```bash
# Windows
rmdir /s /q node_modules
npm install

# Linux/Mac
rm -rf node_modules
npm install
```

## 📊 Thông tin quan trọng

### Database Connection
```
Host: localhost
Port: 5432
Database: blog_nextjs
Username: blog_user
Password: blog_password_2025
```

### pgAdmin
```
URL: http://localhost:5050
Email: admin@blogmodapk.com
Password: admin
```

### Prisma Studio
```
URL: http://localhost:5555 (sau khi chạy npx prisma studio)
```

### Tài khoản test
```
Admin:
- Email: admin@blogmodapk.com
- Password: Admin@123

Editor:
- Email: editor1@blogmodapk.com
- Password: Admin@123

User:
- Email: user1@blogmodapk.com
- Password: Admin@123
```

---

**Lưu file này để tham khảo nhanh! 📌**
