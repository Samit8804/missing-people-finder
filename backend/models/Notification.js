const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // ─── Who receives this notification ───────────────────────────────────
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ─── Notification Type ─────────────────────────────────────────────────
    type: {
      type: String,
      enum: [
        'match_suggested',    // A new match was found for your report
        'match_confirmed',    // A match was confirmed
        'match_rejected',     // A match was rejected
        'report_update',      // Someone updated a report you care about
        'status_change',      // Report status changed (active → found)
        'admin_message',      // Message from admin
        'public_contact',     // A public user contacted the reporter
      ],
      required: true,
    },

    // ─── Notification Content ──────────────────────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ─── Read Status ───────────────────────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
    },

    // ─── Related Data (optional links back to reports/matches) ────────────
    relatedReport: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedReportModel', // Dynamic ref
    },
    relatedReportModel: {
      type: String,
      enum: ['MissingReport', 'FoundReport', 'Match'],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
