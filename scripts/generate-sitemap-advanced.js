#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du site
const SITE_CONFIG = {
  domain: process.env.SITE_DOMAIN || 'votre-domaine.com',
  apiUrl: process.env.API_URL || 'https://votre-domaine.com/api',
  protocol: 'https',
  lastmod: new Date().toISOString().split('T')[0],
  changefreq: {
    home: 'weekly',
    static: 'monthly',
    blog: 'weekly',
    posts: 'weekly'
  }
};

// Routes statiques de l'application avec métadonnées SEO
const STATIC_ROUTES = [
  {
    path: '',
    priority: '1.0',
    changefreq: SITE_CONFIG.changefreq.home,
    title: 'WebKlor - Agence Web & Marketing Digital',
    description: 'Création de sites web, applications et stratégies marketing digital'
  },
  {
    path: 'about',
    priority: '0.8',
    changefreq: SITE_CONFIG.changefreq.static,
    title: 'À Propos - WebKlor',
    description: 'Découvrez notre équipe et notre expertise en développement web'
  },
  {
    path: 'services',
    priority: '0.9',
    changefreq: SITE_CONFIG.changefreq.static,
    title: 'Services - WebKlor',
    description: 'Nos services de création web, développement et marketing digital'
  },
  {
    path: 'portfolio',
    priority: '0.8',
    changefreq: SITE_CONFIG.changefreq.static,
    title: 'Portfolio - WebKlor',
    description: 'Découvrez nos réalisations et projets web'
  },
  {
    path: 'testimonials',
    priority: '0.7',
    changefreq: SITE_CONFIG.changefreq.static,
    title: 'Témoignages - WebKlor',
    description: 'Ce que nos clients disent de nos services'
  },
  {
    path: 'blog',
    priority: '0.9',
    changefreq: SITE_CONFIG.changefreq.blog,
    title: 'Blog - WebKlor',
    description: 'Articles et conseils sur le développement web et le marketing digital'
  },
  {
    path: 'contact',
    priority: '0.8',
    changefreq: SITE_CONFIG.changefreq.static,
    title: 'Contact - WebKlor',
    description: 'Contactez-nous pour votre projet web'
  },
  {
    path: 'brand-kit',
    priority: '0.6',
    changefreq: SITE_CONFIG.changefreq.static,
    title: 'Brand Kit - WebKlor',
    description: 'Notre identité visuelle et ressources de marque'
  },
  {
    path: 'legal-notices',
    priority: '0.3',
    changefreq: 'yearly',
    title: 'Mentions Légales - WebKlor',
    description: 'Informations légales et conditions d\'utilisation'
  },
  {
    path: 'privacy-policy',
    priority: '0.3',
    changefreq: 'yearly',
    title: 'Politique de Confidentialité - WebKlor',
    description: 'Protection de vos données personnelles'
  }
];

// Fonction pour générer une URL complète
function generateUrl(path) {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return `${SITE_CONFIG.protocol}://${SITE_CONFIG.domain}${cleanPath ? '/' + cleanPath : ''}`;
}

// Fonction pour générer une entrée de sitemap
function generateSitemapEntry(route) {
  const lastmod = route.lastmod || SITE_CONFIG.lastmod;
  return `  <url>
    <loc>${generateUrl(route.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}

// Fonction pour récupérer les articles de blog depuis l'API
async function getBlogPostsFromAPI() {
  try {
    console.log('📡 Récupération des articles depuis l\'API...');
    
    const response = await fetch(`${SITE_CONFIG.apiUrl}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WebKlor-Sitemap-Generator'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const posts = await response.json();
    
    if (!Array.isArray(posts)) {
      throw new Error('La réponse de l\'API n\'est pas un tableau');
    }

    console.log(`✅ ${posts.length} articles récupérés depuis l'API`);

    return posts.map(post => ({
      path: `blog/${post.slug}`,
      priority: '0.7',
      changefreq: SITE_CONFIG.changefreq.posts,
      lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : SITE_CONFIG.lastmod,
      title: post.title,
      description: post.excerpt || post.content?.substring(0, 160) + '...'
    }));

  } catch (error) {
    console.warn(`⚠️  Impossible de récupérer les articles depuis l'API: ${error.message}`);
    console.log('📝 Utilisation d\'articles d\'exemple...');
    
    // Retourner des articles d'exemple si l'API n'est pas disponible
    return [
      {
        path: 'blog/comment-creer-site-web-moderne',
        priority: '0.7',
        changefreq: SITE_CONFIG.changefreq.posts,
        lastmod: '2025-05-27',
        title: 'Comment créer un site web moderne',
        description: 'Guide complet pour créer un site web moderne avec les dernières technologies'
      },
      {
        path: 'blog/optimiser-seo-site-web',
        priority: '0.7',
        changefreq: SITE_CONFIG.changefreq.posts,
        lastmod: '2025-05-26',
        title: 'Optimiser le SEO de votre site web',
        description: 'Techniques et conseils pour améliorer le référencement naturel de votre site'
      }
    ];
  }
}

