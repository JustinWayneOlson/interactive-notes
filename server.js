var express = require('express');
var path = require('path')
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var flash = require('connect-flash')
var passport = require('passport');

var fileHandler = require('./app/file-handler');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');


mongoose.connect(configDB.url);

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({secret: 'supersecretsessionsecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes.js')(app, passport, fileHandler);
require('./app/passport')(passport);

app.listen(port);
console.log('Server running on port ' + port);
