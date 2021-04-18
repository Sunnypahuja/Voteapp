const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const Registration = mongoose.model('Registration');
const passport = require('passport');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('user', { title: 'Front page' });
});
router.get('/errorlogin', (req, res) => {
  //res.send('It works!');
  res.render('errorlogin', { title: 'Front page' });
});

router.post(
  '/user',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/errorlogin',
  }),
  function (req, res) {}
);
router.get('/form', (req, res) => {
  res.render('form', { title: 'registration form' });
});

router.get('/registrant', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrant', { title: 'Listing registrations', registrations });
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
}));

router.post('/', 
    [
        check('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
        check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
    ],
    (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          const registration = new Registration(req.body);
          registration.save()
            .then(() => {
              res.render('thankyou', {
                title: 'Thank You',
                errors: errors.array(),
                data: req.body,
              });
            })
            .catch((err) => {
              console.log(err);
              res.send('Sorry! Something went wrong.');
            });
          } else {
            res.render('form', { 
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
             });
          }
    });

module.exports = router;