var mongoose = require('mongoose');

/*
* Defining the Loan Schema.
* This schema will define how the Loan collection will be organized.
*/
var LoanSchema = new mongoose.Schema({
	borrower: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
	item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required:true},
	incentive: {type: String, required: false},
	borRating: {type: Number, required: false}
});

module.exports = LoanSchema;
