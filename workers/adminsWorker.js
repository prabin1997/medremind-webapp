'use strict';

const Appointment = require('../models/appointment');

const adminWorkerFactory = function() {
  return {
    run: function() {
      Appointment.sendAdminReminder();
    },
  };
};

module.exports = adminWorkerFactory();