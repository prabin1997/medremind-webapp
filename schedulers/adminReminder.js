'use strict';

const CronJob = require('cron').CronJob;
const adminsWorker = require('../workers/adminsWorker');
const moment = require('moment');


const adminReminderFactory = function() {
  return {
    start: function() {
      new CronJob('*/10 * * * *', function() {
        console.log('Running Send Admin Worker for ' +
          moment().format());
        adminsWorker.run();
      }, null, true, '');
    },
  };
};


module.exports = adminReminderFactory();