@echo off
echo Pushing Prisma schema to database...
powershell -Command "$env:DATABASE_URL = 'postgresql://blog_user:blog_password_2025@127.0.0.1:5434/blog_nextjs'; npx prisma db push"
echo.
echo Done!
pause
