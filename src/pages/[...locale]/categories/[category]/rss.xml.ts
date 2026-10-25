import type { APIContext } from "astro";
import { getCategories, getPostsByCategory } from "../../../../i18n/content";
import { generateListRss } from "../../../../i18n/rss";
import { useTranslations } from "../../../../i18n/ui";
import { categoryLabel } from "../../../../data/categories";
import { localeFrom, localePaths } from "../../../../i18n/routing";

export async function getStaticPaths() {
  const paths: { params: Record<string, string | undefined> }[] = [];
  for (const { params } of localePaths()) {
    const locale = localeFrom(params);
    for (const category of await getCategories(locale)) {
      paths.push({ params: { ...params, category } });
    }
  }
  return paths;
}

export async function GET(context: APIContext) {
  const locale = localeFrom(context.params);
  const category = context.params.category!;
  const posts = await getPostsByCategory(locale, category);
  const t = useTranslations(locale);
  const label = categoryLabel(locale, category);

  return generateListRss(
    context,
    locale,
    `${label} — ${t("rss.title")}`,
    t("cats.desc").replace("{category}", label),
    posts
  );
}
