const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const missingReportSchema = new mongoose.Schema(
  {
    // ─── Auto-generated Case ID ────────────────────────────────────────────
    caseId: {
      type: String,
      unique: true,
      default: () => 'FL-' + uuidv4().slice(0, 8).toUpperCase(), // e.g. FL-A3F1B2C4
    },

    // ─── Reporter ──────────────────────────────────────────────────────────
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ─── Missing Person Details ────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name of the missing person is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age seems invalid'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'other'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },

    // ─── Last Seen Info ────────────────────────────────────────────────────
    lastSeenLocation: {
      type: String,
      required: [true, 'Last seen location is required'],
      trim: true,
    },
    lastSeenDate: {
      type: Date,
      required: [true, 'Last seen date is required'],
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // ─── Photos ───────────────────────────────────────────────────────────
    photos: {
      type: [String], // Array of Cloudinary URLs
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'Maximum 5 photos allowed',
      },
    },

    // ─── Status & Visibility ──────────────────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'found', 'closed'],
      default: 'active',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },

    // ─── Contact Info (optional, can hide for privacy) ────────────────────
    contactName: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// ─── Index for search performance ─────────────────────────────────────────────
missingReportSchema.index({ name: 'text', description: 'text', lastSeenLocation: 'text' });
missingReportSchema.index({ status: 1, createdAt: -1 });
missingReportSchema.index({ reportedBy: 1 });

const MissingReport = mongoose.model('MissingReport', missingReportSchema);
module.exports = MissingReport;
