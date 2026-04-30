import { Helmet } from 'react-helmet-async';

export const SITE_URL = 'https://rjunotes.prachitregmi.com.np';
export const SITE_NAME = 'RJU Notes Hub';
const DEFAULT_DESCRIPTION =
  'Free study notes, old questions, and exam resources for Rajarshi Janak University (RJU) students. Download PDF notes, unit-wise summaries, and academic materials for BCA, BIT, BSc CSIT and all programs.';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  schema?: object | object[];
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical = '/',
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  schema,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} – Free Notes & Resources for Rajarshi Janak University`;
  const canonicalUrl = canonical.startsWith('http')
    ? canonical
    : `${SITE_URL}${canonical}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${SITE_NAME} – ${title ?? 'Free study materials for Rajarshi Janak University'}`} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} logo`} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
