var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middleware = {};

middleware.checkCampgroundOwner = function(req, res, next) {
   if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, campground) => {
         if (err) {
            req.flash("error", "Error: " + err.message);
            res.redirect('/campgrounds');
         } else {
            if (campground.author.id.equals(req.user._id)) {
               return next();
            } else {
               req.flash("error", "You don't have permission to do that.");
               res.redirect('back');
            }
         }
      });
   } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect('back');
   }
}

middleware.checkCommentOwner = function(req, res, next) {
   if (req.isAuthenticated()) {
      Comment.findById(req.params.commentId, (err, comment) => {
         if (err) {
            res.redirect('/campgrounds');
         } else {
            if (comment.author.id.equals(req.user._id)) {
               return next();
            } else {
               req.flash("error", "You don't have permission to do that.");
               res.redirect('back');
            }
         }
      });
   } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect('back');
   }
}

middleware.isLoggedIn = function(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   } else {
      req.flash("danger", "You need to be logged in to do that.");
      res.redirect('/login');
   }
}

module.exports = middleware;