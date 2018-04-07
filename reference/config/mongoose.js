
var mongoose = require('mongoose'),
    schema = mongoose.Schema;

module.exports = function () {

    var db = mongoose.connect( process.env.db);
    var connection = mongoose.connection;
    mongoose.Promise = require('q').Promise;
    connection.on('error', function (err) {
        console.log('mongodb connection error: %s', err);
        process.exit();
    });
    connection.on('open', function () {
        console.log('Successfully connected to mongodb');

    });

    require('../api/user/user.model');

    return db;

};
