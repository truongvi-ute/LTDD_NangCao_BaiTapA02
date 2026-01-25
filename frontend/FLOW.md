# MAPIC Frontend - Authentication Flow

## 🔄 Flow chính xác theo yêu cầu:

### 1. **Có tài khoản → Login → Home**
```
Login Screen → API call → JWT token → Home Screen
```

### 2. **Chưa có tài khoản → Register → Verify OTP → Login → Home**
```
Register Screen → API call → Verify OTP Screen (type=register) → Login Screen → Home
```

### 3. **Quên mật khẩu → Forgot Password → Verify OTP → Đặt lại MK → Login → Home**
```
Login Screen → Forgot Password → API call → Verify OTP Screen (type=forgot) → Login Screen → Home
```

## 📱 Cấu trúc trang:

- **`/index`** - Auto redirect dựa trên JWT token
- **`/login`** - Đăng nhập + link quên mật khẩu + link đăng ký
- **`/register`** - Đăng ký tài khoản → **NGAY LẬP TỨC** chuyển verify OTP
- **`/forgot-password`** - Nhập email → chuyển verify OTP  
- **`/verify-otp`** - Xử lý cả 2 case:
  - `type=register`: Kích hoạt tài khoản → Login
  - `type=forgot`: Đặt lại mật khẩu → Login
- **`/home`** - Trang chủ sau khi đăng nhập thành công

## 🔐 JWT Token Management:

- **Login thành công**: Lưu JWT token + user info
- **App start**: Check token → redirect home/login
- **API calls**: Auto-attach Bearer token
- **Token expired**: Auto-logout + redirect login
- **Logout**: Clear token + redirect login

## 🎯 Flow chi tiết:

### **Register Flow:**
1. User nhập thông tin → Submit
2. Backend tạo user (active=false) + gửi OTP
3. **NGAY LẬP TỨC** chuyển đến verify-otp?type=register
4. User nhập OTP → Backend kích hoạt tài khoản
5. Chuyển về login để đăng nhập

### **Login Flow:**
1. User nhập email/password → Submit
2. Backend check active=true + trả JWT token
3. Frontend lưu token → chuyển home

### **Forgot Password Flow:**
1. User nhập email → Submit
2. Backend gửi OTP → chuyển verify-otp?type=forgot
3. User nhập OTP + password mới → Backend reset
4. Chuyển về login để đăng nhập

## ✅ Hoàn chỉnh 100%:

✅ Register với OTP activation (NGAY LẬP TỨC)  
✅ Forgot Password với OTP reset  
✅ Login với JWT authentication  
✅ Protected routes với token check  
✅ Auto token management  
✅ Consistent UI/UX  

## 🚀 Sẵn sàng cho production!