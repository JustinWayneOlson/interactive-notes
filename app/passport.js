var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../app/models/user');

var configAuth = require('../config/auth');

module.exports = function(passport){
   passport.serializeUser(function(user, done){
      done(null, user.id);
   });

   passport.deserializeUser(function(id, done){
      User.findById(id,function(err, user){
         done(err, user);
      });
   });

   passport.use(new GoogleStrategy(
      {
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            passReqToCallback: true
      },
      function(req, token, refreshToken, profile, done){
         process.nextTick(function(){
            if(!req.user)
            {
               User.findOne({'account.google_id': profile.id}, function(err, user){
                  if(err)
                  {
                     return done(err);
                  }
                  if(user)
                  {
                     return done(null, user);
                  }
                  else
                  {
                     var newUser = new User();
                     newUser.account.google_id = profile.id;
                     newUser.account.google_token = token;
                     newUser.account.name = profile.displayName;
                     newUser.account.email = profile.emails[0].value;

                     newUser.save(function(err){
                        if(err)
                        {
                           throw err;
                        }
                        return done(null, newUser);
                     });
                  }
               });
            }
            else
            {
               var user = req.user;
               var global_found_user = {};
               User.findOne({'account.google_id': profile.id }, function(err, found_user){
                  if(err)
                  {
                     return done(err);
                  }
                  if(found_user)
                  {
                     global_found_user = found_user.account;
                     //parse and restring to form a temporary deep copy
                     user.account = Object.assign(JSON.parse(JSON.stringify(user.account)), JSON.parse(JSON.stringify(global_found_user)));
                     user.files = user.files.concat(found_user.files);
                     User.findOneAndRemove({'account.google_id': profile.id}, function(err){
                        if(err)
                        {
                           console.log(err);
                        }
                     });
                  }
                  else
                  {
                     user.account.google_id = profile.id;
                     user.account.google_token = token;
                     user.account.name = profile.displayName;
                     user.account.email = profile.emails[0].value;
                  }

                  user.save(function(err){
                     if(err)
                     {
                        throw err;
                     }
                     return done(null, user);
                  });
               });
            }
         });
      }
   ));

   passport.use(new TwitterStrategy(
      {
         consumerKey: configAuth.twitterAuth.consumerKey,
         consumerSecret: configAuth.twitterAuth.consumerSecret,
         callbackURL: configAuth.callbackURL,
         passReqToCallback: true
      },
      function(req, token, tokenSecret, profile, done){
         console.log(token);
         process.nextTick(function(){
            if(!req.user)
            {
               User.findOne({'account.twitter_id': profile.id }, function(err, user){
                  if(err)
                  {
                     return done(err);
                  }

                  if(user)
                  {
                     return done(null, user);
                  }
                  else
                  {
                     var newUser = new User();

                     newUser.account.twitter_id = profile.id;
                     newUser.account.twitter_token = token;
                     newUser.account.twitter_username = profile.username;
                     console.log(newUser);

                     newUser.save(function(err){
                        if(err)
                        {
                           throw err;
                        }
                        return done(null, newUser);
                     });
                  }
               });
            }
            else{
               var user = req.user;
               var global_found_user = {};
               User.findOne({'account.twitter_id': profile.id }, function(err, found_user){
                  if(err)
                  {
                     return done(err);
                  }
                  if(found_user)
                  {
                     global_found_user = found_user.account;
                     user.account = Object.assign(JSON.parse(JSON.stringify(user.account)), JSON.parse(JSON.stringify(global_found_user)));
                     user.files = user.files.concat(found_user.files);
                     User.findOneAndRemove({'account.twitter_id': profile.id}, function(err){
                        if(err)
                        {
                           console.log(err);
                        }
                     });
                  }
                  else
                  {
                     user.account.twitter_id = profile.id;
                     user.account.twitter_token = token;
                     user.account.twitter_username = profile.username;
                  }
                  user.save(function(err){
                     if(err)
                     {
                        throw err;
                     }
                     return done(null, user);
                  });
               });
            }
         });
      }
   ));

   passport.use(new FacebookStrategy(
      {
         clientID: configAuth.facebookAuth.clientID,
         clientSecret: configAuth.facebookAuth.clientSecret,
         callbackURL : configAuth.facebookAuth.callbackURL,
         passReqToCallback: true,
         profileFields: ["email"],
      },
      function(req, token, refreshToken, profile, done){
         process.nextTick(function(){
            if(!req.user)
            {
               User.findOne({'account.facebook_id' : profile.id}, function(err, user){
                  if(err)
                  {
                     return done(err);
                  }

                  if(user)
                  {
                     return done(null, user);
                  }

                  else
                  {
                     var newUser = new User();
                     newUser.account.facebook_id = profile.id;
                     newUser.account.facebook_token = token;
                     newUser.account.name =  profile.displayName;
                     newUser.save(function(err){
                        if(err)
                        {
                           throw err;
                        }
                        return done(null, newUser);
                     });
                  }
               });
            }
            else
            {
               var user = req.user;
               var global_found_user = {};
               User.findOne({'account.facebook_id': profile.id }, function(err, found_user){
                  if(err)
                  {
                     return done(err);
                  }
                  if(found_user)
                  {
                     global_found_user = found_user.account;
                     user.account = Object.assign(JSON.parse(JSON.stringify(user.account)), JSON.parse(JSON.stringify(global_found_user)));
                     user.files = user.files.concat(found_user.files);
                     User.findOneAndRemove({'account.facebook_id': profile.id}, function(err){
                        if(err)
                        {
                           console.log(err);
                        }
                     });
                  }
                  else
                  {
                     user.account.facebook_id = profile.id;
                     user.account.facebook_token = token;
                     user.account.name = profile.displayName;
                  }
                  user.save(function(err){
                     if(err)
                     {
                        throw err;
                     }
                     return done(null, user);
                  });
               });
            }
         });
      }
   ));

   passport.use('local-signup', new LocalStrategy(
      {
         usernameField: 'email',
         passwordField: 'password',
         passReqToCallback: true
      },
      function(req, email, password, done){
         process.nextTick(function(){
            if(!req.user)
            {
               User.findOne({'account.email': email}, function(err, user){
                  if(err)
                  {
                     return done(err);
                  }
                  if(user){
                     return done(null, false, req.flash('signupMessage',' That email is already taken'));
                  }
                  else
                  {
                     var newUser = new User();
                     newUser.account.email = email;
                     newUser.account.password = newUser.generateHash(password);

                     newUser.save(function(err){
                        if(err)
                        {
                           throw err;
                        }
                        return done(null, newUser);
                     });
                  }
               });
            }
            else{
               var user = req.user;
               var global_found_user = {};
               User.findOne({'account.email': email }, function(err, found_user){
                  if(err)
                  {
                     return done(err);
                  }
                  if(found_user)
                  {
                     global_found_user = email;
                     user.account = Object.assign(JSON.parse(JSON.stringify(user.account)), JSON.parse(JSON.stringify(global_found_user)));
                     user.files = user.files.concat(found_user.files);
                     User.findOneAndRemove({'account.email': profile.email}, function(err){
                        if(err)
                        {
                           console.log(err);
                        }
                     });
                  }
                  else
                  {
                     user.account.email = email;
                     user.account.password = user.generateHash(password);
                  }
                  user.save(function(err){
                     if(err)
                     {
                        throw err;
                     }
                     return done(null, user);
                  });
               });

            }
         });
   }));

   passport.use('local-login', new LocalStrategy(
      {
         usernameField: 'email',
         passwordField: 'password',
         passReqToCallback : true
      },
      function(req, email, password, done){
         User.findOne({'account.email': email}, function(err, user){
            if(err)
            {
               return done(err);
            }

            if(!user)
            {
               return done(null, false, req.flash('loginMessage', 'Username not found!'));
            }

            if (!user.validPassword(password))
            {
               return done(null, false, req.flash('loginMessage', 'Incorrect Password'));
            }

            return done(null, user);
         });
      }
   ));
}
