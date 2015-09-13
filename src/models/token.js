'use strict';
var $ = require('jquery');


var Token = {
    get: function() {
        return $.get('/rota/token')
            .done(function(response) {
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('apiUrl', response.apiUrl);
                return response.token;
            });
    }
};

module.exports = Token;