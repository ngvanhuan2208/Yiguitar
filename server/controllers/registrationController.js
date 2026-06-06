const Registration = require('../models/Registration');
const Course = require('../models/Course');

const syncCourseStudentsCount = async (courseName) => {
  if (!courseName) return;
  const count = await Registration.countDocuments({ courseName });
  await Course.updateMany({ name: courseName }, { $set: { studentsCount: count } });
};

exports.submitRegistration = async (req, res) => {
  try {
    const { fullName, email, phone, address, courseName, courseType, courseId } = req.body;
    const registration = new Registration({ fullName, email, phone, address, courseName, courseType, courseId });
    await registration.save();
    await syncCourseStudentsCount(courseName);
    res.status(201).json(registration);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getRegistrations = async (req, res) => {
  try { res.json(await Registration.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateRegistrationStatus = async (req, res) => {
  try { 
    const reg = await Registration.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (reg) await syncCourseStudentsCount(reg.courseName);
    res.json(reg); 
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteRegistration = async (req, res) => {
  try { 
    const reg = await Registration.findByIdAndDelete(req.params.id); 
    if (reg) await syncCourseStudentsCount(reg.courseName);
    res.json({ message: 'Deleted' }); 
  } catch (err) { res.status(500).json({ message: err.message }); }
};
