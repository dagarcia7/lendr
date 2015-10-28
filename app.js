var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var mongooseSession = require('mongoose-session');
var helmet = require('helmet');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('Fl_YOK66hOobbKv-4GNz0A');

var routes = require('./routes/index');
var items = require('./routes/items');
var users = require('./routes/users');
var loans = require('./routes/loans');
var requests = require('./routes/requests');
var returns = require('./routes/returns');

var app = express();

var connection_string = 'localhost/lendr';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/lendr';
}

mongoose.connect('mongodb://' + connection_string);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
//db.once('open', function callback() {});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true,
    store: mongooseSession(mongoose)
}));

app.use('/items', items);
app.use('/users', users);
app.use('/loans', loans);
app.use('/requests', requests);
app.use('/returns', returns);
app.use('/', routes);

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

// We want to model our authentication system based off of the sample app
// that was provided for us.
app.use(function(req, res, next) {
    if (req.session.user) {
        users.findOne({
            _id: req.session.user._id
        }, function(err, user) {
            if(user) {
                req.currentUser = user;
            } else {
                delete req.session.user;
            }
            next();
        });
    } else {
        next();
    }
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
           process.env.OPENSHIFT_NODEJS_IP);
