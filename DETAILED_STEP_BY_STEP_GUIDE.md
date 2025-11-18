# Hướng Dẫn Chi Tiết Từng Bước - BlogModAPK

## Giới Thiệu

Document này sẽ hướng dẫn bạn xây dựng một website blog full-stack từ con số 0. Mỗi bước sẽ được giải thích chi tiết về:
- **Bước này làm gì?** - Mục tiêu của bước
- **Tại sao cần làm?** - Lý do và ý nghĩa
- **Làm như thế nào?** - Hướng dẫn cụ thể
- **Kiến thức cần biết** - Những concepts quan trọng

---

## PHẦN 1: SETUP & CƠ SỞ DỮ LIỆU

---

## Bước 1: Khởi Tạo Dự Án Next.js

### 🎯 Bước này làm gì?
Tạo một project Next.js mới - framework React để xây dựng website hiện đại.

### 🤔 Tại sao cần làm?
Next.js giúp chúng ta:
- Tạo website nhanh hơn với React
- Có sẵn routing (điều hướng trang)
- Hỗ trợ SEO tốt
- Deploy dễ dàng

### 📝 Làm như thế nào?

**Bước 1.1: Mở Terminal/Command Prompt**
```bash
# Windows: Nhấn Win + R, gõ "cmd"
# Mac: Cmd + Space, gõ "terminal"
```

**Bước 1.2: Chạy lệnh tạo project**
```bash
npx create-next-app@latest blog-modapk
```

**Giải thích lệnh:**
- `npx`: Tool để chạy package từ npm
- `create-next-app`: Tool tạo project Next.js
- `@latest`: Dùng phiên bản mới nhất
- `blog-modapk`: Tên folder project

**Bước 1.3: Chọn các options**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
```

**Giải thích từng option:**
- **TypeScript**: Thêm kiểu dữ liệu cho JavaScript, giúp catch lỗi sớm
- **ESLint**: Tool kiểm tra code, bắt lỗi cú pháp
- **Tailwind CSS**: Framework CSS, viết style nhanh hơn
- **src/ directory**: Tổ chức code gọn gàng hơn
- **App Router**: Cách routing mới của Next.js 13+

**Bước 1.4: Vào thư mục project**
```bash
cd blog-modapk
```

**Bước 1.5: Chạy server để test**
```bash
npm run dev
```

Mở browser: `http://localhost:3000` - Bạn sẽ thấy trang Next.js mặc định.

### 💡 Kiến thức cần biết

**1. Node.js & npm**
- **Node.js**: Môi trường chạy JavaScript ngoài browser
- **npm**: Package manager, quản lý thư viện

**2. React**
- Library JavaScript để xây dựng UI
- Dùng Components (các khối UI có thể tái sử dụng)

**3. Next.js**
- Framework xây dựng trên React
- Thêm routing, SSR (Server Side Rendering)

**4. TypeScript**
- JavaScript + Types (kiểu dữ liệu)
- Ví dụ: `const name: string = "John"` - name phải là string

---

## Bước 2: Setup Database với Prisma

### 🎯 Bước này làm gì?
Thiết lập database (cơ sở dữ liệu) để lưu trữ dữ liệu website (users, posts, comments).

### 🤔 Tại sao cần làm?
Website cần lưu trữ:
- Thông tin người dùng
- Bài viết
- Bình luận
- Categories, tags...

Database giúp lưu trữ và truy xuất dữ liệu nhanh chóng.

### 📝 Làm như thế nào?

**Bước 2.1: Cài đặt Prisma**
```bash
npm install prisma @prisma/client
```

**Giải thích:**
- **Prisma**: ORM (Object-Relational Mapping) - tool để làm việc với database
- **@prisma/client**: Client để query database

**Bước 2.2: Khởi tạo Prisma**
```bash
npx prisma init
```

Lệnh này tạo:
- `prisma/schema.prisma`: File định nghĩa database structure
- `.env`: File chứa environment variables (biến môi trường)

