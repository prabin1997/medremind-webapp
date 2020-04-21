'use strict';

const CronJob = require('cron').CronJob;
const notificationsWorker = require('./workers/notificationsWorker');
const remindersWorker = require('./workers/remindersWorker');
const moment = require('moment');

const schedulerFactory = function() {
  return {
    start: function() {
      new CronJob('00 * * * * *', function() {
        console.log('Running Send Notifications Worker for ' +
          moment().format());
        notificationsWorker.run();
      }, null, true, '');
    },
  };
};

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


module.exports = schedulerFactory();
module.exports = reminderFactory();
