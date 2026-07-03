# 📝 پنل ساخت آزمون معلم

یک Cloudflare Worker کامل برای ساخت آزمون‌های درسی با قابلیت خروجی PDF و Word و ذخیره‌سازی در KV.

## ✨ امکانات

- 📋 **مدیریت اطلاعات آزمون**
  - اداره آموزش و پرورش
  - نام مدرسه و آموزگار
  - پایه تحصیلی و نام درس
  - تاریخ شمسی (1405)
  - مدت زمان آزمون

- ✏️ **انواع سوالات**
  - تشریحی
  - چهارگزینه‌ای
  - کوتاه‌پاسخ
  - صحیح و غلط

- 📊 **حالت‌های آزمون**
  - ابتدایی (نمایش بازخورد)
  - متوسطه (نمایش بارم/نمره)

- 💾 **ذخیره‌سازی ابری**
  - ذخیره آزمون در KV
  - بارگذاری آزمون ذخیره شده
  - حذف آزمون از KV

- 👁️ **پیش‌نمایش زنده**
  - نمایش لحظه‌ای تغییرات
  - فرمت A4

- 📄 **خروجی‌ها**
  - PDF با html2pdf.js
  - Word (DOC)

- 🧮 **ابزارها**
  - نمادهای ریاضی (+ − × ÷ = √ % π)
  - تاریخ امروز شمسی

## 🚀 نحوه Deploy

### 1. کلون ریپو
```bash
git clone https://github.com/naderuser/tosifapk.git
cd tosifapk
```

### 2. ساخت KV Namespace
```bash
wrangler kv:namespace create "EXAM_KV"
```
سپس `id` را در `wrangler.toml` قرار دهید:
```toml
[[kv_namespaces]]
binding = "EXAM_KV"
id = "YOUR_KV_ID_HERE"
```

### 3. Deploy با Wrangler
```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

## 📡 API Endpoints

| مسیر | متد | توضیح |
|------|------|--------|
| `/` | GET | صفحه اصلی پنل |
| `/save` | POST | ذخیره آزمون در KV |
| `/load` | GET | بارگذاری آزمون از KV |
| `/delete` | DELETE | حذف آزمون از KV |

### مثال ذخیره:
```bash
curl -X POST https://your-worker.workers.dev/save \
  -H "Content-Type: application/json" \
  -d '{"name":"آزمون ریاضی","data":{...}}'
```

## 📱 نحوه استفاده

1. به آدرس Worker مراجعه کنید
2. اطلاعات آزمون را وارد کنید
3. سوالات را اضافه کنید
4. پیش‌نمایش را ببینید
5. خروجی PDF یا Word بگیرید
6. آزمون را در KV ذخیره کنید

## 📁 ساختار فایل‌ها

```
cloudflare-worker/
├── index.js      # کد Worker (HTML + CSS + JS + KV)
├── wrangler.toml # تنظیمات
└── README.md     # مستندات
```

## 🔧 تکنولوژی‌ها

- Cloudflare Workers
- Cloudflare KV
- JavaScript (Vanilla)
- html2pdf.js
- CSS سفارشی RTL

## 📅 تاریخچه

- **نسخه 2.0** - افزودن KV و بهبود UI (1405)
- **نسخه 1.0** - انتشار اولیه

## 👨‍💻 طراح

**نادر اکچیک**

ساخته شده با ❤️ برای معلمان ایران

---

**لایسنس:** MIT
