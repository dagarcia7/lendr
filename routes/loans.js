var express = require('express');
var router = express.Router();
var Loan = require("../data/models/loans");
var Response = require('../utils/response');

//POST a new loan
router.post('/', Response.restrict, function(req, res) {
    requ = new Loan({
        borrower: req.body.borrower,
        item: req.body.item,
        incentive: req.body.incentive
    }).save(function(err, docs) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Response.sendSuccess(res, {
                request: docs
            });
        }
    });
});

//DELETE a specific loan
router.delete('/:id', Response.restrict, function(req, res) {
    Response.requestForDelete(req, res, Loan, {
        _id: req.params.id
    });
});

module.exports = router;
