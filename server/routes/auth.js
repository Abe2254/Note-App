const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const callbackURL =
  process.env.NODE_ENV === 'production'
    ? 'https://note-app-nyhh.onrender.com/google/callback'
    : 'http://localhost:8000/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      scope: ['profile', 'email'],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Debugging: Log full profile data
        console.log("Google Profile Data:", profile);

        // Handle missing emails
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profileImage: profile.photos?.[0]?.value || "",
          email: email, // Allow null emails
        };

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          user = await User.create(newUser);
          return done(null, user);
        }
      } catch (error) {
        console.error("Google Auth Error:", error);
        return done(error, null);
      }
    }
  )
);


//Google Login Route
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard',
  })
);

//Routes if something goes wrong
router.get('/login-failure', (req, res) => {
  res.send('Failed to login');
});

//Destroy user session
router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send('Error logging out');
    } else {
      res.redirect('/');
    }
  });
});

//Persist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Retrieve user data from session
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id); // Await the Promise
    done(null, user); // Pass the user object
  } catch (err) {
    done(err, null); // Handle errors
  }
});

module.exports = router;
