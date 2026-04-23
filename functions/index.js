const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions");

setGlobalOptions({maxInstances:10});

const expressApp = require("./src/backend/server");

// Export API as /api/* (proxied by firebase.json hosting rewrite)
exports.api = onRequest(expressApp, {
  cors:true,
  memory:"2GiB",
  timeoutSeconds:540,
});

// Health check direct
exports.health = onRequest((req,res)=>{
  res.json({status:"ok",project:"missing-people-finder-19c3a"});
});
