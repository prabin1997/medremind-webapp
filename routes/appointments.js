'use strict';

const express = require('express');
const momentTimeZone = require('moment-timezone');
const moment = require('moment');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const router = new express.Router();



const getTimeZones = function() {
  return momentTimeZone.tz.names();
};
// GET: /appointments
router.get('/', ensureAuthenticated, function(req, res, next) {
    const user = req.user.adminReq;
    const usera = req.user;
    Appointment.find().where('userAdmin').equals(user)
     .then(function(appointments) {
       res.render('appointments/index', {user: usera , appointments: appointments});
    });
});

router.get('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  Appointment.findOne({_id: id})
    .then(function(appointment) {
      res.render('appointments/edit', {timeZones: getTimeZones(),
                                       appointment: appointment});
    });
});

// GET: /appointments/create
router.get('/create', function(req, res, next) {
  res.render('appointments/create', {
    timeZones: getTimeZones(),
    appointment: new Appointment({name: '',
                                  phoneNumber: '',
                                  notification: '',
                                  mealTime: '',
                                  timeZone: '',
                                  time: '',
                                  note: ''})});
});

// POST: /appointments
router.post('/', function(req, res, next) {
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const notification = req.body.notification;
  const mealTime = req.body.mealTime;
  const timeZone = req.body.timeZone;
  const time = moment(req.body.time, 'MM-DD-YYYY hh:mma');
  const createdUser = req.user._id;
  const userAdmin = req.user.adminReq;
  const adminNumber = req.user.number;
  const note = req.body.note;
  const confirm = req.body.confirm;

  const appointment = new Appointment({name: name,
                                       phoneNumber: phoneNumber,
                                       notification: notification,
                                       mealTime: mealTime,
                                       timeZone: timeZone,
                                       time: time,
                                       createdUser: createdUser,
                                       adminNumber: adminNumber,
                                       userAdmin: userAdmin,
                                       note: note,
                                       confirm: confirm});
  appointment.save()
    .then(function() {
      res.redirect('/');
    });
});

// GET: /appointments/:id/edit
router.get('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  Appointment.findOne({_id: id})
    .then(function(appointment) {
      res.render('appointments/edit', {timeZones: getTimeZones(),
                                       appointment: appointment});
    });
});

// POST: /appointments/:id/edit
router.post('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const notification = req.body.notification;
  const mealTime = req.body.mealTime;
  const timeZone = req.body.timeZone;
  const time = moment(req.body.time, 'MM-DD-YYYY hh:mma');
  const note = req.body.note;


  Appointment.findOne({_id: id})
    .then(function(appointment) {
      appointment.name = name;
      appointment.phoneNumber = phoneNumber;
      appointment.notification = notification;
      appointment.mealTime = mealTime;
      appointment.timeZone = timeZone;
      appointment.time = time;
      appointment.note = note;


      appointment.save()
        .then(function() {
          req.flash('success', 'Medication Added');
          res.redirect('/');
        });
    });
});

// POST: /appointments/:id/delete
router.post('/:id/delete', function(req, res, next) {
  const id = req.params.id;

  Appointment.remove({_id: id})
    .then(function() {
      res.redirect('/');
    });
});

// full med details page 
router.get('/:id/fullMed', function(req, res, next) {
  const id = req.params.id;
  Appointment.findOne({_id: id})
    .then(function(appointment) {
      res.render('appointments/fullMed', {
                                          appointment: appointment});
    });
});

router.post('/:id/fullMed/confirm', function(req, res, next) {
  const id = req.params.id;
  Appointment.update({_id: id}, {"$set":{"confirm": true}})
    .then(function() {
      res.redirect('/');
    });
});

// patient diary page
router.get('/appointments/diary', ensureAuthenticated, function(req, res) {
  const user = req.user.adminReq;
  const usera = req.user;
  Appointment.find().where('userAdmin').equals(user)
   .then(function(appointments) {
     res.render('appointments/diary', {user: usera , appointments: appointments});
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/users/home');
  }
}

module.exports = router;


