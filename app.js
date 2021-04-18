const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const User = require("./models/user");
const passport = require("passport");
const app = express();
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoose = require('mongoose');
const helmet = require('helmet');



  mongoose.connect('mongodb://localhost/Voteapp');

const expSession = require('express-session')({
  secret: 'mysecret', //decode or encode session
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 1 * 60 * 1000, //10 minutes
  },
});


passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(expSession);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);


app.use(mongoSanitize());
//preventing DOS attacks - Body Parser
app.use(express.json({ limit: '10Kb' })); //Body limit is 10
//DAta sanitization agains XSS attack
app.use(xss());

//helmet to secure connection and data
app.use(helmet());

module.exports = app;