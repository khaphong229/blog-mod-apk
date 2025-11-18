# Hướng Dẫn Phát Triển BlogModAPK - Full Stack Blog Website

## Tổng Quan Dự Án

**BlogModAPK** là một website blog full-stack được xây dựng bằng Next.js 16, chuyên về chia sẻ ứng dụng, game và tools. Dự án được phát triển qua 20 bước từ setup cơ bản đến hoàn thiện.

### Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js v5 (Auth.js)
- **State Management**: TanStack React Query v5
- **HTTP Client**: Axios
- **Rich Text Editor**: Tiptap
- **Form Handling**: React Hook Form
- **Notifications**: react-hot-toast

---

## Bước 1-3: Setup & Cơ Sở Dữ Liệu

### Bước 1: Khởi Tạo Dự Án

**Mục tiêu**: Setup Next.js project với TypeScript và Tailwind CSS

```bash
npx create-next-app@latest blog-modapk
cd blog-modapk
```

**Cấu hình chọn**:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- src directory: Yes

### Bước 2: Setup Database & Prisma

**File**: `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Enums
enum Role {
  USER
  EDITOR
  ADMIN
  SUPER_ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
}

enum CommentStatus {
  PENDING
  APPROVED
  SPAM
  REJECTED
}

// Models
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  posts     Post[]
  comments  Comment[]
  media     Media[]
  downloads Download[]
  sessions  Session[]
  accounts  Account[]

  @@index([email])
}

model Post {
  id            String     @id @default(cuid())
  title         String
  slug          String     @unique
  excerpt       String?    @db.Text
  content       String     @db.Text
  featuredImage String?
  status        PostStatus @default(DRAFT)
  featured      Boolean    @default(false)

  // App/Game specific
  version      String?
  fileSize     String?
  requirements String? @db.Text
  developer    String?

  // Download
  downloadUrl     String?
  alternativeUrls Json?
  downloadCount   Int     @default(0)

  // SEO
  metaTitle       String?
  metaDescription String? @db.Text
  keywords        String?

  // Stats
  viewCount Int @default(0)

  // Timestamps
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  authorId   String
  author     User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  tags       Tag[]
  comments   Comment[]
  media      Media[]
  downloads  Download[]

  @@index([slug])
  @@index([status])
  @@index([categoryId])
  @@index([authorId])
  @@index([featured])
  @@index([createdAt])
}

model Category {
  id          String  @id @default(cuid())
  name        String  @unique
  slug        String  @unique
  description String? @db.Text
  image       String?
  icon        String?
  color       String?
  order       Int     @default(0)

  // Hierarchical
  parentId String?
  parent   Category?  @relation("CategoryToCategory", fields: [parentId], references: [id])
  children Category[] @relation("CategoryToCategory")

  posts Post[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([parentId])
}

model Tag {
  id          String  @id @default(cuid())
  name        String  @unique
  slug        String  @unique
  description String?

  posts Post[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
}

model Comment {
  id      String        @id @default(cuid())
  content String        @db.Text
  status  CommentStatus @default(PENDING)

  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  postId String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)

  // Nested comments
  parentId String?
  parent   Comment?  @relation("CommentToComment", fields: [parentId], references: [id])
  replies  Comment[] @relation("CommentToComment")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([postId])
  @@index([authorId])
  @@index([status])
  @@index([parentId])
}

model Media {
  id           String  @id @default(cuid())
  filename     String
  originalName String
  mimeType     String
  size         Int
  url          String
  alt          String?
  title        String?

  postId String?
  post   Post?  @relation(fields: [postId], references: [id])

  uploadedById String
  uploadedBy   User   @relation(fields: [uploadedById], references: [id])

  createdAt DateTime @default(now())

  @@index([postId])
  @@index([uploadedById])
}

model Download {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  ipAddress String?
  userAgent String?  @db.Text
  createdAt DateTime @default(now())

  @@index([postId])
  @@index([userId])
  @@index([createdAt])
}

model Setting {
  id    String @id @default(cuid())
  key   String @unique
  value String @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([key])
}

// NextAuth models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

**Chạy migration**:
```bash
npm install prisma @prisma/client
npx prisma init
npx prisma generate
npx prisma migrate dev --name init
```

### Bước 3: Setup Authentication (NextAuth v5)

**File**: `src/lib/auth.ts`

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};
```

**File**: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## Bước 4-6: UI Components & Layout

### Bước 4: Setup shadcn/ui

```bash
npx shadcn-ui@latest init
```

