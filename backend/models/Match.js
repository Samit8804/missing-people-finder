const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    // ─── Linked Reports ────────────────────────────────────────────────────
    missingReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MissingReport',
      required: true,
    },
    foundReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoundReport',
      required: true,
    },

    // ─── Match Score (0–100) ───────────────────────────────────────────────
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // ─── Score Breakdown for transparency ─────────────────────────────────
    scoreBreakdown: {
      genderScore: { type: Number, default: 0 },      // 0 or 30
      ageScore: { type: Number, default: 0 },          // 0 or 25
      locationScore: { type: Number, default: 0 },    // 0 or 25
      descriptionScore: { type: Number, default: 0 }, // 0–20
    },

    // ─── Status — always starts as 'suggested', human must confirm ────────
    status: {
      type: String,
      enum: ['suggested', 'confirmed', 'rejected'],
      default: 'suggested',
    },

    // ─── Who reviewed this match ───────────────────────────────────────────
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },

    // ─── Admin/System notes ────────────────────────────────────────────────
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound unique index: one match entry per missing+found pair ─────────────
matchSchema.index({ missingReport: 1, foundReport: 1 }, { unique: true });
matchSchema.index({ status: 1, matchScore: -1 }); // For fetching top matches

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
