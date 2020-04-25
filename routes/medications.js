'use strict';

const express = require('express');
const User = require('../models/user');
const Medication = require('../models/medication');
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

function ensureAuthenticated(req, res, next){
if(req.isAuthenticated()){
    return next();
} else {
    req.flash('error', 'Please login to access this page');
    res.redirect('/users/login');
}
}

module.exports = router;
