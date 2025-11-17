# Blog ModAPK - Full-Stack Blog Website

A modern, full-featured blog website built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Features

- 🎨 Modern UI with Tailwind CSS & shadcn/ui
- 🔐 Authentication with NextAuth.js v5
- 📝 Rich text editor for creating posts
- 🏷️ Categories and tags management
- 💬 Comment system with moderation
- 📊 Admin dashboard with analytics
- 🔍 Advanced search and filtering
- 📱 Responsive design (mobile-first)
- ⚡ Fast and optimized with Next.js 16
- 🎯 SEO optimized
- 📈 Download tracking
- 🌙 Dark mode support (optional)

## Tech Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React

### Database & ORM
- **Database:** PostgreSQL (or MySQL)
- **ORM:** Prisma

### State & Forms
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Validation:** Zod

### Authentication
- **Auth:** NextAuth.js v5
- **Password Hashing:** bcrypt

### Additional
- **Date Formatting:** date-fns
- **Notifications:** react-hot-toast
- **Rich Text Editor:** Tiptap (to be added)
- **Charts:** Recharts (to be added)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL or MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database connection string and other required variables.

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
blog-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   ├── post/               # Post-related components
│   │   ├── editor/             # Rich text editor
│   │   ├── shared/             # Shared components
│   │   └── admin/              # Admin components
│   ├── lib/                    # Utilities and helpers
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript types
│   └── config/                 # Configuration files
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── public/
│   └── uploads/                # Uploaded files
└── ...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Development Roadmap

This project is being built in 20 steps:

- [x] Step 1: Base project setup
- [ ] Step 2: Database setup with Prisma
- [ ] Step 3: Authentication system
- [ ] Step 4: Base UI components & layout
- [ ] Step 5: Homepage frontend
- [ ] Step 6: Category page
- [ ] Step 7: Post detail page
- [ ] Step 8: Search & filter system
- [ ] Step 9: Admin dashboard layout
- [ ] Step 10: Admin post management
- [ ] Step 11: Rich text editor
- [ ] Step 12: Full-featured post form
- [ ] Step 13: Category & tag management
- [ ] Step 14: Media library
- [ ] Step 15: Download system & tracking
- [ ] Step 16: Comment system
- [ ] Step 17: SEO optimization
- [ ] Step 18: Users & settings management
- [ ] Step 19: Analytics & performance
- [ ] Step 20: Final polish & deployment

## License

MIT

## Author

Blog ModAPK Team
