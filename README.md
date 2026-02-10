# 🎁 Meey Group Survey - Khảo sát nhận ưu đãi

Form khảo sát hiện đại với tích hợp Google Sheets để thu thập thông tin khách hàng và tặng quà.

## 📋 Tính năng

### ✨ Form Features

- **Multi-step form** với 2 bước chính + trang giới thiệu
- **Validation đầy đủ**:
  - Tên bắt buộc
  - Email HOẶC SĐT (ít nhất 1 trong 2)
  - Chọn ít nhất 1 sản phẩm quan tâm
- **Phone formatting**: Tự động thêm prefix +84
- **Email validation**: Kiểm tra format email hợp lệ
- **Product selection**: Logic exclusive cho "Chưa xài sản phẩm nào"

### 🎨 UI/UX

- Gradient background đẹp mắt
- Smooth animations (slideUp, fadeIn, scaleIn)
- Step indicator với icon
- Custom checkbox với mô tả sản phẩm
- Responsive mobile-first design
- Gift highlight section nổi bật

### 📊 Data Collection

- Tự động gửi dữ liệu lên Google Sheets
- Tracking nguồn traffic qua URL parameter `?group=xxx`
- Timestamp tự động
- Console logging để debug

## 🗂️ Cấu trúc file

```
meey-survey/
├── index.html          # Form HTML structure
├── style.css           # Styling & animations
├── script.js           # Form logic & validation
├── meey-logo.png       # Logo Meey Group (cần thêm)
└── README.md           # File này
```

## 🚀 Cách sử dụng

### 1. Setup cơ bản

```bash
# Mở file index.html trong browser
# Hoặc dùng Live Server trong VS Code
```

### 2. Thêm logo

- Đặt file logo `meey-logo.png` vào cùng thư mục
- Hoặc cập nhật đường dẫn trong HTML:

```html
<img src="path/to/your/logo.png" alt="Meey Group" class="header-logo" />
```

### 3. Tracking nguồn

Thêm parameter `group` vào URL để tracking:

```
https://your-domain.com/?group=facebook
https://your-domain.com/?group=email-campaign
https://your-domain.com/?group=zalo-ads
```

## 📊 Google Sheets Integration

### Dữ liệu được gửi:

```javascript
{
    timestamp: "2026-02-06T02:55:16.000Z",
    name: "Nguyễn Văn A",
    phone: "+84912345678",
    email: "example@gmail.com",
    products: "MeeyMap, MeeyAI",
    group: "facebook"
}
```

### Cấu trúc Google Sheets đề xuất:

| Timestamp        | Tên          | Số điện thoại | Email             | Sản phẩm quan tâm | Nguồn    |
| ---------------- | ------------ | ------------- | ----------------- | ----------------- | -------- |
| 2026-02-06 09:55 | Nguyễn Văn A | +84912345678  | example@gmail.com | MeeyMap, MeeyAI   | facebook |

### Google Apps Script Backend

URL hiện tại:

```
https://script.google.com/macros/s/AKfycbwVWaUD4838JEhV7IHTbhQ2RyhZ67r-OGCQ0n5OIr-kLMU85XKfut0AtUi89KmAQjKoLA/exec
```

**Lưu ý**: Bạn cần tạo Google Apps Script riêng để xử lý dữ liệu (xem phần tiếp theo).

## 🔧 Tùy chỉnh

### Thay đổi màu sắc

Sửa trong `style.css`:

```css
:root {
  --primary-color: #001bb0; /* Màu chính */
  --primary-dark: #001494; /* Màu tối */
  --primary-light: #0052e2; /* Màu sáng */
}
```

### Thay đổi nội dung quà tặng

Sửa trong `index.html` tại section `.gift-highlight`:

```html
<li>
  🎁 <strong>Voucher giảm 20%</strong> áp dụng cho dịch vụ của Meey Group.
</li>
```

### Thêm/bớt sản phẩm

Sửa trong `index.html` tại checkbox group:

```html
<label class="checkbox-option">
  <input type="checkbox" name="products" value="TênSảnPhẩm" />
  <span class="checkbox-custom"></span>
  <span class="checkbox-label">
    <strong>Tên Sản Phẩm</strong>
    <span class="product-desc">Mô tả ngắn</span>
  </span>
</label>
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (full layout)
- **Mobile**: ≤ 768px (single column, adjusted spacing)

## 🎯 Validation Rules

1. **Tên**: Bắt buộc, không được để trống
2. **Contact**: Ít nhất 1 trong 2 (Email hoặc SĐT)
3. **Số điện thoại**:
   - Chỉ chấp nhận số
   - Tối thiểu 9 chữ số
   - Tự động thêm +84
4. **Email**: Format chuẩn (xxx@xxx.xxx)
5. **Sản phẩm**: Ít nhất 1 sản phẩm

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 📝 TODO

- [ ] Tạo Google Apps Script backend
- [ ] Thêm logo Meey Group
- [ ] Cập nhật tên quà tặng cụ thể
- [ ] Deploy lên hosting
- [ ] Setup Google Analytics tracking
- [ ] Thêm reCAPTCHA (optional)

## 🤝 Support

Nếu cần hỗ trợ, liên hệ team Meey Group.

---

**Made with ❤️ for Meey Group**
