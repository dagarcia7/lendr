var express = require('express');
var router = express.Router();
var User = require("../data/models/users");
var Return = require("../data/models/returns");
var Response = require('../utils/response');

//POST a new return
router.post('/', Response.restrict, function(req, res) {
    User.findById(req.session.userId, function(err, doc) {
        var newReturn = new Return({
            borrower: doc,
            item: req.body.item,
            incentive: req.body.incentive,
            borRating: req.body.borRating
        }).save(function(err, docs) {
            if (err) {
                Response.sendErr(res, 500, 'An unknown error occurred.');
            } else {
                Response.sendSuccess(res, {
                    returns: docs
                });
            }
        });
    });
});

//GET all of the returns that someone has made to this user
router.get('/', Response.restrict, function(req, res) {
    var user = req.session.userId;
    Return.find({}).populate('item borrower').exec(function(err, docs) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            var rets = [];
            docs.forEach(function(ret) {
                if (String(ret.item.owner) == String(user)) {
                    rets.push(ret);
                }
            });
            Response.sendSuccess(res, {
                returns: rets
            });
        }
    });
});

//GET a return from an item Id
router.get('/:itemId', Response.restrict, function(req, res) {
    var item = req.params.itemId;
    Return.find({item: item}).populate('item borrower').exec(function(err, ret) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Response.sendSuccess(res, {
                returns: ret
            });
        }
    });
});

// DELETE a specific return
router.delete('/:id', Response.restrict, function(req, res) {
    Response.requestForDelete(req, res, Return, {
        _id: req.params.id
    });
});

module.exports = router;
