const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
// Required for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');


// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = [];
    let success_msg = '';
    // Do exercise 3 here
    
/*
    var password1 = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    
    if (password1 != password2) {
        errors.push({text:"Password does not match"});
    } 
    if (password1.length < 4) {
        errors.push({text:"Password must be 4 or more characters"});
    } 

    if (password1 == password2 && password1.length >= 4) {
        let success_msg = email + "registered successfully";
        res.render('./user/login', {
            success_msg:success_msg,
        })
    } 

    else {
        res.render('user/register', {
            errors:errors,
        })
    }

*/


    // Retrieves fields from register page from request body
    let {name, email, password, password2,} = req.body;
    let user_type = "Member";
    let status = "ACTIVE";
    let photoURL = "/img/profiledefault.png";


    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({text: 'Passwords do not match'});
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({text: "Password must be at least 4 characters"});
    }

    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else { 
        // If all is well, checks if user is already registered
        User.findOne({ where: {email: req.body.email}  })
         .then(user=> { 
             if (user) { 
                // If user is found, that means email has already been      
                // registered
                res.render('user/register', { 
                    error: user.email+' already registered',
                    name,
                    email,
                    password, 
                    password2
        });
    } else {
        // Create new user record
        new Promise(resolve => {bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                // Store hash in your password DB.
                password = hash;
                resolve(password);
            });
        });
    }).then(password => {
        User.create({ name, email, password, user_type, status, photoURL })
        .then(user => {
            alertMessage(res, 'success', user.name + ' added. Please login', 'fas fa-sign-in-alt', true);
            res.redirect('/showLogin');
        })
        .catch(err => console.log(err));
    });
            }
        });
    
    }

});

// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/', 
        failureRedirect: '/showLogin',  // Route to /login URL
        failureFlash: true,
        /* Setting the failureFlash option to true instructs Passport to flash an 
        error message using the message given by the strategy's verify callback,
        if any. When a failure occur passport passes the message object as error  */
    })(req, res, next);
});

// ----------- GOOGLE+ LOGIN AS OF MARCH 2019 HAS BEEN DISCONTINUED ----------- //
// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('you reached the callback URI');
    //res.redirect('/login');
});
// ----------- GOOGLE+ LOGIN AS OF MARCH 2019 HAS BEEN DISCONTINUED ----------- //


router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

router.get('/facebook/callback', passport.authenticate('facebook', { 
    failureRedirect: '/showLogin',
    successRedirect: '/',
}));

router.get('/twitter', passport.authenticate('twitter', {
    scope: ['name']
}));

router.get('/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/showLogin',
    successRedirect: '/',
}));


// Upload poster
router.post('/upload', isLoggedIn, (req, res) =>{
        // alert("working");
        // Creates user id directory for upload if not exist
        if(!fs.existsSync('./public/uploads/'+req.user.id)){
            fs.mkdirSync('./public/uploads/'+req.user.id);
        }

        
        upload(req, res, (err) =>{
            if(err) {
                res.json({file: '/img/no-image.jpg', err: err});
            } else{
                if(req.file===undefined) {
                    res.json({file: '/img/no-image.jpg', err: err});
                } else{
                    res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
                }
            }
        });
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/showLogin');
}

module.exports = router;
