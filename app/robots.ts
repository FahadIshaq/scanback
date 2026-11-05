import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/login",
          "/forgot-password",
          "/auth/",
          "/register",
          "/register/",
          "/activate/",
          "/scan/",
          "/admin/",
          "/confirmation",
          "/edit/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: "https://www.scanback.co.za",
  }
}
