var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.get('/', function (req, res) {
   res.render('landing');
});

router.get('/register', (req, res) => {
   res.render('register');
});

router.post('/register', (req, res) => {
   var newUser = new User({ username: req.body.username });
   User.register(newUser, req.body.password, (err, user) => {
      if (err) {
         console.log(err);
         return res.render('register');
      }

      passport.authenticate('local')(req, res, () => {
         res.redirect('/campgrounds');
      });
   });
});

router.get('/login', (req, res) => {
   res.render('login');
});

router.post('/login', passport.authenticate('local',
   {
      successRedirect: '/campgrounds',
      failureRedirect: '/login'
   }), (req, res) => {
   });

router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success', "You've been logged out");
   res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   } else {
      res.redirect('/login');
   }
}

module.exports = router;