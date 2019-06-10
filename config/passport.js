const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const FacebookStrategy = require('passport-facebook').Strategy;

// Load user model 
const User = require('../models/User');

function localStrategy(passport) {
    // Serializes (stores) user id into session upon successful
    // authentication
    passport.serializeUser((user, done) => {
        console.log('User Serialized');
        done(null, user.id); // user.id i used to identify authenticated user
    });

    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((userId, done) => {
        User.findByPk(userId)
            .then((user) => {
                console.log('User Deserialized');
                done(null, user); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });
    });


    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, 
        done) => {
        
            User.findOne({ where: {email: email} })
                .then(user => {
                    if (!user) {
                        return done(null, false, {message: 'No User Found'});
                    } else if (user.status == "DEACTIVATED") {
                        return done(null, false, {message: 'User Account Deactivated.'})
                    }
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {message: "Password incorrect"});
                        }
                    })
                })

        }));


    passport.use(new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: keys.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'email'],
      },(accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                console.log(profile);
                User.findOne( { where: {user_type: 'Member_facebook' + profile.id} } )
                .then((user) => {
                    if(!user) {
                        console.log("======= User not found, new user will be created =======");
                        User.create({ 
                            name: profile.displayName,
                            photoURL: '/img/profiledefault.png',
                            user_type: 'Member_facebook' + profile.id,
                            status: 'ACTIVE',
                            email: profile.emails[0].value,
                        })
                        .then((user) => {
                            console.log('new user created: ' + user);
                            return done(null, user);
                        })
                    } else if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: "Unexpected Error has occured"});
                    }
                });
            });
        })
    )
}


// ----------- GOOGLE+ LOGIN AS OF MARCH 2019 IT HAS BEEN DISCONTINUED ----------- //
function googleStrategy(passport) {
    passport.use(
        new GoogleStrategy({
            // options for the google strat
            callbackURL: '/user/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
        }, (accessToken, refreshToken, profile, done) => {
            // passport callback function
            User.findOne({ where: {user_type: 'google' + profile.id} }).then((user) => {
                if (user){
                    // already have the user
                    console.log('user is: ', user);
                } else {
                    // if not, create user in our db
                    User.create({ 
                        name: profile.displayName,
                        photoURL: '/img/profiledefault.png',
                        user_type: 'google' + profile.id,
                        status: 'ACTIVE',
                    }).then((user) => {
                        console.log('new user created: ' + user);
                    })
                }
            })
        })
    )

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

}
// ----------- GOOGLE+ LOGIN AS OF MARCH 2019 IT HAS BEEN DISCONTINUED ----------- //

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
	    		User.findOne({where: {user_type: "facebook" + profile.id}}).then((err, user) => {
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
                        User.create({ 
                            name: profile.name.givenName + ' ' + profile.name.familyName,
                            photoURL: '/img/profiledefault.png',
                            user_type: 'google' + profile.id,
                            status: 'ACTIVE',
                            email: profile.emails[0].value
                        }).then((user) => {
                            console.log('new user created: ' + user);
                        })
	    			}
	    		});
	    	});
        })
    )
}
module.exports = {localStrategy};
