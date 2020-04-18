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
        const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        appointments.forEach(function(appointment) {
            // Create options to send the message
            const options = {
                to: `+ ${appointment.phoneNumber}`,
                from: TWILIO_PHONE_NUMBER,
                /* eslint-disable max-len */
                body: `Hi there. Just a reminder to take your ${appointment.name} medication.
                Note: ${appointment.note} `,
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
