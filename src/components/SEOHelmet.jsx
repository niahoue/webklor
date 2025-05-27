import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// Configuration des métadonnées SEO pour chaque page
const SEO_CONFIG = {
  default: {
    title: 'WebKlor - Agence Web & Marketing Digital',
    description: 'Création de sites web professionnels, applications mobiles et stratégies marketing digital pour faire grandir votre entreprise.',
    keywords: 'création site web, développement web, marketing digital, agence web, application mobile',
    image: '/assets/images/webklor-og.jpg',
    type: 'website'
  },
  '/': {
    title: 'WebKlor - Agence Web & Marketing Digital',
    description: 'Transformez votre présence digitale avec WebKlor. Création de sites web, développement d\'applications et stratégies marketing sur mesure.',
    keywords: 'agence web, création site internet, développement web, marketing digital, référencement SEO'
  },
  '/about': {
    title: 'À Propos - WebKlor | Notre Équipe & Expertise',
    description: 'Découvrez l\'équipe WebKlor, notre expertise en développement web et notre approche pour créer des solutions digitales innovantes.',
    keywords: 'équipe webklor, expertise développement, agence web expérimentée, développeurs web'
  },
  '/services': {
    title: 'Services Web - WebKlor | Création & Développement',
    description: 'Nos services complets : création de sites web, développement d\'applications, e-commerce, SEO et marketing digital.',
    keywords: 'services web, création site internet, développement application, e-commerce, SEO, marketing digital'
  },
  '/portfolio': {
    title: 'Portfolio - WebKlor | Nos Réalisations Web',
    description: 'Découvrez nos projets web réalisés : sites vitrine, e-commerce, applications métier et solutions sur mesure.',
    keywords: 'portfolio web, réalisations sites internet, projets développement, références clients'
  },
  '/blog': {
    title: 'Blog - WebKlor | Actualités Web & Digital',
    description: 'Articles et conseils sur le développement web, le marketing digital, les tendances technologiques et les bonnes pratiques.',
    keywords: 'blog développement web, actualités digital, conseils marketing, tendances web'
  },
  '/contact': {
    title: 'Contact - WebKlor | Demande de Devis Gratuit',
    description: 'Contactez WebKlor pour votre projet web. Devis gratuit et personnalisé pour votre site internet ou application.',
    keywords: 'contact webklor, devis gratuit, projet web, développement sur mesure'
  },
  '/testimonials': {
    title: 'Témoignages Clients - WebKlor | Avis & Retours',
    description: 'Découvrez les témoignages de nos clients satisfaits et leurs retours sur nos services de développement web.',
    keywords: 'témoignages clients, avis webklor, retours clients, satisfaction client'
  },
  '/brand-kit': {
    title: 'Brand Kit - WebKlor | Identité Visuelle',
    description: 'Notre charte graphique, logos et éléments de communication pour partenaires et clients.',
    keywords: 'brand kit webklor, charte graphique, logo, identité visuelle'
  },
  '/legal-notices': {
    title: 'Mentions Légales - WebKlor',
    description: 'Informations légales, conditions d\'utilisation et mentions obligatoires du site WebKlor.',
    keywords: 'mentions légales, conditions utilisation, informations légales'
  },
  '/privacy-policy': {
    title: 'Politique de Confidentialité - WebKlor | RGPD',
    description: 'Notre politique de protection des données personnelles conforme au RGPD.',
    keywords: 'politique confidentialité, protection données, RGPD, vie privée'
  }
};

/**
 * Composant SEO avancé avec support du sitemap
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre personnalisé de la page
 * @param {string} props.description - Description personnalisée
 * @param {string} props.keywords - Mots-clés personnalisés
 * @param {string} props.image - Image Open Graph personnalisée
 * @param {string} props.type - Type de contenu (website, article, etc.)
 * @param {string} props.canonical - URL canonique personnalisée
 * @param {boolean} props.noindex - Empêcher l'indexation
 * @param {Object} props.structuredData - Données structurées JSON-LD
 */
const SEOHelmet = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  canonical,
  noindex = false,
  structuredData,
  children
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Récupérer la configuration SEO pour la page actuelle
  const pageConfig = SEO_CONFIG[currentPath] || SEO_CONFIG.default;
  
  // Utiliser les props ou la configuration par défaut
  const seoTitle = title || pageConfig.title;
  const seoDescription = description || pageConfig.description;
  const seoKeywords = keywords || pageConfig.keywords;
  const seoImage = image || pageConfig.image;
  const seoType = type || pageConfig.type;
  
  // Construire l'URL complète
  const baseUrl = window.location.origin;
  const fullUrl = canonical || `${baseUrl}${currentPath}`;
  const imageUrl = seoImage?.startsWith('http') ? seoImage : `${baseUrl}${seoImage}`;
  
  // Données structurées par défaut
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WebKlor",
    "url": baseUrl,
    "logo": `${baseUrl}/assets/images/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+33-1-23-45-67-89",
      "contactType": "customer service",
      "areaServed": "FR",
      "availableLanguage": "French"
    },
    "sameAs": [
      "https://www.facebook.com/webklor",
      "https://www.linkedin.com/company/webklor",
      "https://twitter.com/webklor"
    ]
  };

  return (
    <Helmet>
      {/* Titre de la page */}
      <title>{seoTitle}</title>
      
      {/* Méta-descriptions */}
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* Méta-données de base */}
      <meta name="author" content="WebKlor" />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="French" />
      
      {/* URL canonique */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seoType} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="WebKlor" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@webklor" />
      <meta name="twitter:creator" content="@webklor" />
        {/* Liens vers le sitemap et RSS */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />      {/* Google Analytics (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-FWGHPFWF0T"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FWGHPFWF0T');
        `}
      </script>
      
      {/* Données structurées JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
      
      {/* Contenu personnalisé */}
      {children}
    </Helmet>
  );
};

// Hook personnalisé pour les données structurées par type de page
export const useStructuredData = (type, data = {}) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  
  const structuredDataTypes = {
    article: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "image": data.image ? `${baseUrl}${data.image}` : `${baseUrl}/assets/images/default-article.jpg`,
      "author": {
        "@type": "Organization",
        "name": "WebKlor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "WebKlor",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/assets/images/logo.png`
        }
      },
      "datePublished": data.publishedDate,
      "dateModified": data.modifiedDate || data.publishedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}${location.pathname}`
      }
    },
    
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": data.name,
      "description": data.description,
      "provider": {
        "@type": "Organization",
        "name": "WebKlor"
      },
      "areaServed": "France",
      "serviceType": data.serviceType || "Web Development"
    },
    
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.breadcrumbs?.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${baseUrl}${item.path}`
      }))
    }
  };
  
  return structuredDataTypes[type] || null;
};

export default SEOHelmet;
