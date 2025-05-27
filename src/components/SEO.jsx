import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Composant SEO amélioré
 * Gère les balises meta et title pour un référencement optimal
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  image, 
  author = 'WebKlor', 
  publishedDate,
  modifiedDate,
  type = 'website',
  noindex = false,
  lang = 'fr',
  schemaType 
}) => {
  // Site URL et image par défaut
  const siteUrl = 'https://www.webklor.com';
  const defaultImage = `${siteUrl}/assets/images/webklor-social-card.jpg`;
  const completeSiteTitle = `${title} | WebKlor`;
  const completeImageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
  const completeCanonicalUrl = canonicalUrl || `${siteUrl}${window.location.pathname}`;

  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = completeSiteTitle;
  }, [title, completeSiteTitle]);
  
  // Construire le schéma JSON-LD
  const generateSchema = () => {
    // Schéma de base pour l'organisation
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'WebKlor',
      url: siteUrl,
      logo: `${siteUrl}/assets/images/logo.png`,
      sameAs: [
        'https://www.facebook.com/webklor',
        'https://twitter.com/webklor',
        'https://www.instagram.com/webklor',
        'https://www.linkedin.com/company/webklor'
      ]
    };

    // Schéma spécifique au type de page
    let contentSchema = {};
    
    switch (schemaType) {
      case 'article':
        contentSchema = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: description,
          image: completeImageUrl,
          author: {
            '@type': 'Person',
            name: author
          },
          publisher: {
            '@type': 'Organization',
            name: 'WebKlor',
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/assets/images/logo.png`
            }
          },
          datePublished: publishedDate,
          dateModified: modifiedDate || publishedDate,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': completeCanonicalUrl
          }
        };
        break;
      
      case 'service':
        contentSchema = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: title,
          description: description,
          provider: {
            '@type': 'Organization',
            name: 'WebKlor'
          },
          url: completeCanonicalUrl
        };
        break;
        
      default:
        contentSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description: description,
          url: completeCanonicalUrl,
          author: {
            '@type': 'Organization',
            name: 'WebKlor'
          }
        };
    }
    
    return [organizationSchema, contentSchema];
  };

  return (
    <Helmet htmlAttributes={{ lang }}>
      {/* Balises meta de base */}
      <title>{completeSiteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Indexation par les moteurs de recherche */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL pour éviter le contenu dupliqué */}
      <link rel="canonical" href={completeCanonicalUrl} />
      
      {/* Open Graph pour Facebook, LinkedIn, etc. */}
      <meta property="og:title" content={completeSiteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={completeCanonicalUrl} />
      <meta property="og:image" content={completeImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="WebKlor" />
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={completeSiteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={completeImageUrl} />
      <meta name="twitter:creator" content="@webklor" />
      
      {/* Google Analytics (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-FWGHPFWF0T"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FWGHPFWF0T');
        `}
      </script>
      
      {/* Google AdSense */}
      <script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1157924148207745"
        crossOrigin="anonymous"
        data-ad-client="ca-pub-1157924148207745"
      ></script>
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
    </Helmet>
  );
};

// PropTypes pour la validation des types
SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  canonicalUrl: PropTypes.string,
  image: PropTypes.string,
  author: PropTypes.string,
  publishedDate: PropTypes.string,
  modifiedDate: PropTypes.string,
  type: PropTypes.string,
  noindex: PropTypes.bool,
  lang: PropTypes.string,
  schemaType: PropTypes.string
};

export default SEO;
