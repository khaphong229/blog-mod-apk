# 🗃️ Database Setup Guide

## Bước 1: Cài đặt PostgreSQL

### Tùy chọn A: PostgreSQL Local (Windows)

1. Download PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Cài đặt PostgreSQL (chọn port mặc định 5432)
3. Ghi nhớ password của user `postgres` khi cài đặt
4. Mở **pgAdmin 4** (đã cài cùng PostgreSQL)
5. Tạo database mới tên `blog_nextjs`:
   - Right click **Databases** → **Create** → **Database**
   - Database name: `blog_nextjs`
   - Click **Save**

### Tùy chọn B: PostgreSQL Cloud (Miễn phí)

**Supabase (Khuyên dùng):**
1. Đăng ký tài khoản tại: https://supabase.com
2. Tạo project mới
3. Vào **Settings** → **Database**
4. Copy **Connection String** (URI mode)
5. Thay thế `[YOUR-PASSWORD]` bằng password bạn đã đặt

**Neon (Nhanh, miễn phí):**
1. Đăng ký tại: https://neon.tech
2. Tạo project mới
3. Copy **Connection String**

**Railway (Đơn giản):**
1. Đăng ký tại: https://railway.app
2. New Project → Add PostgreSQL
3. Copy **DATABASE_URL**

---

## Bước 2: Cấu hình DATABASE_URL

Mở file `.env.local` và cập nhật `DATABASE_URL`:

### Nếu dùng PostgreSQL Local:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_nextjs?schema=public"
```
Thay `YOUR_PASSWORD` bằng password bạn đặt khi cài PostgreSQL.

### Nếu dùng Supabase:
```env
DATABASE_URL="postgresql://postgres.xxxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### Nếu dùng Neon:
```env
DATABASE_URL="postgresql://username:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require"
```

### Nếu dùng Railway:
```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-xx.railway.app:5432/railway"
```

---

## Bước 3: Chạy Migration

Sau khi đã cấu hình `DATABASE_URL` đúng:

```bash
# 1. Generate Prisma Client (đã làm rồi)
npm run prisma:generate

# 2. Tạo database schema
npm run prisma:migrate
# Khi được hỏi migration name, gõ: init

# 3. Seed data mẫu
npm run prisma:seed

# 4. Mở Prisma Studio để xem data
npm run prisma:studio
```

---

## Bước 4: Verify

Sau khi seed thành công, bạn sẽ thấy:
- ✅ 8 users (1 Super Admin, 2 Editors, 5 Users)
- ✅ 7 categories
- ✅ 20 tags
- ✅ 13 posts (10 published, 2 draft, 1 scheduled)
- ✅ 9 comments

**Login credentials:**
- Email: `admin@blogmodapk.com`
- Password: `Admin@123`

---

## Lỗi thường gặp

### 1. "Environment variable not found: DATABASE_URL"
**Giải pháp:** File `.env.local` chưa được load. Restart terminal hoặc IDE.

### 2. "Can't reach database server"
**Giải pháp:**
- Kiểm tra PostgreSQL đã chạy chưa (Windows: Services → postgresql-x64-15)
- Kiểm tra port 5432 có bị block không
- Với cloud: Kiểm tra connection string có đúng không

### 3. "Error: P3009 Migrate failed"
**Giải pháp:**
- Database đã tồn tại schema cũ
- Chạy: `npm run db:reset` (sẽ xóa hết data và tạo lại)

### 4. Seed bị lỗi "Unique constraint failed"
**Giải pháp:**
- Data đã tồn tại từ lần seed trước
- Xóa data hoặc chạy: `npm run db:reset`

---

## Các lệnh hữu ích

```bash
# Xem database trong browser
npm run prisma:studio

# Reset database (XÓA HẾT DATA)
npm run db:reset

# Push schema không cần migration (dev only)
npm run db:push

# Chỉ seed lại data
npm run prisma:seed
```

---

## 🎉 Hoàn tất!

Sau khi setup xong database, bạn có thể:
1. Chạy dev server: `npm run dev`
2. Mở Prisma Studio: `npm run prisma:studio`
3. Tiếp tục với **BƯỚC 3: Authentication System**

---

**Nếu gặp vấn đề gì, hãy kiểm tra:**
- [ ] PostgreSQL đang chạy
- [ ] DATABASE_URL trong .env.local đúng format
- [ ] Database `blog_nextjs` đã được tạo
- [ ] Password trong connection string đúng
- [ ] Port 5432 không bị block
