


//var config = require('./config'),
var express = require('express'),
bodyParser = require('body-parser'),
morgan = require('morgan');

module.exports = function () {

var api = express();
// configure body-parser
api.use(bodyParser.urlencoded({strict: true, extended: true}));
api.use(bodyParser.json({limit: '50mb'}));
// configure morgan

api.use(morgan('dev'));
api.get('/', function (req, res) {
    res.status(200).send("Welcome to API");
});

// error handler
api.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

var router = express.Router();
// configure routes
require('../api/user/user.route')(router);

api.use(router);
return api;
};
