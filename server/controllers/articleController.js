const Article = require('../models/Article');

exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, isFeatured } = req.query;
    const filter = {};
    if (category && category !== 'Tất cả') filter.category = category;
    if (isFeatured === 'true') filter.isFeatured = true;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Article.countDocuments(filter);
    const articles = await Article.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ articles, total, pages: Math.ceil(total / Number(limit)), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    res.status(201).json(await new Article(req.body).save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    res.json(await Article.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
