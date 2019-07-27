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
// SendGrid
const sgMail = require('@sendgrid/mail');
// JWT
const jwt = require('jsonwebtoken');


// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = [];
    let success_msg = '';


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
                    password2,
        });
    } else {
        // Create new user record
        // Generate JWT token
        let token; 
        jwt.sign(email, 's3cr3Tk3y', (err, jwtoken) => {
            if (err) console.log('Error generating Token: '+err);
                token = jwtoken;
        });

        // Create new user record
        new Promise(resolve => {
            bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                // Store hash in your password DB.
                password = hash;
                resolve(password);
            });
        });
    }).then(password => {
        let wallet = 0;
        User.create({ 
            name, 
            email, 
            password, 
            user_type, 
            status, 
            photoURL, 
            wallet,
            verified: 0,
            is_org: 0,
         }).then(user => {
            sendEmail(user.id, user.email, token)   // Add this to call sendEmail function
                .then(msg => {
                    console.log('Email Sent');
                    alertMessage(res, 'success', user.name + ' added. Please logon to ' + user.email + ' to verify account.', 'fas fa-sign-in-alt', true);
                    res.redirect('/showLogin');
                }).catch(err => { // Send email fail
                    console.log(err);
                    alertMessage(res, 'warning', 'Error sending to '+ user.email,  'fas fa-sign-in-alt', true); 
                    res.redirect('/showLogin');
                });
            }).catch(err => console.log(err));
        });
            }
        });
    
    }

});

// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    User.findOne({ where: {email: req.body.email}})
        .then(user => {
            if (user.verified === true) {
                passport.authenticate('local', {
                    successRedirect: '/', // Route to /video/listVideos URL
                    failureRedirect: '/showLogin',  // Route to /login URL
                    failureFlash: true,
                    /* Setting the failureFlash option to true instructs Passport to flash an 
                    error message using the message given by the strategy's verify callback,
                    if any. When a failure occur passport passes the message object as error  */
                })(req, res, next)
            } else {
                console.log('Did not login');
                alertMessage(res, 'danger', 'User email is not verified!', 'fas fa-exclamation-circle', true); 
                res.redirect('/showLogin');
            }
        }).catch(err => console.log(err));
    });

function sendEmail(userId, email, token){ 
<<<<<<< HEAD
    sgMail.setApiKey('<PUT YOUR API KEY HERE>'); 
=======
    sgMail.setApiKey('<SET YOUR SENDGRID API KEY HERE>'); 
>>>>>>> master
    const message = {
        to: email,
        from: 'Do Not Reply <admin@likey.sg>',
        subject: 'Verify Your Likey Account Now',         
        text: 'Likey Email Verification',         
        html: `Thank you registering with Likey.<br><br>                
                Please <a href="https://localhost:5000/user/verify/${userId}/${token}"> 
                <strong>verify</strong></a> your account.`
            }; 
            // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => { 
        sgMail.send(message) 
            .then(msg=>resolve(msg)) 
            .catch(err=>reject(err));
    }); 
}

router.get('/verify/:userId/:token', (req, res, next) => {
    // retrieve from user using id
    User.findOne({
        where: {
            id: req.params.userId
        }
    }).then(user => {
        if (user) {
            let userEmail = user.email;
            if (user.verified === true) {
                alertMessage(res, 'info', 'User already verified', 'fas fa-exclamation-circle', true);
                res.redirect('/showLogin');
            } else {
                // Verify JWST token sent via URL
                jwt.verify(req.params.token, 's3cr3Tk3y', (err, authData) => {
                    if (err) {
                        alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true); 
                        res.redirect('/');
                    } else {
                        User.update({verified : 1}, {
                            where: {id: user.id}
                        }).then(user => {
                            alertMessage(res, 'success', userEmail + ' verified. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/showLogin');
                        });
                    }
                });
            }
        } else {
            alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true);
            res.redirect('/');
        }
    })
});

// ----------- GOOGLE+ LOGIN AS OF MARCH 2019 HAS BEEN DISCONTINUED ----------- //
// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google',  {
    failureRedirect: '/showLogin',
    successRedirect: '/',
    //res.redirect('/login');
}));


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
