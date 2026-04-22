const MissingReport = require('../models/MissingReport');
const FoundReport = require('../models/FoundReport');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const { sendEmail, matchSuggestedEmail } = require('../utils/sendEmail');

// Simple helper to extract alphanumeric words
const getKeywords = (text) => {
  if (!text) return [];
  return text.toLowerCase().match(/\b\w+\b/g) || [];
};

const runMatching = async (missingReportId) => {
  const missing = await MissingReport.findById(missingReportId).populate('reportedBy');
  if (!missing) return { success: false, message: 'Missing report not found' };

  // Get all open found reports
  const foundReports = await FoundReport.find({ status: 'open' });
  let newMatchesCount = 0;

  for (const found of foundReports) {
    let score = 0;
    const breakdown = {
      genderScore: 0,
      ageScore: 0,
      locationScore: 0,
      descriptionScore: 0,
    };

    // 1. Gender Match (+30)
    if (found.gender && missing.gender && found.gender.toLowerCase() === missing.gender.toLowerCase()) {
      score += 30;
      breakdown.genderScore = 30;
    }

    // 2. Age Match within 5 years (+25)
    if (found.approximateAge && missing.age) {
      if (Math.abs(found.approximateAge - missing.age) <= 5) {
        score += 25;
        breakdown.ageScore = 25;
      }
    }

    // 3. Location Match (+25) - Basic substring matching
    if (found.locationFound && missing.lastSeenLocation) {
      const locFound = found.locationFound.toLowerCase();
      const locMissing = missing.lastSeenLocation.toLowerCase();
      
      const missingWords = getKeywords(locMissing);
      const foundWords = getKeywords(locFound);
      
      const commonWords = missingWords.filter(w => foundWords.includes(w) && w.length > 3);
      if (commonWords.length > 0 || locFound.includes(locMissing) || locMissing.includes(locFound)) {
        score += 25;
        breakdown.locationScore = 25;
      }
    }

    // 4. Description Keywords Match (+20)
    if (found.description && missing.description) {
      const missingDescWords = getKeywords(missing.description);
      const foundDescWords = getKeywords(found.description);
      const common = missingDescWords.filter(w => foundDescWords.includes(w) && w.length > 4);
      
      if (common.length >= 2) {
        score += 20;
        breakdown.descriptionScore = 20;
      } else if (common.length === 1) {
        score += 10;
        breakdown.descriptionScore = 10;
      }
    }

    // Threshold is 50
    if (score >= 50) {
      // Check if match already exists
      const existingMatch = await Match.findOne({
        missingReport: missing._id,
        foundReport: found._id,
      });

      if (!existingMatch) {
        const newMatch = await Match.create({
          missingReport: missing._id,
          foundReport: found._id,
          matchScore: score,
          scoreBreakdown: breakdown,
        });

        // Create Notification
        await Notification.create({
          recipient: missing.reportedBy._id,
          type: 'match_suggested',
          title: 'Potential Match Found',
          message: `A found person report might match your report for ${missing.name}.`,
          relatedReport: newMatch._id,
          relatedReportModel: 'Match',
          isRead: false,
        });

        // Send Email
        if (missing.reportedBy.email) {
          await sendEmail({
            to: missing.reportedBy.email,
            subject: 'FindLink - Potential Match Found',
            html: matchSuggestedEmail(missing.reportedBy.name, score, missing.name),
          });
        }

        newMatchesCount++;
      }
    }
  }

  return { success: true, count: newMatchesCount };
};

module.exports = { runMatching };
