const Tab = require('../models/Tab');

exports.getTabs = async (req, res) => {
  try { res.json(await Tab.find().sort({ difficulty: 1 })); } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getTabById = async (req, res) => {
  try {
    const tab = await Tab.findById(req.params.id);
    if (!tab) return res.status(404).json({ message: 'Not found' });
    res.json(tab);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.downloadTab = async (req, res) => {
  try { res.json(await Tab.findByIdAndUpdate(req.params.id, { $inc: { downloadsCount: 1 } }, { new: true })); } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createTab = async (req, res) => {
  try { res.status(201).json(await new Tab(req.body).save()); } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateTab = async (req, res) => {
  try { res.json(await Tab.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteTab = async (req, res) => {
  try { await Tab.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ message: err.message }); }
};
