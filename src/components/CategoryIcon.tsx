import { Banknote, Bug, CarFront, Crosshair, Ghost, KeyRound, Lightbulb, MapPinned, Newspaper, Users, type LucideProps } from "lucide-react";
import type { CategorySlug } from "@/lib/types";

const ICONS: Record<CategorySlug, React.ComponentType<LucideProps>> = {
  news: Newspaper,
  secrets: KeyRound,
  money: Banknote,
  weapons: Crosshair,
  places: MapPinned,
  characters: Users,
  vehicles: CarFront,
  glitches: Bug,
  strange: Ghost,
  tips: Lightbulb,
};

export function CategoryIcon({ category, ...props }: { category: CategorySlug } & LucideProps) {
  const I = ICONS[category] ?? Newspaper;
  return <I aria-hidden {...props} />;
}
