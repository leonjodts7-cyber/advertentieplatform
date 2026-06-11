import Link from "next/link";

const POPULAR_SEARCHES = [
  { label: "Escort Antwerpen", href: "/zoeken?stad=Antwerpen&categorie=escort" },
  {
    label: "Privé ontvangst Gent",
    href: "/zoeken?stad=Gent&categorie=prive-ontvangst",
  },
  { label: "Video afspraak", href: "/zoeken?categorie=video" },
  {
    label: "Massage Brussel",
    href: "/zoeken?stad=Brussel&categorie=massage",
  },
  { label: "Beschikbaar vandaag", href: "/zoeken?beschikbaar=1" },
  { label: "Geverifieerde profielen", href: "/zoeken?geverifieerd=1" },
] as const;

export function PopularSearches() {
  return (
    <div className="flex flex-wrap gap-2">
      {POPULAR_SEARCHES.map((item) => (
        <Link key={item.href} href={item.href} className="search-chip">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
