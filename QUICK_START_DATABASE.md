# 🚀 Quick Start - Database Setup

## Cách nhanh nhất (Windows)

### Bước 1: Mở Docker Desktop
Đảm bảo Docker Desktop đang chạy

### Bước 2: Chạy script tự động
```bash
./setup-database.bat
```

Script sẽ tự động:
1. ✅ Kiểm tra Docker
2. ✅ Khởi động PostgreSQL container
3. ✅ Tạo database schema
4. ✅ Seed data mẫu

## Hoặc chạy thủ công:

```bash
# 1. Khởi động Docker containers
docker-compose up -d

# 2. Đợi 5 giây cho PostgreSQL khởi động

# 3. Tạo database schema
npx prisma db push

# 4. Seed data
npm run prisma:seed
```

## 🎯 Kiểm tra Database

### Cách 1: Prisma Studio (Khuyến nghị)
```bash
npx prisma studio
```
Mở trình duyệt tại `http://localhost:5555`

### Cách 2: pgAdmin Web UI
Truy cập `http://localhost:5050`
- Email: `admin@blogmodapk.com`
- Password: `admin`

## 🔑 Tài khoản test

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@blogmodapk.com | Admin@123 |
| Editor | editor1@blogmodapk.com | Admin@123 |
| User | user1@blogmodapk.com | Admin@123 |

## 📊 Dữ liệu mẫu có sẵn

- ✅ 4+ Users (Admin, Editors, Users)
- ✅ 5+ Categories (Games, Apps, subcategories)
- ✅ 8+ Tags (MOD features)
- ✅ 5+ Posts (Game & App MODs)
- ✅ Comments & Downloads

## 🔄 Reset Database

Nếu muốn reset và seed lại:
```bash
npx prisma migrate reset
```

## ⚙️ Connection String

```env
DATABASE_URL="postgresql://blog_user:blog_password_2025@localhost:5432/blog_nextjs?schema=public"
```

## 🆘 Troubleshooting

**Lỗi: "Docker không chạy"**
→ Mở Docker Desktop và đợi khởi động

**Lỗi: "Port 5432 đã được sử dụng"**
→ Dừng PostgreSQL khác hoặc đổi port trong docker-compose.yml

**Lỗi: "Không kết nối được database"**
→ Kiểm tra container: `docker ps`

## 📖 Chi tiết đầy đủ

Xem file [DATABASE_SETUP.md](DATABASE_SETUP.md) để biết hướng dẫn chi tiết
