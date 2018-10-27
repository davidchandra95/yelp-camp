var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, (req, res) => {
   let id = req.params.id;
   Campground.findById(id, (err, campground) => {
      if (err) {
         console.log(err);
      } else {
         res.render('./comments/new', { campground });
      }
   })
})

router.post('/', middleware.isLoggedIn, (req, res) => {
   let id = req.params.id;
   Campground.findById(id, (err, campground) => {
      if (err) {
         req.flash("error", "Error: " + err.message);
         res.redirect('/campgrounds');
      } else {
         Comment.create(req.body.comment, (err, comment) => {
            if (err) {
               console.log(err);
            } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Successfuly added comment");
               res.redirect('/campgrounds/' + campground._id);
            }
         });
      }
   });
});

router.get('/:commentId/edit', middleware.checkCommentOwner, (req, res) => {
   Comment.findById(req.params.commentId, (err, comment) => {
      if (err) {
         res.redirect('back');
      }else{
         res.render('./comments/edit', {campgroundId: req.params.id, comment})
      }
   })
});

router.put('/:commentId', middleware.checkCommentOwner, (req, res) => {
   Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.comment.text}, (err, comment) => {
      if (err) {
         console.log(err);
         res.redirect('back');
      } else {
         res.redirect('/campgrounds/' + req.params.id);
      }
   })
});

router.delete('/:commendId', middleware.checkCommentOwner, (req, res) => {
   Comment.findByIdAndRemove(req.params.commendId, (err) => {
      if (err) {
         console.log(err);
      }
      res.redirect('/campgrounds/' + req.params.id);
   });
});

module.exports = router;