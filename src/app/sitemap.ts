import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://veloura.be";

  const routes = [
    "",
    "/zoeken",
    "/ai-lounge",
    "/login",
    "/credits",
    "/juridisch/privacy",
    "/juridisch/voorwaarden",
    "/juridisch/contact",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
