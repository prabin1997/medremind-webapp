'use strict';

const favicon = require('serve-favicon');
const express = require('express');
const cookieSession = require('cookie-session');
const http = require('http');
const enforce = require('express-sslify');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const appointments = require('./routes/appointments');
const users = require('./routes/users');
const medications = require('./routes/medications');
const scheduler = require('./schedulers/scheduler');
const reminder = require('./schedulers/reminder');
const adminReminder = require('./schedulers/adminReminder');
const refillReminder = require('./schedulers/refillReminder');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./cfig/database');
const moment = require('moment');
const router = express.Router();



const app = express();

// Use enforce.HTTPS({ trustProtoHeader: true }) since you're behind Heroku's reverse proxy
app.use(enforce.HTTPS({ trustProtoHeader: true }));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Express Session/ Use Cookie session to store data on the client side when deploying to Heroku 
app.use(cookieSession({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));


// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./cfig/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  res.locals.isAdmin = req.isAdmin || null;
  res.locals.appointment = req.appointment || null;
  res.locals.medication = req.medication || null;
  next();
});



// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'img', 'icons', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');



app.use('/users', users);
app.use('/appointments', appointments);
app.use('/medications', medications);
app.use('/', appointments);


//add the manifest
app.get("/manifest.json", function(req, res){
  //send the correct headers
  res.header("Content-Type", "text/cache-manifest");
  //console.log(path.join(__dirname,"manifest.json"));
  //send the manifest file
  //to be parsed bt express
  res.sendFile(path.join(__dirname,"manifest.json"));
});

//add the service worker
app.get("/sw.js", function(req, res){
  //send the correct headers
  res.header("Content-Type", "text/javascript");
  
  res.sendFile(path.join(__dirname,"sw.js"));
});

app.get("/loader.js", function(req, res){
  //send the correct headers
  res.header("Content-Type", "text/javascript");
  
  res.sendFile(path.join(__dirname,"loader.js"));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

scheduler.start();
reminder.start();
adminReminder.start();
refillReminder.start();


module.exports = app;
