var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

router.get('/', function (req, res) {
   Campground.find({}, (err, campgrounds) => {
      if (err) {
         console.log("ERROR: " + err);
      } else {
         res.render('./campgrounds/index', { campgrounds });
      }

   });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
   var author = {
      id: req.user._id,
      username: req.user.username
   }

   var campground = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      author: author
   };

   Campground.create(
      campground, (err, campground) => {
         if (err) {
            console.log(err);
         } else {

         }
      });

   res.redirect('/campgrounds');
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
   res.render('./campgrounds/new');
});

//Must put this after /campgrounds/new to prevent new being read as an id
router.get('/:id', function (req, res) {
   let id = req.params.id;
   Campground.findById(id).populate("comments").exec((err, campground) => {
      if (err) {
         console.log('ERROR: ' + err);
      } else {
         res.render('./campgrounds/show', { campground });
      }
   });
});

router.get('/:id/edit', middleware.checkCampgroundOwner, (req, res) => {
   Campground.findById(req.params.id, (err, campground) => {
      if (err) {
         req.flash("error", "Error: " + err.message);
         return;
      }
      res.render('campgrounds/edit', { campground });
   });
});

router.put('/:id', middleware.checkCampgroundOwner, (req, res) => {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
      if (err) {
         res.redirect('/campgrounds');
      } else {
         res.redirect('/campgrounds/' + campground._id);
      }
   });
});

router.delete('/:id', middleware.checkCampgroundOwner, (req, res) => {
   Campground.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
         res.redirect('/campgrounds');
      } else {
         res.redirect('/campgrounds');
      }
   });
})

module.exports = router;