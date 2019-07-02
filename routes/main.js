const express = require('express');
const router = express.Router();
const alertMessage= require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const passport = require('passport');
const Order = require('../models/Order');
const Product = require('../models/Product');
const paypal = require('paypal-rest-sdk'); // npm i paypal-rest-sdk
const MapboxClient = require('mapbox'); 
const client = new MapboxClient('pk.eyJ1IjoiY2Vld2FpIiwiYSI6ImNqbng3eDcyZDByeXgzcHBnY2w0cGloM2sifQ.NsvAT34SplBxuUvZsvUSKA');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AZX7tUrGD8SBAr_c10j5apC00LQcX7suQMg_wVXHCNy7gY671pHE-v1oqYWNMZ6MrX9sy0wKM0i2C0WX',
  'client_secret': 'EJ-fLOr86UPcMvcjHHIFgqBQcM9W16ri73uxPwuH62jsxkOPc6ppUVl3jr_IuM2MMF15NI29BXafW3fu'
});

// pay 10
router.post('/pay/1', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "https://localhost:5000/success",
          "cancel_url": "https://localhost:5000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Deposit 10 Bucks into Likey's Wallet",
                  "sku": "001",
                  "price": "10.00",
                  "currency": "USD",
                  "quantity": 1
			  },]
          },
          "amount": {
              "currency": "USD",
              "total": "10.00"
          },
          "description": "This is to put your Hard Earned Cash into Likey's Wallet. Quite self explainatory actually lmao."
	  }]
  };
  
	paypal.payment.create(create_payment_json, (error, payment) => {
		if (error) {
			throw error;
		} else {
			for(let i = 0;i < payment.links.length;i++){
			if(payment.links[i].rel === 'approval_url'){
				res.redirect(payment.links[i].href);
			}
			}
		}
	});
  
});

router.post('/pay/2', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "https://localhost:5000/success",
          "cancel_url": "https://localhost:5000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Deposit 25 Bucks into Likey's Wallet",
                  "sku": "002",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
			  },]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "This is to put your Hard Earned Cash into Likey's Wallet. Quite self explainatory actually lmao."
	  }]
  };
  
	paypal.payment.create(create_payment_json, (error, payment) => {
		if (error) {
			throw error;
		} else {
			for(let i = 0;i < payment.links.length;i++){
			if(payment.links[i].rel === 'approval_url'){
				res.redirect(payment.links[i].href);
			}
			}
		}
	});
  
});
  
router.post('/pay/3', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "https://localhost:5000/success",
          "cancel_url": "https://localhost:5000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Deposit 50 Bucks into Likey's Wallet",
                  "sku": "003",
                  "price": "50.00",
                  "currency": "USD",
                  "quantity": 1
			  },]
          },
          "amount": {
              "currency": "USD",
              "total": "50.00"
          },
          "description": "This is to put your Hard Earned Cash into Likey's Wallet. Quite self explainatory actually lmao."
	  }]
  };
  
	paypal.payment.create(create_payment_json, (error, payment) => {
		if (error) {
			throw error;
		} else {
			for(let i = 0;i < payment.links.length;i++){
			if(payment.links[i].rel === 'approval_url'){
				res.redirect(payment.links[i].href);
			}
			}
		}
	});
  
});
  
  
  router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
            User.findOne({
                where: {
                    id: req.user.id,
                }
            }).then((user) => {
                let amt = user.wallet;
                let wallet = amt + 25;
                user.update({
                    wallet,
                })
            }).then(() => {
                res.redirect("/showDashboardWallet");
            })
      }
  });
  });
  
  router.get('/cancel', (req, res) => res.redirect('/showDashboardWallet'));
  
  

