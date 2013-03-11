

var user = require('../models/user.js'),
   passport = require('passport'),
   BasicStrategy = require('passport-http').BasicStrategy;


module.exports.init = function() {
   passport.use(new BasicStrategy({
     },
     function(username, password, done) {
       process.nextTick(function () {
         // Find the user by username.  If there is no user with the given
         // username, or the password is not correct, set the user to `false` to
         // indicate failure.  Otherwise, return the authenticated `user`.
         findByUsername(username, function(err, user) {
           if (err) { return done(err); }
           if (!user) { return done(null, false); }
           if (user.password != password) { return done(null, false); }
           return done(null, user);
         });
       });
     }
   ));
};

module.exports.restrict = function() {
   passport.authenticate('basic', { session: false });
};
