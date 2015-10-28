var mongoose = require('mongoose');
var itemSchema = require('../schemas/item');

/*
* Defining the Item Model to be used in the app. This model will use the corresponding Schema.
*/
var Item = mongoose.model('Item', itemSchema);

module.exports = Item;