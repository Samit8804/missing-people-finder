const mongoose = require('mongoose');

const foundReportSchema = new mongoose.Schema(
  {
    // ─── Reporter ──────────────────────────────────────────────────────────
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ─── Anonymous Option ─────────────────────────────────────────────────
    isAnonymous: {
      type: Boolean,
      default: false,
    },

    // ─── Found Person Details ──────────────────────────────────────────────
    approximateAge: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age seems invalid'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'unknown'],
      default: 'unknown',
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the person found'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },

    // ─── Location Found ────────────────────────────────────────────────────
    locationFound: {
      type: String,
      required: [true, 'Location where person was found is required'],
      trim: true,
    },
    dateFound: {
      type: Date,
      required: [true, 'Date the person was found is required'],
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // ─── Photos ───────────────────────────────────────────────────────────
    photos: {
      type: [String], // Cloudinary URLs
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'Maximum 5 photos allowed',
      },
    },

    // ─── Status ───────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['open', 'matched', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes for search and matching ─────────────────────────────────────────
foundReportSchema.index({ description: 'text', locationFound: 'text' });
foundReportSchema.index({ status: 1, createdAt: -1 });
foundReportSchema.index({ reportedBy: 1 });

const FoundReport = mongoose.model('FoundReport', foundReportSchema);
module.exports = FoundReport;
