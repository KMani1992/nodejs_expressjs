


var userController = require('./user.controller');


module.exports = function (api) {


    api.route('/users')
        .get( userController.getUsers)
        .post( userController.createUser);
        
    api.route('/users/:userId')
    .get( userController.getUserById);

    // api.route('/users/:userId/:id')
    // .get( userController.getUserById);

    api.param('userId', userController.getById);
};
