//const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcryptjs');
//const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const FacebookStrategy = require('passport-facebook').Strategy;
// Load user model 
const User = require('../models/User');

function facebookStrategy(passport) {
    // Serializes (stores) user id into session upon successful
// authentication
passport.serializeUser((user, done) => {
    done(null, user.id); // user.id i used to identify authenticated user
});

// User object is retrieved by userId from session and
// put into req.user
passport.deserializeUser((userId, done) => {
    User.findByPk(userId)
        .then((user) => {
            done(null, user); // user object saved in req.session
        })
        .catch((done) => { // No user found, not stored in req.session
            console.log(done);
        });
});

passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: keys.facebook.callbackURL
  },
  (accessToken, refreshToken, profile, done) => {
        process.nextTick(function(){
            console.log(profile);
            User.findOne({where: {user_type: "facebook" + profile.id}})
            .then((err, user) => {
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                else {
                    User.create({ 
                        name: profile.displayName,
                        photoURL: '/img/profiledefault.png',
                        user_type: 'facebook' + profile.id,
                        status: 'ACTIVE',
                    }).then((user) => {
                        console.log('new user created: ' + user);
                    })
                }
            });
        });
    })
)
}

module.exports = {facebookStrategy};