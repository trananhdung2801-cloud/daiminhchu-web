@echo off
chcp 65001 >nul
echo ========================================================
echo 🗡️ ĐẠI MINH CHỦ - TỰ ĐỘNG ĐẨY CODE LÊN RENDER.COM 🗡️
echo ========================================================

cd /d "%~dp0"

set /p msg="Nhập ghi chú cập nhật (Enter để mặc định 'Auto update'): "
if "%msg%"=="" set msg=Auto update from Antigravity

echo.
echo [1/3] Đang gom toàn bộ thay đổi...
git add .

echo [2/3] Đang tạo commit: "%msg%"...
git commit -m "%msg%"

echo [3/3] Đang đẩy lên GitHub main branch...
git push origin main

echo.
echo ========================================================
echo ✅ HOÀN TẤT! Render.com sẽ tự động nhận diện và cập nhật
echo 👉 Xem trực tiếp tại: https://dai-minh-chu.onrender.com
echo ========================================================
pause
