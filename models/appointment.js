'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const cfg = require('../config');
const Twilio = require('twilio');

const AppointmentSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  notification: Number,
  mealTime: String,
  timeZone: String,
  time: {type: Date, index: true},
  createdUser: { type: mongoose.Schema.ObjectId, ref: 'User' },
  adminNumber: {type: String, ref: 'number'},
  userAdmin: {type: String, ref: 'adminReq'},
  note: String,
  confirm: {type: Boolean, default: false}
});

AppointmentSchema.methods.requiresNotification = function(date) {
  return Math.round(moment.duration(moment(this.time).tz(this.timeZone).utc()
                          .diff(moment(date).utc())
                        ).asMinutes()) === this.notification;
};

AppointmentSchema.statics.sendNotifications = function(callback) {
  // now
  const searchDate = new Date();
  Appointment
    .find()
    .then(function(appointments) {
      appointments = appointments.filter(function(appointment) {
              return appointment.requiresNotification(searchDate);
      });
      if (appointments.length > 0) {
        sendNotifications(appointments);
      }
    });


    /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} appointments List of appointments.
    */
    function sendNotifications(appointments) {
        const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
        appointments.forEach(function(appointment) {
            // Create options to send the message
            const options = {
                to: `+ ${appointment.phoneNumber}`,
                from: cfg.twilioPhoneNumber,
                /* eslint-disable max-len */
                body: `Hi there. Just a reminder to take your ${appointment.name} medication.\nMedication time: At ${moment(appointment.time).format('hh:mma')} - ${appointment.mealTime}\nNote: ${appointment.note}\nClick on this link to confirm medication: https://medremind-app.herokuapp.com/appointments/${appointment._id}/fullMed `, 
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = appointment.phoneNumber.substr(0,
                        appointment.phoneNumber.length - 5);
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

// Schema to send patients sms reminder to notify if they miss their medication time or forget to confirm

AppointmentSchema.statics.sendReminder = function(callback) {
  // now
  const searchDate = new Date();

  Appointment
    .find({"time": {$lte:searchDate}, confirm: "false"})
    .then(function(appointments) {
      if (appointments.length > 0) {
        sendReminder(appointments);
      }
    });

 

    function sendReminder(appointments) {
      const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
      appointments.forEach(function(appointment) {
          // Create options to send the message
          const options = {
              to: `+ ${appointment.phoneNumber}`,
              from: cfg.twilioPhoneNumber,
              /* eslint-disable max-len */
              body: `Hi there. Just a reminder that you still have not taken your ${appointment.name} medication.\nIf you taken the medication please click on this link to confirm: https://medremind-app.herokuapp.com/appointments/${appointment._id}/fullMed `, 
              /* eslint-enable max-len */
          };

          // Send the message!
          client.messages.create(options, function(err, response) {
              if (err) {
                  // Just log it for now
                  console.error(err);
              } else {
                  // Log the last few digits of a phone number
                  let masked = appointment.phoneNumber.substr(0,
                      appointment.phoneNumber.length - 5);
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

  // Schema to send admins sms reminder to notify patients if they miss their medication time
AppointmentSchema.statics.sendAdminReminder = function(callback) {
  // now
  const searchDate = new Date();

  Appointment
    .find({"time": {$lte:searchDate}, confirm: "false"})
    .then(function(appointments) {
      if (appointments.length > 0) {
        sendAdminReminder(appointments);
      }
    });

 

    function sendAdminReminder(appointments) {
      const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
      appointments.forEach(function(appointment) {
          // Create options to send the message
          const options = {
              to: `+ ${appointment.adminNumber}`,
              from: cfg.twilioPhoneNumber,
              /* eslint-disable max-len */
              body: `Hi there Admin. Just a reminder that the ${appointment.name} medication scheduled for ${moment(appointment.time).format('hh:mma')} as not been confirmed by the patient.\nPlease remind them to take their medication and confrim on the app. `, 
              /* eslint-enable max-len */
          };

          // Send the message!
          client.messages.create(options, function(err, response) {
              if (err) {
                  // Just log it for now
                  console.error(err);
              } else {
                  // Log the last few digits of a phone number
                  let masked = appointment.phoneNumber.substr(0,
                      appointment.phoneNumber.length - 5);
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




const Appointment = mongoose.model('appointment', AppointmentSchema);
module.exports = Appointment;

