var mongoose = require('mongoose');

/*
 * Defining the User Schema.
 * This schema will define how the User collection will be organized.
 */
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    trustability: {
        transactions:{
            type: Number
        },
        value: {
            type: Number
        }
    }
});

module.exports = UserSchema;
