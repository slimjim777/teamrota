var pg = require('pg');


var utils = {
    ensureAuthenticated: function(req, res, next) {
        console.log('---ensureAuthenticated');
        console.log(req.session);
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
    apiAuthenticated: function(req, res, next) {
        console.log('---apiAuthenticated');
        console.log(req.session);
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).send({success: false, message: 'NOT authenticated.'});
    }

 }


module.exports = utils;