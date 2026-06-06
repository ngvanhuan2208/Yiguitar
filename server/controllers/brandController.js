const Brand = require('../models/Brand');

exports.getBrands = async (req, res) => {
  try {
    res.json(await Brand.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    res.status(201).json(await new Brand(req.body).save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    res.json(await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
