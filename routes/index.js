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
  res.render('index', { title: 'Front page' });
});
router.get('/errorlogin', (req, res) => {
  //res.send('It works!');
  res.render('errorlogin', { title: 'Error page' });
});
router.get('/admin', (req, res) => {
  //res.send('It works!');
  res.render('admin', { title: 'Admin page' });
});
router.get('/thankyou', (req, res) => {
  //res.send('It works!');
  res.render('thankyou', { title: 'thank you page' });
});
router.get('/userpage', (req, res) => {
  //res.send('It works!');
  res.render('userpage', { title: 'Voting page' });
});


router.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/userpage',
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

router.post(
  '/form',  
  [
    check('firstName')
      .isLength({ min: 5 })
      .required()
      .withMessage('Please enter your first name'),
    check('lastName')
      .isLength({ min: 5 })
      .withMessage('Please enter your Last name'),
    check('username')
      .isLength({ min: 5 })
      .withMessage('Please enter your username'),
    check('password')
      .isLength({ min: 5 })
      .withMessage('Please enter your password'),
    check('state')
      .isLength({ min: 5 })
      .withMessage('Please enter your state'),
    check('email').isLength({ min: 1 }).withMessage('Please enter an email'),
    
  ],
  async (req, res) => { 
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const registration = new Registration(req.body);
            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            // set user password to hashed password
            registration.password = await bcrypt.hash(registration.password, salt);
            registration.save()
            .then(() => {
                //res.send('Thank you for your registration!');
                res.render('thankyou', { 
                    title: 'Thank You Message',
                    errors: errors.array(),
                    data: req.body,
                });
            })
            .catch((err) => {
                console.log(err);
                res.send('Sorry! Something went wrong.');
            });
        } else {
            res.render('errorlogin', { 
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }
    }
);

module.exports = router;