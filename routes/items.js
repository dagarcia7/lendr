var express = require('express');
var router = express.Router();
var Item = require("../data/models/items");
var Loan = require("../data/models/loans");
var Response = require('../utils/response');
var Request = require('../data/models/requests');
var Return = require('../data/models/returns');
var Fuse = require('../utils/fuse');

// POST a new item to the database belonging to the active user
router.post('/', Response.restrict, function(req, res) {
    var owner = req.session.userId;
    var description = req.body.description;
    
    if (typeof description === "object") {
		description = JSON.stringify(description);
	}
    
    var newItem = new Item({
        description: description,
        owner: owner,
        available: 1
    });
    newItem.save(function(err, item) {
        if (err) {
            return Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            return Response.sendSuccess(res, {
                item: item
            });
        }
    });
});

//GET all of the items
router.get('/', Response.restrict, function(req, res) {
    var user = req.session.userId;
    Item.find({}, function(err, items) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            items.forEach(function(item, index, array) {
                var owned = (String(item.owner) === String(req.session.userId));
                array[index] = {
                    "item": item,
                    "owned": owned
                }
            });
            Response.sendSuccess(res, {
                items: items
            });
        }
    });
});

//GET all of the items that the active user owns
router.get('/owned', Response.restrict, function(req, res) {
    var user = req.session.userId;
    Item.find({
        owner: user
    }, function(err, items) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Response.sendSuccess(res, {
                items: items
            });
        }
    });
});

//GET all of the items the user is currently borrowing
router.get('/borrowed', Response.restrict, function(req, res) {
    var user = req.session.userId;
    Loan.find({
            borrower: user
        })
        .lean()
        .populate({
            path: 'item'
        })
        .exec(function(err, docs) {
            var options = {
                path: 'item.owner',
                model: 'User'
            };
            if (err) {
                Response.sendErr(res, 500, 'An unknown error occurred.');
            } else {
                Loan.populate(docs, options, function(err, loans) {
                    if (err) {
                        Response.sendErr(res, 500, 'An unknown error occurred.');
                    } else {
                        Return.find({}, "item", function(err, returns) {
                            if (err) {
                                Response.sendErr(res, 500, 'An unknown error occurred.');
                            } else {
                                var items = [];
                                var returnedItems = [];
                                returns.forEach(function(ret) {
                                    returnedItems.push("" + ret.item);
                                });
                                loans.forEach(function(loan) {
                                    if (returnedItems.indexOf("" + loan.item._id) === -1) {
                                        items.push({
                                            item: loan.item,
                                            incentive: loan.incentive,
                                            returned: false
                                        });
                                    } else {
                                        items.push({
                                            item: loan.item,
                                            incentive: loan.incentive,
                                            returned: true
                                        });
                                    }
                                });
                                Response.sendSuccess(res, {
                                    items: items
                                });
                            }

                        });

                    };

                });
            }
        });
});

//GET all of the items the user is currently lending
router.get('/lent', Response.restrict, function(req, res) {
    var user = req.session.userId;
    Loan.find({}).populate('item').exec(function(err, loans) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            var items = [];
            loans.forEach(function(loan) {
                if (loan.item.owner == user._id) {
                    items.push(loan.item);
                }
            });
            Response.sendSuccess(res, {
                items: items
            });
        }
    });
});

//GET all of the items that match the search made
router.get('/search', Response.restrict, function(req, res) {
    var options = {
        keys: ['description']
    }
    Item.find({
        owner: {
            $nin: [req.session.userId]
        }
    }).populate('owner').exec(function(err, items) {
        var params = req.query.search;
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Request.find({
                borrower: req.session.userId
            }, function(err, requests) {
                if (err) {
                    Response.sendErr(res, 500, 'An unknown error occurred.');
                } else {
                    var requestedItems = [];
                    requests.forEach(function(reqs) {
                        requestedItems.push("" + reqs.item);
                    });
                    var f = new Fuse(items, options); //Used Fuse } library
                    var results = f.search(params);
                    var available = [];
                    for (var i in results) {
                        if (results[i].available % 2 === 1) {
                            available.push(results[i]);
                        }
                    }
                    var availableItems = [];
                    available.forEach(function(item) {
                        if (requestedItems.indexOf("" + item._id) === -1) {
                            availableItems.push({
                                item: item,
                                requested: false
                            });
                        } else {
                            availableItems.push({
                                item: item,
                                requested: true
                            });
                        }
                    });
                    Response.sendSuccess(res, {
                        items: availableItems
                    });
                }
            });
        }
    });
});

//GET an item by id
router.get('/:itemId', Response.restrict, function(req, res) {
    var itemId = req.params.itemId;
    Item.findOne({
        _id: itemId
    }, function(err, item) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Response.sendSuccess(res, {
                item: item
            });
        }
    });
});

//GET a specific loan by its item id
router.get('/:itemId/loans', Response.restrict, function(req, res) {
    Loan.find({
        item: req.params.itemId
    }, function(err, doc) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Response.sendSuccess(res, {
                loan: doc
            });
        }
    });
});

//GET a return from an item Id
router.get('/:itemId/returns', Response.restrict, function(req, res) {
    var item = req.params.itemId;
    Return.find({
        item: item
    }).populate('item borrower').exec(function(err, ret) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Response.sendSuccess(res, {
                returns: ret
            });
        }
    });
});

//GET a request from an item Id
router.get('/:itemId/requests', Response.restrict, function(req, res) {
    Request.find({
        item: req.params.itemId
    }, function(err, doc) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            Response.sendSuccess(res, {
                requests: doc
            });
        }
    });
});

//PUT an item's description
router.put('/:itemId/description', Response.restrict, function(req, res) {
    var description = req.body.description;
    
    if (typeof description === "object") {
		description = JSON.stringify(description);
	}
    
    var itemId = req.params.itemId;
    Item.findOneAndUpdate({
        _id: itemId
    }, {
        $set: {
            "description": description
        }
    }, function(err, item) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        }
        if (!item) {
            Response.sendErr(res, 404, 'Item not found');
        } else {
            Response.sendSuccess(res, {
                item: item
            });
        }
    });
});

//PUT an item's availability
router.put('/:itemId/availability', Response.restrict, function(req, res) {
    var itemId = req.params.itemId;
    Item.findOneAndUpdate({
        _id: itemId
    }, {
        $inc: {
            "available": 1
        }
    }, function(err, item) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        }
        if (!item) {
            Response.sendErr(res, 404, 'Item not found');
        } else {
            Response.sendSuccess(res, {
                item: item
            });
        }
    });
});

//DELETE an item and all associated loans, returns and requests
router.delete('/:itemId', Response.restrict, function(req, res) {
    Loan.remove({
        item: req.params.itemId
    }, function(err, doc) {
        if (err) {
            Response.sendErr(res, 500, 'An unknown error occurred.');
        } else {
            if (doc === 0) {
                Request.remove({
                    item: req.params.itemId
                }, function(err2, doc2) {
                    if (err2) {
                        Response.sendErr(res, 500, 'An unknown error occurred.');
                    } else {
                        Response.requestForDelete(req, res, Item, {
                            _id: req.params.itemId
                        });
                    }
                });
            } else {
                Return.remove({
                    item: req.params.itemId
                }, function(err3, doc3) {
                    if (err3) {
                        Response.sendErr(res, 500, 'An unknown error occurred.');
                    } else {
                        Response.requestForDelete(req, res, Item, {
                            _id: req.params.itemId
                        });
                    }
                });
            }
        }
    });
});


module.exports = router;
