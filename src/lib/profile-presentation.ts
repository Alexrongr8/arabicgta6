/** Auth metadata is member-editable; never assume its values are strings. */
export function profilePresentation(metadata: Record<string, unknown> | null | undefined) {
  const value = metadata ?? {};
  const name = [value.full_name, value.name].find((v) => typeof v === "string" && v.trim());
  let avatar: string | undefined;
  if (typeof value.avatar_url === "string" && value.avatar_url.length <= 2048) {
    try {
      const url = new URL(value.avatar_url);
      if (url.protocol === "https:" && !url.username && !url.password) avatar = url.href;
    } catch {}
  }
  return { name: typeof name === "string" ? name.trim().slice(0, 100) : undefined, avatar };
}