// Fonction principale pour générer le sitemap
async function generateSitemap() {
  console.log('🗺️  Génération du sitemap XML...');

  try {
    // Récupérer les articles de blog
    const blogPosts = await getBlogPostsFromAPI();
    
    // Combiner toutes les routes
    const allRoutes = [...STATIC_ROUTES, ...blogPosts];

    // Générer le XML du sitemap
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allRoutes.map(route => generateSitemapEntry(route)).join('\n')}
</urlset>`;

    // Écrire le fichier sitemap.xml dans le dossier public
    const publicDir = path.join(__dirname, '..', 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Créer le dossier public s'il n'existe pas
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

    console.log('✅ Sitemap XML généré avec succès !');
    console.log(`📍 Chemin: ${sitemapPath}`);
    console.log(`📊 ${allRoutes.length} URLs incluses`);
    console.log(`🌐 Domaine: ${SITE_CONFIG.domain}`);
    
    return { sitemapPath, urlCount: allRoutes.length };

  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    throw error;
  }
}

// Fonction pour générer le robots.txt
function generateRobotsTxt() {
  console.log('🤖 Génération du robots.txt...');

  const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${generateUrl('sitemap.xml')}

# Interdire l'accès aux pages admin
Disallow: /admin/
Disallow: /login

# Interdire l'accès aux API
Disallow: /api/

# Fichiers et dossiers à ignorer
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /assets/fonts/
Disallow: /assets/icons/

# Autoriser les moteurs de recherche courants
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Délai entre les requêtes (en secondes)
Crawl-delay: 1
`;

  const publicDir = path.join(__dirname, '..', 'public');
  const robotsPath = path.join(publicDir, 'robots.txt');

  fs.writeFileSync(robotsPath, robotsContent, 'utf8');

  console.log('✅ robots.txt généré avec succès !');
  console.log(`📍 Chemin: ${robotsPath}`);
  
  return robotsPath;
}

// Fonction pour générer un sitemap d'index (si nécessaire)
function generateSitemapIndex() {
  console.log('📑 Génération du sitemap index...');

  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${generateUrl('sitemap.xml')}</loc>
    <lastmod>${SITE_CONFIG.lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapIndexPath = path.join(publicDir, 'sitemap-index.xml');

  fs.writeFileSync(sitemapIndexPath, sitemapIndexContent, 'utf8');

  console.log('✅ Sitemap index généré avec succès !');
  return sitemapIndexPath;
}

// Exécution si le script est appelé directement
if (process.argv[1] === __filename) {
  (async () => {
    try {
      console.log('🚀 Démarrage du générateur de sitemap WebKlor');
      console.log(`🌐 Domaine: ${SITE_CONFIG.domain}`);
      console.log(`🔗 API: ${SITE_CONFIG.apiUrl}`);
      console.log('');

      const { urlCount } = await generateSitemap();
      generateRobotsTxt();
      
      if (urlCount > 50) {
        generateSitemapIndex();
      }
      
      console.log('\n🎉 Génération terminée avec succès !');
      console.log('\n📋 Fichiers générés :');
      console.log(`   • public/sitemap.xml (${urlCount} URLs)`);
      console.log('   • public/robots.txt');
      
      console.log('\n🔍 URLs importantes :');
      console.log(`   • https://${SITE_CONFIG.domain}/sitemap.xml`);
      console.log(`   • https://${SITE_CONFIG.domain}/robots.txt`);
      
      console.log('\n📝 Prochaines étapes SEO :');
      console.log('1. Déployez votre site avec les nouveaux fichiers');
      console.log('2. Soumettez le sitemap à Google Search Console');
      console.log('3. Ajoutez le sitemap à Bing Webmaster Tools');
      console.log('4. Configurez Google Analytics si ce n\'est pas fait');
      console.log('5. Ajoutez des données structurées (JSON-LD) à vos pages');
      
    } catch (error) {
      console.error('❌ Échec de la génération:', error);
      process.exit(1);
    }
  })();
}

export { generateSitemap, generateRobotsTxt, generateSitemapIndex };
