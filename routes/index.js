var express = require('express');
var router = express.Router();
var Response = require('../utils/response');

//GET home page.
router.get('/', function(req, res) {
    if (!req.session.userId) {
        res.render('index', {
            title: '',
            user: false,
            search: false,
            profile: false
        });
    } else {
        res.redirect('profile');
    }
});

//GET search page.
router.get('/search', Response.restrict, function(req, res) {
    if (req.session.userId) {
        res.render('search', {
            title: '| Search',
            user: req.session.userId,
            search: true,
            profile: false
        });
    } else {
        res.redirect('/');
    }
});

//GET user's profile page
router.get('/profile', Response.restrict, function(req, res) {
    if (req.session.userId) {
        res.render('profile', {
            title: '| Profile',
            user: req.session.userId,
            search: false,
            profile: true
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
