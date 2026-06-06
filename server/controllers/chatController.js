const Message = require('../models/Message');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', lastMessage: { $first: '$content' }, lastMessageDate: { $first: '$createdAt' }, unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ["$senderRole", "user"] }, { $eq: ["$isRead", false] }] }, 1, 0] } } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $sort: { lastMessageDate: -1 } }
    ]);
    res.json(conversations);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });
    res.json(await Message.find({ conversationId: userId }).sort({ createdAt: 1 }).populate('sender', 'name avatar'));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany({ conversationId: req.params.userId, senderRole: 'user', isRead: false }, { $set: { isRead: true } });
    res.json({ message: 'Read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
