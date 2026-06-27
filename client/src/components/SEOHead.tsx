// SEOHead — Dynamic metadata engine for SwimXP Connect
// Injects <title>, <meta description>, Open Graph, Twitter Card, and canonical tags
// Usage: <SEOHead title="..." description="..." path="..." />

import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  /** Canonical path, e.g. "/explore" or "/coach/sarah-chen" */
  path?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Page type for OG — defaults to "website" */
  ogType?: 'website' | 'profile' | 'article';
  /** Structured data JSON-LD object — pass null to skip */
  structuredData?: object | null;
}

const BASE_URL = 'https://swimxp.com';
const DEFAULT_TITLE = 'SwimXP | Private Swim Lessons at Your Condo Pool';
const DEFAULT_DESCRIPTION =
  'Find and book certified private swim coaches at your Singapore condominium or private estate pool. Easy scheduling, verified coaches, and secure payments.';
const DEFAULT_OG_IMAGE = '/icon-512x512.png';

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(data: object) {
  const id = 'swimxp-structured-data';
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  structuredData = null,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title === DEFAULT_TITLE ? title : `${title} | SwimXP`;
    const canonicalUrl = `${BASE_URL}${path}`;

    // Core
    document.title = fullTitle;
    setMeta('description', description);
    setMeta('robots', 'index, follow');
    setMeta('googlebot', 'index, follow');

    // Canonical
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('og:type', ogType, true);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`, true);
    setMeta('og:site_name', 'SwimXP', true);
    setMeta('og:locale', 'en_SG', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`);

    // Geo / Local SEO
    setMeta('geo.region', 'SG');
    setMeta('geo.placename', 'Singapore');

    // Structured data
    if (structuredData) {
      setJsonLd(structuredData);
    }
  }, [title, description, path, ogImage, ogType, structuredData]);

  return null;
}

// ─── Pre-built SEO configs for key pages ───────────────────────────────────

export const SEO_PAGES = {
  home: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SwimXP',
      url: BASE_URL,
      description: DEFAULT_DESCRIPTION,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/explore?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  explore: {
    title: 'Find Certified Swim Coaches Near You',
    description:
      'Browse verified private swim coaches available at condos and pools across Singapore. Filter by location, level, and availability.',
    path: '/explore',
  },
  pools: {
    title: 'Singapore Condo & Public Pool Registry',
    description:
      'Search 50+ swimming pools across Singapore — condos, clubhouses, and public complexes. Find out if a certified SwimXP coach is active at your pool.',
    path: '/pools',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Singapore Swimming Pool Directory',
      description:
        'Directory of 50+ swimming pools across Singapore available for private swim coaching sessions.',
      url: `${BASE_URL}/pools`,
    },
  },
  matches: {
    title: 'Match With Your Perfect Swim Coach',
    description:
      'Swipe through certified swim coaches matched to your child\'s level, location, and schedule. Book instantly once you find your match.',
    path: '/matches',
  },
  schedule: {
    title: 'My Swim Lesson Schedule',
    description: 'View and manage your upcoming private swim lessons, bookings, and makeup sessions.',
    path: '/schedule',
  },
  dashboard: {
    title: 'Swim School Dashboard',
    description:
      'Manage your swim school operations — lessons, students, coaches, analytics, and payouts in one place.',
    path: '/dashboard',
  },
  jobs: {
    title: 'Swim Coach Jobs Bulletin — Singapore',
    description:
      'Browse private swim coaching job requests from parents across Singapore. Apply to teach at condos and pools near you.',
    path: '/jobs',
  },
};
