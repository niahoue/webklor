const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialisation de l'application Express
const app = express();

// Configuration CORS pour production
app.use(cors({
  origin: [
    'https://webklor.com',
    'https://www.webklor.com',
    'https://webklor-livraison-5pm8kezq1-niahoues-projects.vercel.app',
    'https://webklor-livraison-n53mh5tna-niahoues-projects.vercel.app',
    'https://webklor-livraison-95tni6v12-niahoues-projects.vercel.app',
    'https://webklor-livraison-c6wzpbw4z-niahoues-projects.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Route de test de l'API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API WebKlor - Serveur fonctionnel', 
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Route de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'WebKlor API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test des variables d'environnement
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: process.env.MONGODB_URI ? 'Configuré' : 'Non configuré',
    jwt: process.env.JWT_SECRET ? 'Configuré' : 'Non configuré',
    email: process.env.EMAIL_USER ? 'Configuré' : 'Non configuré',
    frontend: process.env.FRONTEND_URL || 'https://webklor.com'
  });
});

// Routes simplifiées pour les fonctionnalités de base
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    res.json({ 
      message: 'Message reçu avec succès',
      data: { name, email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    res.json({ 
      message: 'Inscription réussie à la newsletter',
      email 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Route pour récupérer les articles de blog (version simplifiée)
app.get('/api/posts', async (req, res) => {
  try {
    const examplePosts = [
      {
        _id: '1',
        slug: 'comment-creer-site-web-moderne',
        title: 'Comment créer un site web moderne en 2025',
        excerpt: 'Découvrez les meilleures pratiques pour créer un site web moderne, les outils incontournables et les tendances à suivre.',
        content: 'Le développement web moderne nécessite une approche méthodique...',
        category: 'Développement Web',
        author: 'Équipe WebKlor',
        tags: ['développement', 'web', 'moderne', '2025'],
        featuredImage: '/assets/images/blog/web-moderne.jpg',
        createdAt: '2025-01-15T10:00:00Z',
        publishedAt: '2025-01-15T10:00:00Z',
        readTime: 5,
        views: 234,
        status: 'publié'
      },
      {
        _id: '2',
        slug: 'optimiser-seo-site-web',
        title: 'Optimiser le SEO de votre site web',
        excerpt: 'Techniques avancées pour améliorer le référencement naturel et attirer plus de visiteurs qualifiés.',
        content: 'Le SEO est un élément crucial pour la visibilité de votre site...',
        category: 'SEO',
        author: 'Équipe WebKlor',
        tags: ['seo', 'référencement', 'optimisation'],
        featuredImage: '/assets/images/blog/seo-optimisation.jpg',
        createdAt: '2025-01-14T10:00:00Z',
        publishedAt: '2025-01-14T10:00:00Z',
        readTime: 7,
        views: 189,
        status: 'publié'
      },
      {
        _id: '3',
        slug: 'tendances-design-web-2025',
        title: 'Les tendances du design web en 2025',
        excerpt: 'Découvrez les dernières tendances en matière de design web qui marqueront cette année.',
        content: 'Le design web évolue constamment...',
        category: 'Design',
        author: 'Équipe WebKlor',
        tags: ['design', 'tendances', '2025', 'ui/ux'],
        featuredImage: '/assets/images/blog/design-tendances.jpg',
        createdAt: '2025-01-13T10:00:00Z',
        publishedAt: '2025-01-13T10:00:00Z',
        readTime: 6,
        views: 156,
        status: 'publié'
      },
      {
        _id: '4',
        slug: 'marketing-digital-strategies',
        title: 'Stratégies de marketing digital efficaces',
        excerpt: 'Optimisez votre présence en ligne avec ces stratégies de marketing digital éprouvées.',
        content: 'Le marketing digital est essentiel pour toute entreprise...',
        category: 'Marketing Digital',
        author: 'Équipe WebKlor',
        tags: ['marketing', 'digital', 'stratégies'],
        featuredImage: '/assets/images/blog/marketing-digital.jpg',
        createdAt: '2025-01-12T10:00:00Z',
        publishedAt: '2025-01-12T10:00:00Z',
        readTime: 8,
        views: 203,
        status: 'publié'
      },
      {
        _id: '5',
        slug: 'securite-sites-web',
        title: 'Sécuriser votre site web contre les menaces',
        excerpt: 'Guide complet pour protéger votre site web des cyberattaques et assurer la sécurité des données.',
        content: 'La sécurité web est plus importante que jamais...',
        category: 'Technologie',
        author: 'Équipe WebKlor',
        tags: ['sécurité', 'cybersécurité', 'protection'],
        featuredImage: '/assets/images/blog/securite-web.jpg',
        createdAt: '2025-01-11T10:00:00Z',
        publishedAt: '2025-01-11T10:00:00Z',
        readTime: 10,
        views: 178,
        status: 'publié'
      },
      {
        _id: '6',
        slug: 'responsive-design-mobile-first',
        title: 'Design responsive et approche Mobile First',
        excerpt: 'Créez des sites web adaptatifs qui offrent une expérience optimale sur tous les appareils.',
        content: 'Avec l\'augmentation du trafic mobile...',
        category: 'Design',
        author: 'Équipe WebKlor',
        tags: ['responsive', 'mobile', 'design', 'ux'],
        featuredImage: '/assets/images/blog/responsive-design.jpg',
        createdAt: '2025-01-10T10:00:00Z',
        publishedAt: '2025-01-10T10:00:00Z',
        readTime: 7,
        views: 145,
        status: 'publié'
      }
    ];

    // Gérer les paramètres de requête
    const { category, limit = 10, page = 1, search } = req.query;
    let filteredPosts = [...examplePosts];

    // Filtrer par catégorie
    if (category && category !== 'Tous') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // Filtrer par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limitNum);
    const skip = (pageNum - 1) * limitNum;
    const paginatedPosts = filteredPosts.slice(skip, skip + limitNum);

    res.json({
      success: true,
      count: paginatedPosts.length,
      total,
      totalPages,
      currentPage: pageNum,
      data: paginatedPosts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des articles',
      message: error.message 
    });
  }
});

// Route alternative pour /api/blog/posts (pour compatibilité)
app.get('/api/blog/posts', async (req, res) => {
  // Rediriger vers la route principale avec les mêmes paramètres
  req.url = req.url.replace('/api/blog/posts', '/api/posts');
  return app._router.handle(req, res);
});

// Route pour récupérer un article spécifique par son slug
app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Articles d'exemple avec contenu complet
    const examplePosts = [
      {
        _id: '1',
        slug: 'comment-creer-site-web-moderne',
        title: 'Comment créer un site web moderne en 2025',
        excerpt: 'Découvrez les meilleures pratiques pour créer un site web moderne, les outils incontournables et les tendances à suivre.',
        content: `
          <h2>Introduction</h2>
          <p>Le développement web moderne nécessite une approche méthodique et l'utilisation des technologies les plus récentes. Dans cet article, nous explorons les meilleures pratiques pour créer un site web qui répond aux attentes d'aujourd'hui.</p>
          
          <h2>Technologies recommandées</h2>
          <ul>
            <li>React.js ou Vue.js pour l'interface utilisateur</li>
            <li>Node.js pour le backend</li>
            <li>MongoDB ou PostgreSQL pour la base de données</li>
            <li>Vercel ou Netlify pour le déploiement</li>
          </ul>
          
          <h2>Bonnes pratiques</h2>
          <p>Un site web moderne doit être rapide, accessible et responsive. L'optimisation des performances et l'expérience utilisateur sont essentielles.</p>
        `,
        category: 'Développement Web',
        author: 'Équipe WebKlor',
        tags: ['développement', 'web', 'moderne', '2025'],
        featuredImage: '/assets/images/blog/web-moderne.jpg',
        createdAt: '2025-01-15T10:00:00Z',
        publishedAt: '2025-01-15T10:00:00Z',
        readTime: 5,
        views: 234,
        status: 'publié'
      },
      {
        _id: '2',
        slug: 'optimiser-seo-site-web',
        title: 'Optimiser le SEO de votre site web',
        excerpt: 'Techniques avancées pour améliorer le référencement naturel et attirer plus de visiteurs qualifiés.',
        content: `
          <h2>Les fondamentaux du SEO</h2>
          <p>Le SEO est un élément crucial pour la visibilité de votre site web. Une stratégie SEO bien pensée peut considérablement augmenter votre trafic organique.</p>
          
          <h2>Optimisation technique</h2>
          <ul>
            <li>Vitesse de chargement des pages</li>
            <li>Structure des URLs</li>
            <li>Balises meta optimisées</li>
            <li>Schema markup</li>
          </ul>
          
          <h2>Contenu et mots-clés</h2>
          <p>La recherche de mots-clés et la création de contenu de qualité sont au cœur d'une stratégie SEO réussie.</p>
        `,
        category: 'SEO',
        author: 'Équipe WebKlor',
        tags: ['seo', 'référencement', 'optimisation'],
        featuredImage: '/assets/images/blog/seo-optimisation.jpg',
        createdAt: '2025-01-14T10:00:00Z',
        publishedAt: '2025-01-14T10:00:00Z',
        readTime: 7,
        views: 189,
        status: 'publié'
      }
    ];

    const post = examplePosts.find(p => p.slug === slug);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    // Incrémenter les vues (simulation)
    post.views += 1;

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération de l\'article',
      message: error.message 
    });
  }
});

