module.exports = function(app, passport, fileHandler){
   app.get('/', function(req, res){
      res.render('index.ejs');
   });

   app.post('/upload', isLoggedIn, fileHandler.upload);

   app.get('/download/:id', fileHandler.download);

   app.get('/delete/:id', isLoggedIn, fileHandler.delete_file);

   app.get('/viewer', isLoggedIn, function(req, res){
      res.render('filebrowser.ejs', {
         user: req.user
      });
   });

   app.get('/viewer/:id', isLoggedIn, function(req, res){
      res.render('viewer.ejs', {
         user: req.user,
         file_id: req.params.id
      });
   });

   app.get('/profile', isLoggedIn, function(req, res){
      res.render('filebrowser.ejs', {
         user : req.user
      });
   });

   app.get('/account', isLoggedIn, function(req, res){
      res.render('account.ejs', {
         user : req.user
      });
   });

   app.get('/signup', function(req, res){
      res.render('signup.ejs', {message: req.flash('signupMessage')});
   });

   app.post('/signup', passport.authenticate('local-signup',
            {
               successRedirect: '/profile',
               failureRedirect: '/signup',
               failureFlash: true
            }
   ));

   app.get('/login', function(req, res){
      res.render('login.ejs', { message: req.flash('loginMessage')});
   });

   app.post('/login', passport.authenticate('local-login',
      {
         successRedirect: '/profile',
         failureRedirect: '/login',
         failureFlash: true
      }
   ));

   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   });


   //Account Authentication
   app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email']}));

   app.get('/auth/google/callback',
         passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
         })
   );

   app.get('/auth/facebook', passport.authenticate('facebook', {scope: ["public_profile", "email"]}));

   app.get('/auth/facebook/callback',
         passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
         })
   );

   app.get('/auth/twitter', passport.authenticate('twitter'));

   app.get('/auth/twitter/callback',
         passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
         })
   );


   //Account Authorization
   app.get('/connect/local', function(req, res){
      res.render('connect-local.ejs', {message: req.flash('loginMessage')});
   });

   app.post('/connect/local', passport.authenticate('local-signup',
      {
         successRedirect : '/profile',
         failureRedirect : '/connect/local',
         failureFlash    : true
      })
   );

   app.get('/connect/facebook', passport.authorize('facebook', { scope: ["public_profile",'email']}));

   app.get('/connect/facebook/callback',passport.authorize('facebook',
         {
            successRedirect: 'profile',
            failureRedirect: '/'
         }
   ));

   app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email']}));

   app.get('/connect/google/callback',
         passport.authorize('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
         }
      ));


   app.get('/connect/twitter', passport.authorize('twitter', { scope :'email'}));

   app.get('/connect/twitter/callback',
         passport.authorize('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
         }
   ));


   function isLoggedIn(req, res, next){
      if(req.isAuthenticated())
      {
         return next();
      }
      res.redirect('/');
   }
}
