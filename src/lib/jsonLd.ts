export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "ODEJ بجاية",
    alternateName: "Office des Établissements des Jeunes — Wilaya de Béjaïa",
    url: "https://odejbejaia.dz",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Béjaïa",
      addressCountry: "DZ",
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  publishedAt?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt,
    author: article.authorName
      ? { "@type": "Person", name: article.authorName }
      : undefined,
    url: `https://odejbejaia.dz/actualites/${article.slug}`,
  };
}

export function eventJsonLd(event: {
  title: string;
  slug: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location
      ? { "@type": "Place", name: event.location }
      : undefined,
    url: `https://odejbejaia.dz/activites/${event.slug}`,
  };
}