**Bước 2.3: Setup PostgreSQL**

**Cách 1: Cài local (máy tính)**
- Download PostgreSQL từ postgresql.org
- Cài đặt và tạo database mới tên "blogmodapk"

**Cách 2: Dùng cloud (đơn giản hơn)**
- Đăng ký tài khoản miễn phí tại railway.app hoặc supabase.com
- Tạo database mới
- Copy connection string

**Bước 2.4: Cấu hình connection string**

File `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogmodapk"
```

**Giải thích connection string:**
- `postgresql://`: Loại database
- `user`: Username database
- `password`: Password database
- `localhost:5432`: Server address và port
- `blogmodapk`: Tên database

**Bước 2.5: Tạo Schema**

File `prisma/schema.prisma`:
```prisma
// Định nghĩa database sẽ dùng
datasource db {
  provider = "postgresql"  // Loại database
  url      = env("DATABASE_URL")  // Lấy từ .env
}

// Định nghĩa Prisma Client
generator client {
  provider = "prisma-client-js"
}

// Model User - bảng users trong database
model User {
  id       String   @id @default(cuid())  // Primary key, tự động tạo ID
  name     String?  // ? = có thể null
  email    String   @unique  // Phải unique (không trùng)
  password String
  role     Role     @default(USER)  // Mặc định là USER

  createdAt DateTime @default(now())  // Tự động lưu thời gian tạo
  updatedAt DateTime @updatedAt  // Tự động update khi sửa

  // Relations - quan hệ với bảng khác
  posts    Post[]  // 1 user có nhiều posts
  comments Comment[]  // 1 user có nhiều comments

  @@index([email])  // Tạo index để tìm kiếm nhanh
}

// Enum - kiểu dữ liệu liệt kê
enum Role {
  USER
  EDITOR
  ADMIN
  SUPER_ADMIN
}

// Model Post - bảng posts
model Post {
  id            String     @id @default(cuid())
  title         String  // Tiêu đề
  slug          String     @unique  // URL-friendly version của title
  content       String     @db.Text  // Nội dung (Text = không giới hạn độ dài)
  featuredImage String?  // Ảnh đại diện
  status        PostStatus @default(DRAFT)

  // Timestamps
  publishedAt DateTime?  // Thời gian xuất bản (có thể null)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Foreign Keys - khóa ngoại
  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])

  // Relations
  comments Comment[]
  tags     Tag[]

  @@index([slug])
  @@index([authorId])
}

enum PostStatus {
  DRAFT      // Bản nháp
  PUBLISHED  // Đã xuất bản
  ARCHIVED   // Đã lưu trữ
}
```

**Bước 2.6: Chạy Migration**
```bash
npx prisma migrate dev --name init
```

**Giải thích:**
- `migrate dev`: Tạo migration (file thay đổi database)
- `--name init`: Đặt tên migration là "init"

Migration sẽ tạo các bảng trong database theo schema.

**Bước 2.7: Generate Prisma Client**
```bash
npx prisma generate
```

Tạo TypeScript types và functions để query database.

### 💡 Kiến thức cần biết

**1. Database (Cơ sở dữ liệu)**
- Nơi lưu trữ dữ liệu có cấu trúc
- Ví dụ: Excel nhưng mạnh mẽ hơn nhiều

**2. SQL vs NoSQL**
- **SQL** (PostgreSQL, MySQL): Dữ liệu có cấu trúc, có quan hệ
- **NoSQL** (MongoDB): Dữ liệu linh hoạt, không cần schema cố định

**3. ORM (Prisma)**
- Viết code JavaScript thay vì SQL
- Ví dụ: `prisma.user.findMany()` thay vì `SELECT * FROM users`

**4. Primary Key**
- ID duy nhất của mỗi record
- Ví dụ: User có id "user123"

