/**
 * Constantes globales de l'application WebKlor
 * Centralise toutes les valeurs constantes pour éviter la duplication
 */

// Configuration du site
export const SITE_CONFIG = {
  name: 'WebKlor',
  url: 'https://www.webklor.com',
  description: 'Experts en création de sites web, SEO, marketing digital et identité visuelle',
  email: 'webklorci@gmail.com',
  phone: '+225 07 16 81 10 87',
  address: '74 Rue des Balances, Marcory, Abidjan, Côte d\'Ivoire',
  hours: 'Lun-Ven: 8h-18h',
  logo: '/assets/images/logo.png',
  socialLinks: {
    facebook: 'https://www.facebook.com/profile.php?id=61576181235235',
    twitter: 'https://x.com/webklor94442',
    instagram: 'https://www.instagram.com/webklor?igsh=Z255ZmxpOGVqeTh2',
    linkedin: 'https://www.linkedin.com/company/webklor'
  }
};

// Données SEO par défaut
export const DEFAULT_SEO = {
  siteName: 'WebKlor',
  separator: ' | ',
  defaultTitle: 'WebKlor - Agence Digitale en Côte d\'Ivoire',
  defaultDescription: 'Experts en création de sites web, SEO, marketing digital et identité visuelle pour propulser votre entreprise vers le succès.',
  defaultKeywords: 'création site web, SEO, marketing digital, logo, flyers, maintenance web, Côte d\'Ivoire, Abidjan',
  defaultImage: '/assets/images/1000059598.png',
  twitterHandle: '@webklor'
};

// Services offerts
export const SERVICES = [
  {
    icon: "🌐",
    title: "Création de Sites Web",
    description: "Sites vitrines, e-commerce et applications web sur mesure avec un design moderne et responsive.",
    color: "primary",
    features: [
      "Sites vitrines élégants et professionnels",
      "Boutiques e-commerce complètes et sécurisées",
      "Applications web personnalisées",
      "Design responsive pour tous les appareils",
      "Intégration de systèmes de gestion de contenu"
    ]
  },
  {
    icon: "📊",
    title: "SEO & Marketing Digital",
    description: "Optimisation pour les moteurs de recherche et stratégies marketing pour augmenter votre visibilité en ligne.",
    color: "secondary",
    features: [
      "Audit SEO complet et optimisation on-page",
      "Stratégies de contenu et de mots-clés",
      "Campagnes publicitaires Google Ads et réseaux sociaux",
      "Analyse de performance et rapports détaillés",
      "Stratégies de marketing par e-mail"
    ]
  },
  {
    icon: "🎨",
    title: "Identité Visuelle",
    description: "Création de logos, flyers et supports marketing pour renforcer votre image de marque.",
    color: "accent",
    features: [
      "Conception de logos uniques et mémorables",
      "Création de flyers et supports publicitaires",
      "Charte graphique complète",
      "Design de cartes de visite professionnelles",
      "Supports marketing digitaux et imprimés"
    ]
  },
  {
    icon: "🔧",
    title: "Maintenance Web",
    description: "Services de maintenance et de mise à jour pour garantir la performance et la sécurité de votre site.",
    color: "dark",
    features: [
      "Mises à jour régulières de sécurité",
      "Sauvegardes automatiques et restauration",
      "Surveillance des performances et optimisation",
      "Support technique réactif",
      "Mises à jour de contenu et ajout de fonctionnalités"
    ]
  }
];

// Statistiques de l'entreprise
export const COMPANY_STATS = [
  { number: "250+", label: "Projets réalisés" },
  { number: "95%", label: "Clients satisfaits" },
  { number: "5+", label: "Années d'expérience" },
  { number: "24/7", label: "Support client" }
];

// Statistiques spécifiques aux témoignages
export const TESTIMONIAL_STATS = [
  { number: "4.9/5", label: "Note moyenne", icon: "bi-star-fill", color: "warning" },
  { number: "98%", label: "Recommandations", icon: "bi-heart-fill", color: "danger" },
  { number: "150+", label: "Avis clients", icon: "bi-chat-quote-fill", color: "info" },
  { number: "85%", label: "Projets répétés", icon: "bi-arrow-repeat", color: "success" }
];

// Valeurs de l'entreprise
export const COMPANY_VALUES = [
  {
    icon: "🎯",
    title: "Excellence",
    description: "Nous visons l'excellence dans chaque projet, en portant une attention particulière aux détails et à la qualité."
  },
  {
    icon: "💡",
    title: "Innovation",
    description: "Nous restons à la pointe des dernières technologies et tendances pour offrir des solutions innovantes."
  },
  {
    icon: "🤝",
    title: "Collaboration",
    description: "Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs besoins et dépasser leurs attentes."
  },
  {
    icon: "📈",
    title: "Résultats",
    description: "Nous nous engageons à fournir des solutions qui génèrent des résultats tangibles pour votre entreprise."
  }
];

