'use strict';
var Ajax = require('./Ajax');


var EventDate = {
    url: function() {
        if (sessionStorage.getItem('apiUrl')) {
            return sessionStorage.getItem('apiUrl') + '/api/eventdates';
        } else {
            return '/api/eventdates';
        }
    },

    findById: function(modelId) {
        return Ajax.get(this.url() + '/' + modelId);
    },

    updateRota: function(modelId, rolePerson) {
        // Expecting dictionary: {role_id: person_id}
        return Ajax.post(this.url() + '/' + modelId + '/rota', rolePerson);
    }
};

module.exports = EventDate;