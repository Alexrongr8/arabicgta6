import type { Metadata } from "next";
import { getLocale } from "@/lib/session";

export const metadata: Metadata = { title: "Privacy" };

export default async function Privacy() {
  const ar = (await getLocale()) === "ar";
  return (
    <main className="prose-item mx-auto max-w-2xl px-4 pt-8">
      <h1 className="mb-4 text-2xl font-extrabold">{ar ? "سياسة الخصوصية" : "Privacy policy"}</h1>
      {ar ? (
        <>
          <p>نستخدم تسجيل الدخول بحساب Google فقط. عند تسجيل الدخول نحفظ اسمك وإيميلك وصورتك من Google، ووقت الدخول، وموقعك التقريبي (الدولة والمدينة من عنوان IP)، ونوع جهازك.</p>
          <p>نسجل أيضاً إحصائيات زيارات بسيطة (الصفحة، الدولة، نوع الجهاز) لتحسين الموقع. لا نبيع بياناتك ولا نشاركها، ولا توجد إعلانات.</p>
          <p>نرسل نشرة أسبوعية لمن يرغب، ويمكنك إلغاء الاشتراك من صفحة حسابك أو من الرابط في أي رسالة. لحذف حسابك وبياناتك تواصل معنا عبر الموقع.</p>
        </>
      ) : (
        <>
          <p>We only offer Google sign-in. When you sign in we store your Google name, email and avatar, sign-in time, approximate location (country and city from your IP address) and device type.</p>
          <p>We also record basic visit statistics (page, country, device) to improve the site. We don&apos;t sell or share your data and there are no ads.</p>
          <p>We send an optional weekly digest; unsubscribe any time from your account page or the link in any email. To delete your account and data, contact us through the site.</p>
        </>
      )}
    </main>
  );
}
