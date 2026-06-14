import type { ReactNode } from "react";
import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { SectionHeader } from "@/components/home/section-header";
import { SkeletonGrid } from "@/components/home/skeleton-card";
import type { Advertentie } from "@/lib/types";

interface HomeAdSectionProps {
  title: string;
  subtitle: string;
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  viewAllHref?: string;
  light?: boolean;
  showSkeleton?: boolean;
  emptyState?: ReactNode;
}

export function HomeAdSection({
  title,
  subtitle,
  advertenties,
  fotos,
  viewAllHref = "/zoeken",
  light = true,
  showSkeleton = false,
  emptyState,
}: HomeAdSectionProps) {
  return (
    <section
      className={
        light ? "discovery-section discovery-section--light" : "discovery-section"
      }
    >
      <div className="container">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          light={light}
          action={
            advertenties.length > 0 ? (
              <Link
                href={viewAllHref}
                className="hidden text-sm font-medium text-[#7b2f49] hover:underline sm:inline"
              >
                Alles bekijken →
              </Link>
            ) : undefined
          }
        />

        {advertenties.length > 0 ? (
          <div className="discovery-grid mt-5">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
                theme="light"
              />
            ))}
          </div>
        ) : showSkeleton ? (
          <SkeletonGrid count={4} />
        ) : (
          (emptyState ?? null)
        )}

        {advertenties.length > 0 && (
          <div className="mt-4 text-center sm:hidden">
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-[#7b2f49] hover:underline"
            >
              Alles bekijken →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
