# 📊 Hướng dẫn Setup Google Sheets Backend

## 🎯 Mục tiêu

Kết nối form khảo sát với Google Sheets để tự động lưu dữ liệu khi user submit.

---

## 📝 Bước 1: Mở Google Sheets

1. Mở link sheet của bạn:

   ```
   https://docs.google.com/spreadsheets/d/1G5ZdNZ4KbHBPGMxQHx37GR3j0UfrhbjBjIaeRGP_x-k/edit
   ```

2. Đảm bảo bạn có quyền **Editor** trên sheet này

---

## ⚙️ Bước 2: Tạo Google Apps Script

### 2.1. Mở Apps Script Editor

1. Trong Google Sheets, click **Extensions** → **Apps Script**
2. Một tab mới sẽ mở ra với Apps Script Editor

### 2.2. Copy Code

1. Xóa toàn bộ code mặc định (function myFunction() {...})
2. Mở file `google-apps-script.js` trong project này
3. Copy **TOÀN BỘ** code
4. Paste vào Apps Script Editor
5. Click **💾 Save** (hoặc Ctrl+S)
6. Đặt tên project: `Meey Survey Backend`

---

## 🚀 Bước 3: Deploy Web App

### 3.1. Deploy

1. Click **Deploy** → **New deployment**
2. Click icon ⚙️ bên cạnh "Select type"
3. Chọn **Web app**

### 3.2. Cấu hình

Điền thông tin như sau:

- **Description**: `Meey Survey Form Backend v1`
- **Execute as**: `Me (your-email@gmail.com)`
- **Who has access**: `Anyone`

### 3.3. Authorize

1. Click **Deploy**
2. Sẽ có popup yêu cầu **Authorize access**
3. Click **Authorize access**
4. Chọn tài khoản Google của bạn
5. Click **Advanced** → **Go to Meey Survey Backend (unsafe)**
6. Click **Allow**

### 3.4. Copy URL

1. Sau khi deploy thành công, sẽ có **Web app URL**
2. Copy URL này (dạng: `https://script.google.com/macros/s/AKfycby.../exec`)
3. Click **Done**

---

## 🔗 Bước 4: Cập nhật Form

### 4.1. Mở file script.js

```bash
C:\Users\Admin\.gemini\antigravity\scratch\meey-survey\script.js
```

### 4.2. Thay URL

Tìm dòng:

```javascript
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwVWaUD4838JEhV7IHTbhQ2RyhZ67r-OGCQ0n5OIr-kLMU85XKfut0AtUi89KmAQjKoLA/exec";
```

Thay bằng URL bạn vừa copy ở bước 3.4:

```javascript
const GOOGLE_SCRIPT_URL = "YOUR_NEW_URL_HERE";
```

### 4.3. Save file

Ctrl+S để save file `script.js`

---

## ✅ Bước 5: Test

### 5.1. Mở form

```bash
C:\Users\Admin\.gemini\antigravity\scratch\meey-survey\index.html
```

### 5.2. Điền form và submit

1. Nhập tên
2. Nhập email hoặc SĐT
3. Chọn sản phẩm
4. Click "Gửi Khảo Sát"

### 5.3. Kiểm tra Google Sheets

1. Quay lại Google Sheets
2. Sẽ có sheet mới tên **"Responses"**
3. Kiểm tra dữ liệu đã được ghi vào

---

## 📊 Cấu trúc dữ liệu trong Sheet

| Timestamp           | Tên          | Số điện thoại | Email            | Sản phẩm quan tâm | Nguồn    |
| ------------------- | ------------ | ------------- | ---------------- | ----------------- | -------- |
| 06/02/2026 10:07:21 | Nguyễn Văn A | +84912345678  | test@example.com | MeeyMap, MeeyAI   | facebook |

### Giải thích các cột:

- **Timestamp**: Thời gian submit (tự động)
- **Tên**: Tên người dùng nhập
- **Số điện thoại**: SĐT với prefix +84
- **Email**: Email người dùng
- **Sản phẩm quan tâm**: Danh sách sản phẩm đã chọn
- **Nguồn**: Tracking từ URL parameter `?group=xxx`

---

## 🎯 Tracking nguồn với URL

### Cách sử dụng:

Khi share link form, thêm parameter `?group=` để tracking:

```
# Facebook Ads
https://your-domain.com/?group=facebook-ads

# Email Campaign
https://your-domain.com/?group=email-campaign

# Zalo
https://your-domain.com/?group=zalo

# Direct (không có parameter)
https://your-domain.com/
→ Sẽ lưu là "direct"
```

### Ví dụ trong Sheet:

| Timestamp | Tên    | ... | Nguồn          |
| --------- | ------ | --- | -------------- |
| ...       | User 1 | ... | facebook-ads   |
| ...       | User 2 | ... | email-campaign |
| ...       | User 3 | ... | direct         |

---

## 🔧 Troubleshooting

### Lỗi: "Script function not found: doPost"

**Nguyên nhân**: Code chưa được save hoặc deploy sai

**Giải pháp**:

1. Kiểm tra lại code trong Apps Script Editor
2. Click Save
3. Deploy lại

### Lỗi: "Authorization required"

**Nguyên nhân**: Chưa authorize script

**Giải pháp**:

1. Làm lại bước 3.3 (Authorize)
2. Đảm bảo chọn đúng tài khoản Google

### Không thấy dữ liệu trong Sheet

**Nguyên nhân**: URL trong script.js chưa đúng

**Giải pháp**:

1. Kiểm tra lại URL trong `script.js`
2. Mở Console trong browser (F12) để xem lỗi
3. Kiểm tra Network tab xem request có gửi thành công không

### Lỗi CORS

**Nguyên nhân**: Apps Script chưa được deploy với "Anyone" access

**Giải pháp**:

1. Vào Apps Script Editor
2. Click Deploy → Manage deployments
3. Click Edit (icon bút chì)
4. Đảm bảo "Who has access" = "Anyone"
5. Click Deploy

---

## 📞 Support

Nếu gặp vấn đề, check:

1. Console log trong browser (F12)
2. Execution log trong Apps Script (View → Executions)
3. Sheet permissions (phải có quyền Editor)

---

**Made with ❤️ for Meey Group**