router.get('/', (req, res) => {
	try {
		Order.findAll({
			where: {
				userId: req.user.id,
			},
			raw: true,
		}).then((order) => {
			ret_product = [];
			Promise.all(order.map(element => {
				return Product.findOne({
					where: {
						id: element.productId,
					}
				}).then((product) => {
					
					// let coords = [];

					let coords = client.geocodeForward(element.destination, { limit: 1 }, ((err, res) => {
						return queryCoords = res.features[0].geometry.coordinates;
					}));

					// console.log(coords);

					// let coords = client.geocodeForward(element.destination);
					// // 	.then(function(res) {
					// // 		// res is the http response, including: status, headers and entity properties
					// // 		var data = res.features[0].geometry.coordinates; // data is the geocoding result as parsed JSON
					// // 		console.log(data);
					// // 	})
					// // 	.catch(function(err) {
					// // 		// handle errors
					// // 		console.log(Error(err));
					// // });
					// console.log(coords);
					

					let the_product = {
						id: product.id,
						orgId: product.orgId,
						name: product.name,
						product_type: product.product_type,
						description: product.description,
						publishDate: product.publishDate,
						cost: product.cost,
						origin: product.origin,
						deliveryfee: product.delivery,
						images: product.images,
						ratings: product.ratings,
						comments: product.comments,
						status: element.status,
						location: element.location,
						destination: element.destination,
					}
					//console.log(the_product);
					ret_product.push(the_product);
					//console.log('This is the ret_product ' + ret_product);
				})
			})).then(() => {
				//console.log("The products: " + ret_product);
				res.render('index', {
					user: req.user,
					product: ret_product,
				});
			})
		})
	} catch {
		res.render('index', {
				user: req.user,
		})
	}
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


// Dashboard: Order
router.get('/showDashboard', isLoggedIn, (req, res) => {
	Order.findAll({
		where: {
			userId: req.user.id,
		},
		raw: true,
	}).then((order) => {
		//var ret_orders = [];
		ret_product = [];
		// Maps the orders list before rendering the template
		Promise.all(order.map(element => {
			return Product.findOne({
				where: {
					id: element.productId,
				}
			}).then((product) => {
				console.log(product.product_type);
				if (product.product_type === "Goods") {
					let the_product = {
						id: product.id,
						orgId: product.orgId,
						name: product.name,
						product_type: product.product_type,
						description: product.description,
						publishDate: product.publishDate,
						cost: product.cost,
						origin: product.origin,
						deliveryfee: product.delivery,
						images: product.images,
						ratings: product.ratings,
						comments: product.comments,
						status: element.status,
					}
					ret_product.push(the_product)
				}
			})
		})).then(() => {
			// console.log('============ HERE ARE THE ORDERS ============');
			// console.log(order);
			// console.log('============ HERE ARE THE PRODUCTS ============');
			// console.log(ret_product);
			res.render('user/dashboard', {
				user: req.user,
				order,
				product: ret_product,
			});
		})
	})
})


// Dashboard: Wishlist
router.get('/showDashboardWishlist', isLoggedIn, (req, res) => {
	res.render('user/dashboardWishlist', {

	});
});

router.get('/showDashboardWallet', isLoggedIn, (req, res) => {
	res.render('user/dashboardWallet', {
		user: req.user,
	});
});

// ========== Dashboard Service ========== //
router.get('/showDashboardService', isLoggedIn, (req, res) => {
	Order.findAll({
		where: {
			userId: req.user.id,
		},
		raw: true,
	}).then((order) => {
		//var ret_orders = [];
		ret_product = [];
		// Maps the orders list before rendering the template
		Promise.all(order.map(element => {
			return Product.findOne({
				where: {
					id: element.productId,
				}
			}).then((product) => {
				console.log(product.product_type);
				if (product.product_type === "Service") {
					let the_product = {
						id: product.id,
						orgId: product.orgId,
						name: product.name,
						product_type: product.product_type,
						description: product.description,
						publishDate: product.publishDate,
						cost: product.cost,
						origin: product.origin,
						deliveryfee: product.delivery,
						images: product.images,
						ratings: product.ratings,
						comments: product.comments,
						status: element.status,
					}
					ret_product.push(the_product)
				}
			})
		})).then(() => {
			// console.log('============ HERE ARE THE ORDERS ============');
			// console.log(order);
			// console.log('============ HERE ARE THE PRODUCTS ============');
			// console.log(ret_product);
			res.render('user/dashboardService', {
				user: req.user,
				order,
				product: ret_product,
			});
		})
	})
});

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

// Service Join
router.get("/joinService", (req, res) => {
	Product.findAll({
		where: {
			product_type: "Service"
		}
	}).then((service) => {
		res.render('/joinService', {
			service,
		})
	})
});




function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/showLogin');
}

module.exports = router;
