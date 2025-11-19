@echo off
echo Starting Next.js development server...
echo.
powershell -Command "$env:DATABASE_URL = 'postgresql://blog_user:blog_password_2025@127.0.0.1:5434/blog_nextjs'; npm run dev"
