@echo off
echo ========================================
echo  BLOG MOD APK - DATABASE SETUP
echo ========================================
echo.

echo [1/4] Kiem tra Docker Desktop...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker chua duoc cai dat!
    echo Vui long cai dat Docker Desktop tu https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop chua chay!
    echo Vui long mo Docker Desktop va doi khoi dong xong
    pause
    exit /b 1
)

echo OK: Docker Desktop dang chay
echo.

echo [2/4] Khoi dong PostgreSQL container...
docker-compose up -d
if errorlevel 1 (
    echo ERROR: Khong the khoi dong Docker containers!
    pause
    exit /b 1
)

echo OK: Containers da khoi dong
echo.

echo Cho 5 giay de PostgreSQL khoi dong hoan tat...
timeout /t 5 /nobreak >nul

echo [3/4] Chay Prisma migration...
call npx prisma db push
if errorlevel 1 (
    echo ERROR: Migration that bai!
    pause
    exit /b 1
)

echo OK: Database schema da duoc tao
echo.

echo [4/4] Seed du lieu mau...
call npm run prisma:seed
if errorlevel 1 (
    echo WARNING: Seed co the da co loi. Kiem tra lai!
)

echo.
echo ========================================
echo  HOAN THANH SETUP DATABASE!
echo ========================================
echo.
echo Thong tin ket noi:
echo   - Database: blog_nextjs
echo   - Host: localhost:5434
echo   - User: blog_user
echo   - Pass: blog_password_2025
echo.
echo Thong tin dang nhap:
echo   - Admin: admin@blogmodapk.com / Admin@123
echo   - Editor: editor1@blogmodapk.com / Admin@123
echo.
echo Truy cap pgAdmin: http://localhost:5050
echo   - Email: admin@blogmodapk.com
echo   - Pass: admin
echo.
echo Khoi dong dev server:
echo   npm run dev
echo.
pause
