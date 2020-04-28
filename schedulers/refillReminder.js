'use strict';

const CronJob = require('cron').CronJob;
const refillsWorker = require('../workers/refillsWorker');
const moment = require('moment');


const adminRefillReminderFactory = function() {
  return {
    start: function() {
      new CronJob('*/30 * * * *', function() {
        console.log('Running Send Admin Refill Worker for ' +
          moment().format());
        refillsWorker.run();
      }, null, true, '');
    },
  };
};


module.exports = adminRefillReminderFactory();