// ============ ROUTES DES COMMENTAIRES ============

// Route pour récupérer les commentaires d'un article
app.get('/api/blog/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Simulation de commentaires pour les tests
    const exampleComments = [
      {
        _id: 'comment1',
        post: postId,
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        content: 'Excellent article ! Très informatif et bien écrit. Merci pour ces conseils pratiques.',
        status: 'approuvé',
        parentComment: null,
        createdAt: '2025-01-15T12:30:00Z',
        updatedAt: '2025-01-15T12:30:00Z'
      },
      {
        _id: 'comment2',
        post: postId,
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        content: 'Je suis d\'accord avec les points mentionnés. Cela va m\'aider dans mes projets.',
        status: 'approuvé',
        parentComment: null,
        createdAt: '2025-01-15T14:45:00Z',
        updatedAt: '2025-01-15T14:45:00Z'
      }
    ];

    res.json({
      success: true,
      count: exampleComments.length,
      data: exampleComments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des commentaires',
      error: error.message
    });
  }
});

// Route pour ajouter un commentaire
app.post('/api/blog/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { name, email, content, parentCommentId } = req.body;
    
    // Validation des champs requis
    if (!name || !email || !content) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (nom, email, contenu)'
      });
    }

    // Validation de l'email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez entrer une adresse email valide'
      });
    }

    // Validation de la longueur du contenu
    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Le commentaire ne peut pas dépasser 1000 caractères'
      });
    }

    // Simulation de la création du commentaire
    const newComment = {
      _id: 'comment_' + Date.now(),
      post: postId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      content: content.trim(),
      status: 'en attente',
      parentComment: parentCommentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // En production réelle, ici on sauvegarderait en base de données
    // et on enverrait un email de notification aux administrateurs

    res.status(201).json({
      success: true,
      message: 'Commentaire ajouté avec succès et en attente de modération',
      data: newComment
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du commentaire',
      error: error.message
    });
  }
});

