import { AiLoungeContent } from "@/components/ai/ai-lounge-content";
import { getAllCompanions } from "@/lib/ai-companions";
import { buildPageMetadata } from "@/lib/metadata-i18n";

export async function generateMetadata() {
  return buildPageMetadata("pages.aiLounge.title", "pages.aiLounge.description", {
    path: "/ai-lounge",
  });
}

/** Companions are static — session data hydrates client-side after paint */
export default function AiLoungePage() {
  return <AiLoungeContent companions={getAllCompanions()} />;
}
