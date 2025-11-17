# 🔐 Authentication System Guide

## Tổng quan

Hệ thống authentication được xây dựng với:
- **NextAuth.js v5** (Auth.js)
- **Prisma** adapter
- **JWT** sessions
- **bcryptjs** password hashing
- **Zod** validation

---

## 📁 Cấu trúc Files

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Trang đăng nhập
│   │   └── register/page.tsx       # Trang đăng ký
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # NextAuth API
│   │   └── register/route.ts       # API đăng ký
│   └── layout.tsx                  # Root layout với SessionProvider
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # Form đăng nhập
│   │   └── RegisterForm.tsx       # Form đăng ký
│   └── providers/
│       └── SessionProvider.tsx    # Session wrapper
├── lib/
│   ├── auth.ts                    # NextAuth config
│   ├── auth-helpers.ts            # Server-side helpers
│   └── validations/
│       └── auth.ts                # Zod schemas
├── hooks/
│   └── useCurrentUser.ts          # Client hook
├── types/
│   └── next-auth.d.ts             # TypeScript types
└── middleware.ts                  # Protected routes
```

---

## 🚀 Sử dụng Authentication

### 1. Đăng ký User mới

**Trang đăng ký:** `http://localhost:3000/register`

```typescript
// API: POST /api/register
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 2. Đăng nhập

**Trang đăng nhập:** `http://localhost:3000/login`

**Tài khoản test (sau khi seed):**
```
Email: admin@blogmodapk.com
Password: Admin@123

Email: editor1@blogmodapk.com
Password: Admin@123

Email: user1@blogmodapk.com
Password: Admin@123
```

---

## 💻 Sử dụng trong Code

### Client Components

```typescript
"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSession, signIn, signOut } from "next-auth/react";

function MyComponent() {
  // Cách 1: Custom hook
  const { user, isLoading, isAuthenticated } = useCurrentUser();

  // Cách 2: useSession trực tiếp
  const { data: session } = useSession();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <button onClick={() => signIn()}>Đăng nhập</button>;
  }

  return (
    <div>
      <p>Xin chào, {user?.name}</p>
      <p>Role: {user?.role}</p>
      <button onClick={() => signOut()}>Đăng xuất</button>
    </div>
  );
}
```

### Server Components

```typescript
import { getCurrentUser, requireAuth, requireRole } from "@/lib/auth-helpers";
import { Role } from "@prisma/client";

// Lấy user hiện tại (nullable)
async function MyServerComponent() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Chưa đăng nhập</div>;
  }

  return <div>Xin chào, {user.name}</div>;
}

// Require user phải đăng nhập
async function ProtectedPage() {
  const user = await requireAuth(); // Throw error nếu chưa login
  return <div>Protected content for {user.name}</div>;
}

// Require role cụ thể
async function AdminPage() {
  const user = await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);
  return <div>Admin dashboard</div>;
}
```

### API Routes

```typescript
import { getCurrentUser } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Your logic here
  return NextResponse.json({ data: "..." });
}
```

---

## 🛡️ Protected Routes

Routes được bảo vệ tự động bởi middleware:

```typescript
// src/middleware.ts
export const config = {
  matcher: [
    "/admin/:path*",        // Tất cả routes bắt đầu bằng /admin
    "/api/posts/:path*",    // API posts
    "/api/categories/:path*",
    // ...
  ],
};
```

**Cách hoạt động:**
- User chưa login → redirect về `/login`
- User đã login → cho phép truy cập

---

## 🎭 Roles & Permissions

### Roles có sẵn:

```typescript
enum Role {
  USER          // User thường
  EDITOR        // Có thể tạo/edit posts
  ADMIN         // Quản lý toàn bộ
  SUPER_ADMIN   // Quyền cao nhất
}
```

### Kiểm tra role:

```typescript
import { isAdmin, isEditor } from "@/lib/auth-helpers";

// Server component
async function AdminOnlyComponent() {
  const admin = await isAdmin();
  if (!admin) {
    return <div>Forbidden</div>;
  }
  // Admin content
}

// Client component
import { useCurrentUser } from "@/hooks/useCurrentUser";

function ClientComponent() {
  const { user } = useCurrentUser();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isEditor = user?.role === "EDITOR" || isAdmin;

  return (
    <div>
      {isAdmin && <button>Admin Actions</button>}
      {isEditor && <button>Edit Post</button>}
    </div>
  );
}
```

---

## 🔧 Validation Schemas

```typescript
// Login
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Register
const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});
```

---

## 🧪 Testing

### 1. Test Registration

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Login

Vào trang: `http://localhost:3000/login`

Hoặc dùng NextAuth API:
```typescript
import { signIn } from "next-auth/react";

await signIn("credentials", {
  email: "admin@blogmodapk.com",
  password: "Admin@123",
  redirect: false,
});
```

### 3. Test Protected Routes

```bash
# Chưa login → redirect to /login
http://localhost:3000/admin/dashboard

# Đã login → OK
```

---

## 📊 Session Management

### Session Config

```typescript
session: {
  strategy: "jwt",          // JWT-based sessions
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

### Update Session

```typescript
"use client";

import { useSession } from "next-auth/react";

function UpdateProfile() {
  const { update } = useSession();

  const handleUpdate = async () => {
    await fetch("/api/user/update", {
      method: "PATCH",
      body: JSON.stringify({ name: "New Name" })
    });

    // Update session
    await update({
      name: "New Name"
    });
  };
}
```

---

## 🔐 Security Best Practices

### 1. Password Hashing
```typescript
// bcrypt với 10 salt rounds
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. Environment Variables
```env
# .env.local
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

**Production:** Đổi `NEXTAUTH_SECRET` bằng random string:
```bash
openssl rand -base64 32
```

### 3. CSRF Protection
NextAuth tự động bảo vệ CSRF.

### 4. Secure Cookies
```typescript
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }
  }
}
```

---

## ❌ Troubleshooting

### 1. "No session found"
**Nguyên nhân:** SessionProvider chưa wrap app
**Giải pháp:** Check `app/layout.tsx` có `<SessionProvider>`

### 2. "Unauthorized" khi call API
**Nguyên nhân:** Chưa đăng nhập hoặc token expired
**Giải pháp:**
```typescript
const session = await getServerSession(authOptions);
if (!session) {
  return new Response("Unauthorized", { status: 401 });
}
```

### 3. Middleware redirect loop
**Nguyên nhân:** Login page cũng bị protect
**Giải pháp:** Exclude auth routes khỏi middleware:
```typescript
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
```

### 4. "Error: SECRET not found"
**Nguyên nhân:** Thiếu `NEXTAUTH_SECRET` trong `.env.local`
**Giải pháp:** Thêm vào `.env.local`:
```env
NEXTAUTH_SECRET=your-secret-here
```

---

## 🎯 Next Steps

Sau khi hoàn thành Auth System:

1. ✅ Users có thể đăng ký/đăng nhập
2. ✅ Protected routes hoạt động
3. ✅ Role-based permissions
4. ✅ JWT sessions

**BƯỚC 4:** Base UI Components & Layout
- Header với user menu
- Footer
- Admin sidebar
- Navigation

---

## 📚 Tài liệu

- NextAuth.js: https://next-auth.js.org
- Prisma Adapter: https://authjs.dev/reference/adapter/prisma
- Zod: https://zod.dev
