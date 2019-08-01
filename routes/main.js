const express = require('express');
const router = express.Router();
const alertMessage= require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const paypal = require('paypal-rest-sdk'); // npm i paypal-rest-sdk
const MapboxClient = require('mapbox'); 
const client = new MapboxClient('pk.eyJ1IjoiY2Vld2FpIiwiYSI6ImNqbng3eDcyZDByeXgzcHBnY2w0cGloM2sifQ.NsvAT34SplBxuUvZsvUSKA');
const dialcodes = require('dialcodes');  // npm i dialcodes
// const SendOtp = require('sendotp'); // npm install sendotp --save
// const sendOtp = new SendOtp('2926AawNJ9tkj5d3bde76');
const Nexmo = require('nexmo'); //npm install --save nexmo express body-parser ejs
// const nexmo = new Nexmo({ // old api key
//   apiKey: '07ec6777',
//   apiSecret: 'aCkARCcv0Hm18Ox5'
// });
const nexmo = new Nexmo({ // 2nd api key
  apiKey: '267bcd28',
  apiSecret: 'jmEutZQWQGJfNv70',
});

// const from = 'Nexmo';
// const to = '6586610775';
// const text = 'Hello from Nexmo';

// nexmo.message.sendSms(from, to, text);

const jwt = require('jsonwebtoken');

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
			ret_goods = [];
			ret_services = [];
			home = req.user.country + ' ' + req.user.address + ' ' + req.user.postalCode;
			Promise.all(order.map(element => {
				return Product.findOne({
					where: {
						id: element.productId,
					}
				}).then((product) => {
					if (product.product_type === "Goods") {
						if (element.status != "DELIVERED") {
							console.log(element.status);
							let the_product = {
								id: element.id,
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
							ret_goods.push(the_product);
						}
					} else {
						if (element.status != "COMPLETED") {
							console.log(element.status);
							let the_product = {
								id: element.id,
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
							ret_services.push(the_product);
						}
					}
				})
			})).then(() => {
				//console.log("The products: " + ret_product);
				res.render('index', {
					user: req.user,
					goods: ret_goods,
					service: ret_services,
					home,
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
		order: [
            ['id', 'DESC'],
        ],
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
						id: element.id,
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
						destination: element.destination,
						location: element.location,
					}
					ret_product.push(the_product);
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
		user: req.user,
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
		order: [
            ['id', 'DESC'],
        ],
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
	let justphoneNo = req.body.phoneNo;
	let dialingCode = dialcodes.getDialingCode(country); // find country dialing code
	let phoneNo = dialingCode + " " + justphoneNo;

	User.findOne({
        where: {
            id: req.user.id,
        }
    }).then((user) => {
		if (user.is_org) {
			console.log(user.is_org);
			let org_type = req.body.org_type;
			let org_website = req.body.org_website;
			let org_address = req.body.org_address;
			let org_country = req.body.org_country;
			let org_unitNo = req.body.org_unitNo;
			let org_postalCode = req.body.org_postalCode;
			User.findOne({
				where: {
					id: req.user.id
				}
			}).then((user) => {		
				user.update({
					// Set variables here to save to the videos table
					org_name: name,
					photoURL,
					org_country,
					org_address,
					org_unitNo,
					org_postalCode,
					org_phone: phoneNo,
					org_type,
					org_website,
				}).then(() => {
					res.redirect('/showDashboard');
				}).catch(err => console.log(err));
			}).catch(err => console.log(err));
		} else {
			console.log(user.is_org);
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
		}
	}).catch((err) => {
		console.log(err);
	})

});

// Edit
router.get('/showEditProfile/:id', isLoggedIn, (req, res) => {
    User.findOne({
        where: {
            id: req.user.id
        }
    }).then((user) => {

		// Check for proper passed in information
		checkOptions(user);
		selectType(user);
		if (user.phoneNo != undefined) {
			let no = user.phoneNo.split(' ');
			user.phoneNo = no[1];
			user.org_phone = no[1];
		}
		
        res.render('user/editProfile', {
            user
        });
    }).catch(err => console.log(err));
})

// Edit Orders
router.get('/editOrder/:id', userOrder, (req, res) => {
    Order.findOne({
        where: {
            id: req.params.id
        }
    }).then((order) => {
		Product.findOne({
			where: {
				id: order.productId
			}
		}).then((product) => {
			// Check for proper passed in information
			selectTypeOrder(order);
			
			if (product.product_type.toLowerCase() == "goods") {
				order.isGoods = "block";
				order.isService = "none";
			} else {
				order.isGoods = "none";
				order.isService = "block";
			}

			res.render('user/editOrder', {
				order,
				product,
			});
		})
    }).catch(err => console.log(err));
})

// Save edited order
router.put('/editOrder/:id', userOrder, (req, res) => {
	let address = req.body.address;
	let country = req.body.countrySelect;
	let street = req.body.street;
	let status = req.body.order_status;
	let Sstatus = req.body.Sorder_status;
	status = status.toUpperCase();
	Sstatus = Sstatus.toUpperCase();
	let location = country + " " + address + " " + street;
	let Slocation = req.body.location;
	
	Order.findOne({
        where: {
            id: req.params.id,
        }
    }).then((order) => {

		Product.findOne({
			where: {
				id: order.productId
			}
		}).then((product) => {
			if (product.product_type.toLowerCase() == "goods") {
				if (status == "DELIVERED") {	
					User.findOne({
						where: {
							id: order.userId
						}
					}).then((user) => {
						if (user.phoneNo.length > 0) {
							const from = 'Likey & Co.';
							const text = 'Your item has been delivered!';
							let to = user.phoneNo.replace('+','');
							to = to.replace(' ','');
							nexmo.message.sendSms(from, to, text);
						}
							order.update({
								status,
								location: order.destination,
							}).then(() => {
								res.redirect('/manageOrder');
							}).catch(err => console.log(err));
					})
				} else {
					order.update({
						status,
						location,
					}).then(() => {
						res.redirect('/manageOrder');
					}).catch(err => console.log(err));
				}
			} else {
				if (Sstatus == "COMPLETED") {
					order.update({
						status: Sstatus,
						location: product.origin,
					}).then(() => {
						res.redirect('/manageOrder');
					}).catch(err => console.log(err));
				} else {
					order.update({
						status: Sstatus,
						location,
					}).then(() => {
						res.redirect('/manageOrder');
					}).catch(err => console.log(err));
				}
				
			}
			
		})
		
	}).catch((err) => {
		console.log(err);
	})

});

router.post("/cancelOrder/:id", userOrder, (req, res) => {
	Order.findOne({
		where: {
			id: req.params.id
		}
	}).then((order) => {
		User.findOne({
			where: {
				id: order.userId,
			}
		}).then((user) => {
			order.update({
				status: "CANCELLED",
			}).then(() => {
				Product.findOne({
					where: {
						id: order.productId,
					}
				}).then((product) => {
					if (user.phoneNo.length > 0) {
						const from = 'Likey & Co.';
						const text = 'Your Order: ' + product.name + ' has been cancelled. Please contact vendor if there is a misunderstanding.';
						let to = user.phoneNo.replace('+','');
						to = to.replace(' ','');
						nexmo.message.sendSms(from, to, text);
					}
					res.redirect('/manageOrder')
				})
			})
		})
	})
})

// Become an organization
router.get("/orgSignup/:token", isLoggedIn, (req, res) => {
	User.findOne({
		where: {
			id: req.user.id
		}
	}).then((user) => {
		

		//console.log('Verifying: ' + req.params.token);
		jwt.verify(req.params.token, 's3cr3Tk3y', (err, authData) => {
			if (err) {
				alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true); 
				res.redirect('/perInfo');
			} else {
				area = user.country + ' ' + user.address + ' ' + user.unitNo + ' ' + user.postalCode
				res.render("user/orgSignup", {
					user,
					area,
				})
			}
		})
	})
});

router.post("/orgSignup", isLoggedIn, (req, res) => {
	let org_ic = req.body.org_ic.split(" ").join('');
	let org_type = req.body.org_type;
	let org_size = req.body.radio;
	let org_name = req.body.org_name;
	let org_country = req.body.org_country;
	let org_address = req.body.org_address;
	let org_unitNo = req.body.org_unitNo;
	let org_postalCode = req.body.org_postalCode;
	let org_id = org_name.toUpperCase() + org_ic;
	let org_phone = req.body.org_phone;
	let org_website = req.body.org_website;
	let is_org = true;


	User.findOne({
		where: {
			id: req.user.id
		}
	}).then((user) => {
		user.update({
			org_id,
			org_ic,
			org_type,
			org_size,
			org_name,
			org_country,
			org_address,
			org_unitNo,
			org_postalCode,
			org_phone,
			org_website,
			is_org
		})
	}).then(() => {
		res.redirect('/showDashboard');
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

// Manage Orders
router.get("/manageOrder", isOrg, (req, res) => {
	Product.findAll({
		where: {
			userId: req.user.id,
		},
	}).then((product) => {
		ret_order = [];
		Promise.all(product.map(theProduct => {
			return Order.findAll({
				where: {
					productId: theProduct.id,
				},
				order: [
					["boughtDate", "DESC"]
				],
			}).then((order) => {
				for (var i = 0; i < order.length; i++) {
					let the_order = {
						id: order[i].id,
						boughtDate: order[i].boughtDate,
						cost: order[i].cost,
						destination: order[i].destination,
						quantity: order[i].quantity,
						status: order[i].status,
						location: order[i].location,
						remarks: order[i].remarks,
						product_name: theProduct.name,
						images: theProduct.images,
						type: theProduct.product_type,
						product_price: theProduct.cost,
					}
					if (theProduct.product_type == "Goods") {
						the_order.qty = "block";
					} else {
						the_order.qty = "none";
					}

					if (order[i].status == "DELIVERED") {
						the_order.delivered = "disabled";
						the_order.deliveredA = "none";
					} else {
						the_order.delivered = "";
						the_order.deliveredA = "block";
					}

					if (order[i].status == "COMPLETED") {
						the_order.completed = "disabled";
						the_order.completedA = "none";
					} else {
						the_order.completed = "";
						the_order.completedA = "block";
					}

					if (order[i].status == "CANCELLED") {
						the_order.cancelled = "disabled";
						the_order.cancelledA = "none";
					} else {
						the_order.cancelled = "";
						the_order.cancelledA = "block";
					}

					ret_order.push(the_order);
				}
			})
		})).then(() => {
			res.render('user/manageOrder', {
				order: ret_order,
			})
		})
	})

})

// Send OTP
router.get("/perInfo", isLoggedIn, (req, res) => {
	let user = req.user;

	if (req.user.phoneNo != undefined) {  // fill out personal information
		let no = user.phoneNo.split(' ');
		user.phoneNo = no[0] + no[1];
		
		res.render('user/perInfo', {
			user,
		})
	} else {
		alertMessage(res, 'info', 'Please fill out your information.', 'fas fa-exclamation-circle', true);
		res.redirect('/showEditProfile/' + req.user.id);
	}
	
})

router.post("/perInfo", isLoggedIn, (req, res) => {
	let phoneNumber = req.body.number;
	console.log('Phone number is: ' + phoneNumber);
	nexmo.verify.request({number: phoneNumber, brand: 'Likey'}, (err, result) => {
	  if(err) {
		res.sendStatus(500);
	  } else {
		let requestId = result.request_id;
		if(result.status == '0') {
		  res.render('user/verify', {requestId: requestId}); // Success! Now, have your user enter the PIN
		} else {
		  res.status(401).send(result.error_text);
		}
	  }
	});
})

router.get("/perInfoVerify", isLoggedIn, (req, res) => {
	
	res.render('user/verify', {})
	
})

router.post('/verify', (req, res) => {
	let pin = req.body.pin;
	let requestId = req.body.requestId;
	console.log(pin);
	console.log(requestId);
   
	nexmo.verify.check({request_id: requestId, code: pin}, (err, result) => {
	  if(err) {
		// handle the error
		res.send('Error');
		console.log(err);
	  } else {
		if(result && result.status == '0') { // Success!
			let token; 
			jwt.sign(requestId, 's3cr3Tk3y', (err, jwtoken) => {
				if (err) console.log('Error generating Token: ' + err);
					token = jwtoken;
					console.log("Generating: " + token);
					res.redirect(`https://localhost:5000/orgSignup/${token}`);
					//console.log(`https://localhost:5000/orgSignup/${token}`);
			});
			//res.redirect('/orgSignup/'+token);
			// res.redirect(`https://localhost:5000/orgSignup/${token}`);
			// console.log(`https://localhost:5000/orgSignup/${token}`);
		} else {
		  // handle the error - e.g. wrong PIN
		//   console.log(result);
		//   console.log(result.status);
		  console.log("Wrong PIN");
		  alertMessage(res, 'info', 'Wrong PIN', 'fas fa-exclamation-circle', true);
		  
		}
	  }
	});
  });

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

function selectType(user) {
	let g = user.org_type
	if (g === null) {
		return ''
	}
	if (g.toLowerCase() == 'goods') {
		user.goods = 'selected';
	}
	if (g.toLowerCase() == 'services') {
		user.services = 'selected';
	} 
	if (g.toLowerCase() == 'goods_services') {
		user.goods_services = 'selected';
	} 
}

function selectTypeOrder(order) {
	let g = order.status;
	if (g === null) {
		return ''
	}
	if (g.toLowerCase() == 'pending') {
		order.pending = 'selected';
	} else {
		order.pending = '';
	}
	if (g.toLowerCase() == 'delivering') {
		order.delivering = 'selected';
	} else {
		order.delivering = '';
	}
	if (g.toLowerCase() == 'delivered') {
		order.delivered = 'selected';
	} else {
		order.delivered = '';
	}
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/showLogin');
}

function userOrder(req, res, next) {
	if (req.isAuthenticated()) {
		Product.findAll({
			where: {
				userId: req.user.id,
			}
		}).then((product) => {
			ret_order = [];
			Promise.all(product.map(theProduct => {
				return Order.findAll({
					where: {
						productId: theProduct.id,
					},
					order: [
						["id", "DESC"]
					],
				}).then((order) => {
					for (var i = 0; i < order.length; i++) {
						ret_order.push(order[i].id);
					}
				})
			})).then(() => {
				if (ret_order.length > 0) {
					for (var i = 0; i < ret_order.length; i++) {
						if (req.params.id == ret_order[i]) {
							return next();
						}
					}
					alertMessage(res, 'info', 'Unauthorized', 'fas fa-exclamation-circle', true);
					res.redirect('/manageOrder');
				}
				alertMessage(res, 'info', 'Unauthorized', 'fas fa-exclamation-circle', true);
				res.redirect('/manageOrder');
			})
		})	
	}
}

function isOrg(req, res, next) {
	if(req.isAuthenticated()){
		if (req.user.is_org) {
			return next();
		}
	}
	
	alertMessage(res, 'info', 'Must be a Vendor!', 'fas fa-exclamation-circle', true);
	res.redirect('/perInfo');

}

module.exports = router;
