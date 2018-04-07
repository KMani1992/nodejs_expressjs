'use strict';

var mongoose = require('mongoose'), 
  //   config = require('../../config/config.js'),
     schema = mongoose.Schema;


var userSchema = new schema({

    firstName: {
        type: String,
        match: [/^[a-zA-Z']{1,}[\ ]{0,1}[a-zA-Z']{0,}$/, "FirstName should not allow special characters"],
        validate: [function (firstName) {
            return firstName.length <= 25;
        }, 'FirstName length must be less than 25 characters']
    },
    lastName: {
        type: String

    },
    email: {
        type: String,
        match: [/^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/, "Email is not valid"]
    },
    password: { type: String },
    role:{type:String},
    status: { type: String, enum: ['active', 'locked', 'inactive'], default: 'active' },
    createdBy: { type: schema.ObjectId, ref: 'users' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date }
});

userSchema.pre('save', function (next) {

    
 //   var self = this;
    this.constructor.findOne({
        email: this.email
    }, function (err, result) {
        var error = new Error();
        if (err) {
            next(err);
            return;
        }
        if (result) {
            error.name = 'EAUS01';
            next(error);
            return;

        }
        next();
    });

});


userSchema.set('toObject', { virtuals: true });

if (!userSchema.options.toObject)
    userSchema.options.toObject = {};


userSchema.index({ email:1 }, { unique: true, sparse: true });

userSchema.options.toObject.transform = function (doc, ret, options) {
    ret.success = true;
    delete ret.endDate;
    delete ret._id;
    delete ret.__v;
};

mongoose.model('user', userSchema);

