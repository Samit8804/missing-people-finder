const { upload } = require('../config/cloudinary');
const VisionService = require('../services/visionService');

/**
 * Upload middleware for reports - accepts up to 5 photos
 * Field name: "photos"
 * Auto-runs Google Cloud Vision on primary photo
 */
const uploadReportImages = upload.array('photos', 5);

/**
 * Wrapper to handle Multer + Vision AI pipeline
 */
const handleUpload = async (req, res, next) => {
  // Step 1: Cloudinary upload
  uploadReportImages(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed',
      });
    }

    // Step 2: AI Vision Analysis on primary photo (if exists)
    if (req.files && req.files.length > 0) {
      const primaryPhotoUrl = req.files[0].path;
      console.log('Running Google Cloud Vision on:', primaryPhotoUrl);
      
      req.faceFeatures = await VisionService.analyzePrimaryPhoto(primaryPhotoUrl);
      console.log('Vision result:', req.faceFeatures ? 'Face detected' : 'No face');
    }

    next();
  });
};

module.exports = { handleUpload };

