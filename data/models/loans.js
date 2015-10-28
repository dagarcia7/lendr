var mongoose = require('mongoose');
var loanSchema = require('../schemas/loan');

/*
* Defining the Loan Model to be used in the app. This model will use the corresponding Schema.
*/
var Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;