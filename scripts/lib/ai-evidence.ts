/** Trust tool output metadata, never URLs written into the model's JSON prose. */
export function evidenceOf(response: { output?: unknown[] }) {
  const urls = new Set<string>(); let searchCalls = 0; let completedSearches = 0;
  for (const value of response.output ?? []) {
    if (!value || typeof value !== "object") continue;
    const call = value as { type?: string; status?: string; action?: { type?: string; url?: string; sources?: { type?: string; url?: string }[] } };
    if (call.type !== "web_search_call") continue;
    searchCalls++;
    if (call.status !== "completed") continue;
    completedSearches++;
    for (const s of call.action?.sources ?? []) if (s.type === "url" && typeof s.url === "string") urls.add(s.url);
    if ((call.action?.type === "open_page" || call.action?.type === "find_in_page") && typeof call.action.url === "string") urls.add(call.action.url);
  }
  return { retrievedUrls: [...urls].slice(0, 100), searchCalls, completedSearches };
}
