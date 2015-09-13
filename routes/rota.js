'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');
var ensureAuthenticated = require('../utils/utils').ensureAuthenticated;


// GET the /rota URL
router.get('/', ensureAuthenticated, function(req, res, next) {
    //res.sendFile(path.normalize(__dirname + '/../index.html'));
    res.render('rota', {API_URL: process.env.API_URL});
});

router.get('/token', ensureAuthenticated, function(req, res, next) {
    // Return the JWT token for the API access
    res.json({
        token: req.session.token,
        apiUrl: process.env.API_URL
    });
});

module.exports = router;
