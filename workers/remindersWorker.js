'use strict';

const Appointment = require('../models/appointment');

const reminderWorkerFactory = function() {
  return {
    run: function() {
      Appointment.sendReminder();
    },
  };
};

module.exports = reminderWorkerFactory();
