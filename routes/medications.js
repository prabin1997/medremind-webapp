'use strict';

const express = require('express');
const Medication = require('../models/medication');
const router = new express.Router();
const multer = require('multer');

// uploading img to mongodb middleware
const storage = multer.diskStorage({
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });


//register frorm
router.get('/addMed', function(req, res){
    res.render('medications/addMed', {
        medication: new Medication({name: '',
                                   quantity: ''})});
});

router.post('/', upload.single('image') , ensureAuthenticated, function(req, res, next) {
    const name = req.body.name;
    const image = req.file.buffer;
    const quantity = req.body.quantity;
    const createdUser = req.user._id;
    const adminNumber = req.user.adminNumber;
    const adminCode = req.user.adminReq;

  
    const medication = new Medication({name: name,
                                        image: image,
                                        quantity: quantity,
                                        adminCode: adminCode,
                                        adminNumber: adminNumber,
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
    Medication.remove({_id: id})
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

module.exports = router;
