'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const cfg = require('../config');
const Twilio = require('twilio');

//Medication schema 
const MedicationSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image: { 
        type: String
    },
    quantity:{
        type: Number,
        required:false
    },
    createdUser: { 
        type: mongoose.Schema.ObjectId, ref: 'User' 
    },
    adminNumber: {
        type: String, ref: 'adminNumber'
    },
    adminCode: {
        type: String, ref: 'adminReq'
    }
});


 // Schema to send admins sms reminder to notify to refill medications
 MedicationSchema.statics.sendAdminRefillReminder = function(callback) {
    
    Medication
      .find({"quantity": {$lte: 2 }})
      .then(function(medications) {
        if (medications.length > 0) {
          sendAdminRefillReminder(medications);
        }
      });
  
      function sendAdminRefillReminder(medications) {
        const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
        medications.forEach(function(medication) {
            // Create options to send the message
            const options = {
                to: `+ ${medication.adminNumber}`,
                from: cfg.twilioPhoneNumber,
                /* eslint-disable max-len */
                body: `Hi there Admin. Just a reminder to refill the ${medication.name} medication which is running low`, 
                /* eslint-enable max-len */
            };
  
            // Send the message!
            client.messages.create(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = medication.adminNumber.substr(0,
                        medication.adminNumber.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        });
  
        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
          callback.call();
        }
    }
  };
  

const Medication = module.exports = mongoose.model('Medication', MedicationSchema);