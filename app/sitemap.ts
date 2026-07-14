import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllColumnArticleParams, getAllColumnIds } from "@/lib/columns";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllInsights } from "@/lib/insights";
import { getAllLessonSlugs } from "@/lib/learn";
import { roles } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const guideSlugs = getAllGuideSlugs();
  const insights = getAllInsights();
  const lessonSlugs = getAllLessonSlugs();
  const columnIds = getAllColumnIds();
  const columnArticles = getAllColumnArticleParams();

  const guideUrls = guideSlugs.map((slug) => ({
    url: `${siteConfig.url}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const roleUrls = roles.map((role) => ({
    url: `${siteConfig.url}/roles/${role.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const insightUrls = insights.map((insight) => ({
    url: `${siteConfig.url}/news/insights/${insight.slug}`,
    lastModified: new Date(
      insight.frontmatter.updated ?? insight.frontmatter.date
    ),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const lessonUrls = lessonSlugs.map((slug) => ({
    url: `${siteConfig.url}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const columnUrls = columnIds.map((id) => ({
    url: `${siteConfig.url}/columns/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const columnArticleUrls = columnArticles.map(({ column, slug }) => ({
    url: `${siteConfig.url}/columns/${column}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    { url: siteConfig.url, priority: 1 },
    { url: `${siteConfig.url}/guides`, priority: 0.9 },
    { url: `${siteConfig.url}/learn`, priority: 0.9 },
    { url: `${siteConfig.url}/columns`, priority: 0.85 },
    { url: `${siteConfig.url}/news`, priority: 0.85 },
    { url: `${siteConfig.url}/tools`, priority: 0.8 },
    { url: `${siteConfig.url}/prompts`, priority: 0.8 },
    { url: `${siteConfig.url}/subscribe`, priority: 0.6 },
  ].map((item) => ({
    ...item,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
  }));

  return [
    ...staticUrls,
    ...roleUrls,
    ...guideUrls,
    ...insightUrls,
    ...lessonUrls,
    ...columnUrls,
    ...columnArticleUrls,
  ];
}
