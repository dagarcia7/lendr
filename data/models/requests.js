var mongoose = require('mongoose');
var loanSchema = require('../schemas/loan');

/*
* Defining the Request Model to be used in the app. This model will use the Loan Schema.
*/
var Request = mongoose.model('Request', loanSchema);

module.exports = Request;