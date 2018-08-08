var Comment = require('../models/comment');
var Restaurant = require('../models/restaurant');
//it checks whether a user has logged in
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  //restaurant middleware
  //checks whether the user has entered the correct restaurant
  checkUserRestaurant: function(req, res, next){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
      if(err || !foundRestaurant){
          console.log(err);
          req.flash('error', 'Sorry, that Restaurant does not exist!');
          res.redirect('/restaurants');
      } else if(foundRestaurant.author.id.equals(req.user._id) || req.user.isAdmin){
          req.restaurant = foundRestaurant;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/restaurants/' + req.params.id);
      }
    });
  },
  //comment middleware
  //authentocicates whether the user can comment and whether they have logged in the system
  checkUserComment: function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/restaurants');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/restaurants/' + req.params.id);
       }
    });
  },
  //check whether the user is an admin 
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      res.redirect('back');
    }
  },
  //checks whethere the image is safe to use and copy the url
  isSafe: function(req, res, next) {
    if(req.body.image.match()) {
      next();
    }else {
      res.redirect('back');
    }
  }
}