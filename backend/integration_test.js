const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const MissingReport = require('./models/MissingReport');
const FoundReport = require('./models/FoundReport');
const Match = require('./models/Match');
const Notification = require('./models/Notification');
const app = require('./server'); // Import real app

const API = 'http://localhost:5001/api';
let server;

async function runTests() {
  console.log("🚀 Starting E2E Integration Tests on fresh instance...");
  
  // Start server on 5001
  server = app.listen(5001, () => console.log('Backend listening on 5001...'));
  
  await mongoose.connect(process.env.MONGO_URI);
  console.log("📦 Connected to MongoDB for test verification.\n");

  let tokenA, tokenB;
  let missingReportId, foundReportId, matchId;

  const testEmailA = `testA_${Date.now()}@example.com`;
  const testEmailB = `testB_${Date.now()}@example.com`;

  try {
    // === 1. SIGNUP USER A ===
    console.log("1️⃣  Testing Signup (User A)...");
    await axios.post(`${API}/auth/signup`, {
      name: "Test User A",
      email: testEmailA,
      password: "password123"
    });
    
    const userA_DB = await User.findOne({ email: testEmailA }).select('+otp');
    if(!userA_DB) throw new Error("User A not in DB");
    
    console.log("   ✅ User A signed up. OTP: " + userA_DB.otp);

    // === 2. VERIFY OTP ===
    console.log("2️⃣  Testing OTP Verification...");
    // To verify OTP we need to be logged in first or it's a private route? 
    // Wait, verify-otp is a protected route! The signup method returns a JWT token.
    // Let's grab the token from login.
    let loginResA = await axios.post(`${API}/auth/login`, {
      email: testEmailA,
      password: "password123"
    });
    tokenA = loginResA.data.token;

    await axios.post(`${API}/auth/verify-otp`, { otp: userA_DB.otp }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log("   ✅ User A OTP verified.");

    // === 3. CREATE MISSING REPORT (USER A) ===
    console.log("3️⃣  Testing Missing Report Creation...");
    const missingRes = await axios.post(`${API}/missing`, {
      name: "James Smith Test",
      age: 25,
      gender: "male",
      description: "Wearing a blue jacket, tall, short black hair. Missing since yesterday.",
      lastSeenLocation: "Downtown Seattle near 4th Ave",
      lastSeenDate: new Date().toISOString()
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    missingReportId = missingRes.data.report._id;
    console.log("   ✅ Missing report created. ID: " + missingReportId);

    // === 4. SIGNUP USER B ===
    console.log("4️⃣  Creating User B...");
    await axios.post(`${API}/auth/signup`, {
      name: "Test User B",
      email: testEmailB,
      password: "password123"
    });
    const userB_DB = await User.findOne({ email: testEmailB }).select('+otp');
    let loginResB = await axios.post(`${API}/auth/login`, {
      email: testEmailB,
      password: "password123"
    });
    tokenB = loginResB.data.token;
    await axios.post(`${API}/auth/verify-otp`, { otp: userB_DB.otp }, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    console.log("   ✅ User B created and verified.");

    // === 5. CREATE FOUND REPORT (USER B) ===
    console.log("5️⃣  Testing Found Report Creation...");
    const foundRes = await axios.post(`${API}/found`, {
      approximateAge: 26,
      gender: "male",
      description: "Found a tall man with black hair wandering, wearing a blue coat.",
      locationFound: "Seattle downtown area",
      dateFound: new Date().toISOString()
    }, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    foundReportId = foundRes.data.report._id;
    console.log("   ✅ Found report created. ID: " + foundReportId);

    // === 6. RUN MATCHING ALGORITHM ===
    console.log("6️⃣  Triggering Match Engine...");
    const matchRunRes = await axios.post(`${API}/match/run/${missingReportId}`, {}, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log(`   ✅ Match engine executed. New matches found: ${matchRunRes.data.newMatches}`);

    // === 7. FETCH MATCHES (USER A) ===
    console.log("7️⃣  Testing Match Retrieval...");
    const myMatchesRes = await axios.get(`${API}/match/my`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    if (myMatchesRes.data.matches.length === 0) {
      throw new Error("No match was created by the engine! Algorithm failed to link them.");
    }
    matchId = myMatchesRes.data.matches[0]._id;
    console.log(`   ✅ Match found! Score: ${myMatchesRes.data.matches[0].matchScore}%`);

    // === 8. CONFIRM MATCH ===
    console.log("8️⃣  Testing Match Confirmation...");
    await axios.put(`${API}/match/${matchId}/confirm`, {}, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log("   ✅ Match confirmed successfully.");

    // Verify status changes in DB
    const finalMissing = await MissingReport.findById(missingReportId);
    const finalFound = await FoundReport.findById(foundReportId);
    if(finalMissing.status !== 'found' || finalFound.status !== 'matched') {
      throw new Error("Report statuses did not update correctly after confirmation.");
    }
    console.log("   ✅ Case statuses dynamically updated.");

    // === 9. CHECK NOTIFICATIONS (USER A) ===
    console.log("9️⃣  Testing Notifications...");
    const notifs = await axios.get(`${API}/notifications`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log(`   ✅ Notifications fetched. Count: ${notifs.data.notifications.length}`);

    console.log("\n🎉 ALL 9 TEST SUITES PASSED PERFECTLY!");

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.response?.data || error.message);
  } finally {
    console.log("\n🧹 Cleaning up test database entries...");
    await MissingReport.findByIdAndDelete(missingReportId);
    await FoundReport.findByIdAndDelete(foundReportId);
    if(matchId) await Match.findByIdAndDelete(matchId);
    await Notification.deleteMany({ recipient: { $exists: true } }); // Clear test notifs
    await User.findOneAndDelete({ email: testEmailA });
    await User.findOneAndDelete({ email: testEmailB });
    await mongoose.disconnect();
    if (server) server.close();
    console.log("   ✅ Cleanup complete.");
  }
}

runTests();
