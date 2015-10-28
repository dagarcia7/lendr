var mongoose = require('mongoose');
var loanSchema = require('../schemas/loan');

/*
* Defining the Return Model to be used in the app. This model will use the Loan Schema.
*/
var Return = mongoose.model('Return', loanSchema);

module.exports = Return;