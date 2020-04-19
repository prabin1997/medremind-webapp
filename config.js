'use strict';

require('dotenv').config();

const cfg = {};

// HTTP Port to run web application
cfg.port = process.env.PORT || 7805;

// A random string that will help generate secure one-time passwords and
// HTTP sessions
cfg.secret = process.env.APP_SECRET || 'keyboard cat';


cfg.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

// A Twilio number you control 
cfg.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// MongoDB connection string - MONGO_URL is for local dev,
// MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
cfg.mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL;
cfg.mongoUrlTest = process.env.MONGO_URL_TEST;


// Export configuration object
module.exports = cfg;
