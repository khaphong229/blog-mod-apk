import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

const SITE_NAME = "BlogModAPK";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blogmodapk.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  noindex = false,
}: SEOConfig): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = image || DEFAULT_IMAGE;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };

  // Add article-specific metadata
  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      tags,
    };
  }

  // Add noindex if specified
  if (noindex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

// Structured data generators
export function generateArticleStructuredData({
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: { name: string; image?: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || DEFAULT_IMAGE,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      name: author.name,
      image: author.image,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${url}`,
    },
  };
}

export function generateBreadcrumbStructuredData(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateSoftwareApplicationStructuredData({
  name,
  description,
  image,
  version,
  fileSize,
  requirements,
  developer,
  downloadUrl,
}: {
  name: string;
  description: string;
  image?: string;
  version?: string;
  fileSize?: string;
  requirements?: string;
  developer?: string;
  downloadUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    image: image || DEFAULT_IMAGE,
    applicationCategory: "MobileApplication",
    operatingSystem: "Android",
    ...(version && { softwareVersion: version }),
    ...(fileSize && { fileSize }),
    ...(requirements && { softwareRequirements: requirements }),
    ...(developer && {
      author: {
        "@type": "Organization",
        name: developer,
      },
    }),
    ...(downloadUrl && {
      downloadUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    }),
  };
}
