const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');



//bring user model 
const User = require('../models/user');

//register frorm
router.get('/register', function(req, res){
    res.render('register');
});

//Admin register frorm
router.get('/adminReg', function(req, res){
    res.render('adminReg');
});

// patient register process
router.post('/register', function(req,res){
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const adminReq = req.body.adminReq;


    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    
    if(errors){
        res.render('register', {
            errors:errors  
        });
    } else {
        let newUser = new User({
            name:name,
            username:username,
            password:password,
            adminReq:adminReq
        });


        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(User.find({adminReq: {$ne: adminReq}})){
                        newUser.isAdmin = false;  
                }else{
                    req.flash('error', 'Wrong details. Please Try again');
                    res.redirect('/users/login');
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;   
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    } 
});

// admin register process
router.post('/adminReg', function(req,res){
    const name = req.body.name;
    const number = req.body.number;
    const adminNumber = req.body.adminNumber;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const adminReq = req.body.adminReq;
    const adminCode = req.body.adminCode;


    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    
    if(errors){
        res.render('adminReg', {
            errors:errors  
        });
    } else {
        let newUser = new User({
            name:name,
            number:number,
            adminNumber:adminNumber,
            username:username,
            password:password,
            adminReq:adminReq
        });


        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(User.find({adminReq: {$eq: adminCode}})){
                        newUser.adminReq = adminCode;
                        newUser.isAdmin = true;  
                }else{
                    req.flash('error', 'Wrong details. Please Try again');
                    res.redirect('/users/login');
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;   
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    } 
});

//Home page 
router.get('/home', function(req, res){
    res.render('home');
});
//Education page page 
router.get('/learn', function(req, res){
    res.render('learn');
});
//Contact page 
router.get('/contact', function(req, res){
    res.render('contact');
});

//Contact page 
router.get('/about', function(req, res){
    res.render('about');
});

//login form
router.get('/login', function(req, res){
    res.render('login');
});

//offilne page
router.get('/offline', function(req, res){
    res.render('offline');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;
