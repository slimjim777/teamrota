'use strict';
var pg = require('pg');
var async = require('async');
var sql = require('../utils/query');
var jwt = require('jsonwebtoken');
var requests = require('then-request');
var SESSION_MAX_AGE_mins = 1440;


var utils = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },

    authenticate: function(request, profile) {
        async.waterfall([
            // First, authenticate the user using the email address
            function(callback) {
                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query(sql.userForEmail(), [profile.email]);

                    var records = [];
                    query.on('row', function(row) {
                        records.push(row);
                    });

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                        var user = null;
                        var error = null;
                        if (records.length > 0) {
                            user = {
                                userId: records[0].id,
                                email: profile.email,
                                name: profile.displayName,
                                role_rota: records[0].role_rota,
                                role_music: records[0].role_music
                            };
                            request.session.user = user;
                            request.session.save(function() {
                                client.end();
                                callback(error, request, user);
                            });
                        } else {
                            // TODO: redirect to the error page
                            request.session = null;
                            error = 'User not found';
                            client.end();
                            callback(error, request, user);
                        }

                    });
                });
            },

            // Second, get the events the user can administrate
            function(request, user, callback) {
                if (!user) {
                    callback('User not found', null);
                }

                // Create a one-time auth token to call the rota API
                var token = jwt.sign(
                    user, process.env.APP_SECRET, { expiresInMinutes: 1 });
                var options = {headers: {Authorization: 'Bearer ' + token}};

                // Call the rota API to get the permissions
                requests('GET', process.env.API_URL + '/api/people/permissions', options).then(function(response) {
                    if (response.statusCode === 200) {
                        // Add the rota permissions to the session
                        var data = JSON.parse(response.getBody().toString());
                        request.session.user.rota_permissions = data.rota_permissions;

                        // Generate a token with the user details
                        request.session.token = jwt.sign(
                            request.session.user, process.env.APP_SECRET, { expiresInMinutes: SESSION_MAX_AGE_mins });

                        // Save the updated session
                        request.session.save(function() {
                            callback(null, request, user);
                        });
                    } else {
                        callback('Permissions call error: ' + response.statusCode, request, user);
                    }
                })
                .catch(function(response) {
                        callback('Permissions call error: ' + response.statusCode, request, user);
                    });
            },

            // Third, update the last login of the user
            function(request, user, callback) {
                if (!user) {
                    callback('User not found', null);
                }

                pg.connect(sql.databaseUrl(), function(err, client, done) {
                    var query = client.query(sql.updateLastLogin(), [user.userId]);

                    // After all data is returned, close connection and return results
                    query.on('end', function() {
                            client.end();
                            callback(null, request, user);

                    });
                });

            }

        ], function(err, request, user) {
            console.log(user);
            if (err) {
                console.log(err);
            }
            if (!user) {
                // TODO: redirect to the error page
                console.log('User not found');
            }
        });
    }
 };


module.exports = utils;