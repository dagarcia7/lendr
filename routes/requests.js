var express = require('express');
var User = require("../data/models/users");
var Request = require("../data/models/requests");
var router = express.Router();
var Response = require('../utils/response');

//POST a new request
router.post('/', Response.restrict, function(req, res) {
    User.findById(req.session.userId, function(err, doc) {
        if (err) {
            Response.sendErr(res, 404, 'Resource not found');
        } else {
            requ = new Request({
                borrower: req.body.borrower,
                item: req.body.item,
                incentive: req.body.incentive,
            }).save(function(err, docs) {
                if (err) {
                    Response.sendErr(res, 500, 'An unknown error occurred.');
                } else {
                    Response.sendSuccess(res, {
                        request: docs
                    });
                }
            });
        }
    });
});

//GET all of the requests that someone has made to this user
router.get('/', Response.restrict, function(req, res) {
    var user = req.session.userId;
    Request.find({}).populate('item borrower').exec(function(err, docs) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            var reqs = [];
            docs.forEach(function(request) {
                if (String(request.item.owner) == String(user)) {
                    reqs.push(request);
                }
            });
            Response.sendSuccess(res, {
                requests: reqs
            });
        }
    });
});

//DELETE a specific request
router.delete('/:id', Response.restrict, function(req, res) {
    Response.requestForDelete(req, res, Request, {
        _id: req.params.id
    });
});

//DELETE a specific request given the item Id
router.delete('/item/:itemId', Response.restrict, function(req, res) {
    Request.remove({item: req.params.itemId}, function (err, doc) {
        if (err) {
			Response.sendErr(res, 404, 'Resource not found.');
		}
		else {
			Response.sendSuccess(res, {num : doc});
		}
    });
});

module.exports = router;
