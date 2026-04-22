const { upload } = require('../config/cloudinary');

/**
 * Upload middleware for reports - accepts up to 5 photos
 * Field name: "photos"
 */
const uploadReportImages = upload.array('photos', 5);

/**
 * Wrapper to handle Multer errors gracefully
 */
const handleUpload = (req, res, next) => {
  uploadReportImages(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed',
      });
    }
    next();
  });
};

module.exports = { handleUpload };
