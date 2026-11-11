import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Only the landing page. Demo screens never go in the sitemap (DEMO-STANDARD.md, Search engines).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl().href, changeFrequency: "monthly", priority: 1 }];
}
