/**
 * do datebase query
 * @author: biangang
 * @date: 2014/5/8
 */
'use strict';
var _ = require('lodash');
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'hello1234',
    database: 'democenter_db',
    port: 3306
});

module.exports = function(sql, params, callback){

    if (_.isFunction(params)) {
        callback = params;
        params = null;
    }

    function connect(err, connection){
        if (err) {
            console.log('POOL ==> ' + err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                setTimeout(pool.getConnection(connect), 2000);
            } else {
                console.log(err);
            }
        } else {
            connection.query(sql, params, function(){
                callback.apply(connection, arguments);
                connection.release();
            });
        }
    }

    pool.getConnection(connect);

};

