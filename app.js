const fs = require('fs')
const https = require('https')
const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');
const MapboxClient = require('mapbox');
const MySQLStore = require('express-mysql-session');
const db = require('./config/db');
const passport = require('passport');
const methodOverride = require('method-override');
const keys = require('./config/keys');

//Bring in database connection
const likeyDB = require('./config/DBConnection');
// Connects to MySQL databse
likeyDB.setUpDB(false);

// Passport Config
const authenticate = require('./config/passport');
authenticate.localStrategy(passport);

const mainRoute = require('./routes/main');
const userRoute = require('./routes/user');
const videoRoute = require('./routes/video');

// Bring in Handlebars Helpers here
// Copy and paste this statement only!!
const {formatDate} = require('./helpers/hbs');
const {radioCheck} = require('./helpers/hbs');
const {checkUserType} = require('./helpers/hbs');
const {ifEqual} = require('./helpers/hbs');
const {ifEqualModal} = require('./helpers/hbs');

const app = express();

app.engine('handlebars', exphbs({
	helpers: {
		formatDate:formatDate,	
		radioCheck:radioCheck,
		checkUserType,
		ifEqual,
		ifEqualModal
	},

	defaultLayout: 'main' 
}));
app.set('view engine', 'handlebars');

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());


app.post("/totp-secret", (request, response, next) => {
    var secret = Speakeasy.generateSecret({ length: 20 });
    response.send({ "secret": secret.base32 });
});


// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// Express session middleware - uses MySQL to store session
app.use(session({
	key: 'likey',
	secret: 'likey_secret',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		checkExpirationInterval: 900000,
		expiration: 900000,
	}),
	resave: false,
	saveUninitialized: false,
}));

// Initilize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Instantiate connect flash
app.use(flash());
app.use(FlashMessenger.middleware);

app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Place to define global variables - not used in practical 1
app.use(function (req, res, next) {
	next();
});

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

app.use('/', mainRoute); 
app.use('/video', videoRoute)
app.use('/user', userRoute)

const httpsOptions = {
	cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
	key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}

const port = 5000;

https.createServer(httpsOptions, app)
	.listen(port, () => {
		console.log(`Server started on port ${port}`);
});