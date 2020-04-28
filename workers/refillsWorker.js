'use strict';

const Medication = require('../models/medication');

const refillWorkerFactory = function() {
  return {
    run: function() {
      Medication.sendAdminRefillReminder();
    },
  };
};

module.exports = refillWorkerFactory();