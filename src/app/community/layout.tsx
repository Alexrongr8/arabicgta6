import type { Metadata } from "next";

/** Player submissions have no editorial approval state yet; keep the list and details out of search. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
