const Post = require('../models/post.model');

/**
 * Contrôleur pour la gestion des articles de blog
 */
const postController = {
  /**
   * Récupération de tous les articles
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllPosts(req, res) {
    try {
      const { category, status, limit = 10, page = 1, search } = req.query;
      
      // Construire la requête
      const query = {};
      
      // Filtrer par catégorie si spécifié
      if (category) {
        query.category = category;
      }
      
      // Filtrer par statut si spécifié (pour l'admin)
      if (status) {
        query.status = status;
      } else {
        // Par défaut, pour les requêtes publiques, n'afficher que les articles publiés
        if (!req.path.includes('/admin')) {
          query.status = 'publié';
        }
      }
      
      // Recherche par mot-clé
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Récupération des articles avec tri par date de création (du plus récent au plus ancien)
      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('title slug excerpt featuredImage category tags author readTime views createdAt');
      
      // Compter le nombre total d'articles pour la pagination
      const total = await Post.countDocuments(query);
      
      res.status(200).json({
        success: true,
        count: posts.length,
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        data: posts
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des articles',
        error: error.message
      });
    }
  },
  
  /**
   * Récupération d'un article par son slug
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getPostBySlug(req, res) {
    try {
      const { slug } = req.params;
      
      const post = await Post.findOne({ slug });
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
      }
      
      // Incrémenter le compteur de vues seulement pour les requêtes publiques
      if (!req.path.includes('/admin')) {
        // Utiliser une mise à jour sans modifier le document en mémoire pour éviter les problèmes de concurrence
        await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });
      }
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération de l\'article',
        error: error.message
      });
    }
  },
  
  /**
   * Création d'un nouvel article
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async createPost(req, res) {
    try {
      const { title, content, excerpt, featuredImage, category, tags, author, status, readTime } = req.body;
      
      // Vérification des champs requis
      if (!title || !content || !excerpt || !category) {
        return res.status(400).json({
          success: false,
          message: 'Les champs titre, contenu, extrait et catégorie sont obligatoires'
        });
      }
      
      // Créer un nouvel article
      const post = new Post({
        title,
        content,
        excerpt,
        featuredImage: featuredImage || undefined,
        category,
        tags: tags || [],
        author: author || 'Équipe WebKlor',
        status: status || 'brouillon',
        readTime: readTime || 5
      });
      
      await post.save();
      
      res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: post
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la création de l\'article',
        error: error.message
      });
    }
  },
  
  /**
   * Mise à jour d'un article
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, slug, content, excerpt, featuredImage, category, tags, author, status, readTime } = req.body;
      
      // Vérifier si l'article existe
      const post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
      }
      
      // Mettre à jour les champs
      post.title = title || post.title;
      if (slug) post.slug = slug;
      post.content = content || post.content;
      post.excerpt = excerpt || post.excerpt;
      if (featuredImage) post.featuredImage = featuredImage;
      post.category = category || post.category;
      if (tags) post.tags = tags;
      post.author = author || post.author;
      post.status = status || post.status;
      post.readTime = readTime || post.readTime;
      
      await post.save();
      
      res.status(200).json({
        success: true,
        message: 'Article mis à jour avec succès',
        data: post
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour de l\'article',
        error: error.message
      });
    }
  },
  
  /**
   * Suppression d'un article
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      
      const post = await Post.findByIdAndDelete(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Article supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression de l\'article',
        error: error.message
      });
    }
  },
  
  /**
   * Obtention des statistiques du blog
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getBlogStats(req, res) {
    try {
      // Nombre total d'articles
      const totalPosts = await Post.countDocuments();
      
      // Nombre d'articles par statut
      const publishedPosts = await Post.countDocuments({ status: 'publié' });
      const draftPosts = await Post.countDocuments({ status: 'brouillon' });
      const archivedPosts = await Post.countDocuments({ status: 'archivé' });
      
      // Articles les plus populaires (basé sur les vues)
      const popularPosts = await Post.find({ status: 'publié' })
        .sort({ views: -1 })
        .limit(5)
        .select('title slug views');
      
      // Répartition par catégorie
      const categories = await Post.aggregate([
        { $match: { status: 'publié' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          totalPosts,
          publishedPosts,
          draftPosts,
          archivedPosts,
          popularPosts,
          categories: categories.map(cat => ({ category: cat._id, count: cat.count }))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du blog:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des statistiques du blog',
        error: error.message
      });
    }
  },

  /**
   * Récupération de tous les articles pour l'administration avec pagination et filtres avancés
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllPostsAdmin(req, res) {
    try {
      const { 
        status, 
        category, 
        search, 
        author,
        limit = 10, 
        page = 1,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      // Construire la requête de filtrage
      const query = {};
      
      if (status) query.status = status;
      if (category) query.category = category;
      if (author) query.author = { $regex: author, $options: 'i' };
      
      // Recherche globale
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Tri
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      // Récupération des articles
      const posts = await Post.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
      
      // Compter le total
      const total = await Post.countDocuments(query);
      
      res.status(200).json({
        success: true,
        count: posts.length,
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        data: posts
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des articles admin:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des articles',
        error: error.message
      });
    }
  },

  /**
   * Récupération d'un article par son ID (pour l'administration)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      
      const post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération de l\'article',
        error: error.message
      });
    }
  },

  /**
   * Changement du statut d'un article
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async changePostStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Vérifier que le statut est valide
      const validStatuses = ['brouillon', 'publié', 'archivé'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide. Les statuts valides sont : ' + validStatuses.join(', ')
        });
      }
      
      const post = await Post.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true, runValidators: true }
      );
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
      }
      
      res.status(200).json({
        success: true,
        message: `Statut de l'article changé vers "${status}" avec succès`,
        data: post
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors du changement de statut',
        error: error.message
      });
    }
  },

  /**
   * Récupération des articles récents pour le tableau de bord
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getRecentPosts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      
      const recentPosts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title slug status createdAt views author');
      
      res.status(200).json({
        success: true,
        data: recentPosts
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des articles récents:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des articles récents',
        error: error.message
      });
    }
  }
};

module.exports = postController;
