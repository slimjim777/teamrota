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

    updateRota: function(modelId, rolePerson, focus, notes, url) {
        // Expecting dictionary: {role_id: person_id}
        // Iterate through the rolePerson object
        for (var key in rolePerson) {
            if (rolePerson.hasOwnProperty(key)) {
                var data = {
                    roleId: key,
                    personId: rolePerson[key]
                }

                Ajax.post(this.url() + '/' + modelId + '/rota', data);
            }
        }

        var eventDate = {
            focus: focus, notes: notes, url: url
        };
        return Ajax.put(this.url() + '/' + modelId + '/eventdate', eventDate);
    }
};

module.exports = EventDate;