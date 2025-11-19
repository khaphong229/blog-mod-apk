# 🚀 BẮT ĐẦU TẠI ĐÂY!

## ✅ Checklist Setup Nhanh

### 1️⃣ Cài đặt Dependencies
```bash
npm install
```

### 2️⃣ Setup Database

#### Cách 1: Tự động (Windows) ⭐ KHUYẾN NGHỊ
```bash
./setup-database.bat
```

#### Cách 2: Thủ công
```bash
# Bước 1: Mở Docker Desktop

# Bước 2: Khởi động PostgreSQL
npm run docker:up

# Bước 3: Tạo database schema
npx prisma db push

# Bước 4: Seed data mẫu
npm run prisma:seed
```

### 3️⃣ Khởi động Development Server
```bash
npm run dev
```

### 4️⃣ Mở trình duyệt
Truy cập: **http://localhost:3000**

## 🔑 Đăng nhập

Sử dụng một trong các tài khoản sau:

### Super Admin
- **Email:** admin@blogmodapk.com
- **Password:** Admin@123

### Editor
- **Email:** editor1@blogmodapk.com
- **Password:** Admin@123

### Normal User
- **Email:** user1@blogmodapk.com
- **Password:** Admin@123

## 🎯 Các trang quan trọng

| Trang | URL | Mô tả |
|-------|-----|-------|
| Trang chủ | `/` | Homepage với danh sách bài viết |
| Đăng nhập | `/login` | Trang đăng nhập |
| Đăng ký | `/register` | Trang đăng ký |
| Admin Dashboard | `/admin` | Trang quản trị (cần đăng nhập) |
| Quản lý Posts | `/admin/posts` | Quản lý bài viết |
| Quản lý Categories | `/admin/categories` | Quản lý danh mục |
| Quản lý Users | `/admin/users` | Quản lý người dùng |
| Profile | `/profile` | Trang cá nhân |

## 🛠️ Tools hữu ích

### Prisma Studio (Database GUI)
```bash
npx prisma studio
```
Mở tại: **http://localhost:5555**

### pgAdmin (PostgreSQL Web UI)
Mở trình duyệt tại: **http://localhost:5050**
- Email: admin@blogmodapk.com
- Password: admin

## 📚 Tài liệu

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Hướng dẫn chi tiết setup database
- [QUICK_START_DATABASE.md](QUICK_START_DATABASE.md) - Quick start database
- [COMMANDS.md](COMMANDS.md) - Tổng hợp các lệnh hữu ích
- [README.md](README.md) - Tài liệu đầy đủ của project

## 🎨 Cấu trúc thư mục quan trọng

```
src/
├── app/              # Next.js App Router
│   ├── (main)/       # Public pages
│   ├── admin/        # Admin pages
│   ├── api/          # API routes
│   └── login/        # Auth pages
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   ├── admin/        # Admin components
│   └── layout/       # Layout components
├── lib/              # Utilities & configs
│   ├── auth.ts       # NextAuth config
│   └── prisma.ts     # Prisma client
└── middleware.ts     # Next.js middleware

prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Seed data script
```

## ⚡ Workflow phát triển

### 1. Thêm tính năng mới
```bash
# 1. Tạo branch mới (nếu dùng git)
git checkout -b feature/ten-tinh-nang

# 2. Code tính năng

# 3. Test local
npm run dev

# 4. Build thử
npm run build
```

### 2. Thay đổi Database Schema
```bash
# 1. Sửa file prisma/schema.prisma

# 2. Push changes lên database
npx prisma db push

# 3. Regenerate Prisma Client
npx prisma generate
```

### 3. Thêm Component mới
```bash
# Sử dụng component từ shadcn/ui
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

## 🐛 Gặp vấn đề?

### Database không kết nối được
```bash
# Kiểm tra Docker containers
docker ps

# Xem logs
npm run docker:logs

# Restart containers
npm run docker:restart
```

### Lỗi Prisma Client
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Lỗi build/compile
```bash
# Xóa cache
rm -rf .next
# hoặc Windows: rmdir /s /q .next

# Build lại
npm run dev
```

### Reset hoàn toàn
```bash
# 1. Dừng mọi thứ
npm run docker:down

# 2. Xóa volumes
docker-compose down -v

# 3. Khởi động lại và setup
npm run docker:up
npx prisma db push
npm run prisma:seed
```

## 🎓 Học thêm

### Next.js
- [Next.js Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)

### Prisma
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## ✨ Tính năng có sẵn

- ✅ Authentication (Login/Register/Logout)
- ✅ Admin Dashboard với thống kê
- ✅ CRUD Posts (Create, Read, Update, Delete)
- ✅ CRUD Categories & Tags
- ✅ Comment system với moderation
- ✅ User management
- ✅ Media upload
- ✅ Download tracking
- ✅ SEO optimization
- ✅ Responsive design

## 🚀 Next Steps

1. ✅ Setup xong → Khám phá admin dashboard
2. ✅ Tạo post mới để test
3. ✅ Thử các tính năng comment, upload ảnh
4. ✅ Customize theme/styling theo ý bạn
5. ✅ Bắt đầu phát triển tính năng mới!

---

**Chúc bạn code vui vẻ! 🎉**

Nếu gặp vấn đề, check file [COMMANDS.md](COMMANDS.md) hoặc [DATABASE_SETUP.md](DATABASE_SETUP.md)
