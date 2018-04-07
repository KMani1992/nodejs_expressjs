    var User = require('mongoose').model('user');

    exports.getUsers = function (req, res, next) {
        User.find({})
        .limit(10)
        .sort({_id:-1})
        .then(function(response){
            if(!response){
                throw {name:""}
            }
            res.status(200).json(response);
        }).catch(function(err){
            next(err);
        })
    }

    exports.createUser = function (req, res, next) {
        var user = new User(req.body)
        user.save()
        .then(function(userObject){
            res.status(201).json(userObject);
        })
        .catch(function(err){

            res.status(400).json(err);
        })
    }

    exports.getUserById = function (req, res, next) {
        
        res.status(200).json(req.user);
    }

    exports.getById = function (req, res, next, id) {
        User.findById(id)
        .then(function(response){

            req.user = response;
            next();
        })
    }


