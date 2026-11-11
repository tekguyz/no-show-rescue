import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Crawlers may fetch every page. Demo screens are kept out of search by their
// own `noindex` tag (app/demo/layout.tsx), not here: a crawler blocked by
// robots.txt never sees that tag, and could list the bare URL anyway.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl()).href,
  };
}
