var express = require('express'),
	swig = require('swig'),
	logger = require('morgan'),
	bodyParser = require('body-parser');
	fs = require('fs');
	https = require('https');
	session = require('express-session')
	cookieParser = require('cookie-parser')
	flash = require('connect-flash')

var app = express();

app.set('views', __dirname + '/pages');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({cache: false});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(session({
    // resave is only necessary for certain session stores
    // in our case we shouldn't need it
    resave: false,
    // by setting saveUninitialized to false
    // we will be preventing the session from being created
    // until it has data associated with it
    saveUninitialized: false,
    // the secret encrypts the session id
    secret: 'tongiscool',
    cookie: {
        // this keeps the session cookie from being sent over HTTP
        // otherwise it would be easy to hijack the session!
        secure: false
    }
}));


app.use(function (req, res, next) {
    if (!req.session.counter) req.session.counter = 0;
    console.log('counter', ++req.session.counter);
    next();
});



app.use(require('./routes'));


app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function (err, req, res, next) {
	err.status = err.status || 500;
	res.render('error', {error: err});
});

var port = 1337;
app.listen(port, function () {
	console.log('Server ready on port', port);
});


// var options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };



// console.log(options.key.toString());
// console.log(options.cert.toString());


// https.createServer(options, app).listen(1337, function () {
// 	console.log('Server ready on port', port);
// });
