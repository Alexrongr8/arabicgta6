# دليل تشغيل موقع arabicgta6.com خطوة بخطوة

> لا ترسل أي مفتاح سري في مكان عام، ولا ترفع ملف `.env.local` على GitHub (الملف محمي تلقائياً).

## 1) GitHub (مكان الكود + التحديث التلقائي كل 6 ساعات)

افتح الطرفية (Terminal) واكتب:

```bash
sudo apt install gh
```

```bash
gh auth login
```

اختر: GitHub.com ← HTTPS ← Login with a web browser، وانسخ الكود اللي يطلع لك في المتصفح.
بعدها أنا أسوي المستودع (private) وأرفع الكود.

## 2) Supabase (قاعدة البيانات + تسجيل الدخول)

1. ادخل https://supabase.com وسجل دخول بحساب GitHub أو Google.
2. New project ← الاسم: `arabicgta6` ← المنطقة: **Frankfurt (eu-central-1)** ← اختر كلمة سر قوية واحفظها عندك.
3. بعد ما يجهز: من القائمة **SQL Editor** ← New query ← الصق محتوى ملف `supabase/schema.sql` كامل ← **Run**.
4. من **Project Settings ← API** انسخ ثلاث قيم وأرسلها لي:
   - Project URL
   - `anon` `public` key
   - `service_role` key (سري)
5. من **Authentication ← URL Configuration**:
   - Site URL: `https://arabicgta6.com`
   - Redirect URLs: أضف `https://arabicgta6.com/**` و `http://localhost:3100/**`

## 3) Google (زر الدخول بحساب Google)

1. ادخل https://console.cloud.google.com ← أنشئ مشروع جديد باسم `arabicgta6`.
2. **APIs & Services ← OAuth consent screen**:
   - User type: External
   - App name: `Arabic GTA 6` ، إيميل الدعم: إيميلك
   - Authorized domains: `arabicgta6.com` و `supabase.co`
   - Scopes: email, profile, openid (الافتراضية)
   - بعد الإعداد اضغط **Publish app** عشان يقدر أي أحد يسجل.
3. **Credentials ← Create credentials ← OAuth client ID**:
   - Application type: Web application
   - Authorized JavaScript origins: `https://arabicgta6.com`
   - Authorized redirect URIs: `https://<رمز مشروعك>.supabase.co/auth/v1/callback` (موجود في Supabase تحت Authentication ← Providers ← Google)
4. انسخ **Client ID** و **Client Secret** والصقهم في Supabase: **Authentication ← Providers ← Google ← Enable**.

## 4) Vercel (استضافة الموقع)

1. ادخل https://vercel.com وسجل دخول بحساب GitHub.
2. Add New ← Project ← اختر مستودع `arabicgta6` ← Import.
3. في **Environment Variables** أضف (أنا أجهز لك القيم):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL=https://arabicgta6.com`, `OWNER_EMAILS=إيميلك`
4. Deploy.
5. **Settings ← Domains** ← أضف `arabicgta6.com` و `www.arabicgta6.com` ← وانسخ سجلات DNS اللي يعطيك إياها Vercel في لوحة شركة الدومين.
6. **Analytics** ← Enable (إحصائيات زيارات مجانية).

## 5) Resend (النشرة الأسبوعية على الإيميل)

1. ادخل https://resend.com وسجل.
2. **Domains ← Add domain** ← `arabicgta6.com` ← أضف سجلات DNS اللي يعطيك إياها في لوحة الدومين ← Verify.
3. **API Keys ← Create** وأرسلها لي.

## 6) أسرار GitHub Actions (للتحديث التلقائي والنشرة)

أنا أضيفها بنفسي بعد ما تعطيني المفاتيح:
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `DIGEST_FROM`

## تغيير سرعة التحديث

ملف `.github/workflows/update.yml`: السطر `cron: "0 */6 * * *"` يعني كل 6 ساعات.
للتحديث كل ساعة غيّره إلى `cron: "0 * * * *"`.

## أوامر مفيدة

| الأمر | الوظيفة |
| --- | --- |
| `npm run dev` | تشغيل الموقع محلياً |
| `npm run seed` | رفع الموسوعة الأولية إلى Supabase |
| `npm run update -- --dry` | تجربة التحديث التلقائي بدون نشر |
| `npm run digest -- --to=you@example.com` | تجربة النشرة على إيميل واحد |
