'use strict';

const express = require('express');
const Medication = require('../models/medication');
const Appointment = require('../models/appointment');
const router = new express.Router();

//register frorm
router.get('/addMed', function(req, res){
    res.render('medications/addMed', {
        medication: new Medication({name: '',
                                   quantity: ''})});
});

router.post('/', ensureAuthenticated, function(req, res, next) {
    const name = req.body.name;
    const quantity = req.body.quantity;
    const createdUser = req.user._id;
    const adminCode = req.user.adminReq;

  
    const medication = new Medication({name: name,
                                         quantity: quantity,
                                         adminCode: adminCode,
                                         createdUser: createdUser});
    medication.save()
      .then(function() {
        res.redirect('medications/viewMed');
      });
  });

// view med page
router.get('/viewMed', ensureAuthenticated, function(req, res) {
    const user = req.user.adminReq;
    const usera = req.user;
    Medication.find().where('adminCode').equals(user)
     .then(function(medications) {
       res.render('medications/viewMed', {user: usera , medications: medications});
    });
  });

// POST: /appointments/:id/delete
router.post('/:id/viewMed/delete', ensureAuthenticated, function(req, res, next) {
    const id = req.params.id;
    Appointment.remove({_id: id})
      .then(function() {
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

module.exports = router;
