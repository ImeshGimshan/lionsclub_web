import {
  Droplet,
  Eye,
  GraduationCap,
  HandHeart,
  Leaf,
  LifeBuoy,
  Ribbon,
  Wheat,
  type LucideProps,
} from "lucide-react";
import type { CauseKey } from "@/lib/content";

// Stand-ins until the club supplies the official Lions global-cause icons
// from the Brand Resource Center. Swap the map entries for those SVGs.
const icons: Record<CauseKey, React.ComponentType<LucideProps>> = {
  environment: Leaf,
  hunger: Wheat,
  vision: Eye,
  diabetes: Droplet,
  "childhood-cancer": Ribbon,
  disaster: LifeBuoy,
  humanitarian: HandHeart,
  youth: GraduationCap,
};

export function CauseIcon({ cause, ...props }: { cause: CauseKey } & LucideProps) {
  const Icon = icons[cause];
  return <Icon aria-hidden="true" {...props} />;
}
