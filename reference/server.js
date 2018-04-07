// Define nodejs environment

process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Express configuration

if(process.env.NODE_ENV == 'test') {
    require('dotenv').config({path:'./.test'});
} else {
    require('dotenv').config();
}


var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    db = mongoose(),
    api = express();
api.use(function (err, req, res, next) {
  
//    res.status(500).json(err);
next();
});


api.use(function (err, req, res, next) {
  
    res.status(500).json(err);
});


process.on('uncaughtException', function (err) {
    console.log(err)
});

api.listen(3000);
module.exports = api;

console.log("API Server running at port 3000");