**Cài đặt components**:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add alert-dialog
```

### Bước 5: Header Component

**File**: `src/components/layout/Header.tsx`

```typescript
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, LogOut, Settings } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">BlogModAPK</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Trang chủ
          </Link>
          <Link href="/category/apps" className="text-sm font-medium hover:text-primary">
            Ứng dụng
          </Link>
          <Link href="/category/games" className="text-sm font-medium hover:text-primary">
            Games
          </Link>
          <Link href="/category/tools" className="text-sm font-medium hover:text-primary">
            Tools
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {session ? (
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
                    Admin
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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

### Bước 6: Footer Component

**File**: `src/components/layout/Footer.tsx`

```typescript
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">BlogModAPK</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tải xuống ứng dụng, game và công cụ mới nhất.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/apps">Ứng dụng</Link></li>
              <li><Link href="/category/games">Games</Link></li>
              <li><Link href="/category/tools">Tools</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Thông tin</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">Về chúng tôi</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
              <li><Link href="/privacy">Chính sách</Link></li>
              <li><Link href="/terms">Điều khoản</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} BlogModAPK. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/sitemap.xml">Sitemap</Link>
            <Link href="/rss">RSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

## Bước 7-9: Pages & Features

### Bước 7: Homepage

**File**: `src/app/(main)/page.tsx`

```typescript
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post/PostCard";
import { CategorySection } from "@/components/category/CategorySection";

export default async function HomePage() {
  const [featuredPosts, latestPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", featured: true },
      take: 6,
      orderBy: { publishedAt: "desc" },
      include: { author: true, category: true, tags: true },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      take: 12,
      orderBy: { publishedAt: "desc" },
      include: { author: true, category: true, tags: true },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      {/* Hero Section */}
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

      {/* Featured Posts */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategorySection categories={categories} />

      {/* Latest Posts */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Mới nhất</h2>
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

### Bước 8: Category Pages

**File**: `src/app/(main)/[slug]/page.tsx`

```typescript
import { Metadata } from "next/metadata";
import { prisma } from "@/lib/prisma";
import { CategoryPage } from "@/components/category/CategoryPage";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata({ params }): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: "Không tìm thấy" };

  return generateSEOMetadata({
    title: category.name,
    description: category.description || `Danh mục ${category.name}`,
    image: category.image || undefined,
    url: `/${params.slug}`,
  });
}

export default async function Page({ params }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) notFound();

  return <CategoryPage categorySlug={category.slug} />;
}
```

### Bước 9: Post Detail Page

**File**: `src/app/(main)/post/[slug]/page.tsx`

```typescript
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostPageClient } from "@/components/post/PostPageClient";
import {
  generateMetadata as generateSEOMetadata,
  generateArticleStructuredData,
} from "@/lib/seo";

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { author: true, tags: true },
  });

  if (!post) return { title: "Không tìm thấy" };

  return generateSEOMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    image: post.featuredImage || undefined,
    url: `/post/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    author: post.author.name || undefined,
    tags: post.tags.map(t => t.name),
  });
}

export default function PostPage({ params }) {
  return <PostPageClient slug={params.slug} />;
}
```

---

## Bước 10-12: Admin Dashboard

### Bước 10: Admin Layout & Dashboard

**File**: `src/app/admin/layout.tsx`

```typescript
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";

export default function AdminLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <AdminSidebar />
        <main className="pl-64 pt-0">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

**File**: `src/app/admin/dashboard/page.tsx`

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Eye, Download } from "lucide-react";
import axios from "@/lib/axios";

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => axios.get("/api/admin/dashboard/stats"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng bài viết"
          value={data?.totals.posts}
          icon={FileText}
        />
        <StatsCard
          title="Lượt xem"
          value={data?.totals.views}
          icon={Eye}
        />
        {/* More stats... */}
      </div>
    </div>
  );
}
```

### Bước 11: Post Management

**API**: `src/app/api/admin/posts/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { author: true, category: true },
    }),
    prisma.post.count(),
  ]);

  return NextResponse.json({
    posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const post = await prisma.post.create({
    data: {
      ...data,
      authorId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, post });
}
```

### Bước 12: Rich Text Editor (Tiptap)

**File**: `src/components/editor/TiptapEditor.tsx`

```typescript
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex gap-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        {/* More buttons... */}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
}
```

---

## Bước 13-15: Advanced Features

### Bước 13: Category & Tag Management

**Category API**: `src/app/api/admin/categories/route.ts`

```typescript
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const category = await prisma.category.create({ data });
  return NextResponse.json({ success: true, category });
}
```

### Bước 14: Media Library

**File**: `src/app/admin/media/page.tsx`

```typescript
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "@/lib/axios";