**5. Foreign Key**
- Tham chiếu đến record khác
- Ví dụ: Post có authorId = "user123" → Post thuộc về User đó

**6. Relations (Quan hệ)**
- **One-to-Many**: 1 User có nhiều Posts
- **Many-to-Many**: 1 Post có nhiều Tags, 1 Tag có nhiều Posts

---

## Bước 3: Setup Authentication (Xác Thực)

### 🎯 Bước này làm gì?
Tạo hệ thống đăng nhập/đăng ký để phân biệt người dùng.

### 🤔 Tại sao cần làm?
- Bảo mật: Chỉ admin mới edit được posts
- Cá nhân hóa: Biết ai đang đăng nhập
- Phân quyền: User, Editor, Admin có quyền khác nhau

### 📝 Làm như thế nào?

**Bước 3.1: Cài đặt NextAuth.js**
```bash
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

**Giải thích packages:**
- **next-auth**: Library authentication cho Next.js
- **@auth/prisma-adapter**: Kết nối NextAuth với Prisma
- **bcryptjs**: Mã hóa password

**Bước 3.2: Tạo Prisma Client**

File `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

// Khai báo global type
const globalForPrisma = global as unknown as {
  prisma: PrismaClient
};

// Tạo Prisma instance
export const prisma =
  globalForPrisma.prisma ||  // Dùng instance cũ nếu có
  new PrismaClient({
    log: ["query"],  // Log các query để debug
  });

// Trong development, lưu vào global để không tạo nhiều instance
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**Tại sao cần global?**
- Next.js dev mode hot-reload liên tục
- Không muốn tạo nhiều connection đến database

**Bước 3.3: Tạo Auth Config**

File `src/lib/auth.ts`:
```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Adapter: Kết nối với database
  adapter: PrismaAdapter(prisma),

  // Providers: Các cách đăng nhập
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Hàm xác thực
      async authorize(credentials) {
        // Kiểm tra input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Tìm user trong database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Nếu không tìm thấy
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // So sánh password (đã mã hóa)
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // Trả về user info
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  // Callbacks: Customize session và JWT
  callbacks: {
    // JWT callback: Thêm data vào token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    // Session callback: Thêm data vào session
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // Session strategy
  session: {
    strategy: "jwt",  // Dùng JWT (JSON Web Token)
  },

  // Custom pages
  pages: {
    signIn: "/auth/signin",  // Trang đăng nhập custom
  },
};
```

**Bước 3.4: Tạo API Route**

File `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Export cho cả GET và POST requests
export { handler as GET, handler as POST };
```

**Giải thích `[...nextauth]`:**
- `[...]` = catch-all route
- Bắt tất cả: `/api/auth/signin`, `/api/auth/signout`, etc.

**Bước 3.5: Tạo Session Provider**

File `src/components/providers/SessionProvider.tsx`:
```typescript
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}
```

**Tại sao "use client"?**
- NextAuth hooks chỉ chạy trên client
- Next.js 13+ mặc định là Server Component

**Bước 3.6: Wrap Root Layout**

