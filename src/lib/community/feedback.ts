/** Do not expose database errors or promise that an interrupted write was rolled back. */
export function communityFeedback(code: string, ar: boolean, kind: "comment" | "submission" | "vote" | "moderation"): string {
  if (code === "auth") return ar ? "سجّل دخولك من جديد لإكمال الطلب." : "Sign in again to continue.";
  if (code === "limit") return ar ? "وصلت الحد اليومي. جرّب لاحقاً." : "Daily limit reached. Please try later.";
  if (code === "offline") return ar ? "المشاركة غير متاحة حالياً." : "Community features are currently unavailable.";
  if (code === "invalid") {
    if (kind === "comment") return ar ? "اكتب من حرفين إلى 1500 حرف بدون روابط، وتأكد أن الموضوع ما زال موجوداً." : "Use 2–1500 characters without links, and check the topic still exists.";
    if (kind === "submission") return ar ? "راجع العنوان (5–140 حرفاً)، والشرح (20–4000)، ورابط الفيديو المدعوم إن أضفته." : "Check the title (5–140 characters), description (20–4000), and supported video URL if supplied.";
    return ar ? "هذا المحتوى غير متاح لهذا الإجراء. حدّث الصفحة." : "This content is unavailable for that action. Refresh the page.";
  }
  return ar ? "ما قدرنا نتأكد من إتمام الطلب. حدّث الصفحة وتحقق قبل المحاولة مرة ثانية." : "We couldn't confirm the request completed. Refresh and check before trying again.";
}
