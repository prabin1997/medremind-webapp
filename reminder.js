'use strict';

const CronJob = require('cron').CronJob;
const remindersWorker = require('./workers/remindersWorker');
const moment = require('moment');


const reminderFactory = function() {
  return {
    start: function() {
      new CronJob('0 */10 * * * *', function() {
        console.log('Running Send Reminders Worker for ' +
          moment().format());
        remindersWorker.run();
      }, null, true, '');
    },
  };
};


module.exports = reminderFactory();
