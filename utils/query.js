'use strict';

var sql = {

    permissions: function () {
        // Parameters:
        // 1: person.id
        return "select e.id event_id, e.name event_name " +
               "from person p " +
               "inner join event_admins ad on ad.person_id=p.id " +
               "inner join event e on e.id=ad.event_id " +
               "where person_id = $1";
    },

    personForEmail: function() {
        return "SELECT * FROM person WHERE active and email = $1";
    },

    updateLastLogin: function() {
        return "update person set last_login=now() where id=$1";
    }
};

module.exports = sql;