const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

// Helper for deleting files (Ideally moved to a util)
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (err) { console.error('Error deleting file:', filePath, err); }
  }
};

const getFilePathFromUrl = (fileUrl) => {
  if (!fileUrl) return null;
  try {
    const urlPath = new URL(fileUrl).pathname;
    return path.join(__dirname, '../', urlPath); // Adjusted for being in controllers/
  } catch {
    return path.join(__dirname, '../', fileUrl);
  }
};

exports.getCourses = async (req, res) => {
  try { res.json(await Course.find().sort({ lessons: -1 })); } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Not found' });
    res.json(course);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createCourse = async (req, res) => {
  try {
    const rawData = { ...req.body };
    if (typeof rawData.curriculum === 'string') rawData.curriculum = JSON.parse(rawData.curriculum);
    if (typeof rawData.benefits === 'string') rawData.benefits = JSON.parse(rawData.benefits);
    if (typeof rawData.attachments === 'string') rawData.attachments = JSON.parse(rawData.attachments);
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    if (req.files['image']) rawData.image = `${baseUrl}/uploads/courses/${req.files['image'][0].filename}`;
    if (req.files['introVideo']) rawData.introVideo = `${baseUrl}/uploads/courses/${req.files['introVideo'][0].filename}`;
    if (req.files['attachments[]']) {
       const newAttachments = req.files['attachments[]'].map(f => ({ name: f.originalname, url: `${baseUrl}/uploads/courses/${f.filename}` }));
       rawData.attachments = [...(rawData.attachments || []), ...newAttachments];
    }
    res.status(201).json(await new Course(rawData).save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCourse = async (req, res) => {
  try {
    const existing = await Course.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const rawData = { ...req.body };
    delete rawData._id; delete rawData.__v;
    
    if (typeof rawData.curriculum === 'string') rawData.curriculum = JSON.parse(rawData.curriculum);
    if (typeof rawData.benefits === 'string') rawData.benefits = JSON.parse(rawData.benefits);
    if (typeof rawData.attachments === 'string') rawData.attachments = JSON.parse(rawData.attachments);
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    if (req.files['image']) { deleteFile(getFilePathFromUrl(existing.image)); rawData.image = `${baseUrl}/uploads/courses/${req.files['image'][0].filename}`; }
    if (req.files['introVideo']) { deleteFile(getFilePathFromUrl(existing.introVideo)); rawData.introVideo = `${baseUrl}/uploads/courses/${req.files['introVideo'][0].filename}`; }
    if (req.files['attachments[]']) {
       const newAttachments = req.files['attachments[]'].map(f => ({ name: f.originalname, url: `${baseUrl}/uploads/courses/${f.filename}` }));
       rawData.attachments = [...(rawData.attachments || []), ...newAttachments];
    }
    res.json(await Course.findByIdAndUpdate(req.params.id, rawData, { new: true }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Not found' });
    deleteFile(getFilePathFromUrl(course.image)); deleteFile(getFilePathFromUrl(course.introVideo));
    if (course.attachments) course.attachments.forEach(att => deleteFile(getFilePathFromUrl(att.url)));
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