File `src/app/layout.tsx`:
```typescript
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

**Bước 3.7: Tạo trang đăng nhập**

File `src/app/auth/signin/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Ngăn form reload page

    try {
      // Gọi NextAuth signIn
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,  // Không redirect tự động
      });

      if (result?.error) {
        setError("Email hoặc password không đúng");
        return;
      }

      // Đăng nhập thành công
      router.push("/admin/dashboard");
    } catch (error) {
      setError("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full">
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
```

### 💡 Kiến thức cần biết

**1. Authentication vs Authorization**
- **Authentication**: Xác thực danh tính (bạn là ai?)
- **Authorization**: Phân quyền (bạn được làm gì?)

**2. Password Hashing**
- Không lưu password trực tiếp
- Dùng bcrypt để mã hóa: `password123` → `$2b$10$xyz...`
- Không thể decode ngược lại

**3. JWT (JSON Web Token)**
- Token chứa thông tin user
- Cấu trúc: Header.Payload.Signature
- Server verify signature để đảm bảo token không bị sửa

**4. Session**
- Lưu trạng thái đăng nhập của user
- JWT session: Token lưu ở client (cookie)
- Database session: Session ID lưu ở database

**5. Protected Routes**
- Chỉ cho phép user đã đăng nhập truy cập
- Check session trước khi render page

---

## PHẦN 2: UI & COMPONENTS

---

## Bước 4: Setup shadcn/ui

### 🎯 Bước này làm gì?
Cài đặt thư viện UI components đẹp và sẵn sàng dùng.

### 🤔 Tại sao cần làm?
- Không phải tự viết tất cả components (Button, Input, Dialog...)
- Components đẹp, accessible (hỗ trợ người khuyết tật)
- Customize dễ dàng

### 📝 Làm như thế nào?

**Bước 4.1: Init shadcn/ui**
```bash
npx shadcn-ui@latest init
```

**Chọn options:**
```
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Would you like to use CSS variables for colors? › Yes
```

**Giải thích:**
- **Default style**: Style mặc định của shadcn
- **Slate**: Màu base (xám nhạt)
- **CSS variables**: Dùng biến CSS để dễ customize

**Bước 4.2: Cài đặt components**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

**Components sẽ được thêm vào `src/components/ui/`**

**Bước 4.3: Sử dụng components**

Ví dụ sử dụng Button:
```typescript
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <div>
      <Button>Click me</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
```

**Ví dụ Card:**
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content here</p>
      </CardContent>
    </Card>
  );
}
```

### 💡 Kiến thức cần biết

**1. Component Library**
- Tập hợp các UI components có sẵn
- Ví dụ: Material-UI, Ant Design, shadcn/ui

**2. Tailwind CSS**
- Utility-first CSS framework
- Viết class thay vì CSS:
  ```html
  <div className="bg-blue-500 text-white p-4 rounded">
    Hello
  </div>
  ```

**3. CSS Variables**
- Biến trong CSS:
  ```css
  :root {
    --primary: 222.2 47.4% 11.2%;
  }

  .button {
    background: hsl(var(--primary));
  }
  ```

**4. Accessibility**
- Làm website dùng được cho người khuyết tật
- Screen reader, keyboard navigation
- ARIA attributes

---

## Bước 5: Tạo Header Component

### 🎯 Bước này làm gì?
Tạo thanh navigation (menu) ở đầu website.

### 🤔 Tại sao cần làm?
- Điều hướng giữa các trang
- Hiển thị logo, menu, user info
- Có ở mọi trang (persistent)

### 📝 Làm như thế nào?

**Bước 5.1: Tạo component Header**

File `src/components/layout/Header.tsx`:
```typescript
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, LogOut, Settings } from "lucide-react";

export function Header() {
  // Hook lấy session (thông tin user đang đăng nhập)
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Bên trái */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            BlogModAPK
          </span>
        </Link>

        {/* Navigation - Giữa */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            href="/category/apps"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Ứng dụng
          </Link>
          <Link
            href="/category/games"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Games
          </Link>
        </nav>

        {/* Actions - Bên phải */}
        <div className="flex items-center gap-4">
          {/* Nút Search */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* User Menu hoặc Login Button */}
          {session ? (
            // Đã đăng nhập - Hiện dropdown menu
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={session.user?.image || undefined} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Chưa đăng nhập - Hiện nút Login
            <Button asChild>
              <Link href="/auth/signin">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
```

**Bước 5.2: Thêm vào Layout**

File `src/app/layout.tsx`:
```typescript
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <SessionProvider>
          <Header />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
```

### 💡 Kiến thức cần biết

**1. React Hooks**
- Functions bắt đầu với `use`
- `useSession()`: Lấy thông tin session
- `useState()`: Quản lý state (trạng thái)
- `useEffect()`: Chạy side effects

**2. Conditional Rendering**
- Hiển thị khác nhau dựa vào điều kiện:
  ```typescript
  {session ? <UserMenu /> : <LoginButton />}
  ```

**3. Next.js Link**
- Component để navigate không reload page
- Prefetch automatic (load trước khi click)

**4. CSS Classes**
- `sticky top-0`: Dính ở đầu khi scroll
- `z-50`: Z-index cao (nằm trên các element khác)
- `backdrop-blur`: Hiệu ứng blur background

**5. Icons (Lucide React)**
- Library icons đẹp, nhẹ
- Import và dùng như component:
  ```typescript
  import { Search } from "lucide-react";
  <Search className="h-5 w-5" />
  ```

---

## Bước 6: Tạo Footer Component

### 🎯 Bước này làm gì?
Tạo phần footer (chân trang) với links, thông tin liên hệ.

### 🤔 Tại sao cần làm?
- SEO: Links nội bộ
- UX: Thông tin liên hệ, social media
- Professional: Website trông hoàn chỉnh hơn

### 📝 Làm như thế nào?

File `src/components/layout/Footer.tsx`:
```typescript
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container py-12">
        {/* Grid layout - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="font-bold text-lg mb-4">BlogModAPK</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tải xuống ứng dụng, game và công cụ mới nhất.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <Link href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/apps"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ứng dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/category/games"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  href="/category/tools"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Thông tin</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">Về chúng tôi</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
              <li><Link href="/privacy">Chính sách bảo mật</Link></li>
              <li><Link href="/terms">Điều khoản</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <a href="mailto:contact@blogmodapk.com">
                contact@blogmodapk.com
              </a>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <Separator className="my-8" />

        {/* Bottom Bar - Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} BlogModAPK. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="/sitemap.xml">Sitemap</Link>
            <Link href="/rss">RSS</Link>
            <Link href="/dmca">DMCA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Thêm vào Layout:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
```

### 💡 Kiến thức cần biết

**1. Flexbox Layout**
- `flex min-h-screen flex-col`: Container flex, chiều dọc
- `flex-1`: Main content chiếm toàn bộ space còn lại
- `mt-auto`: Footer luôn ở dưới cùng

**2. Grid Layout**
- `grid grid-cols-4`: Chia 4 cột bằng nhau
- `gap-8`: Khoảng cách giữa các items
- Responsive: `md:grid-cols-2` (2 cột trên tablet)

**3. Responsive Design**
- `hidden md:flex`: Ẩn trên mobile, hiện từ tablet trở lên
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`

**4. Semantic HTML**
- `<footer>`: Chân trang
- `<nav>`: Navigation
- `<header>`: Đầu trang
- Giúp SEO và accessibility

---

## PHẦN 3: PAGES & FEATURES

---

## Bước 7: Tạo Homepage

### 🎯 Bước này làm gì?
Tạo trang chủ hiển thị bài viết nổi bật và mới nhất.

### 🤔 Tại sao cần làm?
- Trang đầu tiên người dùng thấy
- Showcase nội dung hay nhất
- SEO: Keywords, links nội bộ

### 📝 Làm như thế nào?

**Bước 7.1: Tạo Homepage**

File `src/app/(main)/page.tsx`:
```typescript
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post/PostCard";

export default async function HomePage() {
  // Fetch dữ liệu từ database
  const [featuredPosts, latestPosts] = await Promise.all([
    // Bài viết nổi bật
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",  // Chỉ lấy bài đã publish
        featured: true  // Đánh dấu nổi bật
      },
      take: 6,  // Lấy 6 bài
      orderBy: { publishedAt: "desc" },  // Sắp xếp mới nhất
      include: {  // Include related data
        author: true,
        category: true,
        tags: true,
      },
    }),

    // Bài viết mới nhất
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      take: 12,
      orderBy: { publishedAt: "desc" },
      include: { author: true, category: true },
    }),
  ]);

  return (
    <>
      {/* Hero Section - Banner đầu trang */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Download Apps, Games & Tools
          </h1>
          <p className="text-xl text-muted-foreground">
            Miễn phí, an toàn và nhanh chóng
          </p>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Nổi bật</h2>

          {/* Grid 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Mới nhất</h2>

          {/* Grid 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

**Bước 7.2: Tạo PostCard Component**

File `src/components/post/PostCard.tsx`:
```typescript
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    viewCount: number;
    downloadCount: number;
    category: {
      name: string;
      slug: string;
    } | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/post/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}

        <CardHeader>
          {/* Category Badge */}
          {post.category && (
            <Badge variant="secondary" className="mb-2 w-fit">
              {post.category.name}
            </Badge>
          )}

          {/* Title */}
          <h3 className="font-bold text-lg line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent>
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{post.downloadCount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

### 💡 Kiến thức cần biết

**1. Server Components (Next.js 13+)**
- Mặc định components là Server Components
- Chạy trên server, không gửi JavaScript xuống client
- Có thể fetch dữ liệu trực tiếp trong component
- Nhanh hơn, SEO tốt hơn

**2. Promise.all()**
- Chạy nhiều async operations đồng thời
- Nhanh hơn chạy tuần tự:
  ```typescript
  // Chậm (6s)
  const posts = await prisma.post.findMany(); // 3s
  const users = await prisma.user.findMany(); // 3s

  // Nhanh (3s)
  const [posts, users] = await Promise.all([
    prisma.post.findMany(), // 3s
    prisma.user.findMany(), // 3s (cùng lúc)
  ]);
  ```

**3. Prisma Queries**
- `findMany()`: Tìm nhiều records
- `findUnique()`: Tìm 1 record duy nhất
- `where`: Điều kiện lọc
- `take`: Giới hạn số lượng
- `orderBy`: Sắp xếp
- `include`: Bao gồm related data

**4. Next.js Image**
- Component tối ưu hóa images
- Lazy loading (chỉ load khi scroll tới)
- Tự động resize theo device
- Modern formats (WebP, AVIF)

**5. CSS Utilities**
- `line-clamp-2`: Hiện 2 dòng, ... nếu dài hơn
- `aspect-video`: Tỷ lệ 16:9
- `hover:scale-105`: Zoom khi hover

---

## Bước 8: Tạo Category Pages

### 🎯 Bước này làm gì?
Tạo trang danh mục để hiển thị bài viết theo category (Apps, Games, Tools...).

### 🤔 Tại sao cần làm?
- Tổ chức nội dung theo chủ đề
- SEO: Mỗi category là 1 landing page
- UX: Dễ tìm kiếm bài viết

### 📝 Làm như thế nào?

**Bước 8.1: Tạo Dynamic Route**

File `src/app/(main)/[slug]/page.tsx`:
```typescript
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryPage } from "@/components/category/CategoryPage";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

// Interface cho params
interface CategoryPageProps {
  params: {
    slug: string;  // URL parameter
  };
}

// Generate Static Params - Pre-render tất cả category pages
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  // Return array of params
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Generate Metadata cho SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: "Không tìm thấy danh mục" };
  }

  return generateSEOMetadata({
    title: category.name,
    description: category.description || `Danh mục ${category.name}`,
    image: category.image || undefined,
    url: `/${params.slug}`,
  });
}

// Page Component
export default async function Page({ params }: CategoryPageProps) {
  // Fetch category từ database
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      color: true,
    },
  });

  // Nếu không tìm thấy category
  if (!category) {
    notFound();  // Hiển thị 404 page
  }

  // Render CategoryPage component
  return (
    <CategoryPage
      categorySlug={category.slug}
      categoryName={category.name}
      categoryDescription={category.description}
      categoryColor={category.color}
    />
  );
}
```

**Bước 8.2: Tạo CategoryPage Client Component**

File `src/components/category/CategoryPage.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { PostCard } from "@/components/post/PostCard";
import { Loading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryPageProps {
  categorySlug: string;
  categoryName: string;
  categoryDescription: string | null;
  categoryColor: string | null;
}

export function CategoryPage({
  categorySlug,
  categoryName,
  categoryDescription,
}: CategoryPageProps) {
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);

  // Fetch posts từ API
  const { data, isLoading } = useQuery({
    queryKey: ["category-posts", categorySlug, sortBy, page],
    queryFn: async () => {
      const response = await axios.get("/api/posts", {
        params: {
          category: categorySlug,
          sortBy,
          page,
          limit: 12,
        },
      });
      return response.data;
    },
  });

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
        {categoryDescription && (
          <p className="text-lg text-muted-foreground">
            {categoryDescription}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-8">
        <p className="text-muted-foreground">
          {data?.total || 0} bài viết
        </p>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Mới nhất</SelectItem>
            <SelectItem value="popular">Phổ biến</SelectItem>
            <SelectItem value="downloaded">Nhiều lượt tải</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <Loading size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: data.pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Bước 8.3: Tạo API Route**

File `src/app/api/posts/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Lấy query parameters
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sortBy") || "latest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  // Build where clause
  const where: any = {
    status: "PUBLISHED",
  };

  if (category) {
    where.category = {
      slug: category,
    };
  }

  // Build orderBy
  let orderBy: any = { publishedAt: "desc" };

  if (sortBy === "popular") {
    orderBy = { viewCount: "desc" };
  } else if (sortBy === "downloaded") {
    orderBy = { downloadCount: "desc" };
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Fetch posts và total count
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

### 💡 Kiến thức cần biết

**1. Dynamic Routes (Next.js)**
- `[slug]`: Dynamic segment
- `params.slug`: Access URL parameter
- Ví dụ: `/category/apps` → `params.slug = "apps"`

**2. Static Generation**
- `generateStaticParams()`: Pre-render pages at build time
- Nhanh hơn, SEO tốt hơn
- Chỉ cần rebuild khi có category mới

**3. React Query**
- Library quản lý server state
- Features:
  - Caching: Lưu data, không fetch lại
  - Refetching: Auto refresh data
  - Loading states: `isLoading`, `isError`

**4. Query Parameters**
- `?category=apps&sortBy=latest&page=1`
- `searchParams.get("category")`: Lấy giá trị

**5. Pagination**
- `skip`: Bỏ qua bao nhiêu records
- `take`: Lấy bao nhiêu records
- Page 1: skip 0, take 12
- Page 2: skip 12, take 12

---

## Bước 9: Tạo Post Detail Page

### 🎯 Bước này làm gì?
Tạo trang chi tiết bài viết để hiển thị toàn bộ nội dung.

### 🤔 Tại sao cần làm?
- Hiển thị nội dung đầy đủ
- SEO: Mỗi bài viết là 1 page riêng
- Engagement: Comments, downloads, related posts

### 📝 Làm như thế nào?

**Bước 9.1: Tạo Server Component cho Metadata**

File `src/app/(main)/post/[slug]/page.tsx`:
```typescript
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PostPageClient } from "@/components/post/PostPageClient";
import {
  generateMetadata as generateSEOMetadata,
  generateArticleStructuredData,
} from "@/lib/seo";

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Generate Metadata cho SEO
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
      status: "PUBLISHED"
    },
    include: {
      author: { select: { name: true, image: true } },
      tags: { select: { name: true } },
    },
  });

  if (!post) {
    return { title: "Không tìm thấy bài viết" };
  }

  // Generate SEO metadata
  return generateSEOMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    image: post.featuredImage || undefined,
    url: `/post/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author.name || undefined,
    tags: post.tags.map(t => t.name),
  });
}

// Main Page Component
export default function PostPage({ params }: PostPageProps) {
  return (
    <>
      <PostPageClient slug={params.slug} />
      <StructuredData slug={params.slug} />
    </>
  );
}

// Structured Data cho Google
async function StructuredData({ slug }: { slug: string }) {
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true, image: true } },
    },
  });

  if (!post) return null;

  const articleData = generateArticleStructuredData({
    title: post.title,
    description: post.excerpt || "",
    image: post.featuredImage || undefined,
    url: `/post/${post.slug}`,
    publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: {
      name: post.author.name || "Anonymous",
      image: post.author.image || undefined,
    },
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
    />
  );
}
```

**Bước 9.2: Tạo Client Component**

File `src/components/post/PostPageClient.tsx`:
```typescript
"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface PostPageClientProps {
  slug: string;
}

