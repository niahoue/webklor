// your-project-root/api/posts/index.js
const dbConnect = require('../../utils/dbConnect');
const Post = require('../../server/models/post.model');

module.exports = async (req, res) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { category, limit = 10, page = 1, search } = req.query;

    const query = { status: 'publié' }; // Par défaut, n'afficher que les articles publiés

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
    console.error('Erreur lors de la récupération des articles (public):', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des articles',
      error: error.message
    });
  }
};