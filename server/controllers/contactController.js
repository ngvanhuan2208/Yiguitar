const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    res.status(201).json(await new Contact(req.body).save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    res.json(await Contact.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