export default function MediaPage() {
  const { data } = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => axios.get("/api/admin/media"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Media Library</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data?.media.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <Image
              src={item.url}
              alt={item.alt}
              width={200}
              height={200}
              className="w-full aspect-square object-cover"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Bước 15: Download Tracking

**API**: `src/app/api/posts/[slug]/downloads/route.ts`

```typescript
export async function POST(request: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  await Promise.all([
    prisma.download.create({
      data: {
        postId: post.id,
        userId: session?.user?.id || null,
        ipAddress,
        userAgent,
      },
    }),
    prisma.post.update({
      where: { id: post.id },
      data: { downloadCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ success: true });
}
```

---

## Bước 16: Comment System

### Comment API

**File**: `src/app/api/posts/[slug]/comments/route.ts`

```typescript
export async function GET(request, { params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
      status: "APPROVED",
      parentId: null,
    },
    include: {
      author: { select: { name: true, image: true } },
      replies: {
        where: { status: "APPROVED" },
        include: { author: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ comments });
}

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, parentId } = await request.json();
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: session.user.id,
      postId: post.id,
      parentId: parentId || null,
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true, comment });
}
```

### Comment Components

**File**: `src/components/comments/CommentSection.tsx`

```typescript
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CommentSection({ slug }) {
  const { data } = useQuery({
    queryKey: ["comments", slug],
    queryFn: () => axios.get(`/api/posts/${slug}/comments`),
  });

  const createMutation = useMutation({
    mutationFn: (content) =>
      axios.post(`/api/posts/${slug}/comments`, { content }),
  });

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <div>
        <Textarea placeholder="Viết bình luận..." />
        <Button onClick={() => createMutation.mutate()}>Gửi</Button>
      </div>

      {/* Comments List */}
      {data?.comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
```

---

## Bước 17: SEO Optimization

### SEO Utilities

**File**: `src/lib/seo.ts`

```typescript
import { Metadata } from "next";

const SITE_NAME = "BlogModAPK";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blogmodapk.com";

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  author,
  tags,
}): Metadata {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${url}`,
      siteName: SITE_NAME,
      images: [{ url: image || "/og-image.jpg" }],
      type,
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || "/og-image.jpg"],
    },
  };
}

export function generateArticleStructuredData({ title, description, image, url, publishedTime, author }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished: publishedTime,
    author: {
      "@type": "Person",
      name: author,
    },
  };
}
```

### Sitemap

**File**: `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://blogmodapk.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: SITE_URL, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${SITE_URL}/post/${post.slug}`,
      lastModified: post.updatedAt,
    })),
    ...categories.map((cat) => ({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: cat.updatedAt,
    })),
  ];
}
```

### Robots.txt

**File**: `src/app/robots.ts`

```typescript
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/auth"],
    },
    sitemap: "https://blogmodapk.com/sitemap.xml",
  };
}
```

---

## Bước 18: Users & Settings Management

### User Management API

**File**: `src/app/api/admin/users/route.ts`

```typescript
export async function GET(request) {
  const session = await getServerSession(authOptions);
  const userRole = session.user.role;

  if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true, comments: true } },
    },
  });

  return NextResponse.json({ users });
}
```

**File**: `src/app/api/admin/users/[id]/route.ts`

```typescript
export async function PATCH(request, { params }) {
  const { role } = await request.json();

  // Security: Cannot change own role
  if (params.id === session.user.id) {
    return NextResponse.json({ error: "Cannot change own role" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role },
  });

  return NextResponse.json({ success: true, user });
}
```

### Settings System

**File**: `src/app/api/admin/settings/route.ts`

```typescript
export async function GET() {
  const settings = await prisma.setting.findMany();
  const settingsObject = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return NextResponse.json({ settings: settingsObject });
}

export async function POST(request) {
  const body = await request.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  return NextResponse.json({ success: true });
}
```

---

## Bước 19: Analytics & Performance

### Dashboard Statistics

**File**: `src/app/api/admin/dashboard/stats/route.ts`

```typescript
export async function GET() {
  const [
    totalPosts,
    totalUsers,
    totalDownloads,
    totalViews,
    topPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.user.count(),
    prisma.download.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
    prisma.post.findMany({
      take: 10,
      orderBy: { viewCount: "desc" },
      include: { author: true },
    }),
  ]);

  return NextResponse.json({
    totals: {
      posts: totalPosts,
      users: totalUsers,
      downloads: totalDownloads,
      views: totalViews._sum.viewCount,
    },
    topPosts,
  });
}
```

### Performance Utilities

**File**: `src/lib/performance.ts`

```typescript
// Web Vitals reporting
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === "production") {
    // Send to analytics
    window.gtag?.("event", metric.name, {
      value: Math.round(metric.value),
    });
  }
}

