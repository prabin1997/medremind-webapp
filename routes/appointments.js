'use strict';

const express = require('express');
//const momentTimeZone = require('moment-timezone');
const moment = require('moment');
const Appointment = require('../models/appointment');
const Medication = require('../models/medication');
const User = require('../models/user');
const router = new express.Router();



//const getTimeZones = function() {
  //return momentTimeZone.tz.names();
//};
// GET: /appointments
router.get('/', checkAuthenticated, function(req, res, next) {
    const user = req.user.adminReq;
    const medName = req.params.name;
    const isadmin = req.user.isAdmin;
    const usera = req.user;
    Appointment.find().where('userAdmin').equals(user)
     .then(function(appointments) {
      Medication.find({ $and: [{ name: { $eq: medName }},{ adminCode: { $eq: user }}]})
      .then(function(arrayResult){
       if(isadmin == true){
       res.render('appointments/index', {user: usera , appointments: appointments, meds: arrayResult});
       } else if(isadmin == false){
       res.render('appointments/pindex', {user: usera , appointments: appointments, meds: arrayResult});
       }
    });
  });
});


// GET: /appointments/create
router.get('/create', ensureAuthenticated, function(req, res, next) {
  const user = req.user.adminReq;
  Medication.find({ $and: [{ name: { $exists: true }},{ adminCode: { $eq: user }}]})
  .distinct("name")
  .then(function(result){
  res.render('appointments/create', { dropdownVals: result,
    appointment: new Appointment({name: '',
                                  notification: '',
                                  mealTime: '',
                                  time: '',
                                  note: ''})});
  });
});

// POST: /appointments
router.post('/', ensureAuthenticated, function(req, res, next) {
  const name = req.body.name;
  const notification = req.body.notification;
  const mealTime = req.body.mealTime;
  const timeZone = req.body.timeZone;
  const time = moment(req.body.time, 'MM-DD-YYYY hh:mma');
  const createdUser = req.user._id;
  const userAdmin = req.user.adminReq;
  const adminNumber = req.user.adminNumber;
  const patientNumber = req.user.number;
  const note = req.body.note;
  const confirm = req.body.confirm;

  const appointment = new Appointment({name: name,
                                       notification: notification,
                                       mealTime: mealTime,
                                       timeZone: timeZone,
                                       time: time,
                                       createdUser: createdUser,
                                       adminNumber: adminNumber,
                                       patientNumber: patientNumber,
                                       userAdmin: userAdmin,
                                       note: note,
                                       confirm: confirm});
  appointment.save()
    .then(function() {
      res.redirect('/');
    });
});

// GET: /appointments/:id/edit
router.get('/:id/edit', ensureAuthenticated, function(req, res, next) {
  const id = req.params.id;
  const user = req.user.adminReq;
  Medication.find({ $and: [{ name: { $exists: true }},{ adminCode: { $eq: user }}]})
  .distinct("name").then(function(dropresult){
  Appointment.findOne({_id: id})
    .then(function(appointment) {
      res.render('appointments/edit', {appointment: appointment, dropdownVals: dropresult});
    });
  });
});


// POST: /appointments/:id/edit
router.post('/:id/edit', ensureAuthenticated, function(req, res, next) {
  const id = req.params.id;
  const name = req.body.name;
  const notification = req.body.notification;
  const mealTime = req.body.mealTime;
  const time = moment(req.body.time, 'MM-DD-YYYY hh:mma');
  const note = req.body.note;


  Appointment.findOne({_id: id})
    .then(function(appointment) {
      appointment.name = name;
      appointment.notification = notification;
      appointment.mealTime = mealTime;
      appointment.time = time;
      appointment.note = note;


      appointment.save()
        .then(function() {
          req.flash('success', 'Medication Updated');
          res.redirect('/');
        });
    });
});

// POST: /appointments/:id/delete
router.post('/:id/delete', ensureAuthenticated, function(req, res, next) {
  const id = req.params.id;

  Appointment.remove({_id: id})
    .then(function() {
      req.flash('success', 'Medication Deleted');
      res.redirect('/');
    });
});

// full med details page 
router.get('/:id/fullMed', ensureAuthenticated, function(req, res, next) {
  const id = req.params.id;
  Appointment.findOne({_id: id})
  .then(function(appointment) {
      res.render('appointments/fullMed', {appointment: appointment, quantity: arrayResult});
    });
});

router.post('/:id/fullMed/confirm', ensureAuthenticated, function(req, res, next) {
  const id = req.params.id;
  const msg = ["Diabetes is not terrible and there are many things you can do to prevent problems from diabetes, such as monitoring blood glucose, watching your diet, keeping fit, and taking pills regularly.",
  "Try brisk walking – a convenient, safe and cost-effective way of exercising! It’s good for your heart and will help control blood glucose.",
  "Taking diabetes medications or injecting insulin regularly can help control your blood glucose level.",
  "Afraid of testing blood glucose because it hurts? Try to test on the sides of your fingertips or rotate your fingers, which can help to minimise pain.",
  "The effect of regular activity is also known to help increase insulin sensitivity, which can be useful for all types of diabetes, particularly type 2 diabetes.",
  "Taking the time to draw up a meal plan can save you time and stress in the long run. Eating meals on a schedule can help keep your blood sugar levels where they need to be.",
  "Diabetics need to watch what they eat to prevent spikes in their blood sugar, but that doesn’t mean they have to avoid food they love."
  ];
  const randomMsg = msg[Math.floor(Math.random() * msg.length)];
  const successMsg = "Message of the day: ";

  Medication.update({"$inc": { "quantity": -1}}).then(function() {
  Appointment.update({_id: id}, {"$set":{"confirm": true}})
  .then(function() {
      req.flash('success', "Sucessfully confirmed medication");
      req.flash('success', successMsg + randomMsg);
      res.redirect('/');
    });
  });
});

// patient diary page
router.get('/appointments/diary', ensureAuthenticated, function(req, res) {
  const user = req.user.adminReq;
  const usera = req.user;
  Appointment.find().where('userAdmin').equals(user)
  .find({confirm: true})
   .then(function(appointments) {
     res.render('appointments/diary', {user: usera , appointments: appointments});
   });
});

router.post('/:id/diary/delete', ensureAuthenticated, function(req, res, next) {
  const id = req.params.id;
  Appointment.remove({_id: id})
    .then(function() {
      req.flash('success', 'Medication Deleted');
      res.redirect('/');
    });
});


function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error', 'Please login to access this page');
    res.redirect('/users/login');
  }
}

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/users/home');
  }
}

module.exports = router;