// Témoignages clients
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Marie A kouassi",
    company: "Boutique Élégance",
    sector: "E-commerce",
    image: "/assets/images/comment2.png",
    rating: 5,
    text: "WebKlor a transformé notre présence en ligne avec un site e-commerce qui reflète parfaitement l'élégance de notre marque. Les ventes ont augmenté de 40% dès le premier mois après le lancement!",
    projectType: "Site E-commerce",
    duration: "3 mois",
    results: "+40% de ventes en 1 mois",
    services: ["Développement E-commerce", "Design UX/UI", "SEO"],
    year: "2024"
  },
  {
    id: 2,
    name: "Hamadou Koné",
    company: "Immobilier Premium",
    sector: "Immobilier",
    image: "/assets/images/profile2.png",
    rating: 5,
    text: "L'équipe de WebKlor a su comprendre nos besoins spécifiques et créer une plateforme immobilière intuitive qui a révolutionné notre façon de présenter nos biens. Un travail remarquable!",
    projectType: "Plateforme Web",
    duration: "4 mois",
    results: "Interface révolutionnaire",
    services: ["Développement Web", "Base de données", "API"],
    year: "2024"
  },
  {
    id: 3,
    name: "Sophie Martin",
    company: "Restaurant Le Gourmet",
    sector: "Restauration",
    image: "/assets/images/profile_blanche.png",
    rating: 5,
    text: "Notre nouveau site web et notre stratégie SEO mis en place par WebKlor nous ont permis d'augmenter significativement nos réservations en ligne. Un investissement qui a rapidement porté ses fruits.",
    projectType: "Site Vitrine + SEO",
    duration: "2 mois",
    results: "+60% de réservations",
    services: ["Site Vitrine", "SEO", "Marketing Digital"],
    year: "2024"
  },
  {
    id: 4,
    name: "Jean Marie Attanou",
    company: "Cabinet Juridique Conseil",
    sector: "Juridique",
    image: "/assets/images/profile3.png",
    rating: 4,
    text: "Professionnalisme, réactivité et créativité sont les mots qui définissent WebKlor. Notre nouveau site corporate a considérablement amélioré notre image de marque et notre crédibilité.",
    projectType: "Site Corporate",
    duration: "2.5 mois",
    results: "Image de marque renforcée",
    services: ["Site Corporate", "Identité Visuelle", "Branding"],
    year: "2024"
  },
  {
    id: 5,
    name: "Léa Essou",
    company: "École de Langues Internationale",
    sector: "Éducation",
    image: "/assets/images/profile4.png",
    rating: 5,
    text: "La plateforme éducative développée par WebKlor a transformé notre façon d'enseigner. L'interface intuitive et les fonctionnalités sur mesure ont enchanté nos étudiants et nos professeurs.",
    projectType: "Plateforme Éducative",
    duration: "5 mois",
    results: "Expérience d'apprentissage transformée",
    services: ["Application Web", "LMS", "UX/UI Design"],
    year: "2024"
  },
  {
    id: 6,
    name: "Alexandre Abiali",
    company: "Clinique Bien-Être",
    sector: "Santé",
    image: "/assets/images/profile5.png",
    rating: 5,
    text: "WebKlor a créé pour nous une identité visuelle cohérente et moderne qui nous démarque de la concurrence. Le logo et les supports marketing sont exactement ce que nous recherchions.",
    projectType: "Identité Visuelle",
    duration: "1.5 mois",
    results: "Différenciation concurrentielle",
    services: ["Logo Design", "Charte Graphique", "Supports Marketing"],
    year: "2024"
  },
  {
    id: 7,
    name: "Fatou Traoré",
    company: "Startup TechInnovate",
    sector: "Technologie",
    image: "/assets/images/startup.png",
    rating: 5,
    text: "WebKlor nous a accompagnés depuis nos débuts. Leur expertise technique et leur compréhension de nos enjeux startup ont été déterminantes pour notre croissance. Une équipe au top!",
    projectType: "Application SaaS",
    duration: "6 mois",
    results: "Croissance accélérée",
    services: ["Développement SaaS", "MVP", "Scaling"],
    year: "2024"
  },
  {
    id: 8,
    name: "Mohamed Cissé",
    company: "Logistics Pro",
    sector: "Logistique",
    image: "/assets/images/logistics.png",
    rating: 4,
    text: "La solution de gestion logistique développée par WebKlor a optimisé nos processus et réduit nos coûts de 25%. Une équipe technique très compétente qui comprend les enjeux métier.",
    projectType: "Application Métier",
    duration: "4 mois",
    results: "-25% de coûts opérationnels",
    services: ["Application Métier", "Intégration ERP", "Optimisation"],
    year: "2024"
  }
];

// Processus de travail
export const WORK_PROCESS = [
  {
    number: "01",
    title: "Consultation",
    description: "Nous commençons par comprendre vos besoins, objectifs et vision pour votre projet digital."
  },
  {
    number: "02",
    title: "Planification",
    description: "Nous élaborons une stratégie détaillée et un plan d'action adapté à vos objectifs spécifiques."
  },
  {
    number: "03",
    title: "Création",
    description: "Notre équipe conçoit et développe votre solution digitale avec attention aux détails et qualité."
  },
  {
    number: "04",
    title: "Révision",
    description: "Nous affinons le projet selon vos retours pour garantir qu'il répond parfaitement à vos attentes."
  },
  {
    number: "05",
    title: "Lancement",
    description: "Après validation, nous déployons votre projet et assurons sa mise en ligne sans accroc."
  },
  {
    number: "06",
    title: "Suivi",
    description: "Nous continuons à surveiller, optimiser et faire évoluer votre solution pour maximiser son efficacité."
  }
];

// Navigation principale
export const MAIN_NAVIGATION = [
  { path: '/', label: 'Accueil' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/temoignages', label: 'Témoignages' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' }
];

// Messages d'erreur communs
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de réseau. Veuillez vérifier votre connexion.',
  UNAUTHORIZED: 'Accès non autorisé. Veuillez vous connecter.',
  FORBIDDEN: 'Accès interdit.',
  NOT_FOUND: 'Ressource non trouvée.',
  SERVER_ERROR: 'Erreur du serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Données invalides. Veuillez vérifier les champs.',
  GENERIC_ERROR: 'Une erreur est survenue. Veuillez réessayer.'
};

// Formats de date
export const DATE_FORMATS = {
  FULL: 'DD MMMM YYYY',
  SHORT: 'DD/MM/YYYY',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm'
};
