var mongoose = require('mongoose');
var userSchema = require('../schemas/user');

/*
* Defining the User Model to be used in the app. This model will use the corresponding Schema.
*/
var User = mongoose.model('User', userSchema);

module.exports = User;