// Debounce
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Cache utilities
export const cache = {
  set: (key, value, ttl = 3600000) => {
    localStorage.setItem(key, JSON.stringify({
      value,
      expiry: Date.now() + ttl,
    }));
  },
  get: (key) => {
    const item = JSON.parse(localStorage.getItem(key));
    if (Date.now() > item?.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item?.value;
  },
};
```

### Next.js Config Optimizations

**File**: `next.config.ts`

```typescript
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};
```

---

## Bước 20: Final Polish

### Error Pages

**File**: `src/app/not-found.tsx`

```typescript
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl font-bold">Không tìm thấy trang</h2>
          <p className="text-muted-foreground">
            Trang bạn tìm kiếm không tồn tại.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**File**: `src/app/error.tsx`

```typescript
"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardContent className="text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
          <h2 className="text-3xl font-bold mt-4">Đã xảy ra lỗi</h2>
          <p className="text-muted-foreground">
            Xin lỗi, có gì đó không ổn.
          </p>
          <Button onClick={reset} className="mt-4">Thử lại</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### UI Components

**File**: `src/components/ui/scroll-to-top.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-8 right-8 rounded-full ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <ArrowUp />
    </Button>
  );
}
```

**File**: `src/components/ui/loading.tsx`

```typescript
export function Loading({ size = "md", text }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2 className={`animate-spin text-primary h-${size === 'lg' ? 12 : 8}`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}
```

---

## Setup & Deployment

### Environment Variables

**File**: `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blogmodapk"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Site
NEXT_PUBLIC_SITE_URL="https://blogmodapk.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation & Run

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Required Packages

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^5.0.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "@tiptap/react": "^2.0.0",
    "@tiptap/starter-kit": "^2.0.0",
    "react-hook-form": "^7.48.0",
    "react-hot-toast": "^2.4.0",
    "bcryptjs": "^2.4.3",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.292.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "prisma": "^5.0.0"
  }
}
```

---

## Key Features Summary

### Frontend
✅ Homepage với featured posts
✅ Category pages
✅ Post detail với SEO
✅ Search functionality
✅ Comment system (nested)
✅ Download tracking
✅ Responsive design
✅ Loading states
✅ Error handling

### Admin Panel
✅ Dashboard với analytics
✅ Post management (CRUD)
✅ Category/Tag management
✅ Media library
✅ Comment moderation
✅ User management
✅ Settings configuration
✅ Role-based access

### Technical
✅ Next.js 16 App Router
✅ TypeScript
✅ Prisma ORM + PostgreSQL
✅ NextAuth v5
✅ React Query
✅ SEO optimized
✅ Performance optimized
✅ Image optimization
✅ Caching strategies

---

## Project Structure

```
blog-modapk/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   └── post/[slug]/page.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── posts/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── comments/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   └── posts/
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── post/
│   │   ├── comments/
│   │   └── admin/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── axios.ts
│   │   ├── seo.ts
│   │   └── performance.ts
│   └── hooks/
├── public/
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Troubleshooting

### Common Issues

**Prisma Client Error**
```bash
npx prisma generate
```

**Database Connection**
- Kiểm tra DATABASE_URL trong .env
- Đảm bảo PostgreSQL đang chạy

**NextAuth Error**
- Kiểm tra NEXTAUTH_SECRET
- Verify NEXTAUTH_URL

**Build Errors**
```bash
rm -rf .next
npm run build
```

---

## Best Practices

### Code Organization
- Dùng TypeScript cho type safety
- Component composition
- Server/Client components rõ ràng
- API route organization

### Performance
- Image optimization (Next Image)
- Code splitting
- React Query caching
- Database indexing

### Security
- Input validation
- XSS protection
- CSRF tokens
- Role-based access

### SEO
- Dynamic metadata
- Structured data
- Sitemap
- Robots.txt

---

**Project Complete!** 🎉

Tất cả 20 bước đã hoàn thành. Website BlogModAPK sẵn sàng để deploy với đầy đủ tính năng professional.
