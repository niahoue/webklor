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
  },  '/': {
    title: 'WebKlor - Agence Web Professionnelle | Création Sites Internet & SEO Expert',
    description: 'WebKlor, agence web experte depuis 2020 spécialisée en création de sites internet professionnels, référencement SEO avancé, marketing digital et développement d\'applications sur mesure. Plus de 150 projets réalisés avec succès. Devis gratuit sous 24h, accompagnement personnalisé de A à Z. Solutions digitales innovantes pour entreprises et professionnels.',
    keywords: 'agence web professionnelle france, création site internet sur mesure, développement web expert, référencement SEO avancé, marketing digital stratégique, application web professionnelle, e-commerce performant, maintenance web, webklor agence digitale'
  },  '/about': {
    title: 'À Propos WebKlor | Notre Équipe d\'Experts & Expertise Digitale Reconnue',
    description: 'Découvrez l\'histoire de WebKlor, agence web innovante spécialisée en développement digital depuis 2020. Notre équipe d\'experts certifiés (développeurs full-stack, designers UX/UI, spécialistes SEO) accompagne plus de 150 entreprises dans leur transformation digitale. Expertise reconnue, méthodes agiles, technologies modernes.',
    keywords: 'équipe webklor experts, histoire agence web france, développeurs certifiés full-stack, designers UX UI professionnels, spécialistes SEO certifiés, transformation digitale entreprise, expertise développement web, valeurs agence digitale'
  },  '/services': {
    title: 'Services Web Professionnels WebKlor | Création Sites & Développement Applications',
    description: 'Services digitaux complets : création de sites web professionnels responsives, développement d\'applications métier sur mesure, e-commerce performants, référencement SEO technique, marketing digital stratégique, maintenance et évolution. Solutions adaptées aux PME, startups et grandes entreprises. Méthodologie agile, technologies modernes.',
    keywords: 'services web professionnels, création site internet responsive, développement application métier, e-commerce sur mesure, SEO technique avancé, marketing digital stratégique, maintenance web professionnelle, développement sur mesure'
  },  '/portfolio': {
    title: 'Portfolio WebKlor | Plus de 150 Réalisations Web & Applications Professionnelles',
    description: 'Explorez notre portfolio de projets web réalisés avec succès : sites vitrine modernes et responsives, boutiques e-commerce performantes, applications métier innovantes, identités visuelles créatives. Références clients dans tous secteurs d\'activité depuis 2020. Témoignages authentiques et études de cas détaillées.',
    keywords: 'portfolio webklor réalisations, projets web professionnels, sites vitrine modernes, e-commerce performant, applications métier, identité visuelle créative, références clients satisfaits, études de cas web'
  },  '/blog': {
    title: 'Blog WebKlor | Actualités Web, Guides SEO & Conseils Marketing Digital',
    description: 'Articles d\'experts en développement web, guides complets de référencement SEO, stratégies marketing digital éprouvées et analyses des dernières tendances technologiques. Conseils pratiques, tutoriels détaillés, astuces professionnelles et retours d\'expérience pour optimiser votre présence digitale et booster vos performances en ligne.',
    keywords: 'blog développement web expert, guides SEO complets, stratégies marketing digital, tendances technologiques 2025, tutoriels développement, conseils webmaster professionnels, astuces optimisation web, actualités digitales'
  },  '/contact': {
    title: 'Contact WebKlor | Devis Gratuit en 24h & Consultation Personnalisée',
    description: 'Contactez notre équipe d\'experts WebKlor pour votre projet digital. Devis détaillé gratuit sous 24h, consultation personnalisée sans engagement, accompagnement sur mesure pour création de site web, référencement SEO, marketing digital et développement d\'applications. Réponse rapide garantie, premier échange téléphonique possible.',
    keywords: 'contact webklor experts, devis gratuit 24h site internet, consultation web personnalisée, projet développement sur mesure, demande devis SEO professionnel, contact agence digitale france, accompagnement projet web'
  },  '/testimonials': {
    title: 'Témoignages Clients WebKlor | Avis Authentiques & Success Stories',
    description: 'Découvrez les témoignages authentiques et détaillés de nos clients satisfaits, leurs retours d\'expérience complets sur nos services de développement web, référencement SEO et marketing digital. Success stories réelles, projets transformés, résultats mesurables et relations durables avec plus de 150 entreprises depuis 2020.',
    keywords: 'témoignages clients webklor authentiques, avis clients satisfaits vérifiés, retours expérience développement web, success stories digitales, satisfaction client agence web, références projets réussis, collaboration long terme'
  },  '/brand-kit': {
    title: 'Kit de Marque WebKlor | Identité Visuelle & Ressources Graphiques Officielles',
    description: 'Explorez l\'univers visuel complet de WebKlor : logos haute définition dans tous formats, palette de couleurs officielles avec codes exacts, typographies utilisées, déclinaisons graphiques professionnelles et guidelines d\'utilisation détaillées. Ressources téléchargeables pour partenaires, médias et collaborateurs.',
    keywords: 'kit marque webklor officiel, identité visuelle complète, logos HD téléchargeables, palette couleurs officielle, typographies webklor, guidelines utilisation, ressources graphiques partenaires'
  },  '/legal-notices': {
    title: 'Mentions Légales WebKlor | Informations Légales & Conditions d\'Utilisation',
    description: 'Mentions légales complètes et détaillées du site WebKlor incluant toutes les informations sur l\'éditeur, l\'hébergeur, les conditions d\'utilisation et les responsabilités légales. Conformité juridique française complète pour agence web professionnelle. Informations juridiques obligatoires et transparentes.',
    keywords: 'mentions légales webklor complètes, informations légales agence web, éditeur site internet professionnel, hébergeur responsabilités, conditions utilisation détaillées, conformité juridique france'
  },  '/privacy-policy': {
    title: 'Politique de Confidentialité WebKlor | Protection Données RGPD Complète',
    description: 'Politique de confidentialité exhaustive et transparente de WebKlor, entièrement conforme au RGPD et aux lois françaises. Découvrez en détail comment nous collectons, utilisons, stockons et protégeons vos données personnelles. Transparence totale sur nos pratiques de protection de la vie privée, droits des utilisateurs et procédures de sécurité.',
    keywords: 'politique confidentialité webklor RGPD, protection données personnelles complète, vie privée numérique sécurisée, conformité RGPD france, droits utilisateurs détaillés, sécurité données web, cookies transparence'
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
