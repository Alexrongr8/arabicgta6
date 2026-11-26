import { publicMetadata } from "@/lib/public-metadata";
import { getLocale } from "@/lib/session";
import { riyadhDayNumber } from "@/lib/daily";
import { arcadeQuiz, dailyQuiz } from "@/lib/quiz";
import { Quiz } from "./Quiz";

export async function generateMetadata() {
  const locale = await getLocale();
  const title = locale === "ar" ? "تحدي اليوم: كم تعرف عن GTA 6؟" : "Daily challenge: how well do you know GTA 6?";
  const description = locale === "ar" ? "خمسة أسئلة جديدة كل يوم عن سيارات وأسلحة وحيوانات Leonida. جاوب، اجمع نقاط، وتحدى ربعك." : "Five new questions every day about Leonida's cars, weapons and animals. Answer, earn points and challenge your friends.";
  return { ...publicMetadata("/play", locale, { title, description }), title, description };
}

export default async function PlayPage() {
  const locale = await getLocale();
  const day = riyadhDayNumber();
  // The marathon gets a fresh shuffle on every visit; the daily set is the same for everyone.
  // eslint-disable-next-line react-hooks/purity
  const seed = Math.floor(Math.random() * 2 ** 31);
  return (
    <main className="mx-auto max-w-2xl px-4 pt-5">
      <Quiz daily={dailyQuiz(day)} arcade={arcadeQuiz(seed)} day={day} locale={locale} />
    </main>
  );
}
