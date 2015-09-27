'use strict';

var sql = {

    userForEmail: function() {
        return "SELECT * FROM app_user WHERE active and email = $1";
    },

    updateLastLogin: function() {
        return "update app_user set last_login=now() where id=$1";
    },

    databaseUrl: function() {
        return process.env.DATABASE_URL || process.env.OPENSHIFT_POSTGRESQL_DB_URL;
    }
};

module.exports = sql;