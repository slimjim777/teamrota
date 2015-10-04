'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var ensureAuthenticated = require('../utils/utils').ensureAuthenticated;
var sql = require('../utils/query');
var requests = require('then-request');


// GET the /rota URL
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('rota', {API_URL: process.env.API_URL});
});

router.get('/token', ensureAuthenticated, function(req, res, next) {
    // Return the JWT token for the API access
    res.json({
        token: req.session.token,
        role_rota: req.session.user.role_rota,
        role_music: req.session.user.role_music,
        apiUrl: process.env.API_URL
    });
});

router.put('/person/:user_id', ensureAuthenticated, function(req, res, next) {
    // Update the user
    var u = req.body;

    var options = {
        headers: {Authorization: 'Bearer ' + req.session.token},
        json: u
    };

    pg.connect(sql.databaseUrl(), function(err, client, done) {
        var query = client.query(sql.updateUser(), [parseInt(u.user_id), u.email, u.firstname, u.lastname, u.active,
            u.user_role]);

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();

            // Update the rota person
            requests('PUT', process.env.API_URL.concat('/api/people/', u.user_id), options).then(function(response) {});
            return res.json({success: true});
        });
    });


});

module.exports = router;
