const express = require('express');
const app = express()
const port = process.env.PORT || 3000;
// Previous imports...
const jwtDecode = require('jwt-decode');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;



/*****************
* Middleware
*****************/
app.use(passport.initialize());

/*****************
* Passport Config
*****************/
passport.use('swoop', new OAuth2Strategy({
  authorizationURL: 'https://auth.swoop.email/oauth2/authorize',
  tokenURL: 'https://auth.swoop.email/oauth2/token',
  clientID: 'swoop_4k6qx64khl4dsnw',
  clientSecret: '2ecfff48f3b59c7248c14398d1018efc6c62fd42ed5b57084cf5e09e384a8204',
  callbackURL: 'http://localhost:3000/auth/swoop/callback'
}, function(accessToken, refreshToken, params, profile, done) {
  let user = jwtDecode(params.id_token);
  done(null, user);
}));

/*****************
* Routes
*****************/

// Root Route
app.get('/', (req, res) => {
  res.send('Hello Swoop! \
  <div><a href="/auth/swoop">Login</a></div> \
  <div><a href="/logout">Logout</a></div>');
});

// Route that will be made secret
app.get('/secret', (req, res, next) => {
  res.send('Shhhhhh! It\' a secret!');
});

// Swoop Login Route
app.get('/auth/swoop', passport.authenticate('swoop', { scope: ['email'] }));

// Callback function after authentication occurs
app.get('/auth/swoop/callback',
        passport.authenticate('swoop', { session: false }),
        (req, res, next) => {
  console.log(req.user);
  res.redirect('/secret');
});

// Logs the user out and redirects to the homepage
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start the server
app.listen(port, () => console.log(`Swoop Demo listening on port ${port}!`));