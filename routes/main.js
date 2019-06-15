const express = require('express');
const router = express.Router();
const alertMessage= require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const passport = require('passport');


router.get('/', (req, res) => {
	const title = 'NodeJS Proj';
	res.render('index', {
		title: title,
		user: req.user,
	}) // renders views/index.handlebars
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// Login
router.get('/showLogin', (req, res) => {
	res.render('user/login', {user: req.user})
})

// Register 
router.get('/showRegister', (req, res) => {
	res.render('user/register', {user: req.user})
})


// Dashboard 
router.get('/showDashboard', isLoggedIn, (req, res) => {
    res.render('user/dashboard', {user: req.user})
})

// Save edited Profile
router.put('/saveEditedProfile/:id', isLoggedIn, (req, res) => {
	let name = req.body.name;
	let photoURL = req.body.photoURL;
	let address = req.body.address;
	let country = req.body.countrySelect;
	let unitNo = req.body.unitNo;
	let postalCode = req.body.postalCode;
	let phoneNo = req.body.phoneNo;
	let gender = req.body.gender.toString();
	let dob = req.body.dobUk;

	User.findOne({
        where: {
            id: req.user.id
        }
    }).then((user) => {		
        user.update({
            // Set variables here to save to the videos table
            name,
			photoURL,
			address,
			country,
			unitNo,
			postalCode,
			phoneNo,
			gender,
			dob,
        }).then(() => {
            res.redirect('/showDashboard');
		}).catch(err => console.log(err));
	}).catch(err => console.log(err));
});

// Edit
router.get('/showEditProfile/:id', isLoggedIn, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    }).then((user) => {
		checkOptions(user)
        res.render('user/editProfile', {
            user
        });
    }).catch(err => console.log(err));
})

function checkOptions(user) {
	let g = user.gender
	if (g === null) {
		return ''
	}
	if (g.toLowerCase() == 'male') {
		user.male = 'checked';
	}
	if (g.toLowerCase() == 'female') {
		user.female = 'checked';
	} 
}

// Login Form POST => /user/login
/*
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/video/listVideos',
        failureRedirect: '/showLogin',  // Route to /login URL
        failureFlash: true,

    })(req, res, next);

});
*/


// About
router.get('/about', (req,res) => {
	const author = 'Denzel Washington';
	let success_msg = 'Success message';
	//let error_msg = 'Error Message'
	let errors = [{text:"First Error"}, {text:"Second Error"}, {text:"Third Error"}] 
	alertMessage(res, 'success', 'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger', 'Unauthorised access', 'fas fa-exclamation-circle', false);
	

	res.render('about', {
		author: author,
		success_msg: success_msg,
		//error_msg: error_msg,
		errors:errors,
	})
});

// callback route for google to redirect to
/*
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('you reached the callback URI');
    res.redirect('user/login');
});
*/

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/showLogin');
}

module.exports = router;