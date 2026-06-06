const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (await Category.findOne({ name })) return res.status(400).json({ message: 'Danh mục đã tồn tại!' });
    const newCategory = new Category({ name, subCategories: [] });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSubCategory = async (req, res) => {
  try {
    const { categoryId, subName } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Not found' });
    if (!category.subCategories.includes(subName)) {
      category.subCategories.push(subName);
      await category.save();
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subName } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Not found' });
    category.subCategories = category.subCategories.filter(s => s !== subName);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
