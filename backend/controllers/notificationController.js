const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// ─── @route  GET /api/notifications ───────────────────────────────────────────
// @desc    Get user's notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  res.status(200).json({ success: true, count: notifications.length, unreadCount, notifications });
});

// ─── @route  PUT /api/notifications/:id/read ──────────────────────────────────
// @desc    Mark a notification as read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ success: true, notification });
});

// ─── @route  PUT /api/notifications/read-all ──────────────────────────────────
// @desc    Mark all user's notifications as read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

// ─── @route  DELETE /api/notifications/:id ────────────────────────────────────
// @desc    Delete a notification
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await notification.deleteOne();

  res.status(200).json({ success: true, message: 'Notification deleted' });
});

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
