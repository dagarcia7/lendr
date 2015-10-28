var express = require('express');
var router = express.Router();
var User = require("../data/models/users");
var Loan = require('../data/models/loans');
var Return = require('../data/models/returns');
var bcrypt = require('bcrypt');
var Response = require('../utils/response');

var encryptPassword = function(password, cb) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            cb(hash);
        });
    });
};

var comparePassword = function(password, pwhash, cb) {
    bcrypt.compare(password, pwhash, function(err, pwmatch) {
        cb(pwmatch);
    });
};

var isLoggedInOrInvalidBody = function(req, res) {
    if (req.session.userId) {
        Response.sendErr(res, 403, 'There is already a user logged in.');
        return true;
    } else if (!(req.body.email && req.body.password)) {
        Response.sendErr(res, 400, 'Email or password not provided.');
        return true;
    }
    return false;
};

var updateTrustability = function (trust, newVal){
    var counter = trust.transactions + 1;
    var val = trust.value * (counter-1);
    var val1 = val + newVal;
    var val2 = val1/counter;
    var newTrust = {transactions: counter, value: val2};
    return newTrust;
};

//LOGIN
router.post('/login', function (req, res) {
    if (isLoggedInOrInvalidBody(req, res)) {
        return;
    }
    var email = req.body.email.toLowerCase();
    if (typeof email === "object") {
		email = JSON.stringify(email);
	}
    
    var password = req.body.password;
    if (typeof password === "object") {
		password = JSON.stringify(password);
	}
    
    User.findOne({ email: email}, function(err, user) {
        if (user) {
            comparePassword(password, user.password, function(pwmatch) {
                if (pwmatch) {
                    req.session.userId = user._id;
                    var userSimple = {
                        name: user.name,
                        email: user.email,
                        location: user.location,
                    };
                    Response.sendSuccess(res, {
                        user: userSimple
                    });
                } else {
                    Response.sendErr(res, 403, 'Username or password invalid.');
                }
            });
        } else {
            Response.sendErr(res, 403, 'Username or password invalid.');
        }
    });
});

//LOGOUT
router.post('/logout', Response.restrict, function (req, res) {
    if (req.session.userId) {
        delete req.session.userId;
        Response.sendSuccess(res);
    } else {
        Response.sendErr(res, 403, 'There is no user currently logged in.');
    }
});

//POST a new user (sign up)
router.post('/', function (req, res) {
    
    var email = req.body.email.toLowerCase();
    if (typeof email === "object") {
		email = JSON.stringify(email);
	}
    
    var name = req.body.name;
    if (typeof name === "object") {
		name = JSON.stringify(name);
	}
    
    var location = req.body.location;
    if (typeof location === "object") {
		location = JSON.stringify(location);
	}
    
    User.findOne({email: email}, function (err, user) {
        if (user) {
            Response.sendErr(res, 400, 'An account associated with that email already exists.');
        } else {
            encryptPassword(req.body.password, function (pwhash) {
                var user = new User({
                    name: name,
                    email: email,
                    password: pwhash,
                    location: location,
                    trustability: {
                        transactions: 0,
                        value: 0
                    }
                }).save(function (err, result) {
                    if (err) {
                        // 11000 and 11001 are MongoDB duplicate key error codes
                        if (err.code && (err.code === 11000 || err.code === 11001)) {
                            Response.sendErr(res, 400, 'That email is already taken!');
                        } else {
                            Response.sendErr(res, 500, 'An unknown DB error occurred.');
                        }
                    } else {
                        req.session.userId = result._id;
                        var userSimple = {
                            name: result.name,
                            email: result.email,
                            location: result.location
                        };
                        Response.sendSuccess(res, {
                            user: userSimple
                        });
                    }
                });
            });
        }
    });
});

//GET current logged in user
router.get('/current', function (req, res) {
    if (req.session.userId) {
        Response.sendSuccess(res, {
            loggedIn: true,
            user: req.session.userId
        });
    } else {
        Response.sendSuccess(res, {
            loggedIn: false
        });
    }
});

//GET a specific user
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function(err, doc) {
        if (err) {
            Response.sendErr(res, 404, 'Resource not found.');
        } else {
            var userSimple = { // further protection of user's password
                name: doc.name,
                email: doc.email,
                location: doc.location,
                trustability: doc.trustability
            };
            Response.sendSuccess(res, {
                user: userSimple
            });
        }
    });
});

//PUT new credentials of active user
router.put('/:id/credentials', Response.restrict, function (req, res) {
    if (req.body.password.length==0){ // if new password was not provided, update only name and location
        User.findOneAndUpdate({_id: req.params.id},
                              {$set : {'name': req.body.name, 'location': req.body.location}})
        .exec(function (err, doc) {
            if (err) {
                Response.sendErr(res, 404, 'Resource not found.');
            } else {
                Response.sendSuccess(res, {user: doc});
            }
        });
    } else { // if password was provided, update all fields
        encryptPassword(req.body.password, function(pwhash) {
            User.findOneAndUpdate({_id: req.params.id},
                                  {$set : {'name': req.body.name, 'location': req.body.location, 'password': pwhash}})
            .exec(function (err, doc) {
                if (err) {
                    Response.sendErr(res, 404, 'Resource not found.');
                } else {
                    Response.sendSuccess(res, {user: doc});
                }
            });
        });
    }
});

//PUT trustability of lender and borrower
router.put('/:id/trustability', Response.restrict, function (req, res) {
    var lenRating = Number(req.body.lenRating);
    Return.findById(req.body.returnId, function (err, docs) { // return
        if (err) {
            Response.sendErr(res, 404, 'Resource not found.');
        } else {
            User.findById(docs.borrower, function (err, borr) { // borrower
                if (err) {
                    Response.sendErr(res, 404, 'Resource not found.');
                } else { // update borrower's trustability
                    var borrTrust = updateTrustability(borr.trustability, lenRating);
                    User.update({_id:docs.borrower}, {$set: {trustability: borrTrust}})
                    .exec(function (err, doc) {
                        if (err) {
                            Response.sendErr(res, 404, 'Resource not found.');
                        } else {
                            User.findById(req.params.id, function (err, lend) { // lender
                                if (err) {
                                    Response.sendErr(res, 404, 'Resource not found.');
                                } else { // update lender's trustability
                                    var lenTrust = updateTrustability(lend.trustability, Number(docs.borRating));
                                    User.update({_id:req.params.id}, {$set: {trustability: lenTrust}})
                                    .exec(function (err, doc2) {
                                        if (err) {
                                            Response.sendErr(res, 404, 'Resource not found.');
                                        } else {
                                            Response.sendSuccess (res, {user: lend});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
