import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getLocale()) === "ar" ? "سياسة الخصوصية" : "Privacy policy" };
}

export default async function Privacy() {
  const ar = (await getLocale()) === "ar";
  return (
    <main className="prose-item mx-auto max-w-2xl px-4 pt-8">
      <h1 className="mb-4 text-2xl font-extrabold">{ar ? "سياسة الخصوصية" : "Privacy policy"}</h1>
      {ar ? (
        <>
          <p>تقدر تقرأ الموقع وتبحث وتتصفح الكتالوجات بدون حساب. تسجيل الدخول بحساب Google يتيح لك التعليقات والتصويت ونشر اكتشافاتك وإدارة تفضيلاتك.</p>
          <h2>الحساب والمشاركة</h2>
          <p>عند الدخول نحفظ الاسم والإيميل وصورة الحساب من Google، ووقت الدخول وعدده، ونوع الجهاز، والموقع التقريبي الذي توفره الاستضافة مثل الدولة والمدينة. منشوراتك وتعليقاتك واسمك وصورتك ومجموع التصويت تظهر في صفحات المجتمع العامة؛ تجنب نشر معلومات شخصية في النصوص.</p>
          <h2>إحصائيات الزيارة والتفضيلات</h2>
          <p>نسجل مسار الصفحة واللغة ونوع المتصفح والجهاز والموقع التقريبي ومصدر الزيارة والحملة. نستخدم معرّف زيارة عشوائيًا محفوظًا في متصفحك لتمييز الزيارات، وVercel Analytics لقياس استخدام الموقع. عند تشغيل إعلانات سناب شات نستخدم Snap Pixel لقياس الزيارات القادمة من الإعلانات، وتعالج Snap Inc. بيانات الاتصال وفق سياستها. تحفظ ملفات الارتباط جلسة الدخول واللغة والمظهر، ويحفظ المتصفح تفضيل النصائح وما شاهدته منها.</p>
          <h2>الخدمات التي تشغّل الموقع</h2>
          <p>تستضيف Vercel الموقع، وتحفظ Supabase بيانات الحساب والمحتوى، وتوفر Google تسجيل الدخول. تتصل صور المصادر ولقطات YouTube بخدماتها الخارجية، ويُحمّل مشغّل YouTube عند ضغط التشغيل. تعالج هذه الخدمات بيانات الاتصال اللازمة لعملها وفق سياساتها. لا نبيع بياناتك.</p>
          <h2>النشرة البريدية</h2>
          <p>النشرة اختيارية ولا تُرسل إلا عند تفعيل الخدمة. تقدر توقف الاشتراك من <Link href="/account" className="text-accent underline">صفحة حسابك</Link> أو من رابط الإلغاء في الرسالة. عند تفعيل الإرسال، تستخدم خدمة Resend عنوان البريد لإيصال النشرة.</p>
        </>
      ) : (
        <>
          <p>You can read, search and browse the catalogs without an account. Google sign-in enables comments, votes, discoveries and account preferences.</p>
          <h2>Accounts and community posts</h2>
          <p>We store your Google name, email and avatar, sign-in time and count, device type, and approximate location supplied by the host, such as country and city. Posts, comments, author names, avatars and vote totals appear on public community pages. Avoid including personal information in your posts.</p>
          <h2>Visit statistics and preferences</h2>
          <p>We record page paths, language, browser and device type, approximate location, referral source and campaign. A random visitor identifier is stored in your browser to distinguish visits. We also use Vercel Analytics. When Snapchat ads run, the Snap Pixel measures visits from those ads, and Snap Inc. processes the connection data under its own policy. Cookies retain your sign-in session, language and theme; browser storage retains your tip preference and seen tips.</p>
          <h2>Services used by the site</h2>
          <p>Vercel hosts the site, Supabase stores account and content data, and Google provides sign-in. Source images and YouTube thumbnails connect to their external services; the YouTube player loads when you press play. These providers process the connection data needed for their services under their own policies. We do not sell your data.</p>
          <h2>Email digest</h2>
          <p>The digest is optional and only sends when delivery is enabled. Turn off your preference from your <Link href="/account" className="text-accent underline">account page</Link> or use the unsubscribe link in an email. When enabled, Resend processes the email address to deliver the digest.</p>
        </>
      )}
    </main>
  );
}