// Routes d'administration pour les commentaires (simplifiées)
app.get('/api/admin/blog/comments', async (req, res) => {
  try {
    const { status } = req.query;
    
    // Simulation de commentaires d'administration
    const adminComments = [
      {
        _id: 'comment1',
        post: { _id: '1', title: 'Comment créer un site web moderne en 2025', slug: 'comment-creer-site-web-moderne' },
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        content: 'Excellent article ! Très informatif et bien écrit.',
        status: 'approuvé',
        createdAt: '2025-01-15T12:30:00Z'
      },
      {
        _id: 'comment2',
        post: { _id: '2', title: 'Optimiser le SEO de votre site web', slug: 'optimiser-seo-site-web' },
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        content: 'Commentaire en attente de modération.',
        status: 'en attente',
        createdAt: '2025-01-15T14:45:00Z'
      }
    ];

    // Filtrer par statut si spécifié
    let filteredComments = adminComments;
    if (status && ['approuvé', 'en attente', 'rejeté'].includes(status)) {
      filteredComments = adminComments.filter(comment => comment.status === status);
    }

    res.json({
      success: true,
      count: filteredComments.length,
      data: filteredComments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires admin:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des commentaires',
      error: error.message
    });
  }
});

app.get('/api/admin/blog/comments/pending', async (req, res) => {
  try {
    // Simulation de commentaires en attente
    const pendingComments = [
      {
        _id: 'comment_pending1',
        post: { _id: '1', title: 'Comment créer un site web moderne en 2025', slug: 'comment-creer-site-web-moderne' },
        name: 'Utilisateur Test',
        email: 'test@example.com',
        content: 'Commentaire en attente de modération.',
        status: 'en attente',
        createdAt: '2025-01-15T16:00:00Z'
      }
    ];

    res.json({
      success: true,
      count: pendingComments.length,
      data: pendingComments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires en attente:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des commentaires en attente',
      error: error.message
    });
  }
});

app.put('/api/admin/blog/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body;
    
    // Vérifier si le statut est valide
    if (!['en attente', 'approuvé', 'rejeté'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    // Simulation de la mise à jour du commentaire
    const updatedComment = {
      _id: commentId,
      status: status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: `Commentaire ${status === 'approuvé' ? 'approuvé' : status === 'rejeté' ? 'rejeté' : 'mis en attente'} avec succès`,
      data: updatedComment
    });
  } catch (error) {
    console.error('Erreur lors de la modération du commentaire:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la modération du commentaire',
      error: error.message
    });
  }
});

app.delete('/api/admin/blog/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Simulation de la suppression du commentaire
    res.json({
      success: true,
      message: 'Commentaire et ses réponses supprimés avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la suppression du commentaire',
      error: error.message
    });
  }
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur s\'est produite'
  });
});

// Route par défaut
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Export pour Vercel serverless
module.exports = async (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error('❌ Erreur dans la fonction serverless:', error);
    return res.status(500).json({ 
      error: 'Erreur de service',
      message: 'Service temporairement indisponible'
    });
  }
};
