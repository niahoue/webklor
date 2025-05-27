#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du site
const SITE_CONFIG = {
  domain: process.env.SITE_DOMAIN || 'votre-domaine.com', // À remplacer par votre domaine
  protocol: 'https',
  lastmod: new Date().toISOString().split('T')[0], // Date du jour
  changefreq: {
    home: 'weekly',
    static: 'monthly',
    blog: 'weekly',
    posts: 'weekly'
  }
};

// Routes statiques de l'application
const STATIC_ROUTES = [
  {
    path: '',
    priority: '1.0',
    changefreq: SITE_CONFIG.changefreq.home
  },
  {
    path: 'about',
    priority: '0.8',
    changefreq: SITE_CONFIG.changefreq.static
  },
  {
    path: 'services',
    priority: '0.9',
    changefreq: SITE_CONFIG.changefreq.static
  },
  {
    path: 'portfolio',
    priority: '0.8',
    changefreq: SITE_CONFIG.changefreq.static
  },
  {
    path: 'testimonials',
    priority: '0.7',
    changefreq: SITE_CONFIG.changefreq.static
  },
  {
    path: 'blog',
    priority: '0.9',
    changefreq: SITE_CONFIG.changefreq.blog
  },
  {
    path: 'contact',
    priority: '0.8',
    changefreq: SITE_CONFIG.changefreq.static
  },
  {
    path: 'brand-kit',
    priority: '0.6',
    changefreq: SITE_CONFIG.changefreq.static
  },
  {
    path: 'legal-notices',
    priority: '0.3',
    changefreq: 'yearly'
  },
  {
    path: 'privacy-policy',
    priority: '0.3',
    changefreq: 'yearly'
  }
];

// Fonction pour générer une URL complète
function generateUrl(path) {
  const cleanPath = path.replace(/^\/+|\/+$/g, ''); // Supprime les / au début et à la fin
  return `${SITE_CONFIG.protocol}://${SITE_CONFIG.domain}${cleanPath ? '/' + cleanPath : ''}`;
}

// Fonction pour générer une entrée de sitemap
function generateSitemapEntry(route) {
  return `  <url>
    <loc>${generateUrl(route.path)}</loc>
    <lastmod>${SITE_CONFIG.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}

// Fonction pour récupérer les articles de blog (simulation)
async function getBlogPosts() {
  // En production, cette fonction devrait se connecter à votre base de données
  // Pour l'instant, on retourne des exemples
  const samplePosts = [
    {
      slug: 'exemple-article-1',
      lastmod: '2025-05-27',
      priority: '0.7'
    },
    {
      slug: 'exemple-article-2',
      lastmod: '2025-05-26',
      priority: '0.7'
    }
  ];

  return samplePosts.map(post => ({
    path: `blog/${post.slug}`,
    priority: post.priority,
    changefreq: SITE_CONFIG.changefreq.posts,
    lastmod: post.lastmod
  }));
}

// Fonction principale pour générer le sitemap
async function generateSitemap() {
  console.log('🗺️  Génération du sitemap...');

  try {
    // Récupérer les articles de blog
    const blogPosts = await getBlogPosts();
    
    // Combiner toutes les routes
    const allRoutes = [...STATIC_ROUTES, ...blogPosts];

    // Générer le XML du sitemap
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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

    console.log('✅ Sitemap généré avec succès !');
    console.log(`📍 Chemin: ${sitemapPath}`);
    console.log(`📊 ${allRoutes.length} URLs incluses`);
    console.log(`🌐 Domaine: ${SITE_CONFIG.domain}`);
    
    return sitemapPath;

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
Disallow: /assets/
`;

  const publicDir = path.join(__dirname, '..', 'public');
  const robotsPath = path.join(publicDir, 'robots.txt');

  fs.writeFileSync(robotsPath, robotsContent, 'utf8');

  console.log('✅ robots.txt généré avec succès !');
  console.log(`📍 Chemin: ${robotsPath}`);
}

// Exécution si le script est appelé directement
if (process.argv[1] === __filename) {
  (async () => {
    try {
      await generateSitemap();
      generateRobotsTxt();
      
      console.log('\n🎉 Génération terminée avec succès !');
      console.log('\n📋 Prochaines étapes :');
      console.log('1. Remplacez "votre-domaine.com" par votre vrai domaine dans SITE_DOMAIN');
      console.log('2. Vérifiez le sitemap généré dans public/sitemap.xml');
      console.log('3. Soumettez le sitemap à Google Search Console');
      console.log('4. Ajoutez le sitemap à Bing Webmaster Tools');
      
    } catch (error) {
      console.error('❌ Échec de la génération:', error);
      process.exit(1);
    }
  })();
}

export { generateSitemap, generateRobotsTxt };