async function getPost(slug: string) {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
}

export function PostPageClient({ slug }: PostPageClientProps) {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPost(slug),
  });

  // Track view count
  useEffect(() => {
    if (post) {
      // Đợi 3 giây rồi mới tăng view (tránh bot)
      const timer = setTimeout(() => {
        axios.post(`/api/posts/${slug}/views`).catch(console.error);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [post, slug]);

  if (isLoading) {
    return <Loading size="lg" text="Đang tải bài viết..." />;
  }

  if (error || !post) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-muted/30 py-12">
        <div className="container max-w-4xl">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-2">
              <span>Bởi {post.author.name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount.toLocaleString()} lượt xem</span>
            </div>

            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{post.downloadCount.toLocaleString()} lượt tải</span>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.category && (
              <Badge>{post.category.name}</Badge>
            )}
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 p-6 bg-primary/5 border-l-4 border-primary rounded-lg">
              <p className="text-lg text-muted-foreground">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* App Info (nếu có) */}
          {(post.version || post.fileSize || post.developer) && (
            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-bold mb-4">Thông tin ứng dụng</h3>
              <dl className="grid grid-cols-2 gap-4">
                {post.version && (
                  <>
                    <dt className="font-medium">Phiên bản:</dt>
                    <dd>{post.version}</dd>
                  </>
                )}
                {post.fileSize && (
                  <>
                    <dt className="font-medium">Dung lượng:</dt>
                    <dd>{post.fileSize}</dd>
                  </>
                )}
                {post.developer && (
                  <>
                    <dt className="font-medium">Nhà phát triển:</dt>
                    <dd>{post.developer}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Download Button */}
          {post.downloadUrl && (
            <div className="mt-8 text-center">
              <a
                href={post.downloadUrl}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => {
                  // Track download
                  axios.post(`/api/posts/${slug}/downloads`);
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Tải xuống
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
```

### 💡 Kiến thức cần biết

**1. Server vs Client Components**
- **Server**:
  - Fetch data, generate metadata
  - Không có state, events
  - Good for SEO
- **Client**:
  - Interactive (onClick, useState)
  - Can't fetch directly in component

**2. useEffect Hook**
- Chạy side effects (effects phụ)
- Dependencies array: `[post, slug]`
- Chạy lại khi dependencies thay đổi
- Cleanup function: `return () => {...}`

**3. dangerouslySetInnerHTML**
- Render HTML string
- "Dangerous" vì có thể bị XSS attack
- Chỉ dùng với nội dung tin cậy (từ database)

**4. Structured Data (JSON-LD)**
- Metadata cho search engines
- Hiển thị rich snippets trên Google
- Article schema: Title, author, date, image

**5. View Tracking**
- Đợi 3s trước khi track (tránh bot)
- Send request không chờ response
- `.catch(console.error)`: Log lỗi nhưng không throw

---

*Tiếp tục với các bước tiếp theo trong phần 2...*

## PHẦN 2: ADMIN PANEL & ADVANCED FEATURES

Ở phần này tôi sẽ giải thích các bước từ 10-20...

(Document này đã đạt giới hạn độ dài. Bạn có muốn tôi tạo thêm file riêng cho PHẦN 2 không?)
