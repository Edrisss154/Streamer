

# Streamer 🎥  
**یک پلتفرم استریم آنلاین برای نمایش و مدیریت فیلم‌ها!**

## 📋 توضیحات پروژه
این پروژه یک اپلیکیشن وب برای استریم ویدیوها و مدیریت اطلاعات آن‌ها است. با استفاده از Node.js و Express ساخته شده و از دیتابیس MySQL برای ذخیره اطلاعات فیلم‌ها استفاده می‌کند. این اپلیکیشن به کاربران اجازه می‌دهد:
- **مشاهده ویدیوها** به صورت استریم
- **افزودن، حذف و ویرایش فیلم‌ها** (با احراز هویت JWT)
- **جستجو و مشاهده اطلاعات فیلم‌ها**
- **دریافت کد embed برای نمایش فیلم‌ها در صفحات وب دیگر**

---

## 🚀 امکانات
1. **API‌ مدیریت فیلم‌ها:**
   - مشاهده لیست فیلم‌ها
   - دریافت اطلاعات یک فیلم خاص
   - افزودن فیلم (با احراز هویت)
   - حذف فیلم (با احراز هویت)
   - به‌روزرسانی اطلاعات فیلم (با احراز هویت)

2. **استریم ویدیو:**
   - قابلیت استریم ویدیو با پشتیبانی از "Range Requests" برای بهبود عملکرد پخش

3. **احراز هویت:**
   - احراز هویت مبتنی بر JWT برای محافظت از endpointهای حساس

4. **کد Embed:**
   - قابلیت دریافت کد HTML برای نمایش ویدیو در صفحات دیگر

---

## 📁 ساختار فایل‌ها
```
Streamer/
├── public/                 # فایل‌های عمومی (CSS، HTML)
├── img/                    # پوشه تصاویر
├── videos/                 # فایل‌های ویدیویی (باید ایجاد شود)
├── index.js                # فایل اصلی سرور
├── package.json            # اطلاعات پروژه و وابستگی‌ها
├── README.md               # توضیحات پروژه
```

---

## 🛠️ نحوه نصب و اجرا
برای راه‌اندازی پروژه مراحل زیر را دنبال کنید:

1. کلون کردن پروژه:
   ```bash
   git clone https://github.com/Edrisss154/Streamer.git
   cd Streamer
   ```

2. نصب وابستگی‌ها:
   ```bash
   npm install
   ```

3. ایجاد دیتابیس MySQL:
   - یک دیتابیس با نام `movies_db` ایجاد کنید.
   - فایل `index.js` را ویرایش کرده و نام کاربری و رمز عبور MySQL خود را تنظیم کنید.

4. اجرا کردن سرور:
   ```bash
   node index.js
   ```

5. دسترسی به پروژه:
   - سرور روی `http://localhost:3000` اجرا می‌شود.

---

## 🔑 احراز هویت
برای endpointهایی که نیاز به احراز هویت دارند (مانند افزودن، حذف یا ویرایش فیلم‌ها)، از JWT استفاده شده است. برای دریافت توکن، از endpoint `/api/login` استفاده کنید:
```bash
POST /api/login
{
  "username": "edrisss",
  "password": "12041381"
}
```

---

## 📦 API Endpoints

### 1. **مدیریت فیلم‌ها**
- **GET /api/movies**  
  دریافت لیست تمام فیلم‌ها
- **GET /api/movies/:id**  
  دریافت اطلاعات یک فیلم خاص
- **POST /api/movies**  
  افزودن فیلم (نیاز به توکن)
- **DELETE /api/movies/:id**  
  حذف فیلم (نیاز به توکن)
- **PUT /api/movies/:id**  
  ویرایش فیلم (نیاز به توکن)

### 2. **استریم ویدیو**
- **GET /api/stream/:id**  
  استریم ویدیو

### 3. **Embed**
- **GET /api/embed/:id**  
  دریافت کد HTML برای نمایش ویدیو

---

## 🧰 پیش‌نیازها
- Node.js (نسخه 14 یا بالاتر)
- MySQL
- مرورگر مدرن

---

## 💡 نکات مهم
- فایل‌های ویدیویی باید در پوشه `videos` قرار داده شوند.
- همچنین میتوانید فقط لینک  فیلم بدهید و فیلم بصورت iframe نمایش داده میشود
- از کلید امن خودتان به جای `secret_key` برای JWT استفاده کنید.
- مسیر فایل‌ها و تنظیمات دیتابیس را مطابق با نیاز خود تنظیم کنید.

---

## 👨‍💻 نویسنده
این پروژه توسط [Edrisss154](https://github.com/Edrisss154) توسعه داده شده است. اگر ایده یا پیشنهادی دارید، خوشحال می‌شوم که بشنوم!

---