var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var User = require('./models/user');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');
var campgroundRoutes = require('./routes/campgrounds');
var methodOverride = require('method-override');
var flash = require('connect-flash');

//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
   secret: 'David Andrian Chandra',
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE FOR PASSING CURRENT USER
app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   
   next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(4000 || process.env.PORT, process.env.IP, function () {
   console.log("YelpCamp Has Started..");
});