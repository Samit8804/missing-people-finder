const vision = require('@google-cloud/vision');
const path = require('path');

/**
 * Google Cloud Vision service for face detection on person photos
 * Extracts normalized face bounding box and key landmarks for matching
 */
class VisionService {
  constructor() {
    this.client = new vision.ImageAnnotatorClient();
  }

  /**
   * Analyze primary photo for face features
   * @param {string} imageUrl - Cloudinary public URL
   * @returns {Object|null} faceFeatures or null if no faces/no primary photo
   */
  async analyzePrimaryPhoto(imageUrl) {
    if (!imageUrl) return null;

    try {
      // Vision directly supports public URLs
      const [result] = await this.client.faceDetection(imageUrl);
      const faces = result.faceAnnotations;

      if (!faces || faces.length === 0) {
        console.log('No faces detected in image');
        return null;
      }

      const primaryFace = faces[0]; // Use largest/most confident face

      // Normalized bounding box (0-1 scale for position/size comparison)
      const bbox = {
        x: primaryFace.boundingPoly.normalizedVertices[0].x, // left
        y: primaryFace.boundingPoly.normalizedVertices[0].y, // top
        width: primaryFace.boundingPoly.normalizedVertices[1].x - primaryFace.boundingPoly.normalizedVertices[0].x,
        height: primaryFace.boundingPoly.normalizedVertices[2].y - primaryFace.boundingPoly.normalizedVertices[0].y,
      };

      // Key landmarks for pose/identity hints (normalized)
      const landmarks = {};
      if (primaryFace.landmarks) {
        const normalizePoint = (p) => ({
          x: p.position.x / 1024, // normalize ~image width
          y: p.position.y / 1024,
        });

        if (primaryFace.landmarks.LEFT_EYE) landmarks.leftEye = normalizePoint(primaryFace.landmarks.LEFT_EYE);
        if (primaryFace.landmarks.RIGHT_EYE) landmarks.rightEye = normalizePoint(primaryFace.landmarks.RIGHT_EYE);
        if (primaryFace.landmarks.NOSE_BASE) landmarks.nose = normalizePoint(primaryFace.landmarks.NOSE_BASE);
      }

      console.log(`Face detected: bbox=${JSON.stringify(bbox)}`);

      return {
        bbox,
        landmarks,
        confidence: primaryFace.detectionConfidence,
        numFaces: faces.length,
        analyzedAt: new Date(),
      };

    } catch (error) {
      console.error('Vision API error:', error.message);
      return null;
    }
  }
}

module.exports = new VisionService();

