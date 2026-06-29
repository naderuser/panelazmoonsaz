# 📚 توصیف عملکرد — اپ اندروید

## ساختار پروژه
```
app/src/main/java/com/nader/gradesapp/
├── data/
│   ├── model/          ← مدل‌های داده
│   └── repository/     ← ارتباط با API
├── ui/
│   ├── screens/        ← صفحات اپ
│   ├── components/     ← کامپوننت‌های مشترک
│   └── theme/          ← رنگ و فونت
└── viewmodel/          ← ViewModel ها
```

## نصب
1. پروژه رو در Android Studio باز کن
2. در فایل `Repository.kt`، آدرس ورکرت رو جایگزین کن:
   ```kotlin
   const val BASE_URL = "https://YOUR-WORKER.workers.dev"
   ```
3. پروژه رو Build کن و روی دستگاه نصب کن
