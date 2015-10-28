var mongoose = require('mongoose');

/*
* Defining the Item Schema.
* This schema will define how the Item collection will be organized.
*/
var itemSchema = new mongoose.Schema({
	description: {type: String, required:true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
	available: {type: Number}
});

module.exports = itemSchema;
